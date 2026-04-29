# TASK 10 — LinkedIn Profile Optimizer Page

**Priority:** 🟢 Low — Nice Differentiator, ~4 Hours  
**Estimated Time:** 4 hours  
**Status:** Open

---

## Overview

New route `/linkedin-optimizer` in the dashboard.

User inputs their current LinkedIn profile text (paste-in, since LinkedIn doesn't have a public API). The AI returns:
- Optimized headline
- Rewritten summary section
- 3 improved bullet points for their most recent experience
- Keyword suggestions for LinkedIn's algorithm

This reuses the existing Gemini integration — no new backend service needed, just a new prompt and controller action.

---

## Backend

### New AI Endpoint

Add to `backend/src/routes/ai.routes.ts`:

```ts
router.post('/optimize-linkedin', authenticate, creditCheck(3), asyncHandler(aiController.optimizeLinkedIn));
```

### Controller

```ts
// backend/src/controllers/ai.controller.ts
export const optimizeLinkedIn = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const { profileText, targetRole, industry } = req.body;
  if (!profileText) throw new ValidationError('profileText is required');

  const result = await aiService.optimizeLinkedInProfile({
    profileText,
    targetRole,
    industry,
  });

  await creditsService.deductCredits(req.user.userId, 3, 'LinkedIn profile optimization');

  res.json({ success: true, data: result });
});
```

### AI Service Method

Add to `backend/src/services/ai/aiService.ts`:

```ts
interface LinkedInOptimizeOptions {
  readonly profileText: string;
  readonly targetRole?: string;
  readonly industry?: string;
}

interface LinkedInOptimizeResult {
  headline: string;
  summary: string;
  experienceBullets: Array<{ original: string; improved: string; reason: string }>;
  keywords: string[];
  overallTips: string[];
}

async optimizeLinkedInProfile(options: LinkedInOptimizeOptions): Promise<LinkedInOptimizeResult> {
  if (!options.profileText) throw new ValidationError('profileText is required');

  const prompt = `You are a LinkedIn optimization expert. Analyze this LinkedIn profile and provide improvements.
Target Role: ${options.targetRole || 'Not specified'}
Industry: ${options.industry || 'Not specified'}

Profile Text:
${options.profileText.substring(0, 5000)}

Return JSON:
{
  "headline": "optimized headline (120 chars max)",
  "summary": "rewritten About section (300 words max)",
  "experienceBullets": [
    { "original": "old bullet", "improved": "new bullet with metrics", "reason": "why this is better" }
  ],
  "keywords": ["keyword1", "keyword2"],
  "overallTips": ["tip1", "tip2", "tip3"]
}`;

  return generateStructuredContent<LinkedInOptimizeResult>(prompt, MODELS.PRO);
}
```

Add `LinkedInOptimizeResult` to `aiService.types.ts`.

---

## Frontend

### Route

Create `frontend/app/(dashboard)/linkedin-optimizer/page.tsx`.

Add to sidebar nav:

```ts
{ label: 'LinkedIn Optimizer', href: '/linkedin-optimizer', icon: Linkedin }
```

### Page Layout

```
┌─────────────────────────────────────────┐
│  LinkedIn Profile Optimizer             │
│  3 credits per analysis                 │
├──────────────────┬──────────────────────┤
│  Input Panel     │  Results Panel       │
│                  │                      │
│  [Paste your     │  Headline:           │
│   LinkedIn       │  ┌────────────────┐  │
│   profile text   │  │ Optimized text │  │
│   here...]       │  └────────────────┘  │
│                  │                      │
│  Target Role:    │  Summary:            │
│  [_________]     │  [Rewritten text]    │
│                  │                      │
│  Industry:       │  Experience Bullets: │
│  [_________]     │  Before → After      │
│                  │                      │
│  [Optimize →]    │  Keywords to add:    │
│                  │  [tag] [tag] [tag]   │
└──────────────────┴──────────────────────┘
```

### API Hook

```ts
// frontend/hooks/use-ai.ts — add to aiApi object
optimizeLinkedIn: (data: { profileText: string; targetRole?: string; industry?: string }) =>
  api.post('/ai/optimize-linkedin', data).then((res) => res.data),

// Add to useAI():
optimizeLinkedIn: useMutation({ mutationFn: aiApi.optimizeLinkedIn }),
```

### Copy Buttons

Each output section (headline, summary, each bullet) should have a copy-to-clipboard button so users can paste directly into LinkedIn.

---

## Files to Create/Change

| File | Change |
|---|---|
| `backend/src/routes/ai.routes.ts` | Add `POST /optimize-linkedin` |
| `backend/src/controllers/ai.controller.ts` | Add `optimizeLinkedIn` handler |
| `backend/src/services/ai/aiService.ts` | Add `optimizeLinkedInProfile()` method |
| `backend/src/services/ai/aiService.types.ts` | Add `LinkedInOptimizeResult` interface |
| `frontend/app/(dashboard)/linkedin-optimizer/page.tsx` | **Create** |
| `frontend/hooks/use-ai.ts` | Add `optimizeLinkedIn` mutation |
| Frontend sidebar nav | Add LinkedIn Optimizer link |

---

## Credit Cost

3 credits per optimization (same as cover letter). Add a visible credit cost indicator near the "Optimize" button.
