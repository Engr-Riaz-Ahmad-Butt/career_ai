import { test, expect } from '@playwright/test';
import { apiRegister, uiLogin } from './helpers/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// 5 — Resume Builder (API + UI)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('5. Resume Builder', () => {
  let accessToken: string;
  let resumeId: string;
  let email: string;
  const password = 'Password123!';

  test.beforeAll(async ({ request }) => {
    email = `e2e+resume+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'Resume', lastName: 'Tester', email, password,
    });
    accessToken = result.accessToken;
  });

  // ── 5.1 Create Resume ─────────────────────────────────────────────────────
  test('5.1 creates a resume and returns 201', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/resumes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        title: 'My Software Engineer Resume',
        targetRole: 'Senior Software Engineer',
        targetIndustry: 'Technology',
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.data.id).toBeTruthy();
    resumeId = body.data.id;
  });

  // ── 5.2 List Resumes ──────────────────────────────────────────────────────
  test('5.2 lists resumes with pagination', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/resumes?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data.resumes ?? body.data)).toBe(true);
  });

  // ── 5.3 Get Resume ────────────────────────────────────────────────────────
  test('5.3 gets a specific resume by ID', async ({ request }) => {
    test.skip(!resumeId, 'Requires a created resume');
    const res = await request.get(`${BASE_URL}/resumes/${resumeId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(resumeId);
  });

  // ── 5.4 Update Resume ─────────────────────────────────────────────────────
  test('5.4 updates resume content', async ({ request }) => {
    test.skip(!resumeId, 'Requires a created resume');
    const res = await request.put(`${BASE_URL}/resumes/${resumeId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        title: 'Updated Resume Title',
        summary: 'Experienced software engineer with expertise in React and Node.js.',
        experience: [
          {
            title: 'Software Engineer',
            company: 'Tech Corp',
            startDate: '2020-01',
            endDate: '2024-01',
            description: 'Built scalable web applications serving 1M+ users.',
          },
        ],
        skills: { technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'] },
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.title).toBe('Updated Resume Title');
  });

  // ── 5.5 Version History ───────────────────────────────────────────────────
  test('5.5 lists version history for a resume', async ({ request }) => {
    test.skip(!resumeId, 'Requires a created resume');
    const res = await request.get(`${BASE_URL}/resumes/${resumeId}/versions`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
  });

  // ── 5.6 Duplicate Resume ──────────────────────────────────────────────────
  test('5.6 duplicates a resume', async ({ request }) => {
    test.skip(!resumeId, 'Requires a created resume');
    const res = await request.post(`${BASE_URL}/resumes/${resumeId}/duplicate`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect([200, 201]).toContain(res.status());
    const body = await res.json();
    expect(body.data.id).not.toBe(resumeId);
  });

  // ── 5.9 Delete Resume ─────────────────────────────────────────────────────
  test('5.9 deletes a resume and returns 404 after', async ({ request }) => {
    // Create a disposable resume
    const createRes = await request.post(`${BASE_URL}/resumes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { title: 'Delete Me', targetRole: 'Any' },
    });
    const disposableId = (await createRes.json()).data.id;

    const delRes = await request.delete(`${BASE_URL}/resumes/${disposableId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(delRes.status()).toBe(200);

    const getRes = await request.get(`${BASE_URL}/resumes/${disposableId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(getRes.status()).toBe(404);
  });

  // ── 18.2 Authorization ────────────────────────────────────────────────────
  test('18.2 cannot access another user\'s resume (returns 404)', async ({ request }) => {
    test.skip(!resumeId, 'Requires a created resume');
    // Create another user
    const other = await apiRegister(request, {
      firstName: 'Other', lastName: 'User',
      email: `e2e+other+${Date.now()}@example.com`,
      password: 'Password123!',
    });
    const res = await request.get(`${BASE_URL}/resumes/${resumeId}`, {
      headers: { Authorization: `Bearer ${other.accessToken}` },
    });
    expect(res.status()).toBe(404);
  });

  // ── 5.10 UI Test ──────────────────────────────────────────────────────────
  test('5.10 UI: resume builder page redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/resume-builder');
    await expect(page).toHaveURL(/auth\/login/, { timeout: 5000 });
  });

  test('5.10 UI: resume builder renders after login', async ({ page }) => {
    await uiLogin(page, email, password);
    await page.goto('/resume-builder');
    // Should be on resume builder (or dashboard if no onboarding)
    const url = page.url();
    expect(url).not.toContain('/auth/login');
  });
});
