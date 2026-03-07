import { Request, Response } from 'express';
import { AIService } from '../services/ai/aiService';
import prisma from '../config/database';
import { asyncHandler } from '../middleware/error';

const ai = new AIService();

export const analyzeCommunicationAI = asyncHandler(async (req: Request, res: Response) => {
    const result = await ai.analyzeCommunication(req.user!.userId, req.body);

    const analysis = await prisma.communicationAnalysis.create({
        data: {
            userId: req.user!.userId,
            text: req.body.text,
            context: req.body.context,
            targetAudience: req.body.targetAudience,
            overallScore: result.overallScore,
            clarity: result.clarity,
            grammar: result.grammar,
            tone: result.tone,
            professionalism: result.professionalism,
            suggestions: result.suggestions || [],
            highlights: result.highlights || [],
        },
    });

    res.json({ success: true, data: { analysis: { ...analysis, ...result } } });
});

export const listAnalyses = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        prisma.communicationAnalysis.findMany({
            where: { userId: req.user!.userId },
            orderBy: { createdAt: 'desc' },
            skip, take: limit,
            select: { id: true, context: true, overallScore: true, createdAt: true },
        }),
        prisma.communicationAnalysis.count({ where: { userId: req.user!.userId } }),
    ]);

    res.json({ success: true, data: { data, total, page, limit, totalPages: Math.ceil(total / limit) } });
});

export const getAnalysis = asyncHandler(async (req: Request, res: Response) => {
    const analysis = await prisma.communicationAnalysis.findFirst({
        where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!analysis) return res.status(404).json({ success: false, message: 'Analysis not found' });
    res.json({ success: true, data: { analysis } });
});

