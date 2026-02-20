import prisma from '../config/database';
import { ApiError } from '../middleware/error';

export class TailoringService {

    async tailorResume(userId: string, data: {
        baseResumeId: string;
        jobDescription: string;
        companyName?: string;
        jobTitle?: string;
        aggressiveness?: string;
    }) {
        const baseResume = await prisma.resume.findFirst({ where: { id: data.baseResumeId, userId } });
        if (!baseResume) throw new ApiError(404, 'Base resume not found');

        // Import AI service dynamically to avoid circular deps
        const { AIService } = await import('./ai/aiService');
        const aiService = new AIService();

        const result = await aiService.tailorResume({
            resume: baseResume,
            jobDescription: data.jobDescription,
            companyName: data.companyName,
            jobTitle: data.jobTitle,
            aggressiveness: (data.aggressiveness || 'moderate') as 'subtle' | 'moderate' | 'aggressive',
        });

        const tailored = await prisma.tailoredResume.create({
            data: {
                userId,
                baseResumeId: data.baseResumeId,
                jobDescription: data.jobDescription,
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                aggressiveness: data.aggressiveness || 'moderate',
                tailoredContent: result.tailoredContent,
                extractedKeywords: result.extractedKeywords,
                matchedKeywords: result.matchedKeywords,
                missingKeywords: result.missingKeywords,
                atsScore: result.atsScore,
                suggestions: result.suggestions,
            },
        });

        // Deduct credits
        await this._deductCredit(userId, 'TAILOR_RESUME', 3, tailored.id);

        return tailored;
    }

    async getTailoringHistory(userId: string, params: { page?: number; limit?: number }) {
        const page = params.page || 1;
        const limit = Math.min(params.limit || 10, 50);
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.tailoredResume.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip, take: limit,
                select: { id: true, jobTitle: true, companyName: true, atsScore: true, aggressiveness: true, createdAt: true },
            }),
            prisma.tailoredResume.count({ where: { userId } }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getTailoredById(userId: string, id: string) {
        const tailored = await prisma.tailoredResume.findFirst({ where: { id, userId } });
        if (!tailored) throw new ApiError(404, 'Tailored resume not found');
        return tailored;
    }

    async deleteTailored(userId: string, id: string) {
        const tailored = await prisma.tailoredResume.findFirst({ where: { id, userId } });
        if (!tailored) throw new ApiError(404, 'Tailored resume not found');
        await prisma.tailoredResume.delete({ where: { id } });
    }

    private async _deductCredit(userId: string, action: string, amount: number, resourceId?: string) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: amount }, lifetimeCreditsUsed: { increment: amount } },
            select: { credits: true },
        });
        await prisma.creditTransaction.create({
            data: { userId, amount: -amount, type: 'USAGE', description: `${action}`, balanceAfter: user.credits },
        });
    }
}
