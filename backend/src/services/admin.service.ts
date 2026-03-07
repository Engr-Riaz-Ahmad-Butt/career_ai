import prisma from '../config/database';
import { Plan } from '@prisma/client';

export class AdminService {
    async getUsers(query: {
        page: number;
        limit: number;
        plan?: string;
        search?: string;
        sortBy?: string;
        order?: 'asc' | 'desc';
    }) {
        const { page, limit, plan, search, sortBy, order } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (plan) where.plan = plan.toUpperCase();
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }

        const orderBy: any = {};
        if (sortBy) {
            orderBy[sortBy] = order;
        } else {
            orderBy.createdAt = 'desc';
        }

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
        return prisma.user.update({
            where: { id },
            data: { plan },
        });
    }

    async adjustUserCredits(id: string, amount: number, reason: string) {
        const user = await prisma.user.update({
            where: { id },
            data: {
                credits: { increment: amount },
                lifetimeCreditsEarned: amount > 0 ? { increment: amount } : undefined,
            },
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
        // This would normally aggregate from log files or a billing API
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
        const transactions = await prisma.invoice.findMany({
            where: {
                status: 'paid',
                createdAt: { gte: from, lte: to },
            },
        });

        return {
            totalRevenue: transactions.reduce((sum: number, t: any) => sum + t.amount, 0),
            currency: 'USD',
            transactionCount: transactions.length,
        };
    }

    async getBroadcastRecipients(segment?: string) {
        const where: any = {};
        if (segment === 'PRO') where.plan = { not: 'FREE' };
        if (segment === 'FREE') where.plan = 'FREE';

        const users = await prisma.user.findMany({
            where,
            select: { email: true },
        });

        return users.map(u => u.email);
    }
}

export const adminService = new AdminService();
