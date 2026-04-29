# TASK 01 — Make GEMINI_API_KEY Required in Production

**Priority:** 🔴 Critical — Do First  
**Estimated Time:** 15 minutes  
**Status:** Open

---

## Problem

`GEMINI_API_KEY` is currently optional in the env schema:

```ts
// backend/src/config/env.ts
GEMINI_API_KEY: z.string().optional(),
```

If this key is missing or wrong in production, every AI feature silently fails:
- Resume tailoring
- Cover letter generation
- ATS scoring
- Interview prep
- Bio generator
- Communication analyzer

Users will lose credits for operations that return nothing. There is no guard that prevents the server from starting without this key.

---

## Files to Change

### `backend/src/config/env.ts`

```ts
// Before
GEMINI_API_KEY: z.string().optional(),

// After
GEMINI_API_KEY: process.env.NODE_ENV === 'production'
  ? z.string().min(1, 'GEMINI_API_KEY is required in production')
  : z.string().optional(),
```

Or simpler — just make it always required and add it to all environments:

```ts
GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
```

### `backend/src/config/gemini.ts`

Add a startup guard so the server crashes immediately (not on first AI call) if the key is missing:

```ts
if (!env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set. All AI features will fail.');
}
```

---

## Verification

1. Remove `GEMINI_API_KEY` from `.env`
2. Start the backend — it should throw on startup, not on first AI request
3. Add the key back — server starts normally
4. Call `POST /api/v1/ai/score-ats` — returns a valid AI response

---

## Also Check

Verify `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` follow the same pattern — currently they are also optional, which means billing silently returns 501 in production. These should at minimum log a loud warning at startup if missing.
