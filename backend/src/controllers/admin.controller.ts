import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { emailService } from '../services/email.service';
import { asyncHandler } from '../middleware/error';
import { Plan } from '@prisma/client';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const plan = req.query.plan as string;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string;
    const order = (req.query.order as 'asc' | 'desc') || 'desc';

    const result = await adminService.getUsers({
        page,
        limit,
        plan,
        search,
        sortBy,
        order,
    });

    res.json({ success: true, data: result });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await adminService.getUserById(req.params.id);
    res.json({ success: true, data: { user } });
});

export const updateUserPlan = asyncHandler(async (req: Request, res: Response) => {
    const { plan } = req.body;
    const user = await adminService.updateUserPlan(req.params.id, plan.toUpperCase() as Plan);
    res.json({ success: true, data: { user } });
});

export const adjustUserCredits = asyncHandler(async (req: Request, res: Response) => {
    const { amount, reason } = req.body;
    const newBalance = await adminService.adjustUserCredits(req.params.id, amount, reason);
    res.json({ success: true, data: { newBalance } });
});

export const getStats = asyncHandler(async (req: Request, res: Response) => {
    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    const stats = await adminService.getSystemStats(from, to);
    res.json({ success: true, data: stats });
});

export const getAiCosts = asyncHandler(async (req: Request, res: Response) => {
    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    const costs = await adminService.getAiCosts(from, to);
    res.json({ success: true, data: costs });
});

export const getRevenue = asyncHandler(async (req: Request, res: Response) => {
    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    const revenue = await adminService.getRevenue(from, to);
    res.json({ success: true, data: revenue });
});

export const broadcast = asyncHandler(async (req: Request, res: Response) => {
    const { subject, body, segment } = req.body;

    const recipients = await adminService.getBroadcastRecipients(segment);

    // Fire-and-forget broadcast
    emailService.sendBroadcastEmail(recipients, subject, body);

    res.json({
        success: true,
        message: `Broadcast queued for ${recipients.length} users`,
        data: { recipientCount: recipients.length }
    });
});
