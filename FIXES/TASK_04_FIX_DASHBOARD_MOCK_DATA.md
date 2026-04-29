# TASK 04 — Fix Remaining Mock Data in Dashboard & Job Tracker Components

**Priority:** 🟠 High — Core UX is Broken  
**Estimated Time:** 3 hours  
**Status:** Open

---

## Problem

Two areas still use hardcoded mock data after the previous fixes:

### 1. Dashboard Page — Recent Documents

`frontend/app/(dashboard)/dashboard/page.tsx` lines ~91–110:

```ts
// Mock recent documents (replace with real API data later)
const recentDocuments = [
  { id: '1', title: 'Google Cover Letter', type: 'Cover Letter', ... },
  { id: '2', title: 'Amazon SOP', type: 'SOP', ... },
];
```

This is hardcoded at module level and always shows the same two fake documents regardless of who is logged in.

### 2. Job Tracker Components — Still Read from Mock Store

`frontend/components/job-tracker/JobTable.tsx`, `JobDetail.tsx`, and `InterviewNotes.tsx` all import directly from `@/lib/jobTrackerData` for type definitions and in some cases for mock data initialization. Although the page now fetches from the API via `jobTrackerApi`, the sub-components may still reference the local mock store instead of the data passed from the parent.

---

## Fix Plan

### Fix 1 — Dashboard Recent Documents

Replace the hardcoded array with a real API call using the existing `documentApi` and `resumeApi`:

```tsx
// frontend/app/(dashboard)/dashboard/page.tsx

import { useDocumentsLibrary } from '@/hooks/useDocumentsLibrary';

// Inside the component:
const { items: recentDocuments, isLoading: isDocsLoading } = useDocumentsLibrary();
const latestDocs = recentDocuments.slice(0, 5); // show 5 most recent
```

`useDocumentsLibrary` already exists at `frontend/hooks/useDocumentsLibrary.ts` and returns merged resume + document items sorted by `lastModified`. Use it directly — no new code needed.

### Fix 2 — Dashboard Job Stats

The dashboard reads `useJobTrackerStore` for job stats (line ~111). Since the job tracker page now fetches from the API, the store is no longer populated with real data on dashboard load. Two options:

**Option A (Quick):** On the jobs page load, call `setJobs(data)` to sync the Zustand store from the API response. The dashboard then reads the store as before.

**Option B (Clean):** Add a `useDashboard` hook that calls `GET /api/v1/dashboard` directly — the backend already has a `dashboard.controller.ts` and `dashboard.service.ts`. Use the API stats instead of the local store.

Option B is cleaner — check what `GET /api/v1/dashboard` returns and wire the stats cards to it:

```tsx
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient.get('/dashboard').then((r) => r.data.data),
  });
}
```

### Fix 3 — Job Tracker Components

Audit `JobTable.tsx`, `JobDetail.tsx`, `InterviewNotes.tsx`:

- Remove any direct imports from `@/lib/jobTrackerData` that pull mock data (type imports are fine)
- Ensure they receive job data as props from `jobs/page.tsx` (which now fetches from API)
- The `JobDetail` component likely calls `getJobById` on the store — change this to accept a `job` prop directly

---

## Files to Change

| File | Change |
|---|---|
| `frontend/app/(dashboard)/dashboard/page.tsx` | Use `useDocumentsLibrary()` hook, add `useDashboardStats()` |
| `frontend/components/job-tracker/JobTable.tsx` | Remove mock data imports, accept props |
| `frontend/components/job-tracker/JobDetail.tsx` | Accept `job` prop instead of reading from store |
| `frontend/components/job-tracker/InterviewNotes.tsx` | Same — accept props |
