# TASK 03 — Remove Fake Testimonials, Add Honest Beta Messaging

**Priority:** 🔴 Critical — Legal & Trust Risk  
**Estimated Time:** 2 hours  
**Status:** Open

---

## Problem

### 1. Fake Testimonials

`frontend/constants/landing.constants.ts` contains `TESTIMONIALS` — fabricated quotes with fake names, fake companies, and fake results. The section header says "Real Results. Real stories." This is deceptive.

The `Testimonials` component is loaded in `frontend/app/(public)/page.tsx`.

### 2. Inflated Stats

Check `landing.constants.ts` and any hero/stats section for numbers like "10,000+ users", "95% success rate", "500+ companies" — any figure that is not backed by real data.

### 3. No Beta Indication

Nothing on the site tells users this is a new product. First-time users have no context for why data might be limited.

---

## Fix Plan

### Step 1 — Remove the Testimonials Section

In `frontend/app/(public)/page.tsx`, remove the `<Testimonials />` dynamic import and its usage.

In `landing.constants.ts`, delete the `TESTIMONIALS` array and the `Testimonial` type.

Remove the "Reviews" link from `NAV_LINKS` (currently pointing to `/#testimonials`).

### Step 2 — Add Beta Banner to Landing Page

Add a top banner above the navbar:

```tsx
// frontend/components/layout/BetaBanner.tsx
export function BetaBanner() {
  return (
    <div className="w-full bg-teal-600 text-white text-center py-2 px-4 text-sm font-medium">
      🚀 CareerForge AI is in Beta — First 500 users get{' '}
      <strong>6 months Pro free</strong>.{' '}
      <a href="/auth/register" className="underline font-bold">
        Join now →
      </a>
    </div>
  );
}
```

Add `<BetaBanner />` as the very first element in the public layout.

### Step 3 — Replace Stats with Honest Alternatives

If there are fake user/company count stats on the landing page, replace them with:

```
"Built for job seekers"       → instead of "10,000+ users"
"AI-powered in seconds"       → instead of "95% success rate"
"Free to start, no card needed" → instead of inflated claim
```

Or simply remove the stats section entirely until you have real numbers.

### Step 4 — Add Beta Label to Dashboard

In the dashboard header or sidebar footer, add a small "Beta" pill so users inside the app also see it:

```tsx
<span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full">
  BETA
</span>
```

---

## Files to Change

| File | Change |
|---|---|
| `frontend/app/(public)/page.tsx` | Remove `<Testimonials />` |
| `frontend/constants/landing.constants.ts` | Delete `TESTIMONIALS` array, remove "Reviews" from `NAV_LINKS` |
| `frontend/components/sections/Testimonials.tsx` | Delete file |
| `frontend/app/(public)/layout.tsx` | Add `<BetaBanner />` |
| `frontend/components/layout/BetaBanner.tsx` | **Create** |
| Dashboard layout or sidebar | Add "BETA" pill |
