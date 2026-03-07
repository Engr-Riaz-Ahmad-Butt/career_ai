import { Request, Response } from 'express';
import { PortfolioService } from '../services/portfolio.service';
import { asyncHandler } from '../middleware/error';

const portfolioService = new PortfolioService();

export const generatePortfolio = asyncHandler(async (req: Request, res: Response) => {
    const portfolio = await portfolioService.createPortfolio(req.user!.userId, req.body);
    res.status(201).json({ success: true, message: 'Portfolio created. Deploy to make it live.', data: { portfolio } });
});

export const listPortfolios = asyncHandler(async (req: Request, res: Response) => {
    const portfolios = await portfolioService.listPortfolios(req.user!.userId);
    res.json({ success: true, data: { portfolios } });
});

export const getPortfolio = asyncHandler(async (req: Request, res: Response) => {
    const portfolio = await portfolioService.getPortfolioById(req.user!.userId, req.params.id);
    if (!portfolio) {
        return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    res.json({ success: true, data: { portfolio } });
});

export const updatePortfolio = asyncHandler(async (req: Request, res: Response) => {
    const portfolio = await portfolioService.updatePortfolio(req.user!.userId, req.params.id, req.body);
    res.json({ success: true, data: { portfolio } });
});

export const deployPortfolio = asyncHandler(async (req: Request, res: Response) => {
    const portfolio = await portfolioService.deployPortfolio(req.user!.userId, req.params.id);
    if (!portfolio) {
        return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    res.json({ success: true, message: 'Portfolio deployed', data: { portfolio } });
});

export const deletePortfolio = asyncHandler(async (req: Request, res: Response) => {
    await portfolioService.deletePortfolio(req.user!.userId, req.params.id);
    res.json({ success: true, message: 'Portfolio deleted' });
});
