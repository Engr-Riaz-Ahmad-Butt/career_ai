import prisma from '@/config/database';
import { CREDIT_COSTS } from '@/constants/creditCosts';
import { PAGINATION } from '@/constants/pagination';
import { env } from '@/config/env';

export class CreditsService {
    async getBalance(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                credits: true,
                plan: true,
                creditsResetAt: true,
                lifetimeCreditsEarned: true,
                lifetimeCreditsUsed: true
            },
        });
    }

    async getHistory(userId: string, query: { page?: number; limit?: number; type?: string }) {
        const page = +(query.page || PAGINATION.DEFAULT_PAGE);
        const limit = Math.min(+(query.limit || PAGINATION.DEFAULT_LIMIT_FALLBACK), PAGINATION.SERVICE_MAX_LIMIT);
        const skip = (page - 1) * limit;

        const where: { userId: string; type?: string } = { userId };
        if (query.type) where.type = query.type.toUpperCase();

        const [data, total] = await Promise.all([
            prisma.creditTransaction.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            prisma.creditTransaction.count({ where }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async applyReferral(userId: string, referralCode: string) {
        const referrer = await prisma.user.findUnique({ where: { referralCode } });
        if (!referrer) return { success: false, message: 'Invalid referral code', status: 404 };
        if (referrer.id === userId) return { success: false, message: 'Cannot use your own referral code', status: 400 };

        const self = await prisma.user.findUnique({ where: { id: userId }, select: { referredById: true } });
        if (self?.referredById) return { success: false, message: 'Referral code already applied', status: 400 };

        const [updated] = await Promise.all([
            prisma.user.update({
                where: { id: userId },
                data: { referredById: referrer.id, credits: { increment: 5 }, lifetimeCreditsEarned: { increment: 5 } },
                select: { credits: true }
            }),
            prisma.user.update({
                where: { id: referrer.id },
                data: { credits: { increment: 5 }, lifetimeCreditsEarned: { increment: 5 } }
            }),
        ]);

        await Promise.all([
            prisma.creditTransaction.create({
                data: { userId, amount: 5, type: 'REFERRAL', description: `Referral from code ${referralCode}`, balanceAfter: updated.credits }
            }),
            prisma.creditTransaction.create({
                data: { userId: referrer.id, amount: 5, type: 'REFERRAL', description: `Referral bonus — code used`, balanceAfter: 0 }
            }),
        ]);

        return { success: true, creditsEarned: 5, newBalance: updated.credits };
    }

    getCosts() {
        return {
            CREATE_RESUME: env.CREDIT_COST_CREATE_RESUME,
            UPLOAD_RESUME: env.CREDIT_COST_UPLOAD_RESUME,
            TAILOR_RESUME: env.CREDIT_COST_TAILOR_RESUME,
            ENHANCE_RESUME_SECTION: env.CREDIT_COST_ENHANCE_RESUME_SECTION,
            ATS_SCORE: CREDIT_COSTS.ATS_SCORE,
            GENERATE_COVER_LETTER: CREDIT_COSTS.COVER_LETTER_GENERATE,
            GENERATE_SOP: CREDIT_COSTS.SOP_GENERATE,
            GENERATE_MOTIVATION_LETTER: CREDIT_COSTS.MOTIVATION_LETTER_GENERATE,
            GENERATE_STUDY_PLAN: env.CREDIT_COST_GENERATE_STUDY_PLAN,
            GENERATE_FINANCIAL_LETTER: env.CREDIT_COST_GENERATE_FINANCIAL_LETTER,
            GENERATE_BIO: CREDIT_COSTS.BIO_GENERATE,
            GENERATE_INTERVIEW: CREDIT_COSTS.INTERVIEW_GENERATE,
            INTERVIEW_FEEDBACK: env.CREDIT_COST_INTERVIEW_FEEDBACK,
            COMMUNICATION_ANALYZE: CREDIT_COSTS.COMMUNICATION_ANALYZE,
            GENERATE_PORTFOLIO: CREDIT_COSTS.PORTFOLIO_GENERATE,
        };
    }
}
