import apiClient from '@/lib/api/client';

// ── Types ──────────────────────────────────────────────────────────────────

export type PlanId = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';

export interface Plan {
    id: PlanId;
    name: string;
    price: number;
    billingInterval: 'month' | 'year';
    credits: number;
    features: string[];
    stripePriceId?: string;
}

export interface Subscription {
    id: string;
    plan: PlanId;
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}

export interface CheckoutSession {
    url: string;
    sessionId: string;
}

// ── API Module ──────────────────────────────────────────────────────────────

export const billingApi = {
    /** GET /billing/plans */
    getPlans: (): Promise<Plan[]> =>
        apiClient.get('/billing/plans').then((r) => r.data.data),

    /** POST /billing/checkout — creates a Stripe Checkout session */
    createCheckout: (planId: PlanId, interval?: 'month' | 'year'): Promise<CheckoutSession> =>
        apiClient.post('/billing/checkout', { planId, interval }).then((r) => r.data.data),

    /** POST /billing/portal — creates a Stripe Customer Portal session */
    getPortalUrl: (): Promise<{ url: string }> =>
        apiClient.post('/billing/portal').then((r) => r.data.data),

    /** GET /billing/subscription */
    getSubscription: (): Promise<Subscription | null> =>
        apiClient.get('/billing/subscription').then((r) => r.data.data),
};
