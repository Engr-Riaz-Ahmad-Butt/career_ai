import { Request, Response } from 'express';
import { CreditsService } from '../services/credits.service';
import { asyncHandler } from '../middleware/error';

const creditsService = new CreditsService();

export const getBalance = asyncHandler(async (req: Request, res: Response) => {
    const data = await creditsService.getBalance(req.user!.userId);
    res.json({ success: true, data });
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
    const result = await creditsService.getHistory(req.user!.userId, req.query as any);
    res.json({ success: true, data: result });
});

export const applyReferral = asyncHandler(async (req: Request, res: Response) => {
    const { referralCode } = req.body;
    const result = await creditsService.applyReferral(req.user!.userId, referralCode);
    if (!result.success) {
        return res.status(result.status || 400).json(result);
    }
    res.json(result);
});

export const getCosts = asyncHandler(async (_req: Request, res: Response) => {
    const data = creditsService.getCosts();
    res.json({ success: true, data });
});
