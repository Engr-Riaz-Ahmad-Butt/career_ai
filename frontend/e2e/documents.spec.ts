import { test, expect } from '@playwright/test';
import { apiRegister } from './helpers/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// 7 — Cover Letter Generator
// ─────────────────────────────────────────────────────────────────────────────

test.describe('7. Cover Letter Generator', () => {
  let accessToken: string;
  let resumeId: string;
  let documentId: string;

  test.beforeAll(async ({ request }) => {
    const email = `e2e+coverletter+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'Cover', lastName: 'Tester', email, password: 'Password123!',
    });
    accessToken = result.accessToken;

    const res = await request.post(`${BASE_URL}/resumes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { title: 'Test Resume for CL', targetRole: 'Backend Engineer' },
    });
    resumeId = (await res.json()).data?.id;
  });

  test('7.1 generates a cover letter and returns 201 with document', async ({ request }) => {
    test.skip(!resumeId, 'Requires a resume');
    const creditsBefore = await getCredits(request, accessToken);

    const res = await request.post(`${BASE_URL}/documents/cover-letter/generate`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        type: 'job_application',
        companyName: 'Stripe',
        jobTitle: 'Senior Backend Engineer',
        jobDescription: 'We are hiring a backend engineer to work on our payments infrastructure with Node.js and TypeScript.',
        resumeId,
        tone: 'professional',
        wordLimit: 400,
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.data.document.id).toBeTruthy();
    expect(body.data.document.type).toBe('COVER_LETTER');
    expect(body.data.document.content).toBeTruthy();
    documentId = body.data.document.id;

    const creditsAfter = await getCredits(request, accessToken);
    expect(creditsAfter).toBe(creditsBefore - 2);
  });

  test('7.2 regenerates a cover letter using same document ID', async ({ request }) => {
    test.skip(!documentId, 'Requires a generated cover letter');
    const res = await request.post(`${BASE_URL}/documents/cover-letter/${documentId}/regenerate`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.document.id).toBe(documentId);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8 — SOP Generator
// ─────────────────────────────────────────────────────────────────────────────

test.describe('8. SOP Generator', () => {
  let accessToken: string;

  test.beforeAll(async ({ request }) => {
    const email = `e2e+sop+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'SOP', lastName: 'Tester', email, password: 'Password123!',
    });
    accessToken = result.accessToken;
  });

  test('8.1 generates an SOP and returns 201', async ({ request }) => {
    const creditsBefore = await getCredits(request, accessToken);

    const res = await request.post(`${BASE_URL}/documents/sop/generate`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        program: 'MS Computer Science',
        university: 'Stanford University',
        country: 'USA',
        degree: 'Masters',
        researchInterests: ['Machine Learning', 'Distributed Systems'],
        academicBackground: 'BS in Computer Science from NUST, GPA 3.8',
        workExperience: '2 years as Software Engineer at TechCorp',
        whyThisProgram: "Stanford's AI lab is world-renowned and aligns with my research interests",
        careerGoals: 'Become an AI researcher and eventually lead an AI lab',
        wordLimit: 800,
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.data.document.type).toBe('SOP');
    expect(body.data.document.content).toBeTruthy();

    const creditsAfter = await getCredits(request, accessToken);
    expect(creditsAfter).toBe(creditsBefore - 3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8.3 — Document CRUD
// ─────────────────────────────────────────────────────────────────────────────

test.describe('8.3 Document CRUD', () => {
  let accessToken: string;

  test.beforeAll(async ({ request }) => {
    const email = `e2e+docCRUD+${Date.now()}@example.com`;
    const result = await apiRegister(request, {
      firstName: 'Doc', lastName: 'CRUD', email, password: 'Password123!',
    });
    accessToken = result.accessToken;
  });

  test('lists all documents with pagination', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/documents?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
  });

  test('filters documents by type', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/documents?type=COVER_LETTER`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status()).toBe(200);
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
