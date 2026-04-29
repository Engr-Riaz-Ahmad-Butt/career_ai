# TASK 08 — Referral System UI

**Priority:** 🟡 Medium — Backend Already Done, Just Needs UI  
**Estimated Time:** 3 hours  
**Status:** Open

---

## Current State

The backend referral system is fully implemented:

- `User.referralCode` — unique 8-char code generated at signup
- `User.referredById` — tracks who referred this user
- `CreditTransaction` with type `REFERRAL` — records credits earned from referrals
- `resolveReferrer()` in `auth.service.ts` — handles referral on registration

The frontend has **zero UI** for this. Users have referral codes but no way to see or share them.

---

## What to Build

### 1. Referral Section in Settings Page

Add a new tab or section in `frontend/app/(dashboard)/settings/page.tsx` called "Referrals" or embed it in the existing profile tab.

**Show:**
- User's referral link: `https://careerforge.ai/auth/register?ref=USERCODE`
- One-click copy button
- Number of people referred
- Total credits earned from referrals

```tsx
// Referral link display
const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?ref=${user.referralCode}`;

<div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
  <span className="flex-1 text-sm font-mono text-slate-600 truncate">{referralLink}</span>
  <Button size="sm" onClick={() => navigator.clipboard.writeText(referralLink)}>
    Copy
  </Button>
</div>
```

### 2. Referral Stats

Call `GET /api/v1/credits/history` (already exists) and filter for `type === 'REFERRAL'` transactions to show:
- Credits earned from referrals
- How many referrals converted (count of REFERRAL transactions)

Or add a dedicated `GET /api/v1/user/referral-stats` endpoint if you want cleaner data:

```ts
// Endpoint response shape
{
  referralCode: string;
  referralCount: number;         // how many users signed up with this code
  creditsEarned: number;         // total credits earned from referrals
}
```

### 3. Auto-Apply Referral Code on Registration

The register page (`frontend/app/(auth)/auth/register/page.tsx`) should read `?ref=CODE` from the URL and pass it as `referralCode` in the registration form body.

```tsx
// frontend/app/(auth)/auth/register/page.tsx
import { useSearchParams } from 'next/navigation';

const searchParams = useSearchParams();
const referralCode = searchParams.get('ref');

// Pass to register mutation:
registerMutation.mutate({ ...formData, referralCode });
```

The backend already handles this — `registerData.referralCode` is passed to `resolveReferrer()` in `auth.service.ts`.

### 4. Referral History Table (Optional)

Show a table of `CreditTransaction` entries with `type === 'REFERRAL'`:

| Date | Credits | Description |
|---|---|---|
| Jan 15, 2026 | +5 | Referral bonus — user joined |
| Feb 3, 2026 | +5 | Referral bonus — user joined |

---

## API Calls Needed

| Call | Endpoint | Notes |
|---|---|---|
| Get referral code | `GET /api/v1/user/me` | `referralCode` field on user object |
| Get credit history | `GET /api/v1/credits/history` | Filter for `type === 'REFERRAL'` |
| (Optional) Referral stats | `GET /api/v1/user/referral-stats` | New endpoint, simple DB aggregate |

---

## Files to Change

| File | Change |
|---|---|
| `frontend/app/(dashboard)/settings/page.tsx` | Add Referrals section/tab |
| `frontend/app/(auth)/auth/register/page.tsx` | Read `?ref=` from URL, pass to API |
| `backend/src/routes/user.routes.ts` | Add `GET /referral-stats` if needed |
| `backend/src/controllers/user.controller.ts` | Add `getReferralStats` handler if needed |
