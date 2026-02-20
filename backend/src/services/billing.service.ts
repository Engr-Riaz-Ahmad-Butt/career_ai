import prisma from '../config/database';
import { ApiError } from '../middleware/error';

// Stripe is optional — only initialize if env is set
let stripe: any = null;
try {
    if (process.env.STRIPE_SECRET_KEY) {
        const Stripe = require('stripe');
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    }
} catch { /* stripe not installed; billing will return 501 */ }

// Hard-coded plan definitions (can be moved to DB later)
export const PLANS = [
    { id: 'free', name: 'Free', price: 0, credits: 10, features: ['10 credits/month', '3 resumes', 'Basic templates'] },
    { id: 'pro_monthly', name: 'Pro Monthly', price: 1999, credits: 100, features: ['100 credits/month', 'Unlimited resumes', 'All templates', 'Version history', 'PDF export'] },
    { id: 'pro_annual', name: 'Pro Annual', price: 19990, credits: 100, features: ['100 credits/month', 'Unlimited resumes', 'All templates', '2 months free'] },
    { id: 'team_monthly', name: 'Team', price: 4999, credits: 500, features: ['500 credits/month', 'Team management', 'Priority support'] },
    { id: 'enterprise', name: 'Enterprise', price: 0, credits: -1, features: ['Custom credits', 'Dedicated support', 'SLA', 'Admin panel'] },
];

const PRICE_IDS: Record<string, string> = {
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL || '',
    team_monthly: process.env.STRIPE_PRICE_TEAM_MONTHLY || '',
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE || '',
};

export class BillingService {

    private _requireStripe() {
        if (!stripe) throw new ApiError(501, 'Billing not configured. Set STRIPE_SECRET_KEY in environment.');
        return stripe;
    }

    getPlans() {
        return PLANS;
    }

    async createCheckoutSession(userId: string, plan: string, successUrl: string, cancelUrl: string) {
        const s = this._requireStripe();
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new ApiError(404, 'User not found');

        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await s.customers.create({ email: user.email, metadata: { userId } });
            customerId = customer.id;
            await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
        }

        const session = await s.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: { userId, plan },
        });

        return { checkoutUrl: session.url };
    }

    async createPortalSession(userId: string) {
        const s = this._requireStripe();
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.stripeCustomerId) throw new ApiError(400, 'No billing account found');

        const session = await s.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.FRONTEND_URL}/billing`,
        });
        return { portalUrl: session.url };
    }

    async getSubscription(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { plan: true, subscriptionStatus: true, currentPeriodEnd: true, cancelAtPeriodEnd: true, trialEnd: true },
        });
        return user;
    }

    async cancelSubscription(userId: string) {
        const s = this._requireStripe();
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.stripeSubscriptionId) throw new ApiError(400, 'No active subscription');

        await s.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true });
        await prisma.user.update({ where: { id: userId }, data: { cancelAtPeriodEnd: true } });
    }

    async reactivateSubscription(userId: string) {
        const s = this._requireStripe();
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.stripeSubscriptionId) throw new ApiError(400, 'No subscription to reactivate');

        await s.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: false });
        await prisma.user.update({ where: { id: userId }, data: { cancelAtPeriodEnd: false } });
    }

    async purchaseCredits(userId: string, credits: number, successUrl: string) {
        const s = this._requireStripe();
        if (credits <= 0 || credits % 50 !== 0) throw new ApiError(400, 'Credits must be a positive multiple of 50');

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new ApiError(404, 'User not found');

        // $1 per 10 credits
        const session = await s.checkout.sessions.create({
            customer: user.stripeCustomerId ?? undefined,
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    unit_amount: credits * 10,
                    product_data: { name: `${credits} CareerAI Credits` },
                },
                quantity: 1,
            }],
            success_url: successUrl,
            metadata: { userId, credits: credits.toString(), type: 'credit_purchase' },
        });

        return { checkoutUrl: session.url };
    }

    async listInvoices(userId: string, params: { page?: number; limit?: number }) {
        const page = params.page || 1;
        const limit = Math.min(params.limit || 10, 50);
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.invoice.findMany({
                where: { userId },
                orderBy: { invoiceDate: 'desc' },
                skip, take: limit,
            }),
            prisma.invoice.count({ where: { userId } }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async handleWebhook(rawBody: Buffer, signature: string) {
        const s = this._requireStripe();
        let event: any;

        try {
            event = s.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
        } catch {
            throw new ApiError(400, 'Invalid Stripe signature');
        }

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const { userId, plan, credits, type } = session.metadata;

                if (type === 'credit_purchase') {
                    const creditAmount = parseInt(credits);
                    const user = await prisma.user.update({
                        where: { id: userId },
                        data: { credits: { increment: creditAmount }, lifetimeCreditsEarned: { increment: creditAmount } },
                        select: { credits: true },
                    });
                    await prisma.creditTransaction.create({
                        data: { userId, amount: creditAmount, type: 'PURCHASE', description: `Purchased ${creditAmount} credits`, balanceAfter: user.credits },
                    });
                } else if (plan) {
                    const planMap: Record<string, string> = { pro_monthly: 'PRO', pro_annual: 'PRO', team_monthly: 'TEAM', enterprise: 'ENTERPRISE' };
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            plan: planMap[plan] as any || 'PRO',
                            stripeSubscriptionId: session.subscription,
                            subscriptionStatus: 'ACTIVE',
                        },
                    });
                }
                break;
            }
            case 'customer.subscription.updated': {
                const sub = event.data.object;
                const user = await prisma.user.findFirst({ where: { stripeSubscriptionId: sub.id } });
                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            subscriptionStatus: sub.status.toUpperCase() as any,
                            currentPeriodEnd: new Date(sub.current_period_end * 1000),
                            cancelAtPeriodEnd: sub.cancel_at_period_end,
                        },
                    });
                }
                break;
            }
            case 'customer.subscription.deleted': {
                const sub = event.data.object;
                const user = await prisma.user.findFirst({ where: { stripeSubscriptionId: sub.id } });
                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { plan: 'FREE', subscriptionStatus: 'INACTIVE', stripeSubscriptionId: null, credits: 10 },
                    });
                }
                break;
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const user = await prisma.user.findFirst({ where: { stripeCustomerId: invoice.customer } });
                if (user) {
                    await prisma.user.update({ where: { id: user.id }, data: { subscriptionStatus: 'PAST_DUE' } });
                    await prisma.invoice.upsert({
                        where: { stripeInvoiceId: invoice.id },
                        create: { userId: user.id, stripeInvoiceId: invoice.id, amount: invoice.amount_due, status: 'failed', pdfUrl: invoice.invoice_pdf, invoiceDate: new Date(invoice.created * 1000) },
                        update: { status: 'failed' },
                    });
                }
                break;
            }
        }

        return { received: true };
    }
}
