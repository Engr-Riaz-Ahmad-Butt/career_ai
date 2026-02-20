import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { ApiError } from '../middleware/error';

export class UserService {

    private readonly USER_SELECT = {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        country: true,
        timezone: true,
        currentRole: true,
        targetRole: true,
        industry: true,
        preferences: true,
        plan: true,
        credits: true,
        emailVerified: true,
        onboardingComplete: true,
        referralCode: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        createdAt: true,
        lastLoginAt: true,
    };

    // GET /users/me
    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
            select: this.USER_SELECT,
        });
        if (!user) throw new ApiError(404, 'User not found');
        return user;
    }

    // PUT /users/me
    async updateProfile(userId: string, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        currentRole?: string;
        targetRole?: string;
        industry?: string;
        country?: string;
        preferences?: Record<string, any>;
    }) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
                onboardingComplete: true,
            },
            select: this.USER_SELECT,
        });
        return user;
    }

    // DELETE /users/me (soft delete)
    async deleteAccount(userId: string) {
        await prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date(), isActive: false },
        });
        // Revoke all refresh tokens
        await prisma.refreshToken.updateMany({ where: { userId }, data: { revoked: true } });
    }

    // PUT /users/me/password
    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.password) throw new ApiError(400, 'No password set for this account');

        const isValid = await comparePassword(currentPassword, user.password);
        if (!isValid) throw new ApiError(400, 'Current password is incorrect');

        const hashed = await hashPassword(newPassword);
        await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    }

    // POST /users/me/avatar
    async updateAvatar(userId: string, avatarUrl: string) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl },
            select: { id: true, avatar: true },
        });
        return user;
    }

    // GET /users/me/credits
    async getCreditBalance(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true, creditsResetAt: true, lifetimeCreditsEarned: true, lifetimeCreditsUsed: true },
        });
        if (!user) throw new ApiError(404, 'User not found');

        const history = await prisma.creditTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        return { balance: user.credits, resetsAt: user.creditsResetAt, lifetimeEarned: user.lifetimeCreditsEarned, lifetimeUsed: user.lifetimeCreditsUsed, history };
    }

    // GET /users/me/usage
    async getUsageStats(userId: string) {
        const [resumeCount, coverLetterCount, sopCount, bioCount, tailoringCount, interviewCount, analysisCount] = await Promise.all([
            prisma.resume.count({ where: { userId } }),
            prisma.document.count({ where: { userId, type: 'COVER_LETTER' } }),
            prisma.document.count({ where: { userId, type: 'SOP' } }),
            prisma.document.count({ where: { userId, type: 'BIO' } }),
            prisma.tailoredResume.count({ where: { userId } }),
            prisma.interviewSession.count({ where: { userId } }),
            prisma.communicationAnalysis.count({ where: { userId } }),
        ]);

        const totalDocs = coverLetterCount + sopCount + bioCount;
        const aiCallsTotal = tailoringCount + interviewCount + analysisCount;

        return { resumesCreated: resumeCount, coverLettersCreated: coverLetterCount, sopCreated: sopCount, bioCreated: bioCount, totalDocuments: totalDocs, tailoringRuns: tailoringCount, aiCallsTotal };
    }

    // GET /users/me/referrals
    async getReferrals(userId: string) {
        const referrals = await prisma.user.findMany({
            where: { referredById: userId },
            select: { id: true, firstName: true, lastName: true, email: true, createdAt: true, plan: true },
            orderBy: { createdAt: 'desc' },
        });

        const creditsEarned = referrals.length * 5;
        return { referrals, creditsEarned, totalReferrals: referrals.length };
    }
}
