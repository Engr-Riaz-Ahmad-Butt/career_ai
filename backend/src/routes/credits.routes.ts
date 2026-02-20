import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../config/database';
import { z } from 'zod';

const router = Router();
router.use(authenticate);

const referralSchema = z.object({ referralCode: z.string() });

// GET /credits/balance
router.get('/balance', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: { credits: true, plan: true, creditsResetAt: true, lifetimeCreditsEarned: true, lifetimeCreditsUsed: true },
    });
    res.json({ success: true, data: { balance: user?.credits, plan: user?.plan, resetsAt: user?.creditsResetAt, lifetimeEarned: user?.lifetimeCreditsEarned, lifetimeUsed: user?.lifetimeCreditsUsed } });
});

// GET /credits/history
router.get('/history', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const skip = (page - 1) * limit;

    const where: any = { userId: req.user!.userId };
    if (req.query.type) where.type = (req.query.type as string).toUpperCase();

    const [data, total] = await Promise.all([
        prisma.creditTransaction.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
        prisma.creditTransaction.count({ where }),
    ]);
    res.json({ success: true, data: { data, total, page, limit, totalPages: Math.ceil(total / limit) } });
});

// POST /credits/referral/apply
router.post('/referral/apply', async (req, res) => {
    const { referralCode } = referralSchema.parse(req.body);
    const userId = req.user!.userId;

    const referrer = await prisma.user.findUnique({ where: { referralCode } });
    if (!referrer) return res.status(404).json({ success: false, message: 'Invalid referral code' });
    if (referrer.id === userId) return res.status(400).json({ success: false, message: 'Cannot use your own referral code' });

    // Check if already applied
    const self = await prisma.user.findUnique({ where: { id: userId }, select: { referredById: true, credits: true } });
    if (self?.referredById) return res.status(400).json({ success: false, message: 'Referral code already applied' });

    // Apply referral: give 5 credits to both parties
    const [updated] = await Promise.all([
        prisma.user.update({ where: { id: userId }, data: { referredById: referrer.id, credits: { increment: 5 }, lifetimeCreditsEarned: { increment: 5 } }, select: { credits: true } }),
        prisma.user.update({ where: { id: referrer.id }, data: { credits: { increment: 5 }, lifetimeCreditsEarned: { increment: 5 } } }),
    ]);

    await Promise.all([
        prisma.creditTransaction.create({ data: { userId, amount: 5, type: 'REFERRAL', description: `Referral from code ${referralCode}`, balanceAfter: updated.credits } }),
        prisma.creditTransaction.create({ data: { userId: referrer.id, amount: 5, type: 'REFERRAL', description: `Referral bonus — code used`, balanceAfter: 0 } }),
    ]);

    res.json({ success: true, data: { creditsEarned: 5, newBalance: updated.credits } });
});

// GET /credits/costs (public — no auth needed, but we put it here for convenience)
router.get('/costs', async (_req, res) => {
    res.json({
        success: true,
        data: {
            CREATE_RESUME: 1,
            UPLOAD_RESUME: 2,
            TAILOR_RESUME: 3,
            ENHANCE_RESUME_SECTION: 2,
            ATS_SCORE: 1,
            GENERATE_COVER_LETTER: 2,
            GENERATE_SOP: 3,
            GENERATE_MOTIVATION_LETTER: 2,
            GENERATE_STUDY_PLAN: 2,
            GENERATE_FINANCIAL_LETTER: 2,
            GENERATE_BIO: 1,
            GENERATE_INTERVIEW: 2,
            INTERVIEW_FEEDBACK: 1,
            COMMUNICATION_ANALYZE: 1,
        },
    });
});

export default router;
