import { Request, Response } from 'express';
import { AIService } from '../services/ai/aiService';
import prisma from '../config/database';
import { z } from 'zod';

const ai = new AIService();

const analyzeSchema = z.object({
    text: z.string().max(30000),
    context: z.enum(['email', 'cover_letter', 'bio', 'essay', 'general']).optional(),
    targetAudience: z.enum(['hiring_manager', 'professor', 'executive', 'general']).optional(),
});

export const analyzeCommunicationAI = async (req: Request, res: Response) => {
    const data = analyzeSchema.parse(req.body);
    const result = await ai.analyzeCommunication(req.user!.userId, data);

    const analysis = await prisma.communicationAnalysis.create({
        data: {
            userId: req.user!.userId,
            text: data.text,
            context: data.context,
            targetAudience: data.targetAudience,
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
};

export const listAnalyses = async (req: Request, res: Response) => {
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
};

export const getAnalysis = async (req: Request, res: Response) => {
    const analysis = await prisma.communicationAnalysis.findFirst({
        where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!analysis) return res.status(404).json({ success: false, message: 'Analysis not found' });
    res.json({ success: true, data: { analysis } });
};
