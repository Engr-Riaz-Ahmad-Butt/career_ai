import { Request, Response } from 'express';
import { BillingService, PLANS } from '../services/billing.service';
import { asyncHandler } from '../middleware/error';

const billingService = new BillingService();

export const getPlans = asyncHandler(async (_req: Request, res: Response) => {
    res.json({ success: true, data: { plans: PLANS } });
});

export const createCheckout = asyncHandler(async (req: Request, res: Response) => {
    const { plan, successUrl, cancelUrl } = req.body;
    const result = await billingService.createCheckoutSession(req.user!.userId, plan, successUrl, cancelUrl);
    res.json({ success: true, data: result });
});

export const createPortal = asyncHandler(async (req: Request, res: Response) => {
    const result = await billingService.createPortalSession(req.user!.userId);
    res.json({ success: true, data: result });
});

export const getSubscription = asyncHandler(async (req: Request, res: Response) => {
    const data = await billingService.getSubscription(req.user!.userId);
    res.json({ success: true, data });
});

export const cancelSubscription = asyncHandler(async (req: Request, res: Response) => {
    await billingService.cancelSubscription(req.user!.userId);
    res.json({ success: true, message: 'Subscription will be canceled at end of period' });
});

export const reactivateSubscription = asyncHandler(async (req: Request, res: Response) => {
    await billingService.reactivateSubscription(req.user!.userId);
    res.json({ success: true, message: 'Subscription reactivated' });
});

export const purchaseCredits = asyncHandler(async (req: Request, res: Response) => {
    const { credits, successUrl } = req.body;
    const result = await billingService.purchaseCredits(req.user!.userId, credits, successUrl);
    res.json({ success: true, data: result });
});

export const listInvoices = asyncHandler(async (req: Request, res: Response) => {
    const result = await billingService.listInvoices(req.user!.userId, req.query as any);
    res.json({ success: true, data: result });
});

export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    if (!signature) return res.status(400).json({ success: false, message: 'Missing stripe-signature header' });
    const result = await billingService.handleWebhook(req.body as Buffer, signature);
    res.json(result);
});

