import prisma from '../config/database';

export class PortfolioService {
    async createPortfolio(userId: string, data: any) {
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

        // Deduct credits
        const user = await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: 5 }, lifetimeCreditsUsed: { increment: 5 } },
            select: { credits: true }
        });

        await prisma.creditTransaction.create({
            data: { userId, amount: -5, type: 'USAGE', description: 'GENERATE_PORTFOLIO', balanceAfter: user.credits }
        });

        return portfolio;
    }

    async listPortfolios(userId: string) {
        return prisma.portfolio.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getPortfolioById(userId: string, id: string) {
        return prisma.portfolio.findFirst({
            where: { id, userId }
        });
    }

    async updatePortfolio(userId: string, id: string, data: any) {
        return prisma.portfolio.update({
            where: { id, userId },
            data: {
                ...data,
                theme: data.theme?.toUpperCase()
            }
        });
    }

    async deployPortfolio(userId: string, id: string) {
        const portfolio = await prisma.portfolio.findFirst({ where: { id, userId } });
        if (!portfolio) return null;

        const liveUrl = portfolio.customDomain
            ? `https://${portfolio.customDomain}`
            : `https://careerai-portfolio-${portfolio.id.substring(0, 8)}.vercel.app`;

        return prisma.portfolio.update({
            where: { id },
            data: { deployStatus: 'DEPLOYED', lastDeployedAt: new Date(), liveUrl },
        });
    }

    async deletePortfolio(userId: string, id: string) {
        return prisma.portfolio.delete({
            where: { id, userId }
        });
    }
}
