import { test, expect } from '@playwright/test';
import { apiRegister } from './helpers/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// 9 — Interview Prep
// ─────────────────────────────────────────────────────────────────────────────

test.describe('9. Interview Prep', () => {
  let accessToken: string;
  let sessionId: string;
  let questionId: string;

  test.beforeAll(async ({ request }) => {
    const email = `e2e+interview+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'Interview', lastName: 'Tester', email, password: 'Password123!',
    });
    accessToken = result.accessToken;
  });

  // ── 9.1 Generate Interview Session (2 credits) ────────────────────────────
  test('9.1 generates interview session and returns questions', async ({ request }) => {
    const creditsBefore = await getCredits(request, accessToken);

    const res = await request.post(`${BASE_URL}/interviews/generate`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        role: 'Senior Software Engineer',
        company: 'Google',
        industry: 'Technology',
        difficulty: 'hard',
        interviewType: 'technical',
        questionCount: 5,
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.data.id).toBeTruthy();
    expect(Array.isArray(body.data.questions)).toBe(true);
    expect(body.data.questions.length).toBeGreaterThan(0);
    sessionId = body.data.id;
    questionId = body.data.questions[0]?.id;

    const creditsAfter = await getCredits(request, accessToken);
    expect(creditsAfter).toBe(creditsBefore - 2);
  });

  // ── 9.2 Submit Answer Feedback (1 credit) ─────────────────────────────────
  test('9.2 submits answer and returns AI feedback', async ({ request }) => {
    test.skip(!sessionId || !questionId, 'Requires a generated session');
    const creditsBefore = await getCredits(request, accessToken);

    const res = await request.post(`${BASE_URL}/interviews/${sessionId}/feedback`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        questionId,
        answer: 'I would approach this problem using a distributed cache like Redis to reduce database load. First, I would identify the hot paths in the application...',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.score).toBeDefined();
    expect(body.data.feedback).toBeTruthy();

    const creditsAfter = await getCredits(request, accessToken);
    expect(creditsAfter).toBe(creditsBefore - 1);
  });

  // ── 9.3 List Sessions ─────────────────────────────────────────────────────
  test('9.3 lists interview sessions', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/interviews?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data.sessions ?? body.data)).toBe(true);
  });

  test('9.3 gets a specific interview session', async ({ request }) => {
    test.skip(!sessionId, 'Requires a generated session');
    const res = await request.get(`${BASE_URL}/interviews/${sessionId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(sessionId);
  });

  test('9.3 deletes an interview session', async ({ request }) => {
    // Create disposable session
    const createRes = await request.post(`${BASE_URL}/interviews/generate`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { role: 'Junior Engineer', industry: 'Tech', difficulty: 'easy', interviewType: 'behavioural', questionCount: 3 },
    });
    if (!createRes.ok()) return;
    const disposableId = (await createRes.json()).data?.id;

    const delRes = await request.delete(`${BASE_URL}/interviews/${disposableId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect([200, 204]).toContain(delRes.status());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────
async function getCredits(request: any, token: string): Promise<number> {
  const res = await request.get(`${BASE_URL}/users/me/credits`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  return body.data?.credits ?? body.data ?? 0;
}
