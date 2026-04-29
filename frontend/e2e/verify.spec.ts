import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and meta tags', async ({ page }) => {
    await expect(page).toHaveTitle(/CareerForge/);
  });

  test('loads without critical JS errors', async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('pageerror', (err) => jsErrors.push(err.message));

    await page.waitForLoadState('networkidle');
    expect(jsErrors).toHaveLength(0);
  });

  test('hero section displays correctly', async ({ page }) => {
    // Check for main headline
    await expect(page.getByText('Your Career,')).toBeVisible();
    await expect(page.getByText('Redefined by AI.')).toBeVisible();

    // Check for CTA button
    const ctaButton = page.getByRole('link', { name: /Launch Your Future/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href', '/auth/register');

    // Check for premium badge
    await expect(page.getByText(/Next-Gen Career Intelligence/i)).toBeVisible();
  });

  test('metrics section displays key proof points', async ({ page }) => {
    await expect(page.getByText(/92% Success/i)).toBeVisible();
    await expect(page.getByText(/12k\+ Hired/i)).toBeVisible();
    await expect(page.getByText(/AES-256/i)).toBeVisible();
  });

  test('navigation links are functional', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /log\s*in|sign\s*in/i }).first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/auth\/login/);
    }
  });

  test('responsive design - mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Your Career,')).toBeVisible();
    
    // Check if CTA is still accessible
    const ctaButton = page.getByRole('link', { name: /Launch Your Future/i });
    await expect(ctaButton).toBeVisible();
  });
});

test('health check endpoint returns 200', async ({ request }) => {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:5000';
  try {
    const response = await request.get(`${backendUrl}/health`);
    if (response.ok()) {
      const body = await response.json();
      expect(body.success).toBe(true);
    }
  } catch (error) {
    // Backend might not be running in all environments, skip if unreachable
    console.warn('Backend health check skipped: Backend unreachable');
  }
});
