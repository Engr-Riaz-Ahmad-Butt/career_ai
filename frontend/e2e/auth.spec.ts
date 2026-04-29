import { test, expect } from '@playwright/test';
import { apiRegister, apiLogin, uiLogin } from './helpers/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// 2.1 — Email Registration
// ─────────────────────────────────────────────────────────────────────────────
test.describe('2.1 Email Registration', () => {
  test('registers successfully and returns correct initial state', async ({ request }) => {
    const email = `e2e+reg+${Date.now()}@example.com`;
    const res = await request.post(`${BASE_URL}/auth/register`, {
      data: { firstName: 'Test', lastName: 'User', email, password: 'Password123!' },
    });
    const body = await res.json();

    expect(res.status()).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.accessToken).toBeTruthy();
    expect(body.data.user.credits).toBe(10);
    expect(body.data.user.plan).toBe('FREE');
    expect(body.data.user.emailVerified).toBe(false);
  });

  test('returns 409 on duplicate email', async ({ request }) => {
    const email = `e2e+dup+${Date.now()}@example.com`;
    await request.post(`${BASE_URL}/auth/register`, {
      data: { firstName: 'A', lastName: 'B', email, password: 'Password123!' },
    });
    const res = await request.post(`${BASE_URL}/auth/register`, {
      data: { firstName: 'A', lastName: 'B', email, password: 'Password123!' },
    });
    expect(res.status()).toBe(409);
  });

  test('returns 400 on short password', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/register`, {
      data: { firstName: 'A', lastName: 'B', email: `e2e+short+${Date.now()}@example.com`, password: 'abc' },
    });
    expect(res.status()).toBe(400);
  });

  test('returns 400 on missing fields', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/register`, {
      data: { email: `e2e+missing+${Date.now()}@example.com` },
    });
    expect(res.status()).toBe(400);
  });

  // UI: Validation errors on the register form
  test('shows validation errors on empty register form submit', async ({ page }) => {
    await page.goto('/auth/register');
    await page.getByRole('button', { name: /Create Account/i }).click();
    await expect(page.getByText(/First name is required/i)).toBeVisible();
    await expect(page.getByText(/Last name is required/i)).toBeVisible();
    await expect(page.getByText(/Invalid email/i)).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2.2 — Email Login
// ─────────────────────────────────────────────────────────────────────────────
test.describe('2.2 Email Login', () => {
  let email: string;

  test.beforeAll(async ({ request }) => {
    email = `e2e+login+${Date.now()}@example.com`;
    await apiRegister(request, { firstName: 'Test', lastName: 'Login', email, password: 'Password123!' });
  });

  test('logs in successfully and returns 200 with accessToken', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/login`, {
      data: { email, password: 'Password123!' },
    });
    const body = await res.json();
    expect(res.status()).toBe(200);
    expect(body.data.accessToken).toBeTruthy();
    expect(body.data.user.email).toBe(email);
  });

  test('returns 401 on wrong password', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/login`, {
      data: { email, password: 'WrongPass999' },
    });
    expect(res.status()).toBe(401);
  });

  test('returns 401 for non-existent user', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: 'ghost+e2e@example.com', password: 'Password123!' },
    });
    expect(res.status()).toBe(401);
  });

  test('shows server error on invalid credentials in UI', async ({ page }) => {
    await page.goto('/auth/login');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill('WrongPass999');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.locator('form')).toContainText(/failed|invalid|error|password/i, { timeout: 8000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2.3 — Token Refresh
// ─────────────────────────────────────────────────────────────────────────────
test.describe('2.3 Token Refresh', () => {
  test('returns new access token using refresh cookie', async ({ request }) => {
    const email = `e2e+refresh+${Date.now()}@example.com`;
    // Login to set the refresh cookie in the request context
    await request.post(`${BASE_URL}/auth/register`, {
      data: { firstName: 'Test', lastName: 'Refresh', email, password: 'Password123!' },
    });
    await request.post(`${BASE_URL}/auth/login`, {
      data: { email, password: 'Password123!' },
    });
    // The refresh cookie is now in the request context (same context = same cookie jar)
    const refreshRes = await request.post(`${BASE_URL}/auth/refresh`);
    const body = await refreshRes.json();
    expect(refreshRes.status()).toBe(200);
    expect(body.data.accessToken).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2.4 — Logout & Token Revocation
// ─────────────────────────────────────────────────────────────────────────────
test.describe('2.4 Logout & Token Revocation', () => {
  test('logout clears session and revokes token', async ({ request }) => {
    const email = `e2e+logout+${Date.now()}@example.com`;
    await request.post(`${BASE_URL}/auth/register`, {
      data: { firstName: 'Test', lastName: 'Logout', email, password: 'Password123!' },
    });
    const loginRes = await request.post(`${BASE_URL}/auth/login`, {
      data: { email, password: 'Password123!' },
    });
    const { accessToken } = (await loginRes.json()).data;

    // Logout
    const logoutRes = await request.post(`${BASE_URL}/auth/logout`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(logoutRes.status()).toBe(200);

    // Token is revoked — refresh must fail
    const refreshRes = await request.post(`${BASE_URL}/auth/refresh`);
    expect(refreshRes.status()).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2.5 — Forgot Password Flow
// ─────────────────────────────────────────────────────────────────────────────
test.describe('2.5 Forgot Password Flow', () => {
  test('forgot-password always returns 200 (anti-enumeration)', async ({ request }) => {
    // Non-existent email — still 200
    const res1 = await request.post(`${BASE_URL}/auth/forgot-password`, {
      data: { email: 'does-not-exist@example.com' },
    });
    expect(res1.status()).toBe(200);

    // Existing email — still 200
    const email = `e2e+forgot+${Date.now()}@example.com`;
    await request.post(`${BASE_URL}/auth/register`, {
      data: { firstName: 'Test', lastName: 'Forgot', email, password: 'Password123!' },
    });
    const res2 = await request.post(`${BASE_URL}/auth/forgot-password`, {
      data: { email },
    });
    expect(res2.status()).toBe(200);
  });

  test('reset-password rejects invalid or expired token', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/reset-password`, {
      data: { token: 'fake-invalid-token-e2e', newPassword: 'NewPass123!' },
    });
    expect(res.status()).toBe(400);
  });

  // UI — Forgot password page renders and shows success state
  test('forgot password UI shows success message after submission', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await page.locator('#email').fill('any@example.com');
    await page.getByRole('button', { name: /Send Reset Link/i }).click();
    // Should show the "Check your email" success state
    await expect(page.getByText(/Check your email/i)).toBeVisible({ timeout: 8000 });
  });

  // UI — Reset password page shows "Invalid Link" state without token
  test('reset password UI shows invalid link state when no token in URL', async ({ page }) => {
    await page.goto('/auth/reset-password');
    await expect(page.getByText(/Invalid Link/i)).toBeVisible({ timeout: 5000 });
  });

  // UI — Reset password page shows form when token is in URL
  test('reset password UI shows form when token present in URL', async ({ page }) => {
    await page.goto('/auth/reset-password?token=some-fake-token-for-ui-test');
    await expect(page.locator('#password')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#confirmPassword')).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2.6 — Email Verification
// ─────────────────────────────────────────────────────────────────────────────
test.describe('2.6 Email Verification', () => {
  test('returns 400 on invalid/expired verification token', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/verify-email`, {
      data: { token: 'totally-fake-expired-token-e2e' },
    });
    expect(res.status()).toBe(400);
  });

  test('resend verification returns 200 for existing email', async ({ request }) => {
    const email = `e2e+verify+${Date.now()}@example.com`;
    await request.post(`${BASE_URL}/auth/register`, {
      data: { firstName: 'Test', lastName: 'Verify', email, password: 'Password123!' },
    });
    const res = await request.post(`${BASE_URL}/auth/resend-verification`, {
      data: { email },
    });
    expect(res.status()).toBe(200);
  });

  test('resend verification returns 200 for non-existent email (anti-enumeration)', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/resend-verification`, {
      data: { email: 'ghost-verify@example.com' },
    });
    expect(res.status()).toBe(200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2.x — Navigation Between Auth Pages
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Auth Page Navigation', () => {
  test('navigates from login to register and back', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('link', { name: /Sign up/i }).click();
    await expect(page).toHaveURL(/auth\/register/);
    await page.getByRole('link', { name: /Sign in/i }).click();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('forgot password link is present on login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('link', { name: /Forgot password/i })).toBeVisible();
  });

  test('back to login link is present on forgot password page', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.getByRole('link', { name: /Back to Login/i })).toBeVisible();
  });

  test('unauthenticated access to dashboard redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/auth\/login/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 18.1 — Security: Auth Guards
// ─────────────────────────────────────────────────────────────────────────────
test.describe('18.1 Security: Authentication Guards', () => {
  test('GET /users/me without token returns 401', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/users/me`);
    expect(res.status()).toBe(401);
  });

  test('GET /users/me with tampered token returns 401', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.tampered.signature' },
    });
    expect(res.status()).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 18.4 — Input Validation (XSS / Injection)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('18.4 Input Validation', () => {
  test('XSS payload in firstName is sanitized or returns 400', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/register`, {
      data: {
        firstName: "<script>alert('xss')</script>",
        lastName: 'Test',
        email: `e2e+xss+${Date.now()}@example.com`,
        password: 'Password123!',
      },
    });
    // Should either succeed (and sanitize) or reject
    expect([201, 400]).toContain(res.status());
  });

  test('SQL injection in email field returns 400 or 401', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: "admin'--", password: "' OR '1'='1" },
    });
    // Prisma parameterizes queries — should fail with 400 or 401, never succeed
    expect([400, 401]).toContain(res.status());
  });
});
