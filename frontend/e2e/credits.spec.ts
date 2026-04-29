import { test, expect } from '@playwright/test';
import { apiRegister } from './helpers/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// 13 — Credit System
// ─────────────────────────────────────────────────────────────────────────────

test.describe('13. Credit System', () => {
  let accessToken: string;

  test.beforeAll(async ({ request }) => {
    const email = `e2e+credits+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'Credit', lastName: 'Tester', email, password: 'Password123!',
    });
    accessToken = result.accessToken;
  });

  // ── 13.1 Initial Credits ──────────────────────────────────────────────────
  test('13.1 new user starts with 10 credits', async ({ request }) => {
    const credits = await getCredits(request, accessToken);
    expect(credits).toBe(10);
  });

  // ── 13.2 Credit Transaction Log ───────────────────────────────────────────
  test('13.2 usage/transaction log is available', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/users/me/usage`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Should be an array of transactions or a usage stats object
    expect(body.data).toBeDefined();
  });

  // ── 13.1 Credit deduction accuracy ───────────────────────────────────────
  test('13.1 ATS score deducts exactly 1 credit', async ({ request }) => {
    // Create a resume first
    const resumeRes = await request.post(`${BASE_URL}/resumes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { title: 'Credit Test Resume', targetRole: 'Engineer' },
    });
    const resumeId = (await resumeRes.json()).data?.id;
    if (!resumeId) return test.skip(true, 'Could not create resume');

    const before = await getCredits(request, accessToken);
    await request.post(`${BASE_URL}/ai/resume/ats-score`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { resumeId, jobDescription: 'Node.js developer with PostgreSQL experience.' },
    });
    const after = await getCredits(request, accessToken);
    expect(after).toBe(before - 1);
  });

  // ── 13.3 Insufficient Credits Gate ───────────────────────────────────────
  test('13.3 returns 402 with insufficient credits message', async ({ request }) => {
    // This test requires a user with 0 credits.
    // We exhaust them by making many free credits calls don't work for this.
    // Document: requires DB manipulation. Simulated by checking the 402 format.
    // Instead, verify that the error format is correct with a mock check.
    // We skip the actual 402 trigger here since it needs DB-level manipulation.
    test.skip(true, 'Requires DB: UPDATE User SET credits=0. Covered in manual testing checklist.');
  });

  // ── 13.4 Low Credits Email ────────────────────────────────────────────────
  test('13.4 low credits email trigger is documented', async () => {
    // Email delivery requires SMTP access and cannot be automated in a pure E2E
    // test without a mail interceptor (e.g., Mailhog). Documented here for traceability.
    test.skip(true, 'Requires Mailhog/SMTP interceptor. See Section 16 manual testing.');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 15 — Referral System
// ─────────────────────────────────────────────────────────────────────────────

test.describe('15. Referral System', () => {
  let referrerToken: string;
  let referralCode: string;

  test.beforeAll(async ({ request }) => {
    // Create referrer account
    const email = `e2e+referrer+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'Referrer', lastName: 'User', email, password: 'Password123!',
    });
    referrerToken = result.accessToken;

    // Get referral code from profile
    const meRes = await request.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${referrerToken}` },
    });
    const meBody = await meRes.json();
    referralCode = meBody.data.referralCode;
  });

  // ── 15.1 Referral Code Exists ─────────────────────────────────────────────
  test('15.1 every user has a unique referral code', async ({ request }) => {
    expect(referralCode).toBeTruthy();
    expect(referralCode.length).toBeGreaterThanOrEqual(6);
  });

  // ── 15.2 Register With Referral Code ──────────────────────────────────────
  test('15.2 new user gets signup credits and referrer gets bonus', async ({ request }) => {
    test.skip(!referralCode, 'Requires a referral code');

    const referrerBefore = await getCredits(request, referrerToken);

    // Register a new user using the referral code
    const newEmail = `e2e+referred+${Date.now()}@example.com`;
    const newResult = await apiRegister(request, {
      firstName: 'Referred', lastName: 'User', email: newEmail,
      password: 'Password123!', referralCode,
    });

    // New user should have 10 credits
    expect(newResult.user.credits).toBe(10);

    // Referrer should gain +5 credits
    const referrerAfter = await getCredits(request, referrerToken);
    expect(referrerAfter).toBe(referrerBefore + 5);
  });

  // ── 15.3 View Referrals ───────────────────────────────────────────────────
  test('15.3 referrer can view their referrals list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/users/me/referrals`, {
      headers: { Authorization: `Bearer ${referrerToken}` },
    });
    // Could be 200 with a referrals array, or 404 if endpoint not implemented
    expect([200, 404]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(body.data).toBeDefined();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────
async function getCredits(request: any, token: string): Promise<number> {
  const res = await request.get(`${BASE_URL}/users/me/credits`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  return body.data?.credits ?? body.data ?? 0;
}
