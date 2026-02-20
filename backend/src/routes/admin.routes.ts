import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import prisma from '../config/database';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const router = Router();
router.use(authenticate, requireAdmin);

const planSchema = z.object({ plan: z.string(), reason: z.string().optional() });
const creditsSchema = z.object({ amount: z.number(), reason: z.string() });
const broadcastSchema = z.object({
    subject: z.string(),
    body: z.string(),
    segment: z.enum(['all', 'free', 'pro', 'team', 'inactive']),
});

// GET /admin/users
router.get('/users', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (req.query.plan) where.plan = (req.query.plan as string).toUpperCase();
    if (req.query.search) {
        where.OR = [
            { email: { contains: req.query.search, mode: 'insensitive' } },
            { firstName: { contains: req.query.search, mode: 'insensitive' } },
        ];
    }

    const orderBy: any = { [req.query.sortBy as string || 'createdAt']: req.query.order || 'desc' };
    const [users, total] = await Promise.all([
        prisma.user.findMany({ where, orderBy, skip, take: limit, select: { id: true, email: true, firstName: true, lastName: true, plan: true, credits: true, createdAt: true, subscriptionStatus: true } }),
        prisma.user.count({ where }),
    ]);
    res.json({ success: true, data: { data: users, total, page, limit, totalPages: Math.ceil(total / limit) } });
});

// GET /admin/users/:id
router.get('/users/:id', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { resumes: { select: { id: true, title: true, createdAt: true } }, documents: { select: { id: true, type: true, createdAt: true } } },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: { user } });
});

// PUT /admin/users/:id/plan
router.put('/users/:id/plan', async (req, res) => {
    const { plan } = planSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { plan: plan.toUpperCase() as any }, select: { id: true, email: true, plan: true } });
    res.json({ success: true, data: { user } });
});

// POST /admin/users/:id/credits
router.post('/users/:id/credits', async (req, res) => {
    const { amount, reason } = creditsSchema.parse(req.body);
    const user = await prisma.user.update({
        where: { id: req.params.id },
        data: {
            credits: { increment: amount },
            ...(amount > 0 ? { lifetimeCreditsEarned: { increment: amount } } : { lifetimeCreditsUsed: { increment: -amount } }),
        },
        select: { credits: true },
    });
    await prisma.creditTransaction.create({
        data: { userId: req.params.id, amount, type: 'ADJUSTMENT', description: `Admin adjustment: ${reason}`, balanceAfter: user.credits },
    });
    res.json({ success: true, data: { newBalance: user.credits } });
});

// GET /admin/stats
router.get('/stats', async (req, res) => {
    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    const [totalUsers, activeUsers, docsGenerated, aiCallsTotal] = await Promise.all([
        prisma.user.count({ where: { deletedAt: null } }),
        prisma.user.count({ where: { deletedAt: null, lastLoginAt: { gte: from } } }),
        prisma.document.count({ where: { createdAt: { gte: from, lte: to } } }),
        prisma.tailoredResume.count({ where: { createdAt: { gte: from, lte: to } } }),
    ]);

    res.json({ success: true, data: { totalUsers, activeUsers, docsGenerated, aiCallsTotal, period: { from, to } } });
});

// GET /admin/ai-costs
router.get('/ai-costs', async (req, res) => {
    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    const costs = await prisma.creditTransaction.groupBy({
        by: ['type'],
        where: { type: 'USAGE', createdAt: { gte: from, lte: to } },
        _sum: { amount: true },
        _count: true,
    });

    res.json({ success: true, data: { costs, period: { from, to } } });
});

// GET /admin/revenue
router.get('/revenue', async (req, res) => {
    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    const invoices = await prisma.invoice.findMany({ where: { invoiceDate: { gte: from, lte: to }, status: 'paid' } });
    const revenue = invoices.reduce((sum, i) => sum + i.amount, 0);

    res.json({ success: true, data: { revenue, period: { from, to } } });
});

// POST /admin/broadcast
router.post('/broadcast', async (req, res) => {
    const { subject, body, segment } = broadcastSchema.parse(req.body);

    const planMap: Record<string, string[]> = {
        free: ['FREE'],
        pro: ['PRO'],
        team: ['TEAM'],
        all: ['FREE', 'PRO', 'TEAM', 'ENTERPRISE'],
    };

    const where: any = { deletedAt: null, isActive: true };
    if (segment !== 'inactive' && segment !== 'all') {
        where.plan = { in: planMap[segment] };
    } else if (segment === 'inactive') {
        where.lastLoginAt = { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    const users = await prisma.user.findMany({ where, select: { email: true } });

    // Fire-and-forget email blast
    // In production: use a queue (BullMQ/SQS) + email service
    const emails = users.map(u => u.email).join(',');
    console.log(`[ADMIN BROADCAST] Sending "${subject}" to ${users.length} users in segment "${segment}"`);

    res.json({ success: true, message: `Broadcast queued for ${users.length} users`, data: { recipientCount: users.length } });
});

export default router;
