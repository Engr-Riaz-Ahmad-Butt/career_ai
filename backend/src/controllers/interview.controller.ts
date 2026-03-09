import { Request, Response } from 'express';
import { InterviewService } from '@/services/interview.service';
import { asyncHandler } from '@/middleware/error';


const interviewService = new InterviewService();

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Ensure user is authenticated */
function requireAuth(userId?: string): void {
    if (!userId) throw new Error('Unauthorized');
}

/** Ensure resource ID is provided */
function requireId(id?: string): void {
    if (!id) throw new Error('Session ID is required');
}
export const generateSession = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);
    if (!req.body || typeof req.body !== 'object') throw new Error('Invalid request body');

    const session = await interviewService.generateSession(req.user!.userId, req.body);
    res.status(201).json({ success: true, message: 'Interview session generated', data: { session } });
});

export const listSessions = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);

    const result = await interviewService.listSessions(req.user!.userId, req.query as any);
    res.json({ success: true, data: result });
});

export const getSession = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);
    requireId(req.params.id);

    const session = await interviewService.getSessionById(req.user!.userId, req.params.id);
    res.json({ success: true, data: { session } });
});

export const submitFeedback = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);
    requireId(req.params.id);
    if (!req.body || typeof req.body !== 'object') throw new Error('Invalid request body');

    const feedback = await interviewService.submitFeedback(req.user!.userId, req.params.id, req.body);
    res.json({ success: true, message: 'Feedback generated', data: { feedback } });
});

export const deleteSession = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);
    requireId(req.params.id);

    await interviewService.deleteSession(req.user!.userId, req.params.id);
    res.json({ success: true, message: 'Session deleted' });
});

