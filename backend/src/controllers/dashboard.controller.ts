import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export const getDashboard = async (req: Request, res: Response) => {
    const data = await dashboardService.getDashboard(req.user!.userId);
    res.json({ success: true, data });
};

export const getRecentDocuments = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await dashboardService.getRecentDocuments(req.user!.userId, limit);
    res.json({ success: true, data });
};

export const getDashboardStats = async (req: Request, res: Response) => {
    const data = await dashboardService.getStats(req.user!.userId);
    res.json({ success: true, data });
};

export const getActivityFeed = async (req: Request, res: Response) => {
    const data = await dashboardService.getActivityFeed(req.user!.userId, {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
    });
    res.json({ success: true, data });
};
