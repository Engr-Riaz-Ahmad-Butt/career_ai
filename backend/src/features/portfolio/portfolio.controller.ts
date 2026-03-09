import { PortfolioService } from '@/features/portfolio/portfolio.service';
import { asyncHandler } from '@/middleware/error';
import { requireAuth, requireId } from '@/utils/requestValidators';
import type { Request, Response } from 'express';

const portfolioService = new PortfolioService();

// ── Handlers ────────────────────────────────────────────────────────────────

export const generatePortfolio = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);
    if (!req.body || typeof req.body !== 'object') throw new Error('Invalid request body');

    const portfolio = await portfolioService.createPortfolio(req.user!.userId, req.body);
    res.status(201).json({ success: true, message: 'Portfolio created. Deploy to make it live.', data: { portfolio } });
});

export const listPortfolios = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);

    const portfolios = await portfolioService.listPortfolios(req.user!.userId);
    res.json({ success: true, data: { portfolios } });
});

export const getPortfolio = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);
    requireId(req.params.id);

    const portfolio = await portfolioService.getPortfolioById(req.user!.userId, req.params.id);
    if (!portfolio) throw new Error('Portfolio not found');

    res.json({ success: true, data: { portfolio } });
});

export const updatePortfolio = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);
    requireId(req.params.id, 'Portfolio ID');
    if (!req.body || typeof req.body !== 'object') throw new Error('Invalid request body');

    const portfolio = await portfolioService.updatePortfolio(req.user!.userId, req.params.id, req.body);
    res.json({ success: true, data: { portfolio } });
});

export const deployPortfolio = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);
    requireId(req.params.id);

    const portfolio = await portfolioService.deployPortfolio(req.user!.userId, req.params.id);
    if (!portfolio) throw new Error('Portfolio not found');

    res.json({ success: true, message: 'Portfolio deployed', data: { portfolio } });
});

export const deletePortfolio = asyncHandler(async (req: Request, res: Response) => {
    requireAuth(req.user?.userId);
    requireId(req.params.id);

    await portfolioService.deletePortfolio(req.user!.userId, req.params.id);
    res.json({ success: true, message: 'Portfolio deleted' });
});
