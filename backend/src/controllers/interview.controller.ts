import { Request, Response } from 'express';
import { InterviewService } from '../services/interview.service';
import { asyncHandler } from '../middleware/error';

const interviewService = new InterviewService();

export const generateSession = asyncHandler(async (req: Request, res: Response) => {
    const session = await interviewService.generateSession(req.user!.userId, req.body);
    res.status(201).json({ success: true, message: 'Interview session generated', data: { session } });
});

export const listSessions = asyncHandler(async (req: Request, res: Response) => {
    const result = await interviewService.listSessions(req.user!.userId, req.query as any);
    res.json({ success: true, data: result });
});

export const getSession = asyncHandler(async (req: Request, res: Response) => {
    const session = await interviewService.getSessionById(req.user!.userId, req.params.id);
    res.json({ success: true, data: { session } });
});

export const submitFeedback = asyncHandler(async (req: Request, res: Response) => {
    const feedback = await interviewService.submitFeedback(req.user!.userId, req.params.id, req.body);
    res.json({ success: true, message: 'Feedback generated', data: { feedback } });
});

export const deleteSession = asyncHandler(async (req: Request, res: Response) => {
    await interviewService.deleteSession(req.user!.userId, req.params.id);
    res.json({ success: true, message: 'Session deleted' });
});

