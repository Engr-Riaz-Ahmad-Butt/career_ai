import prisma from '@/config/database';
import { env } from '@/config/env';
import { BILLING, SUBSCRIPTION_PLANS } from '@/constants/billing';
import { PAGINATION } from '@/constants/pagination';
import { createHttpError } from '@/utils/errorHandler';

// Stripe is optional — only initialize if env is set
let stripe: any = null;
try {
    if (env.STRIPE_SECRET_KEY) {
        const Stripe = require('stripe');
        stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: BILLING.STRIPE_API_VERSION });
    }
} catch { /* stripe not installed; billing will return 501 */ }

const PRICE_IDS: Record<string, string> = {
    ...BILLING.STRIPE_PRICE_IDS,
};

export class BillingService {

    private _requireStripe() {
        if (!stripe) throw createHttpError(501, 'Billing not configured. Set STRIPE_SECRET_KEY in environment.');
        return stripe;
    }

    getPlans() {
        return SUBSCRIPTION_PLANS;
    }

    async createCheckoutSession(userId: string, plan: string, successUrl: string, cancelUrl: string) {
        const s = this._requireStripe();
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw createHttpError(404, 'User not found');

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
        if (!user?.stripeCustomerId) throw createHttpError(400, 'No billing account found');

        const session = await s.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${env.FRONTEND_URL}/billing`,
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
        if (!user?.stripeSubscriptionId) throw createHttpError(400, 'No active subscription');

        await s.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true });
        await prisma.user.update({ where: { id: userId }, data: { cancelAtPeriodEnd: true } });
    }

    async reactivateSubscription(userId: string) {
        const s = this._requireStripe();
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.stripeSubscriptionId) throw createHttpError(400, 'No subscription to reactivate');

        await s.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: false });
        await prisma.user.update({ where: { id: userId }, data: { cancelAtPeriodEnd: false } });
    }

    async purchaseCredits(userId: string, credits: number, successUrl: string) {
        const s = this._requireStripe();
        if (credits <= 0 || credits % BILLING.CREDIT_PURCHASE_MULTIPLE !== 0) {
            throw createHttpError(
                400,
                `Credits must be a positive multiple of ${BILLING.CREDIT_PURCHASE_MULTIPLE}`
            );
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw createHttpError(404, 'User not found');

        // $1 per 10 credits
        const session = await s.checkout.sessions.create({
            customer: user.stripeCustomerId ?? undefined,
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: BILLING.CURRENCY,
                    unit_amount: credits * BILLING.CREDIT_PRICE_PER_UNIT_CENTS,
                    product_data: { name: `${credits} CareerAI Credits` },
                },
                quantity: 1,
            }],
            success_url: successUrl,
            metadata: { userId, credits: credits.toString(), type: BILLING.CREDIT_PURCHASE_METADATA_TYPE },
        });

        return { checkoutUrl: session.url };
    }

    async listInvoices(userId: string, params: { page?: number; limit?: number }) {
        const page = params.page || PAGINATION.DEFAULT_PAGE;
        const limit = Math.min(params.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.SERVICE_MAX_LIMIT);
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
            event = s.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
        } catch {
            throw createHttpError(400, 'Invalid Stripe signature');
        }

        switch (event.type) {
            case BILLING.WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED: {
                const session = event.data.object;
                const { userId, plan, credits, type } = session.metadata;

                if (type === BILLING.CREDIT_PURCHASE_METADATA_TYPE) {
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
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            plan: BILLING.PLAN_TO_USER_PLAN[plan as keyof typeof BILLING.PLAN_TO_USER_PLAN] as any || BILLING.PLAN_FALLBACK,
                            stripeSubscriptionId: session.subscription,
                            subscriptionStatus: 'ACTIVE',
                        },
                    });
                }
                break;
            }
            case BILLING.WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED: {
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
            case BILLING.WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED: {
                const sub = event.data.object;
                const user = await prisma.user.findFirst({ where: { stripeSubscriptionId: sub.id } });
                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            plan: 'FREE',
                            subscriptionStatus: 'INACTIVE',
                            stripeSubscriptionId: null,
                            credits: BILLING.DEFAULT_FREE_CREDITS,
                        },
                    });
                }
                break;
            }
            case BILLING.WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED: {
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

