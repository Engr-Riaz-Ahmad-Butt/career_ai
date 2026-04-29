# TASK 06 — Build 4-Step Onboarding Wizard

**Priority:** 🟡 High — Biggest Impact on User Activation  
**Estimated Time:** 3–4 days  
**Status:** Open

---

## Why This Matters

New users who don't complete their first meaningful action within 10 minutes of signing up will not return. The 4-step wizard forces users through the "aha moment" — seeing AI improve their resume — before they can access the free-roam dashboard.

The backend already supports every step. This is a pure frontend build.

---

## Flow Overview

```
Sign Up → [Step 1] Upload or Build Resume
        → [Step 2] Run ATS Scan
        → [Step 3] Generate One Document (Cover Letter or Bio)
        → [Step 4] View Portfolio Preview
        → Dashboard (onboarding complete)
```

User cannot skip steps. A persistent progress bar shows position. The wizard stores progress in `onboardingComplete: Boolean` on the User model (already in DB schema).

---

## Step 1 — Upload or Build Resume

**Route:** `POST /api/v1/resumes` or `POST /api/v1/resumes/upload`

Show two options:
- **Upload PDF/DOCX** — uses existing `resumeApi.upload()`, AI extracts the data
- **Start from scratch** — goes to the quick-fill personal info form (subset of full wizard)

On completion: store `resumeId` in the onboarding state and advance to Step 2.

---

## Step 2 — ATS Scan

**Route:** `POST /api/v1/jobs/resume/:resumeId/ats-score` (BullMQ job)

Show a job description text area. User pastes a job posting. Submit calls the ATS score endpoint, poll for result using `useJobPoller`. Display the score (0–100) with a breakdown of matched vs missing keywords.

This is the core "aha moment" — users see their score and immediately understand the value.

---

## Step 3 — Generate One Document

**Route:** `POST /api/v1/ai/generate-cover-letter` or `POST /api/v1/ai/generate-linkedin-bio`

Give user a choice: generate a cover letter for the job they just analyzed, or generate a LinkedIn bio. One click, 10 seconds, result shown inline.

This shows the AI generation capability without overwhelming the user.

---

## Step 4 — Portfolio Preview

Show a static preview of what their portfolio will look like based on the resume data just uploaded. Include a "Deploy to GitHub" button (can be disabled with "coming soon" if portfolio deploy isn't live yet).

Even a read-only preview of the portfolio template counts as completing this step.

---

## Technical Implementation

### Onboarding Route

Create `frontend/app/(onboarding)/` as a new route group with its own layout (no sidebar, just the wizard UI).

Redirect new users here after signup:

```ts
// frontend/hooks/use-auth.ts — after login/register success
if (!user.onboardingComplete) {
  router.push('/onboarding');
}
```

### Progress State

```ts
// frontend/store/onboardingStore.ts
interface OnboardingState {
  step: 1 | 2 | 3 | 4;
  resumeId: string | null;
  jobDescription: string | null;
  atsScore: number | null;
  generatedDocument: string | null;
  setStep: (step: number) => void;
  setResumeId: (id: string) => void;
  // ...
}
```

### Complete Onboarding

On finishing Step 4, call:

```ts
// PATCH /api/v1/profile — set onboardingComplete: true
await apiClient.patch('/profile', { onboardingComplete: true });
router.push('/dashboard');
```

---

## UI Components Needed

| Component | Description |
|---|---|
| `OnboardingLayout` | Full-screen layout, no sidebar, progress bar at top |
| `StepIndicator` | 4 dots / bar showing current step |
| `ResumeUploadStep` | Upload card + "start from scratch" option |
| `ATSScanStep` | Job description textarea + score display |
| `DocumentGenerateStep` | Choice + one-click generate + result preview |
| `PortfolioPreviewStep` | Static portfolio preview card |

---

## Files to Create

```
frontend/app/(onboarding)/
  layout.tsx               — full-screen, no sidebar
  onboarding/
    page.tsx               — step router based on store
    upload/page.tsx        — Step 1
    ats-scan/page.tsx      — Step 2
    generate/page.tsx      — Step 3
    portfolio/page.tsx     — Step 4
frontend/store/onboardingStore.ts
frontend/components/onboarding/
  StepIndicator.tsx
  OnboardingLayout.tsx
```
