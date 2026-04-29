import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show validation errors on empty login form', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: /Sign In/i }).click();

    await expect(page.getByText(/Invalid email/i)).toBeVisible();
    await expect(page.getByText(/String must contain at least 6 character/i)).toBeVisible();
  });

  test('should show validation errors on empty register form', async ({ page }) => {
    await page.goto('/auth/register');
    await page.getByRole('button', { name: /Create Account/i }).click();

    await expect(page.getByText(/First name is required/i)).toBeVisible();
    await expect(page.getByText(/Last name is required/i)).toBeVisible();
    await expect(page.getByText(/Invalid email/i)).toBeVisible();
  });

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('link', { name: /Sign up/i }).click();
    await expect(page).toHaveURL(/auth\/register/);

    await page.getByRole('link', { name: /Sign in/i }).click();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('password strength indicator works', async ({ page }) => {
    await page.goto('/auth/register');
    const passwordInput = page.locator('#password');
    
    await passwordInput.fill('weak');
    await expect(page.getByText(/Password strength: 1\/4/i)).toBeVisible();
    
    await passwordInput.fill('Stronger123');
    await expect(page.getByText(/Password strength: 4\/4/i)).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    // This test assumes the backend is running and handles auth
    await page.goto('/auth/login');
    await page.locator('#email').fill('nonexistent@example.com');
    await page.locator('#password').fill('wrongpassword');
    await page.getByRole('button', { name: /Sign In/i }).click();

    // We expect a server error message to appear
    // The exact message depends on backend implementation
    await expect(page.locator('form')).toContainText(/failed|invalid|error/i);
  });
});
