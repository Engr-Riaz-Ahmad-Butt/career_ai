import prisma from '../config/database';

// ── Request Interfaces ────────────────────────────────────────────────────

interface CreatePortfolioData {
    readonly resumeId: string;
    readonly theme: string;
    readonly customDomain?: string;
    readonly sections?: string[];
    readonly colorScheme?: Record<string, unknown>;
}

interface UpdatePortfolioData {
    readonly theme?: string;
    readonly customDomain?: string;
    readonly sections?: string[];
    readonly colorScheme?: Record<string, unknown>;
}

// ── Helpers ───────────────────────────────────────────────────────────────

/** Deduct portfolio creation credits */
async function deductPortfolioCredits(userId: string): Promise<void> {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 5 }, lifetimeCreditsUsed: { increment: 5 } },
        select: { credits: true }
    });
    await prisma.creditTransaction.create({
        data: { userId, amount: -5, type: 'USAGE', description: 'GENERATE_PORTFOLIO', balanceAfter: user.credits }
    });
}

/** Generate portfolio live URL */
function generateLiveUrl(portfolio: { id: string; customDomain?: string | null }): string {
    return portfolio.customDomain
        ? `https://${portfolio.customDomain}`
        : `https://careerai-portfolio-${portfolio.id.substring(0, 8)}.vercel.app`;
}

export class PortfolioService {
    async createPortfolio(userId: string, data: CreatePortfolioData) {
        if (!userId || !data?.resumeId || !data?.theme) throw new Error('Missing required fields');
        const portfolio = await prisma.portfolio.create({
            data: {
                userId,
                resumeId: data.resumeId,
                theme: data.theme.toUpperCase(),
                customDomain: data.customDomain,
                sections: data.sections || ['about', 'experience', 'skills', 'projects', 'contact'],
                colorScheme: data.colorScheme,
                deployStatus: 'PENDING',
                siteConfig: { generated: true, timestamp: new Date().toISOString() },
            },
        });
        await deductPortfolioCredits(userId);
        return portfolio;
    }

    async listPortfolios(userId: string) {
        if (!userId) throw new Error('userId is required');
        return prisma.portfolio.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getPortfolioById(userId: string, id: string) {
        if (!userId || !id) throw new Error('userId and portfolio id required');
        return prisma.portfolio.findFirst({ where: { id, userId } });
    }

    async updatePortfolio(userId: string, id: string, data: UpdatePortfolioData) {
        if (!userId || !id || !data) throw new Error('Missing required parameters');
        return prisma.portfolio.update({
            where: { id, userId },
            data: { ...data, theme: data.theme?.toUpperCase() }
        });
    }

    async deployPortfolio(userId: string, id: string) {
        if (!userId || !id) throw new Error('userId and portfolio id required');
        const portfolio = await prisma.portfolio.findFirst({ where: { id, userId } });
        if (!portfolio) return null;
        const liveUrl = generateLiveUrl(portfolio);
        return prisma.portfolio.update({
            where: { id },
            data: { deployStatus: 'DEPLOYED', lastDeployedAt: new Date(), liveUrl },
        });
    }

    async deletePortfolio(userId: string, id: string) {
        if (!userId || !id) throw new Error('userId and portfolio id required');
        return prisma.portfolio.delete({ where: { id, userId } });
    }
}
