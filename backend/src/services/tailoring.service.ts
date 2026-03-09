import prisma from '@/config/database';
import { PAGINATION } from '@/constants/pagination';
import { createHttpError } from '@/utils/errorHandler';
import { findResourceByIdOrThrow, paginateQuery } from '@/utils/dbHelpers';

export class TailoringService {

    async tailorResume(userId: string, data: {
        baseResumeId: string;
        jobDescription: string;
        companyName?: string;
        jobTitle?: string;
        aggressiveness?: string;
    }) {
           const baseResume = await findResourceByIdOrThrow<any>(
            prisma.resume,
            data.baseResumeId,
            { userId },
               undefined,
            'Base resume not found'
        );

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
        const page = params.page || PAGINATION.DEFAULT_PAGE;
        const limit = Math.min(params.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.SERVICE_MAX_LIMIT);

        return paginateQuery(
            prisma.tailoredResume,
            { userId },
            page,
            limit,
            {
                select: {
                    id: true,
                    jobTitle: true,
                    companyName: true,
                    atsScore: true,
                    aggressiveness: true,
                    createdAt: true,
                },
            },
            { createdAt: 'desc' }
        );
    }

    async getTailoredById(userId: string, id: string) {
           return findResourceByIdOrThrow<any>(
            prisma.tailoredResume,
            id,
            { userId },
               undefined,
            'Tailored resume not found'
        );
    }

    async deleteTailored(userId: string, id: string) {
           const tailored = await findResourceByIdOrThrow<any>(
            prisma.tailoredResume,
            id,
            { userId },
               undefined,
            'Tailored resume not found'
        );
        await prisma.tailoredResume.delete({ where: { id: tailored.id } });
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

