import { env } from '@/config/env';

export const BILLING = {
  STRIPE_API_VERSION: env.STRIPE_API_VERSION,
  CREDIT_PRICE_PER_UNIT_CENTS: env.BILLING_CREDIT_PRICE_PER_UNIT_CENTS,
  CREDIT_PURCHASE_MULTIPLE: env.BILLING_CREDIT_PURCHASE_MULTIPLE,
  CURRENCY: 'usd',
  CREDIT_PURCHASE_METADATA_TYPE: 'credit_purchase',
  DEFAULT_FREE_CREDITS: 10,
  PLAN_FALLBACK: 'PRO',
  PLAN_TO_USER_PLAN: {
    pro_monthly: 'PRO',
    pro_annual: 'PRO',
    team_monthly: 'TEAM',
    enterprise: 'ENTERPRISE',
  },
  WEBHOOK_EVENTS: {
    CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
    CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
    CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
    INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  },
  STRIPE_PRICE_IDS: {
    pro_monthly: env.STRIPE_PRICE_PRO_MONTHLY,
    pro_annual: env.STRIPE_PRICE_PRO_ANNUAL,
    team_monthly: env.STRIPE_PRICE_TEAM_MONTHLY,
    enterprise: env.STRIPE_PRICE_ENTERPRISE,
  },
} as const;

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: BILLING.DEFAULT_FREE_CREDITS,
    features: ['10 credits/month', '3 resumes', 'Basic templates'],
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 1999,
    credits: 100,
    features: ['100 credits/month', 'Unlimited resumes', 'All templates', 'Version history', 'PDF export'],
  },
  {
    id: 'pro_annual',
    name: 'Pro Annual',
    price: 19990,
    credits: 100,
    features: ['100 credits/month', 'Unlimited resumes', 'All templates', '2 months free'],
  },
  {
    id: 'team_monthly',
    name: 'Team',
    price: 4999,
    credits: 500,
    features: ['500 credits/month', 'Team management', 'Priority support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0,
    credits: -1,
    features: ['Custom credits', 'Dedicated support', 'SLA', 'Admin panel'],
  },
] as const;
