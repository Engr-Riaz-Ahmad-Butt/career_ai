import { Page, APIRequestContext } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const TEST_USERS = {
  main: {
    firstName: 'Test',
    lastName: 'Main',
    email: `test+main+${Date.now()}@example.com`,
    password: 'Password123!',
  },
  referrer: {
    firstName: 'Test',
    lastName: 'Referrer',
    email: `test+referrer+${Date.now()}@example.com`,
    password: 'Password123!',
  },
  low: {
    firstName: 'Test',
    lastName: 'Low',
    email: `test+low+${Date.now()}@example.com`,
    password: 'Password123!',
  },
};

export interface AuthResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    credits: number;
    plan: string;
    emailVerified: boolean;
    onboardingComplete: boolean;
  };
}

/**
 * Register a new user via API and return access token + user.
 */
export async function apiRegister(
  request: APIRequestContext,
  data: { firstName: string; lastName: string; email: string; password: string; referralCode?: string }
): Promise<AuthResult> {
  const res = await request.post(`${BASE_URL}/auth/register`, { data });
  const body = await res.json();
  if (!res.ok()) throw new Error(`Register failed: ${JSON.stringify(body)}`);
  return body.data;
}

/**
 * Login via API and return access token + user.
 */
export async function apiLogin(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<AuthResult> {
  const res = await request.post(`${BASE_URL}/auth/login`, {
    data: { email, password },
  });
  const body = await res.json();
  if (!res.ok()) throw new Error(`Login failed: ${JSON.stringify(body)}`);
  return body.data;
}

/**
 * Inject auth state into the browser page (bypasses login UI).
 * Sets the access token in localStorage so the frontend picks it up.
 */
export async function injectAuthState(page: Page, accessToken: string, user: AuthResult['user']) {
  await page.goto('/auth/login');
  await page.evaluate(
    ({ token, userObj }) => {
      // Hydrate Zustand store via window storage injection
      // The frontend reads from in-memory store, so we set a flag and reload via a custom helper
      sessionStorage.setItem('__e2e_token', token);
      sessionStorage.setItem('__e2e_user', JSON.stringify(userObj));
    },
    { token: accessToken, userObj: user }
  );
}

/**
 * Full login via the UI (use sparingly — prefer injectAuthState).
 */
export async function uiLogin(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: /Sign In/i }).click();
  // Wait for redirect away from login page
  await page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 10000 });
}
