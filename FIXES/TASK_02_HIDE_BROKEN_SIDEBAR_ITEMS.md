# TASK 02 — Hide A/B Testing & Career Growth from Sidebar

**Priority:** 🔴 Critical — Do Before Any Real User Sees This  
**Estimated Time:** 30 minutes  
**Status:** Open

---

## Problem

Two sidebar items link to pages that are pure frontend toys with no backend connection:

| Page | Data Source | Backend? |
|---|---|---|
| `/ab-testing` | `abTestingData.ts` — local mock with fake predictions | None |
| `/career-growth` | `careerGrowthData.ts` — local mock data | None |

A paying user who clicks these will see fabricated data that changes nothing and saves nothing. This destroys credibility.

---

## Option A — Add "Coming Soon" Label (Recommended, 30 min)

Keep the routes but disable navigation and show a badge. This preserves the feature promise without shipping a broken experience.

### Find the sidebar nav config

Look in `frontend/components/layout/` or `frontend/app/(dashboard)/layout.tsx` for the sidebar navigation array. Find the entries for `ab-testing` and `career-growth`.

Add a `comingSoon: true` flag:

```ts
const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { label: 'Resume Builder', href: '/resume-builder', icon: FileText },
  // ...
  {
    label: 'Career Growth',
    href: '/career-growth',
    icon: TrendingUp,
    comingSoon: true,   // add this
  },
  {
    label: 'A/B Testing',
    href: '/ab-testing',
    icon: Sparkles,
    comingSoon: true,   // add this
  },
];
```

### Update the sidebar item renderer

```tsx
{item.comingSoon ? (
  <div className="flex items-center gap-2 px-3 py-2 text-slate-400 cursor-not-allowed rounded-lg">
    <item.icon className="h-4 w-4" />
    <span className="text-sm">{item.label}</span>
    <span className="ml-auto text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full">
      Soon
    </span>
  </div>
) : (
  <Link href={item.href}>...</Link>
)}
```

---

## Option B — Remove Entirely (10 min)

Simply delete the nav entries. Cleaner but loses the feature signal.

---

## What NOT to Do

Do not build a full backend for A/B Testing or Career Growth right now. Each would require:
- **A/B Testing:** Resume variant storage, real ATS score comparison, statistical significance calculation
- **Career Growth:** Monthly report generation, skill tracking over time, goal setting system

Both are week-long builds. The sidebar label costs 30 minutes. Do the sidebar first.

---

## Files to Change

1. `frontend/components/layout/Sidebar.tsx` (or wherever nav items are defined)
2. The sidebar item renderer component — add `comingSoon` visual treatment
