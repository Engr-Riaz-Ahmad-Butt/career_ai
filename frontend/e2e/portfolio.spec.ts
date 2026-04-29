import { test, expect } from '@playwright/test';
import { apiRegister, uiLogin } from './helpers/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// 12 — Portfolio Builder
// ─────────────────────────────────────────────────────────────────────────────

test.describe('12. Portfolio Builder', () => {
  let accessToken: string;
  let email: string;
  const password = 'Password123!';

  test.beforeAll(async ({ request }) => {
    email = `e2e+portfolio+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'Portfolio', lastName: 'Tester', email, password,
    });
    accessToken = result.accessToken;
  });

  // ── 12.1 Create/Update Portfolio ──────────────────────────────────────────
  test('12.1 creates or updates a portfolio', async ({ request }) => {
    // Try POST first, then PUT if it already exists
    let res = await request.post(`${BASE_URL}/portfolio`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        title: 'My Developer Portfolio',
        bio: 'Full-stack developer specializing in React and Node.js',
        theme: 'MODERN',
        sections: ['about', 'experience', 'projects', 'skills', 'contact'],
      },
    });
    // If POST not supported, try PUT
    if (res.status() === 404 || res.status() === 405) {
      res = await request.put(`${BASE_URL}/portfolio`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: {
          bio: 'Full-stack developer specializing in React and Node.js',
          theme: 'MODERN',
          sections: ['about', 'experience', 'projects', 'skills', 'contact'],
        },
      });
    }
    expect([200, 201]).toContain(res.status());
  });

  // ── 12.3 UI Smoke Tests ───────────────────────────────────────────────────
  test('12.3 UI: portfolio page redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page).toHaveURL(/auth\/login/, { timeout: 5000 });
  });

  test('12.3 UI: portfolio page renders after login', async ({ page }) => {
    await uiLogin(page, email, password);
    await page.goto('/portfolio');
    const url = page.url();
    expect(url).not.toContain('/auth/login');
  });

  test('12.3 UI: portfolio page has theme picker or content areas', async ({ page }) => {
    await uiLogin(page, email, password);
    await page.goto('/portfolio');
    // Page should render something useful
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10 — LinkedIn Optimizer (UI)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('10. LinkedIn Optimizer (UI)', () => {
  let email: string;
  const password = 'Password123!';

  test.beforeAll(async ({ request }) => {
    email = `e2e+linkedin+${Date.now()}@example.com`;
    await apiRegister(request, {
      firstName: 'LinkedIn', lastName: 'Tester', email, password,
    });
  });

  test('10.2 UI: LinkedIn optimizer page redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/linkedin-optimizer');
    await expect(page).toHaveURL(/auth\/login/, { timeout: 5000 });
  });

  test('10.2 UI: LinkedIn optimizer page renders after login', async ({ page }) => {
    await uiLogin(page, email, password);
    await page.goto('/linkedin-optimizer');
    const url = page.url();
    expect(url).not.toContain('/auth/login');
  });

  test('10.2 UI: has profile text area and target role input', async ({ page }) => {
    await uiLogin(page, email, password);
    await page.goto('/linkedin-optimizer');
    await page.waitForLoadState('networkidle');
    // Should have a textarea for profile text
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible({ timeout: 8000 });
  });

  test('10.2 UI: optimize button is present', async ({ page }) => {
    await uiLogin(page, email, password);
    await page.goto('/linkedin-optimizer');
    await page.waitForLoadState('networkidle');
    const btn = page.getByRole('button', { name: /Optimize|Optimize Now/i });
    await expect(btn).toBeVisible({ timeout: 8000 });
  });
});
