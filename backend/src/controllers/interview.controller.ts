import { Request, Response } from 'express';
import { InterviewService } from '../services/interview.service';
import { z } from 'zod';

const interviewService = new InterviewService();

const generateSchema = z.object({
    resumeId: z.string(),
    jobDescription: z.string().optional(),
    questionCount: z.number().min(1).max(30).optional().default(10),
    categories: z.array(z.string()).optional(),
    difficulty: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
    includeAnswerTips: z.boolean().optional().default(true),
});

const feedbackSchema = z.object({
    questionId: z.string(),
    userAnswer: z.string().min(1),
});

export const generateSession = async (req: Request, res: Response) => {
    const data = generateSchema.parse(req.body);
    const session = await interviewService.generateSession(req.user!.userId, data);
    res.status(201).json({ success: true, message: 'Interview session generated', data: { session } });
};

export const listSessions = async (req: Request, res: Response) => {
    const result = await interviewService.listSessions(req.user!.userId, {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
    });
    res.json({ success: true, data: result });
};

export const getSession = async (req: Request, res: Response) => {
    const session = await interviewService.getSessionById(req.user!.userId, req.params.id);
    res.json({ success: true, data: { session } });
};

export const submitFeedback = async (req: Request, res: Response) => {
    const data = feedbackSchema.parse(req.body);
    const feedback = await interviewService.submitFeedback(req.user!.userId, req.params.id, data);
    res.json({ success: true, message: 'Feedback generated', data: { feedback } });
};

export const deleteSession = async (req: Request, res: Response) => {
    await interviewService.deleteSession(req.user!.userId, req.params.id);
    res.json({ success: true, message: 'Session deleted' });
};
