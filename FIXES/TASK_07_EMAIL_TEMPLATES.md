# TASK 07 — Build Branded Email Templates

**Priority:** 🟡 Medium — Required for Professional Launch  
**Estimated Time:** 1 day (minimum 2 emails), 2–3 days (all 6)  
**Status:** Open

---

## Current State

`backend/src/services/email.service.ts` exists with Nodemailer configured. It likely sends plain-text or basic HTML. No branded templates exist.

---

## Emails to Build (Priority Order)

### 1. Welcome Email — **Build First**

Triggered: After successful registration (`auth.service.ts` → `register()`)

Content:
- Logo + brand header
- "Welcome to CareerForge AI, [firstName]!"
- Your 10 free credits are ready
- 3 quick-start buttons: Build Resume, Generate Cover Letter, Run ATS Scan
- Link to the onboarding wizard

### 2. Low Credits Warning — **Build Second**

Triggered: When user's credits drop to 3 or below (check after every credit deduction in `credits.service.ts`)

Content:
- "You're running low on credits — 3 left"
- What you can still do with 3 credits
- "Top up now" CTA button → links to billing/credits page
- Show current plan + upgrade prompt if on Free

### 3. Resume Analyzed

Triggered: After ATS scan completes

Content:
- ATS Score result (big number, color-coded)
- Top 3 missing keywords
- "Improve your score" CTA → links to tailor page

### 4. Document Generated

Triggered: After cover letter, SOP, or bio is created

Content:
- "Your [Cover Letter] is ready"
- Preview snippet (first 100 chars)
- "View Document" CTA

### 5. Weekly Digest

Triggered: Every Monday for active users (BullMQ scheduled job)

Content:
- Credits remaining
- Documents created this week
- Job applications updated
- Tip of the week

### 6. Portfolio Deployed

Triggered: After successful GitHub deployment

Content:
- "Your portfolio is live!"
- Live URL as a big CTA button
- Share on LinkedIn prompt

---

## Implementation Approach

Use **React Email** (`@react-email/components`) — it renders React components to HTML and plain-text simultaneously.

### Install

```bash
npm install @react-email/components react-email --save-dev
# in backend:
npm install @react-email/render
```

### Folder Structure

```
backend/src/emails/
  WelcomeEmail.tsx
  LowCreditsEmail.tsx
  ResumeAnalyzedEmail.tsx
  DocumentGeneratedEmail.tsx
  WeeklyDigestEmail.tsx
  PortfolioDeployedEmail.tsx
  components/
    EmailLayout.tsx      — shared header/footer with logo
    EmailButton.tsx      — branded CTA button
    EmailStats.tsx       — stats row component
```

### Render and Send

```ts
// backend/src/services/email.service.ts
import { render } from '@react-email/render';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

async function sendWelcomeEmail(user: { email: string; firstName: string }) {
  const html = await render(WelcomeEmail({ firstName: user.firstName }));
  const text = await render(WelcomeEmail({ firstName: user.firstName }), { plainText: true });

  await transporter.sendMail({
    to: user.email,
    subject: 'Welcome to CareerForge AI — your 10 credits are ready',
    html,
    text,
  });
}
```

### Trigger Points

| Email | Where to Add the Call |
|---|---|
| Welcome | `auth.service.ts` → after `prisma.user.create()` in `register()` |
| Low Credits | `credits.service.ts` → after every `deductCredits()`, check if balance <= 3 |
| Resume Analyzed | `job.worker.ts` → after ATS score job completes |
| Document Generated | `document.service.ts` → after `prisma.document.create()` |
| Portfolio Deployed | `portfolio.service.ts` → after deploy succeeds |
| Weekly Digest | New BullMQ scheduled job — fires every Monday at 9am |

---

## Preview During Development

React Email has a preview server:

```bash
npx react-email dev --dir backend/src/emails
# Opens http://localhost:3001 with live preview of all emails
```
