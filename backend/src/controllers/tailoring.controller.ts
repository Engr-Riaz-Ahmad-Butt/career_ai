import { Request, Response } from 'express';
import { TailoringService } from '../services/tailoring.service';
import { z } from 'zod';

const tailoringService = new TailoringService();

const tailorSchema = z.object({
    baseResumeId: z.string(),
    jobDescription: z.string().min(50),
    companyName: z.string().optional(),
    jobTitle: z.string().optional(),
    aggressiveness: z.enum(['subtle', 'moderate', 'aggressive']).optional(),
});

export const tailorResume = async (req: Request, res: Response) => {
    const data = tailorSchema.parse(req.body);
    const result = await tailoringService.tailorResume(req.user!.userId, data);
    res.status(201).json({ success: true, message: 'Resume tailored successfully', data: result });
};

export const getTailorHistory = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await tailoringService.getTailoringHistory(req.user!.userId, { page, limit });
    res.json({ success: true, data: result });
};

export const getTailored = async (req: Request, res: Response) => {
    const result = await tailoringService.getTailoredById(req.user!.userId, req.params.id);
    res.json({ success: true, data: result });
};

export const deleteTailored = async (req: Request, res: Response) => {
    await tailoringService.deleteTailored(req.user!.userId, req.params.id);
    res.json({ success: true, message: 'Tailored resume deleted' });
};
