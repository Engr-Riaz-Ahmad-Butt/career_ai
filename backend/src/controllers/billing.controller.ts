import { Request, Response } from 'express';
import { BillingService, PLANS } from '../services/billing.service';
import { z } from 'zod';

const billingService = new BillingService();

const checkoutSchema = z.object({
    plan: z.enum(['pro_monthly', 'pro_annual', 'team_monthly', 'enterprise']),
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
});

const creditsSchema = z.object({
    credits: z.number().positive().multipleOf(50),
    successUrl: z.string().url(),
});

export const getPlans = async (_req: Request, res: Response) => {
    res.json({ success: true, data: { plans: PLANS } });
};

export const createCheckout = async (req: Request, res: Response) => {
    const { plan, successUrl, cancelUrl } = checkoutSchema.parse(req.body);
    const result = await billingService.createCheckoutSession(req.user!.userId, plan, successUrl, cancelUrl);
    res.json({ success: true, data: result });
};

export const createPortal = async (req: Request, res: Response) => {
    const result = await billingService.createPortalSession(req.user!.userId);
    res.json({ success: true, data: result });
};

export const getSubscription = async (req: Request, res: Response) => {
    const data = await billingService.getSubscription(req.user!.userId);
    res.json({ success: true, data });
};

export const cancelSubscription = async (req: Request, res: Response) => {
    await billingService.cancelSubscription(req.user!.userId);
    res.json({ success: true, message: 'Subscription will be canceled at end of period' });
};

export const reactivateSubscription = async (req: Request, res: Response) => {
    await billingService.reactivateSubscription(req.user!.userId);
    res.json({ success: true, message: 'Subscription reactivated' });
};

export const purchaseCredits = async (req: Request, res: Response) => {
    const { credits, successUrl } = creditsSchema.parse(req.body);
    const result = await billingService.purchaseCredits(req.user!.userId, credits, successUrl);
    res.json({ success: true, data: result });
};

export const listInvoices = async (req: Request, res: Response) => {
    const result = await billingService.listInvoices(req.user!.userId, {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
    });
    res.json({ success: true, data: result });
};

export const handleWebhook = async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    if (!signature) return res.status(400).json({ success: false, message: 'Missing stripe-signature header' });
    const result = await billingService.handleWebhook(req.body as Buffer, signature);
    res.json(result);
};
