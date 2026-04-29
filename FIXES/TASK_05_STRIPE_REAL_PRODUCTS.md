# TASK 05 — Set Up Real Stripe Products & Connect Pricing Page

**Priority:** 🟠 High — Required Before Charging Anyone  
**Estimated Time:** 4 hours  
**Status:** Open

---

## Problem

All Stripe Price IDs are empty strings in the env schema:

```ts
// backend/src/config/env.ts
STRIPE_PRICE_PRO_MONTHLY: z.string().default(''),
STRIPE_PRICE_PRO_ANNUAL: z.string().default(''),
STRIPE_PRICE_TEAM_MONTHLY: z.string().default(''),
STRIPE_PRICE_ENTERPRISE: z.string().default(''),
```

The pricing page exists but the checkout button either does nothing or calls `BillingService.createCheckoutSession()` with an empty Price ID, which Stripe rejects silently. No user can actually subscribe.

---

## Step 1 — Create Products in Stripe Dashboard

Log in to [dashboard.stripe.com](https://dashboard.stripe.com) → Products → Add Product.

Create these products with the following pricing:

| Product | Price | Billing | Env Variable |
|---|---|---|---|
| CareerForge Pro | $19/mo | Monthly recurring | `STRIPE_PRICE_PRO_MONTHLY` |
| CareerForge Pro | $190/yr | Annual recurring | `STRIPE_PRICE_PRO_ANNUAL` |
| CareerForge Team | $49/mo | Monthly recurring | `STRIPE_PRICE_TEAM_MONTHLY` |
| Credits Top-up (50 credits) | $5 one-time | One-time | Handle separately |

Copy each `price_xxxxx` ID into your `.env` and production environment.

---

## Step 2 — Add Credit Top-Up as a Stripe Price

The billing service supports credit purchases (`BillingService.createCreditPurchaseSession`). Create a one-time price in Stripe for the credit bundle and add it to the `PRICE_IDS` map in `billing.service.ts`.

---

## Step 3 — Connect the Pricing Page

Find `frontend/app/(public)/pricing/page.tsx`. The "Get Started" / "Upgrade" buttons must call the checkout endpoint:

```tsx
// frontend/app/(public)/pricing/page.tsx or billing hook
import apiClient from '@/lib/api/client';

async function handleCheckout(plan: 'PRO' | 'TEAM') {
  const { data } = await apiClient.post('/billing/checkout', {
    plan,
    successUrl: `${window.location.origin}/dashboard?upgraded=true`,
    cancelUrl: `${window.location.origin}/pricing`,
  });
  window.location.href = data.data.checkoutUrl;
}
```

---

## Step 4 — Set Up Stripe Webhook

`POST /api/v1/billing/webhook` already exists in `billing.routes.ts`. In the Stripe dashboard:

1. Go to Webhooks → Add Endpoint
2. URL: `https://your-domain.com/api/v1/billing/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Copy the Webhook Secret into `STRIPE_WEBHOOK_SECRET` env var

---

## Step 5 — Test End-to-End

Use Stripe's test card `4242 4242 4242 4242` with any future expiry and CVC:

1. Click "Upgrade to Pro" on pricing page
2. Completes Stripe checkout
3. Webhook fires → `billing.service.ts` updates user plan to `PRO` in DB
4. User returns to `/dashboard?upgraded=true` with Pro plan active
5. User can see updated plan in Settings → Billing tab

---

## Step 6 — Make Stripe Required in Production

```ts
// backend/src/config/env.ts
STRIPE_SECRET_KEY: process.env.NODE_ENV === 'production'
  ? z.string().min(1, 'STRIPE_SECRET_KEY is required in production')
  : z.string().optional(),
STRIPE_WEBHOOK_SECRET: process.env.NODE_ENV === 'production'
  ? z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required in production')
  : z.string().optional(),
```

---

## Files to Change

| File | Change |
|---|---|
| Stripe Dashboard | Create products + prices + webhook |
| `.env` + production env | Add real `STRIPE_PRICE_*` IDs and `STRIPE_WEBHOOK_SECRET` |
| `backend/src/config/env.ts` | Make Stripe keys required in production |
| `frontend/app/(public)/pricing/page.tsx` | Wire checkout buttons to `/billing/checkout` API |
| `frontend/hooks/` | Create `useBilling.ts` hook with `createCheckout` mutation |
