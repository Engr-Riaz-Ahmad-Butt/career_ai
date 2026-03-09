import prisma from '@/config/database';
import { Plan, Prisma } from '@prisma/client';
import { ValidationError } from '@/utils/errorHandler';

interface GetUsersOptions {
    readonly page: number;
    readonly limit: number;
    readonly plan?: string;
    readonly search?: string;
    readonly sortBy?: string;
    readonly order?: 'asc' | 'desc';
}

type UserSortField = 'createdAt' | 'email' | 'firstName' | 'lastName' | 'plan' | 'credits';

function buildUserWhere(options: GetUsersOptions): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};
    if (options.plan) where.plan = options.plan.toUpperCase() as Plan;
    if (!options.search) return where;

    where.OR = [
        { email: { contains: options.search, mode: 'insensitive' } },
        { firstName: { contains: options.search, mode: 'insensitive' } },
        { lastName: { contains: options.search, mode: 'insensitive' } },
    ];
    return where;
}

function buildUserOrderBy(sortBy?: string, order: 'asc' | 'desc' = 'desc'): Prisma.UserOrderByWithRelationInput {
    const field = sortBy as UserSortField | undefined;
    if (!field) return { createdAt: 'desc' };

    switch (field) {
        case 'email':
            return { email: order };
        case 'firstName':
            return { firstName: order };
        case 'lastName':
            return { lastName: order };
        case 'plan':
            return { plan: order };
        case 'credits':
            return { credits: order };
        case 'createdAt':
        default:
            return { createdAt: order };
    }
}

function assertDateRange(from: Date, to: Date): void {
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
        throw new ValidationError('Invalid date range');
    }
    if (from > to) throw new ValidationError('from date must be before to date');
}

function buildCreditUpdate(amount: number): Prisma.UserUpdateInput {
    if (amount > 0) {
        return {
            credits: { increment: amount },
            lifetimeCreditsEarned: { increment: amount },
        };
    }
    return { credits: { increment: amount } };
}

function buildBroadcastWhere(segment?: string): Prisma.UserWhereInput {
    if (segment === 'PRO') return { plan: { not: 'FREE' } };
    if (segment === 'FREE') return { plan: 'FREE' };
    return {};
}

export class AdminService {
    async getUsers(query: GetUsersOptions) {
        if (query.page < 1 || query.limit < 1) throw new ValidationError('Invalid pagination parameters');

        const page = query.page;
        const limit = Math.min(query.limit, 100);
        const skip = (page - 1) * limit;
        const where = buildUserWhere(query);
        const orderBy = buildUserOrderBy(query.sortBy, query.order ?? 'desc');

        const [users, total] = await Promise.all([
            prisma.user.findMany({ where, skip, take: limit, orderBy }),
            prisma.user.count({ where }),
        ]);

        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getUserById(id: string) {
        if (!id) throw new ValidationError('User ID is required');
        return prisma.user.findUnique({
            where: { id },
            include: {
                resumes: true,
                documents: true,
                interviewSessions: true,
            },
        });
    }

    async updateUserPlan(id: string, plan: Plan) {
        if (!id || !plan) throw new ValidationError('User ID and plan are required');
        return prisma.user.update({
            where: { id },
            data: { plan },
        });
    }

    async adjustUserCredits(id: string, amount: number, reason: string) {
        if (!id || !reason) throw new ValidationError('User ID and reason are required');
        if (!Number.isFinite(amount)) throw new ValidationError('Amount must be a valid number');

        const user = await prisma.user.update({
            where: { id },
            data: buildCreditUpdate(amount),
            select: { credits: true },
        });

        await prisma.creditTransaction.create({
            data: {
                userId: id,
                amount,
                type: 'ADJUSTMENT',
                description: reason,
                balanceAfter: user.credits,
            },
        });

        return user.credits;
    }

    async getSystemStats(from: Date, to: Date) {
        assertDateRange(from, to);

        const [totalUsers, totalResumes, totalAIUsage] = await Promise.all([
            prisma.user.count(),
            prisma.resume.count(),
            prisma.creditTransaction.count({
                where: {
                    type: 'USAGE',
                    createdAt: { gte: from, lte: to },
                },
            }),
        ]);

        return {
            totalUsers,
            totalResumes,
            totalAIUsage,
            timeRange: { from, to },
        };
    }

    async getAiCosts(from: Date, to: Date) {
        assertDateRange(from, to);

        const usage = await prisma.creditTransaction.findMany({
            where: {
                type: 'USAGE',
                createdAt: { gte: from, lte: to },
            },
        });

        return {
            totalCreditsUsed: usage.reduce((sum, t) => sum + Math.abs(t.amount), 0),
            transactionCount: usage.length,
        };
    }

    async getRevenue(from: Date, to: Date) {
        assertDateRange(from, to);

        const transactions = await prisma.invoice.findMany({
            where: {
                status: 'paid',
                createdAt: { gte: from, lte: to },
            },
        });

        return {
            totalRevenue: transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0),
            currency: 'USD',
            transactionCount: transactions.length,
        };
    }

    async getBroadcastRecipients(segment?: string) {
        const users = await prisma.user.findMany({
            where: buildBroadcastWhere(segment),
            select: { email: true },
        });

        return users.map((user) => user.email).filter((email): email is string => Boolean(email));
    }
}

export const adminService = new AdminService();
