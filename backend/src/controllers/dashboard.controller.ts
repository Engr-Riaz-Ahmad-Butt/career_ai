import { Request, Response } from 'express';
import { DashboardService } from '@/services/dashboard.service';
import { asyncHandler } from '@/middleware/error';

const dashboardService = new DashboardService();

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getDashboard(req.user!.userId);
    res.json({ success: true, data });
});

export const getRecentDocuments = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await dashboardService.getRecentDocuments(req.user!.userId, limit);
    res.json({ success: true, data });
});

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getStats(req.user!.userId);
    res.json({ success: true, data });
});

export const getActivityFeed = asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getActivityFeed(req.user!.userId, req.query as any);
    res.json({ success: true, data });
});

