import { test, expect } from '@playwright/test';
import { apiRegister, uiLogin } from './helpers/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// 11 — Job Tracker
// ─────────────────────────────────────────────────────────────────────────────

test.describe('11. Job Tracker', () => {
  let accessToken: string;
  let jobId: string;
  let email: string;
  const password = 'Password123!';

  test.beforeAll(async ({ request }) => {
    email = `e2e+jobs+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'Job', lastName: 'Tracker', email, password,
    });
    accessToken = result.accessToken;
  });

  // ── 11.1 Create Job Application ───────────────────────────────────────────
  test('11.1 creates a job application and returns 201', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/jobs`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        company: 'Stripe',
        title: 'Senior Backend Engineer',
        status: 'APPLIED',
        url: 'https://stripe.com/jobs/12345',
        salary: '$180,000',
        location: 'Remote',
        notes: 'Applied through LinkedIn. Referral from John.',
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.data.id).toBeTruthy();
    expect(body.data.company).toBe('Stripe');
    jobId = body.data.id;
  });

  // ── List Jobs ─────────────────────────────────────────────────────────────
  test('lists all job applications', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/jobs`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data.jobs ?? body.data)).toBe(true);
  });

  // ── 11.2 Update Job Status ────────────────────────────────────────────────
  test('11.2 cycles job through statuses correctly', async ({ request }) => {
    test.skip(!jobId, 'Requires a created job');
    const statuses = ['APPLIED', 'INTERVIEW', 'OFFER', 'ACCEPTED'];

    for (const status of statuses) {
      const res = await request.put(`${BASE_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { status },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.data.status).toBe(status);
    }
  });

  // ── Get Single Job ────────────────────────────────────────────────────────
  test('gets a specific job by ID', async ({ request }) => {
    test.skip(!jobId, 'Requires a created job');
    const res = await request.get(`${BASE_URL}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(jobId);
  });

  // ── Delete Job ────────────────────────────────────────────────────────────
  test('deletes a job application', async ({ request }) => {
    const createRes = await request.post(`${BASE_URL}/jobs`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { company: 'DeleteMe Corp', title: 'Any Role', status: 'WISHLIST' },
    });
    const disposableId = (await createRes.json()).data?.id;

    const delRes = await request.delete(`${BASE_URL}/jobs/${disposableId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect([200, 204]).toContain(delRes.status());
  });

  // ── 11.3 UI Smoke Tests ───────────────────────────────────────────────────
  test('11.3 UI: job tracker page redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/job-tracker');
    await expect(page).toHaveURL(/auth\/login/, { timeout: 5000 });
  });

  test('11.3 UI: job tracker renders after login', async ({ page }) => {
    await uiLogin(page, email, password);
    await page.goto('/job-tracker');
    const url = page.url();
    expect(url).not.toContain('/auth/login');
  });
});
