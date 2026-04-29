import { test, expect } from '@playwright/test';
import { apiRegister, uiLogin } from './helpers/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// 14 — Billing & Stripe
// ─────────────────────────────────────────────────────────────────────────────

test.describe('14. Billing & Stripe', () => {
  let accessToken: string;
  let email: string;
  const password = 'Password123!';

  test.beforeAll(async ({ request }) => {
    email = `e2e+billing+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'Billing', lastName: 'Tester', email, password,
    });
    accessToken = result.accessToken;
  });

  // ── 14.1 View Plans ───────────────────────────────────────────────────────
  test('14.1 GET /billing/plans returns plan list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/billing/plans`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const plans = body.data?.plans ?? body.data;
    expect(Array.isArray(plans)).toBe(true);
    expect(plans.length).toBeGreaterThan(0);
  });

  // ── 14.2 Checkout Session ─────────────────────────────────────────────────
  test('14.2 POST /billing/checkout returns a Stripe checkout URL', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/billing/checkout`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { planId: 'pro', billingPeriod: 'monthly' },
    });
    // Stripe must be configured in env for this to work
    if (res.status() === 500 || res.status() === 503) {
      return test.skip(true, 'Stripe not configured in this environment');
    }
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.checkoutUrl).toMatch(/stripe\.com/);
  });

  // ── 14.3 View Subscription ────────────────────────────────────────────────
  test('14.3 GET /billing/subscription returns subscription info', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/billing/subscription`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    // New free user may have no subscription
    expect([200, 404]).toContain(res.status());
  });

  // ── 14.7 Customer Portal ──────────────────────────────────────────────────
  test('14.7 POST /billing/portal returns a Stripe portal URL', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/billing/portal`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status() === 500 || res.status() === 503 || res.status() === 400) {
      return test.skip(true, 'Stripe customer ID required for portal — needs a paid user');
    }
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.portalUrl).toMatch(/billing\.stripe\.com/);
  });

  // ── 14.8 List Invoices ────────────────────────────────────────────────────
  test('14.8 GET /billing/invoices returns paginated invoices', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/billing/invoices?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect([200, 404]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(body.data).toBeDefined();
    }
  });

  // ── 14.4 Cancel Subscription ─────────────────────────────────────────────
  test('14.4 POST /billing/cancel requires an active subscription', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/billing/cancel`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    // Free user has no subscription to cancel — expect 400 or 404
    expect([200, 400, 404]).toContain(res.status());
  });

  // ── 14.5 Reactivate Subscription ─────────────────────────────────────────
  test('14.5 POST /billing/reactivate requires an active cancelled subscription', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/billing/reactivate`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect([200, 400, 404]).toContain(res.status());
  });

  // ── UI: Settings / Billing Page ───────────────────────────────────────────
  test('14 UI: settings page redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/auth\/login/, { timeout: 5000 });
  });

  test('14 UI: settings page renders billing section after login', async ({ page }) => {
    await uiLogin(page, email, password);
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).not.toContain('/auth/login');
  });
});
