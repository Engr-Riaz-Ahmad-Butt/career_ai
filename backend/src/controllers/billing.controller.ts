import { Request, Response } from 'express';
import { SUBSCRIPTION_PLANS } from '@/constants/billing';
import { BillingService } from '@/services/billing.service';
import { asyncHandler } from '@/middleware/error';
import { UnauthorizedError, ValidationError } from '@/utils/errorHandler';

const billingService = new BillingService();

// ── Helper Functions ────────────────────────────────────────────────────

function requireUserId(req: Request): string {
  if (!req.user?.userId) throw new UnauthorizedError();
  return req.user.userId;
}

function validateCheckoutData(body: any): { plan: string; successUrl: string; cancelUrl: string } {
  if (!body.plan) throw new ValidationError('plan is required');
  if (!body.successUrl) throw new ValidationError('successUrl is required');
  if (!body.cancelUrl) throw new ValidationError('cancelUrl is required');
  return { plan: body.plan, successUrl: body.successUrl, cancelUrl: body.cancelUrl };
}

function validateCreditsPurchase(body: any): { credits: number; successUrl: string } {
  if (!body.credits || typeof body.credits !== 'number') throw new ValidationError('credits (number) is required');
  if (!body.successUrl) throw new ValidationError('successUrl is required');
  return { credits: body.credits, successUrl: body.successUrl };
}

function validateWebhookSignature(headers: any): string {
  const signature = headers['stripe-signature'];
  if (!signature) throw new ValidationError('Missing stripe-signature header');
  return signature as string;
}

// ── Controllers ────────────────────────────────────────────────────────

export const getPlans = asyncHandler(async (_req: Request, res: Response) => {
    res.json({ success: true, data: { plans: SUBSCRIPTION_PLANS } });
});

export const createCheckout = asyncHandler(async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const { plan, successUrl, cancelUrl } = validateCheckoutData(req.body);
    
    const result = await billingService.createCheckoutSession(userId, plan, successUrl, cancelUrl);
    res.json({ success: true, data: result });
});

export const createPortal = asyncHandler(async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const result = await billingService.createPortalSession(userId);
    res.json({ success: true, data: result });
});

export const getSubscription = asyncHandler(async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const data = await billingService.getSubscription(userId);
    res.json({ success: true, data });
});

export const cancelSubscription = asyncHandler(async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    await billingService.cancelSubscription(userId);
    res.json({ success: true, message: 'Subscription will be canceled at end of period' });
});

export const reactivateSubscription = asyncHandler(async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    await billingService.reactivateSubscription(userId);
    res.json({ success: true, message: 'Subscription reactivated' });
});

export const purchaseCredits = asyncHandler(async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const { credits, successUrl } = validateCreditsPurchase(req.body);
    
    const result = await billingService.purchaseCredits(userId, credits, successUrl);
    res.json({ success: true, data: result });
});

export const listInvoices = asyncHandler(async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const result = await billingService.listInvoices(userId, req.query as any);
    res.json({ success: true, data: result });
});

export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = validateWebhookSignature(req.headers);
    const result = await billingService.handleWebhook(req.body as Buffer, signature);
    res.json(result);
});

