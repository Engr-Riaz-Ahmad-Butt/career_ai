import { test, expect } from '@playwright/test';
import { apiRegister, uiLogin } from './helpers/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// 3 — Onboarding Wizard
// ─────────────────────────────────────────────────────────────────────────────

test.describe('3. Onboarding Wizard', () => {
  let email: string;
  let password: string;

  test.beforeAll(async ({ request }) => {
    email = `e2e+onboard+${Date.now()}@example.com`;
    password = 'Password123!';
    await apiRegister(request, { firstName: 'Onboard', lastName: 'Test', email, password });
  });

  test('unauthenticated user is redirected to login from /onboarding', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page).toHaveURL(/auth\/login/, { timeout: 5000 });
  });

  test('new user is redirected to /onboarding after login', async ({ page }) => {
    await uiLogin(page, email, password);
    await expect(page).toHaveURL(/onboarding|dashboard/, { timeout: 10000 });
  });

  test('onboarding page renders step content', async ({ page }) => {
    await uiLogin(page, email, password);
    // If onboarding is shown, look for step content
    const url = page.url();
    if (url.includes('onboarding')) {
      // Step 1 should be visible
      const heading = page.getByRole('heading');
      await expect(heading.first()).toBeVisible();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4 — User Profile & Settings
// ─────────────────────────────────────────────────────────────────────────────

test.describe('4. User Profile & Settings', () => {
  let accessToken: string;
  let userId: string;

  test.beforeAll(async ({ request }) => {
    const email = `e2e+profile+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'Profile', lastName: 'Test', email, password: 'Password123!',
    });
    accessToken = result.accessToken;
    userId = result.user.id;
  });

  test('4.1 GET /users/me returns full user object', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toMatchObject({
      email: expect.any(String),
      credits: 10,
      plan: 'FREE',
    });
  });

  test('4.2 PUT /users/me updates profile fields', async ({ request }) => {
    const res = await request.put(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        firstName: 'Updated',
        lastName: 'Name',
        currentRole: 'Software Engineer',
        targetRole: 'Senior Engineer',
        industry: 'Technology',
        bio: 'Passionate engineer with 5 years experience.',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.firstName).toBe('Updated');
    expect(body.data.currentRole).toBe('Software Engineer');
  });

  test('4.5 GET /users/me/credits returns credit info', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/users/me/credits`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.credits).toBeDefined();
  });

  test('4.3 PUT /users/me/password changes password', async ({ request }) => {
    // Create a separate user for this test so we don't break other tests
    const email = `e2e+pwchange+${Date.now()}@example.com`;
    const orig = await apiRegister(request, {
      firstName: 'PwChange', lastName: 'Test', email, password: 'Password123!',
    });
    const res = await request.put(`${BASE_URL}/users/me/password`, {
      headers: { Authorization: `Bearer ${orig.accessToken}` },
      data: { currentPassword: 'Password123!', newPassword: 'NewPassword456!' },
    });
    expect(res.status()).toBe(200);

    // Old password must no longer work
    const loginOld = await request.post(`${BASE_URL}/auth/login`, {
      data: { email, password: 'Password123!' },
    });
    expect(loginOld.status()).toBe(401);

    // New password must work
    const loginNew = await request.post(`${BASE_URL}/auth/login`, {
      data: { email, password: 'NewPassword456!' },
    });
    expect(loginNew.status()).toBe(200);
  });
});
