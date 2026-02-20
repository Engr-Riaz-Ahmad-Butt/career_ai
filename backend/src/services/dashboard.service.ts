import prisma from '../config/database';

export class DashboardService {

    async getDashboard(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                credits: true,
                plan: true,
                onboardingComplete: true,
                referralCode: true,
                creditsResetAt: true,
            },
        });

        const [resumeCount, coverLetterCount, sopCount, avgAts, recentDocs] = await Promise.all([
            prisma.resume.count({ where: { userId } }),
            prisma.document.count({ where: { userId, type: 'COVER_LETTER' } }),
            prisma.document.count({ where: { userId, type: 'SOP' } }),
            prisma.resume.aggregate({ where: { userId, atsScore: { not: null } }, _avg: { atsScore: true } }),
            this._getRecentDocuments(userId, 5),
        ]);

        return {
            credits: user?.credits ?? 0,
            plan: user?.plan,
            onboardingComplete: user?.onboardingComplete,
            recentDocuments: recentDocs,
            resumeCount,
            coverLetterCount,
            sopCount,
            avgAtsScore: Math.round(avgAts._avg.atsScore ?? 0),
            referralCode: user?.referralCode,
            usageSummary: { resumes: resumeCount, documents: coverLetterCount + sopCount },
        };
    }

    async getRecentDocuments(userId: string, limit = 10) {
        return this._getRecentDocuments(userId, limit);
    }

    async getStats(userId: string) {
        const [totalResumes, totalDocuments, tailoringRuns, avgAts, creditsUsed] = await Promise.all([
            prisma.resume.count({ where: { userId } }),
            prisma.document.count({ where: { userId } }),
            prisma.tailoredResume.count({ where: { userId } }),
            prisma.resume.aggregate({ where: { userId, atsScore: { not: null } }, _avg: { atsScore: true } }),
            prisma.creditTransaction.aggregate({
                where: { userId, type: 'USAGE', createdAt: { gte: new Date(new Date().setDate(1)) } },
                _sum: { amount: true },
            }),
        ]);

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });

        return {
            totalResumes,
            totalDocuments,
            totalTailoringRuns: tailoringRuns,
            avgAtsScore: Math.round(avgAts._avg.atsScore ?? 0),
            creditsUsedThisMonth: Math.abs(creditsUsed._sum.amount ?? 0),
            creditsRemaining: user?.credits ?? 0,
        };
    }

    async getActivityFeed(userId: string, params: { page?: number; limit?: number }) {
        const page = params.page || 1;
        const limit = Math.min(params.limit || 20, 50);
        const skip = (page - 1) * limit;

        const [resumes, documents] = await Promise.all([
            prisma.resume.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                take: limit,
                select: { id: true, title: true, updatedAt: true, createdAt: true, status: true },
            }),
            prisma.document.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                take: limit,
                select: { id: true, title: true, type: true, updatedAt: true, createdAt: true, status: true },
            }),
        ]);

        // Merge and sort by date
        const activity = [
            ...resumes.map(r => ({ ...r, resourceType: 'resume', event: r.createdAt === r.updatedAt ? 'created' : 'updated' })),
            ...documents.map(d => ({ ...d, resourceType: 'document', event: d.createdAt === d.updatedAt ? 'created' : 'updated' })),
        ]
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(skip, skip + limit);

        return { data: activity, page, limit };
    }

    private async _getRecentDocuments(userId: string, limit: number) {
        const [resumes, documents] = await Promise.all([
            prisma.resume.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                take: limit,
                select: { id: true, title: true, updatedAt: true, status: true },
            }),
            prisma.document.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                take: limit,
                select: { id: true, title: true, type: true, updatedAt: true, status: true },
            }),
        ]);

        return [
            ...resumes.map(r => ({ ...r, type: 'resume' })),
            ...documents,
        ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, limit);
    }
}
