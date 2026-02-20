import { Router } from 'express';
import { authenticate, requireCredits } from '../middleware/auth';
import prisma from '../config/database';
import { z } from 'zod';

const router = Router();
router.use(authenticate);

const generateSchema = z.object({
    resumeId: z.string(),
    theme: z.enum(['minimal', 'modern', 'creative', 'dark', 'academic']).optional().default('modern'),
    customDomain: z.string().optional(),
    sections: z.array(z.string()).optional(),
    colorScheme: z.string().optional(),
});

const updateSchema = z.object({
    theme: z.string().optional(),
    sections: z.array(z.string()).optional(),
    colorScheme: z.string().optional(),
    customDomain: z.string().optional(),
});

// POST /portfolio/generate
router.post('/generate', requireCredits(5), async (req, res) => {
    const data = generateSchema.parse(req.body);
    const userId = req.user!.userId;

    const portfolio = await prisma.portfolio.create({
        data: {
            userId,
            resumeId: data.resumeId,
            theme: data.theme.toUpperCase() as any,
            customDomain: data.customDomain,
            sections: data.sections || ['about', 'experience', 'skills', 'projects', 'contact'],
            colorScheme: data.colorScheme,
            deployStatus: 'PENDING',
            siteConfig: { generated: true, timestamp: new Date().toISOString() },
        },
    });

    // Deduct credits
    const user = await prisma.user.update({ where: { id: userId }, data: { credits: { decrement: 5 }, lifetimeCreditsUsed: { increment: 5 } }, select: { credits: true } });
    await prisma.creditTransaction.create({ data: { userId, amount: -5, type: 'USAGE', description: 'GENERATE_PORTFOLIO', balanceAfter: user.credits } });

    res.status(201).json({ success: true, message: 'Portfolio created. Deploy to make it live.', data: { portfolio } });
});

// GET /portfolio
router.get('/', async (req, res) => {
    const portfolios = await prisma.portfolio.findMany({ where: { userId: req.user!.userId }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: { portfolios } });
});

// GET /portfolio/:id
router.get('/:id', async (req, res) => {
    const portfolio = await prisma.portfolio.findFirst({ where: { id: req.params.id, userId: req.user!.userId } });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    res.json({ success: true, data: { portfolio } });
});

// PUT /portfolio/:id
router.put('/:id', async (req, res) => {
    const data = updateSchema.parse(req.body);
    const portfolio = await prisma.portfolio.findFirst({ where: { id: req.params.id, userId: req.user!.userId } });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const updated = await prisma.portfolio.update({ where: { id: req.params.id }, data: { ...data, theme: data.theme?.toUpperCase() as any } });
    res.json({ success: true, data: { portfolio: updated } });
});

// POST /portfolio/:id/deploy
router.post('/:id/deploy', async (req, res) => {
    const portfolio = await prisma.portfolio.findFirst({ where: { id: req.params.id, userId: req.user!.userId } });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    // TODO: trigger Vercel deployment
    const liveUrl = portfolio.customDomain
        ? `https://${portfolio.customDomain}`
        : `https://careerai-portfolio-${portfolio.id.substring(0, 8)}.vercel.app`;

    const updated = await prisma.portfolio.update({
        where: { id: req.params.id },
        data: { deployStatus: 'DEPLOYED', lastDeployedAt: new Date(), liveUrl },
    });

    res.json({ success: true, message: 'Portfolio deployed', data: { portfolio: updated } });
});

// DELETE /portfolio/:id
router.delete('/:id', async (req, res) => {
    const portfolio = await prisma.portfolio.findFirst({ where: { id: req.params.id, userId: req.user!.userId } });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    await prisma.portfolio.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Portfolio deleted' });
});

export default router;
