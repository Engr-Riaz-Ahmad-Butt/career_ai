import { test, expect } from '@playwright/test';

test('landing page has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CareerForge/);
});

test('landing page loads without JS errors', async ({ page }) => {
  const jsErrors: string[] = [];
  page.on('pageerror', (err) => jsErrors.push(err.message));

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  expect(jsErrors).toHaveLength(0);
});

test('login page is accessible from landing page', async ({ page }) => {
  await page.goto('/');

  // Find and click a Login link/button
  const loginLink = page.getByRole('link', { name: /log\s*in|sign\s*in/i }).first();
  await expect(loginLink).toBeVisible();
  await loginLink.click();

  await expect(page).toHaveURL(/auth\/login/);
});

test('register page is accessible from landing page', async ({ page }) => {
  await page.goto('/');

  const registerLink = page.getByRole('link', { name: /get started|sign\s*up|register/i }).first();
  await expect(registerLink).toBeVisible();
});

test('health check endpoint returns 200', async ({ request }) => {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:5000';
  const response = await request.get(`${backendUrl}/health`);
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.success).toBe(true);
});
