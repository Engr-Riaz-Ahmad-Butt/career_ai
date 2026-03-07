import prisma from '../config/database';

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
        const page = +(query.page || 1);
        const limit = Math.min(+(query.limit || 20), 50);
        const skip = (page - 1) * limit;

        const where: any = { userId };
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
            CREATE_RESUME: 1,
            UPLOAD_RESUME: 2,
            TAILOR_RESUME: 3,
            ENHANCE_RESUME_SECTION: 2,
            ATS_SCORE: 1,
            GENERATE_COVER_LETTER: 2,
            GENERATE_SOP: 3,
            GENERATE_MOTIVATION_LETTER: 2,
            GENERATE_STUDY_PLAN: 2,
            GENERATE_FINANCIAL_LETTER: 2,
            GENERATE_BIO: 1,
            GENERATE_INTERVIEW: 2,
            INTERVIEW_FEEDBACK: 1,
            COMMUNICATION_ANALYZE: 1,
            GENERATE_PORTFOLIO: 5,
        };
    }
}
