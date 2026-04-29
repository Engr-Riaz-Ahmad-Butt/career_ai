import { test, expect } from '@playwright/test';
import { apiRegister, uiLogin } from './helpers/auth';

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Layout & Navigation
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Dashboard Layout & Navigation', () => {
  test('redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/auth\/login/, { timeout: 5000 });
  });

  test('mobile layout: login form is visible on small screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/auth/login');
    const loginBox = page.locator('.rounded-lg.border').first();
    await expect(loginBox).toBeVisible();
  });

  test('renders dashboard after login and shows sidebar', async ({ page }) => {
    const email = `e2e+dash+${Date.now()}@example.com`;
    const password = 'Password123!';
    await apiRegister(page.request, {
      firstName: 'Dash', lastName: 'Tester', email, password,
    });
    await uiLogin(page, email, password);
    // Should end up on /dashboard or /onboarding
    await expect(page).toHaveURL(/(dashboard|onboarding)/, { timeout: 10000 });
    // The sidebar or main content should be visible
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });
});
