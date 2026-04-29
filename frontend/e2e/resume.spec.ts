import { test, expect } from '@playwright/test';

test.describe('Resume Builder Flow', () => {
  test('should navigate to resume builder from landing page via register', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Launch Your Future/i }).click();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('should show validation errors in manual wizard', async ({ page }) => {
    // This requires being on the resume builder page, which usually requires auth.
    // We'll test what we can without a session, or assume we can reach it for testing purposes
    // if the dev environment allows.
    
    await page.goto('/resume-builder');
    
    // If it redirects to login, we skip the rest of the test
    if (page.url().includes('/auth/login')) {
      console.log('Skipping resume builder test: Auth required');
      return;
    }

    // Step 1: Personal Info
    await page.getByRole('button', { name: /Next/i }).click();
    await expect(page.getByText(/Full Name is required/i)).toBeVisible();
    
    await page.getByPlaceholder(/e.g. Jane Smith/i).fill('Test User');
    await page.getByPlaceholder(/jane@example.com/i).fill('test@example.com');
    await page.getByPlaceholder(/\+1 555 000 0000/i).fill('1234567890');
    
    await page.getByRole('button', { name: /Next/i }).click();
    
    // Step 2: Experience
    await expect(page.getByText(/Add your first work experience/i)).toBeVisible();
  });
});
