import { Request, Response } from 'express';
import { TailoringService } from '../services/tailoring.service';
import { asyncHandler } from '../middleware/error';

const tailoringService = new TailoringService();

export const tailorResume = asyncHandler(async (req: Request, res: Response) => {
    const result = await tailoringService.tailorResume(req.user!.userId, req.body);
    res.status(201).json({ success: true, message: 'Resume tailored successfully', data: result });
});

export const getTailorHistory = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await tailoringService.getTailoringHistory(req.user!.userId, { page, limit });
    res.json({ success: true, data: result });
});

export const getTailored = asyncHandler(async (req: Request, res: Response) => {
    const result = await tailoringService.getTailoredById(req.user!.userId, req.params.id);
    res.json({ success: true, data: result });
});

export const deleteTailored = asyncHandler(async (req: Request, res: Response) => {
    await tailoringService.deleteTailored(req.user!.userId, req.params.id);
    res.json({ success: true, message: 'Tailored resume deleted' });
});

