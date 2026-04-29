# CareerForge AI — Comprehensive Testing Guide

> **Purpose:** End-to-end manual + AI-assisted testing of every feature, API route, and UI flow.  
> **Base URL (backend):** `http://localhost:5000/api`  
> **Base URL (frontend):** `http://localhost:3000`  
> **Test date:** 2026-04-29

---

## Table of Contents

1. [Test Environment Setup](#1-test-environment-setup)
2. [Authentication](#2-authentication)
3. [Onboarding Wizard](#3-onboarding-wizard)
4. [User Profile & Settings](#4-user-profile--settings)
5. [Resume Builder](#5-resume-builder)
6. [AI — Resume Tools](#6-ai--resume-tools)
7. [Cover Letter Generator](#7-cover-letter-generator)
8. [SOP Generator](#8-sop-generator)
9. [Interview Prep](#9-interview-prep)
10. [LinkedIn Optimizer](#10-linkedin-optimizer)
11. [Job Tracker](#11-job-tracker)
12. [Portfolio Builder](#12-portfolio-builder)
13. [Credit System](#13-credit-system)
14. [Billing & Stripe](#14-billing--stripe)
15. [Referral System](#15-referral-system)
16. [Email Delivery](#16-email-delivery)
17. [Background Jobs](#17-background-jobs)
18. [Security & Edge Cases](#18-security--edge-cases)
19. [Full User Journey (Golden Path)](#19-full-user-journey-golden-path)

---

## 1. Test Environment Setup

### 1.1 Required Services Running

```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 3000)
cd frontend && npm run dev

# Redis (required for BullMQ job queues)
redis-server

# PostgreSQL must be running with migrations applied
cd backend && npx prisma migrate dev
```

### 1.2 Required Environment Variables

Confirm these are set in `backend/.env`:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Access token signing |
| `JWT_REFRESH_SECRET` | Refresh token signing |
| `GEMINI_API_KEY` | All AI features |
| `GOOGLE_CLIENT_ID` | Google OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth |
| `STRIPE_SECRET_KEY` | Billing (use `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification |
| `REDIS_URL` | BullMQ jobs |
| `FRONTEND_URL` | Email deep links (e.g. `http://localhost:3000`) |
| `SMTP_HOST/USER/PASS` | Email delivery |

### 1.3 Create 3 Test Accounts

Use these throughout testing:

| Account | Purpose |
|---|---|
| `test+main@example.com` / `Password123!` | Primary tester |
| `test+referer@example.com` / `Password123!` | Referral tester (created first) |
| `test+low@example.com` / `Password123!` | Low-credits / billing edge cases |

### 1.4 Set Up Postman (or use curl examples below)

- Import collection with `Authorization: Bearer {{accessToken}}` header
- Set `{{BASE_URL}}` = `http://localhost:5000/api`
- After login, copy `accessToken` from response and set as variable

---

## 2. Authentication

### 2.1 Email Registration

**POST** `/auth/register`

```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test+main@example.com",
  "password": "Password123!"
}
```

**Expected:**
- `201` with `{ success: true, data: { user, accessToken } }`
- `refreshToken` cookie set (HttpOnly)
- `user.credits` = 10
- `user.plan` = `"FREE"`
- `user.emailVerified` = false
- Verification email arrives in inbox

**Failure cases to test:**
```json
// Duplicate email → 409
{ "email": "test+main@example.com", "password": "Password123!", "firstName": "A", "lastName": "B" }

// Short password → 400 validation
{ "email": "new@test.com", "password": "abc", "firstName": "A", "lastName": "B" }

// Missing fields → 400 validation
{ "email": "no-password@test.com" }
```

---

### 2.2 Email Login

**POST** `/auth/login`

```json
{
  "email": "test+main@example.com",
  "password": "Password123!"
}
```

**Expected:** `200` with `accessToken`, `refreshToken` cookie, full user object.

**Failure cases:**
```json
// Wrong password → 401
{ "email": "test+main@example.com", "password": "WrongPass" }

// Non-existent user → 401
{ "email": "ghost@test.com", "password": "Password123!" }
```

---

### 2.3 Token Refresh

**POST** `/auth/refresh`  
_(Requires `refreshToken` cookie — send via browser or set cookie manually in Postman)_

**Expected:** `200` with new `accessToken` and rotated `refreshToken` cookie.

---

### 2.4 Logout

**POST** `/auth/logout`  
_(Requires `Authorization: Bearer <token>` header)_

**Expected:** `200`, `refreshToken` cookie cleared, token is revoked in DB.

**Verify revocation:** Immediately try `POST /auth/refresh` → must return `401`.

---

### 2.5 Forgot Password Flow

```bash
# Step 1: Request reset
POST /auth/forgot-password
{ "email": "test+main@example.com" }
# → 200 (always, to prevent enumeration)
# → Check email for reset link containing token

# Step 2: Reset using token from email
POST /auth/reset-password
{ "token": "<token-from-email>", "password": "NewPassword123!" }
# → 200

# Step 3: Old password no longer works
POST /auth/login
{ "email": "test+main@example.com", "password": "Password123!" }
# → 401

# Step 4: New password works
POST /auth/login
{ "email": "test+main@example.com", "password": "NewPassword123!" }
# → 200
```

---

### 2.6 Email Verification

```bash
# Get token from verification email link
POST /auth/verify-email
{ "token": "<token-from-email>" }
# → 200 { "message": "Email verified successfully" }
# → user.emailVerified now true

# Resend verification
POST /auth/resend-verification
{ "email": "test+main@example.com" }
# → 200

# Expired token → 400
POST /auth/verify-email
{ "token": "expired-or-fake-token" }
# → 400
```

---

### 2.7 Google OAuth

**UI Test:**
1. Go to `http://localhost:3000/auth/login`
2. Click "Continue with Google"
3. Select a Google account
4. Should redirect to dashboard with user logged in
5. Check DB: user has `provider: "google"`, `emailVerified: true`, `credits: 10`

---

### 2.8 GitHub OAuth

**UI Test:**
1. Go to `http://localhost:3000/auth/login`
2. Click "Continue with GitHub"
3. Authorize the app
4. Should redirect to dashboard
5. Check DB: user has `provider: "github"`, `githubId` set, `credits: 10`

**API Test (redirect flow):**
```bash
GET /auth/github
# → 302 redirect to GitHub
# After callback: GET /auth/github/callback?code=<github_code>
# → 302 redirect to frontend
```

---

## 3. Onboarding Wizard

**Prerequisites:** Freshly registered account (onboardingComplete = false)

**UI Test:**
1. Log in with a new account
2. Should auto-redirect to `/onboarding`
3. Complete all wizard steps:
   - Step 1: Select role (e.g., "Software Engineer")
   - Step 2: Select industry (e.g., "Technology")
   - Step 3: Set target role (e.g., "Senior Software Engineer")
   - Step 4: Upload or skip resume
4. Click "Complete" / "Go to Dashboard"
5. Verify `user.onboardingComplete = true` via `GET /users/me`
6. Verify sidebar items are now visible in dashboard
7. Verify navigating to `/onboarding` redirects to `/dashboard` (since already complete)

---

## 4. User Profile & Settings

### 4.1 Get Profile

**GET** `/users/me`

**Expected:** Full user object with all profile fields.

---

### 4.2 Update Profile

**PUT** `/users/me`

```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "currentRole": "Software Engineer",
  "targetRole": "Senior Engineer",
  "industry": "Technology",
  "bio": "Passionate engineer with 5 years experience."
}
```

**Expected:** `200` with updated user.

---

### 4.3 Change Password

**PUT** `/users/me/password`

```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

**Expected:** `200`. Verify old password is rejected at next login.

---

### 4.4 Upload Avatar

**POST** `/users/me/avatar`  
Content-Type: `multipart/form-data`  
Body: `file` = a PNG or JPG file (< 2 MB)

**Expected:** `200` with `avatarUrl`. Verify image appears in UI sidebar.

**Failure case:** Upload a `.pdf` as avatar → must return `400` (magic bytes validation).

---

### 4.5 Credits & Usage

```bash
GET /users/me/credits
# → { credits: 10, lifetimeCreditsUsed: 0, lifetimeCreditsEarned: 10, plan: "FREE" }

GET /users/me/usage
# → usage stats object
```

**UI Test:** Go to `/settings` → Verify credit balance matches API response.

---

### 4.6 Delete Account

**DELETE** `/users/me`

**Expected:** `200`, account soft-deleted (deletedAt set). Subsequent login → `401`.

> **Note:** Use a throwaway account for this test. Do NOT delete your primary test account.

---

## 5. Resume Builder

### 5.1 Create Resume

**POST** `/resumes`

```json
{
  "title": "My Software Engineer Resume",
  "targetRole": "Senior Software Engineer",
  "targetIndustry": "Technology"
}
```

**Expected:** `201` with resume object containing `id`. **Costs 1 credit.**

---

### 5.2 List Resumes

**GET** `/resumes?page=1&limit=10`

**Expected:** `200` with paginated list.

---

### 5.3 Get Resume

**GET** `/resumes/:id`

**Expected:** `200` with full resume data.

---

### 5.4 Update Resume

**PUT** `/resumes/:id`

```json
{
  "title": "Updated Resume Title",
  "summary": "Experienced software engineer with expertise in React and Node.js.",
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "startDate": "2020-01",
      "endDate": "2024-01",
      "description": "Built scalable web applications serving 1M+ users."
    }
  ],
  "skills": ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL"]
}
```

**Expected:** `200`. Previous version auto-snapshotted.

---

### 5.5 Version History

```bash
# List versions
GET /resumes/:id/versions
# → Array of up to 5 snapshots

# Restore to a version
POST /resumes/:id/restore/:versionId
# → 200 with restored resume content
```

---

### 5.6 Duplicate Resume

**POST** `/resumes/:id/duplicate`

**Expected:** `201` with new resume (different ID, same content, title prefixed "Copy of").

---

### 5.7 Generate PDF

**POST** `/resumes/:id/pdf`

**Expected:** `200` with `pdfUrl` (S3/storage URL). Click URL to verify PDF downloads.

---

### 5.8 Upload & Parse Resume (File Upload)

**POST** `/resumes/upload`  
Content-Type: `multipart/form-data`  
Body: `file` = a real `.pdf` or `.docx` resume

**Expected:** `201` with parsed resume object. **Costs 1 credit.**

**Failure cases:**
- Upload `.exe` or non-resume file → `400` (magic bytes validation)
- Upload file > 5MB → `413` payload too large

---

### 5.9 Delete Resume

**DELETE** `/resumes/:id`

**Expected:** `200`. Verify `GET /resumes/:id` → `404`.

---

### 5.10 UI Test — Resume Builder Page

1. Go to `/resume-builder`
2. Click "Create New Resume"
3. Fill in personal info, work experience, education, skills
4. Click "Save" — verify auto-save works
5. Preview panel should update in real-time
6. Switch templates — verify template changes apply instantly
7. Click "Download PDF" — verify PDF opens in browser

---

## 6. AI — Resume Tools

> All AI calls require a valid `accessToken` and sufficient credits.

### 6.1 Enhance Resume (2 Credits)

**POST** `/ai/resume/enhance`

```json
{
  "resumeId": "<resume-id>",
  "section": "experience",
  "content": "Built web apps. Worked on backend. Did code reviews."
}
```

**Expected:** `200` with enhanced content. Credit balance decreases by 2.

---

### 6.2 Tailor Resume (3 Credits)

**POST** `/ai/resume/tailor`

```json
{
  "resumeId": "<resume-id>",
  "jobDescription": "We are looking for a Senior React Engineer with 5+ years of experience building scalable SPAs. Must know TypeScript, GraphQL, and CI/CD pipelines.",
  "targetRole": "Senior React Engineer"
}
```

**Expected:** `200` with tailored resume sections. **Costs 3 credits.**

---

### 6.3 ATS Score (1 Credit)

**POST** `/ai/resume/ats-score`

```json
{
  "resumeId": "<resume-id>",
  "jobDescription": "Senior React Engineer with TypeScript and GraphQL skills required."
}
```

**Expected:** `200` with score object:
```json
{
  "score": 72,
  "keywordMatches": ["React", "TypeScript"],
  "missingKeywords": ["GraphQL", "CI/CD"],
  "suggestions": ["Add GraphQL experience", "Mention CI/CD tools"],
  "overallFeedback": "..."
}
```

---

### 6.4 Extract Keywords (0 Credits — Free Utility)

**POST** `/ai/keywords/extract`

```json
{
  "text": "We need a Senior Node.js developer with PostgreSQL, Docker, and Kubernetes experience."
}
```

**Expected:** `200` with array of extracted keywords.

---

### 6.5 Fix Grammar (0 Credits — Free Utility)

**POST** `/ai/grammar/fix`

```json
{
  "text": "i builded a app that have 1 million user and its was very fast"
}
```

**Expected:** `200` with corrected text.

---

### 6.6 Improve Text (0 Credits — Free Utility)

**POST** `/ai/text/improve`

```json
{
  "text": "I did good work at my job and my boss was happy."
}
```

**Expected:** `200` with professionally improved text.

---

### 6.7 Insufficient Credits Test

1. Set a test user's credits to 0 in the DB:
   ```sql
   UPDATE "User" SET credits = 0 WHERE email = 'test+low@example.com';
   ```
2. Attempt any AI action with that user
3. **Expected:** `402 Payment Required` with `{ message: "Insufficient credits" }`

---

## 7. Cover Letter Generator

### 7.1 Generate Cover Letter (2 Credits)

**POST** `/documents/cover-letter/generate`

```json
{
  "type": "job_application",
  "companyName": "Stripe",
  "jobTitle": "Senior Backend Engineer",
  "jobDescription": "We are hiring a backend engineer to work on our payments infrastructure...",
  "resumeId": "<resume-id>",
  "tone": "professional",
  "wordLimit": 400
}
```

**Expected:** `201` with:
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "...",
      "type": "COVER_LETTER",
      "title": "Cover Letter — Stripe",
      "content": "...",
      "metadata": { ... }
    }
  }
}
```

---

### 7.2 Regenerate Cover Letter (2 Credits)

**POST** `/documents/cover-letter/:id/regenerate`

**Expected:** `200` with updated content. Same document ID.

---

### 7.3 UI Test — Cover Letter Page

1. Go to `/cover-letter`
2. Fill in company name, job title, paste job description
3. Click "Generate" — verify loading spinner shows
4. Verify generated letter appears in preview panel
5. Click "Copy" — verify text copies to clipboard
6. Click "Download PDF" — verify PDF generates
7. Verify credit balance in UI decreased by 2

---

## 8. SOP Generator

### 8.1 Generate SOP (3 Credits)

**POST** `/documents/sop/generate`

```json
{
  "program": "MS Computer Science",
  "university": "Stanford University",
  "country": "USA",
  "degree": "Masters",
  "researchInterests": ["Machine Learning", "Distributed Systems"],
  "academicBackground": "BS in Computer Science from NUST, GPA 3.8",
  "workExperience": "2 years as Software Engineer at TechCorp",
  "whyThisProgram": "Stanford's AI lab is world-renowned and aligns with my research interests",
  "careerGoals": "Become an AI researcher and eventually lead an AI lab",
  "wordLimit": 800
}
```

**Expected:** `201` with SOP document. **Costs 3 credits.**

---

### 8.2 Additional Document Generators

All follow the same pattern. Test each one:

| Endpoint | Credits | Required Fields |
|---|---|---|
| `/documents/motivation-letter/generate` | 2 | `program`, `university`, `personalStatement` |
| `/documents/study-plan/generate` | 2 | `program`, `university`, `studyPlan` |
| `/documents/financial-letter/generate` | 2 | `scholarshipName`, `amount`, `purpose` |
| `/documents/bio/generate` | 1 | `bioType`, `name`, `currentRole` |

---

### 8.3 Document CRUD

```bash
# List all documents
GET /documents?page=1&limit=10

# List by type filter
GET /documents?type=COVER_LETTER

# Get specific document
GET /documents/:id

# Update document (edit content)
PUT /documents/:id
{ "content": "Updated content here..." }

# Delete document
DELETE /documents/:id

# Generate PDF
POST /documents/:id/pdf

# Duplicate document
POST /documents/:id/duplicate
```

---

## 9. Interview Prep

### 9.1 Generate Interview Session (2 Credits)

**POST** `/interviews/generate`

```json
{
  "role": "Senior Software Engineer",
  "company": "Google",
  "industry": "Technology",
  "difficulty": "hard",
  "interviewType": "technical",
  "questionCount": 5,
  "resumeId": "<resume-id>"
}
```

**Expected:** `201` with session containing questions array. **Costs 2 credits.**

---

### 9.2 Submit Answer Feedback (1 Credit)

**POST** `/interviews/:id/feedback`

```json
{
  "questionId": "<question-id>",
  "answer": "I would approach this problem using a distributed cache like Redis to reduce database load. First, I would identify the hot paths..."
}
```

**Expected:** `200` with AI feedback on the answer. **Costs 1 credit.**

---

### 9.3 List & Get Sessions

```bash
GET /interviews?page=1&limit=10  # List all sessions
GET /interviews/:id               # Get session with questions
DELETE /interviews/:id            # Delete session
```

---

### 9.4 UI Test — Interview Prep Page

1. Go to `/interview-prep`
2. Select role, industry, difficulty, interview type
3. Click "Generate Questions" — verify loading state
4. Questions appear in a card list
5. Type an answer into a text area for one question
6. Click "Get Feedback" — verify AI feedback appears below answer
7. Verify credit balance decreased (2 for generation + 1 per feedback)

---

## 10. LinkedIn Optimizer

### 10.1 Optimize LinkedIn Profile (3 Credits)

**POST** `/ai/optimize-linkedin`

```json
{
  "profileText": "Senior Software Engineer at TechCorp with 8 years of experience. I build web applications and work with React and Node.js. I lead a team of 5 developers. Previously worked at StartupXYZ as a full-stack developer.",
  "targetRole": "Engineering Manager",
  "industry": "SaaS / B2B Software"
}
```

**Expected:** `200` with:
```json
{
  "success": true,
  "data": {
    "headline": "Engineering Manager | Scaling SaaS Teams | React & Node.js | 8+ Years",
    "summary": "Results-driven engineering leader...",
    "experienceBullets": [
      {
        "original": "I build web applications",
        "improved": "Architected and shipped 3 production web applications serving 500K+ monthly active users",
        "reason": "Quantified impact with metrics increases recruiter engagement"
      }
    ],
    "keywords": ["Engineering Manager", "Team Leadership", "SaaS", "React", "Node.js"],
    "overallTips": [
      "Post 2x per week to boost algorithm visibility",
      "Engage with 10 posts/day to increase profile views"
    ]
  }
}
```

**Costs 3 credits.**

---

### 10.2 UI Test — LinkedIn Optimizer Page

1. Go to `/linkedin-optimizer`
2. Paste a sample LinkedIn profile text (copy your own or use sample above)
3. Fill in "Target Role" and "Industry" fields
4. Click "Optimize Now (3 Credits)"
5. Verify loading spinner with "Optimizing Profile..."
6. Output panel shows:
   - Optimized Headline with "Highly Searched" badge and Copy button
   - About (Summary) section with Copy button
   - Experience Improvements with before/after comparison
   - Keywords to Add (teal badges)
   - Algorithm Tips list
7. Click each Copy button — verify clipboard works
8. Verify credit balance decreased by 3

---

## 11. Job Tracker

### 11.1 Create Job Application

**POST** `/jobs` (check actual route prefix)

```json
{
  "company": "Stripe",
  "role": "Senior Backend Engineer",
  "status": "APPLIED",
  "jobUrl": "https://stripe.com/jobs/12345",
  "salary": "$180,000",
  "location": "Remote",
  "notes": "Applied through LinkedIn. Referral from John."
}
```

**Expected:** `201` with job object.

---

### 11.2 Update Job Status

**PUT** `/jobs/:id`

```json
{ "status": "INTERVIEWING" }
```

Valid statuses to test cycling through: `BOOKMARKED → APPLIED → INTERVIEWING → OFFERED → REJECTED`

---

### 11.3 UI Test — Job Tracker Page

1. Go to `/job-tracker`
2. Click "Add Application"
3. Fill in company, role, status, URL
4. Verify card appears in the Kanban board in the correct column
5. Drag card from "Applied" to "Interviewing" — verify status updates
6. Click on a card — verify detail/edit panel opens
7. Edit notes — verify save works
8. Delete a job — verify it disappears from the board

---

## 12. Portfolio Builder

### 12.1 Create/Update Portfolio

**POST or PUT** `/portfolio` (check feature route in `backend/src/features/portfolio/`)

```json
{
  "title": "My Developer Portfolio",
  "bio": "Full-stack developer specializing in React and Node.js",
  "theme": "modern",
  "sections": {
    "about": true,
    "experience": true,
    "projects": true,
    "skills": true,
    "contact": true
  },
  "projects": [
    {
      "name": "CareerForge AI",
      "description": "AI-powered career platform",
      "techStack": ["React", "Node.js", "PostgreSQL"],
      "githubUrl": "https://github.com/user/careerforge",
      "liveUrl": "https://careerforge.ai"
    }
  ]
}
```

---

### 12.2 Deploy Portfolio to Vercel

1. Go to `/settings` → Connect Vercel (OAuth flow)
2. Click `GET /auth/vercel/connect` → redirects to Vercel OAuth
3. After approval, `GET /auth/vercel/callback` stores token
4. Go to `/portfolio` → click "Deploy to Vercel"
5. **Expected:** Portfolio deployed, public URL returned
6. Navigate to the portfolio URL — verify it renders correctly

---

### 12.3 UI Test — Portfolio Page

1. Go to `/portfolio`
2. Select a theme from the theme picker
3. Add at least 2 projects
4. Fill in bio and skills
5. Click "Preview" — verify live preview updates
6. Verify all sections are visible and formatted correctly

---

## 13. Credit System

### 13.1 Credit Deduction Accuracy

Run each of these and confirm the credit balance decreases by the stated amount:

| Action | Cost | Endpoint |
|---|---|---|
| Create resume | 1 | `POST /resumes` |
| Upload & parse resume | 1 | `POST /resumes/upload` |
| ATS score | 1 | `POST /ai/resume/ats-score` |
| Bio generate | 1 | `POST /documents/bio/generate` |
| Interview feedback | 1 | `POST /interviews/:id/feedback` |
| Communication analyze | 1 | `POST /ai/communication/analyze` |
| Enhance resume | 2 | `POST /ai/resume/enhance` |
| Cover letter | 2 | `POST /documents/cover-letter/generate` |
| Motivation letter | 2 | `POST /documents/motivation-letter/generate` |
| Study plan | 2 | `POST /documents/study-plan/generate` |
| Interview generate | 2 | `POST /interviews/generate` |
| Resume tailor | 3 | `POST /ai/resume/tailor` |
| SOP generate | 3 | `POST /documents/sop/generate` |
| LinkedIn optimize | 3 | `POST /ai/optimize-linkedin` |

**Verify with:** `GET /users/me/credits` before and after each call.

---

### 13.2 Credit Transactions Log

After running several actions:

```bash
GET /users/me/usage
```

**Expected:** Array of credit transaction records showing each deduction with type, description, amount, and balanceAfter.

---

### 13.3 Insufficient Credits (402 Gate)

1. Set credits to 0 for test user in DB
2. Attempt any action with a credit cost
3. **Expected:** `402` with `{ "message": "Insufficient credits" }`
4. No AI call is made (verified by no Gemini API charges and no credit transaction in DB)

---

### 13.4 Low Credits Email Trigger

1. Set user credits to 3 in DB
2. Perform any 1-credit action (e.g., `POST /ai/grammar/fix`)
3. Credits drop to 2 (≤ 3 threshold)
4. **Expected:** Low credits email arrives in inbox within 30 seconds

---

## 14. Billing & Stripe

> Use Stripe test mode. Test card: `4242 4242 4242 4242`, exp `12/34`, CVC `123`

### 14.1 View Plans

**GET** `/billing/plans`

**Expected:** `200` with array of plan objects (Free, Pro, Team, Enterprise) including prices and features.

---

### 14.2 Create Checkout Session (Upgrade to Pro)

**POST** `/billing/checkout`

```json
{
  "planId": "pro",
  "billingPeriod": "monthly"
}
```

**Expected:** `200` with `{ checkoutUrl: "https://checkout.stripe.com/..." }`.

**UI Test:**
1. Go to `/pricing` or `/settings/billing`
2. Click "Upgrade to Pro"
3. Stripe checkout page opens
4. Enter test card details
5. Complete payment
6. Verify redirect back to dashboard
7. `GET /users/me` → `user.plan` = `"PRO"`
8. Payment success email arrives in inbox

---

### 14.3 View Subscription

**GET** `/billing/subscription`

**Expected:** `200` with current plan, status, billing period, next billing date.

---

### 14.4 Cancel Subscription

**POST** `/billing/cancel`

**Expected:** `200`. Subscription cancels at end of billing period. `user.plan` stays `PRO` until period ends.

---

### 14.5 Reactivate Subscription

**POST** `/billing/reactivate`

_(After cancellation, before period ends)_

**Expected:** `200`. Cancellation reversed, subscription active again.

---

### 14.6 Purchase Credits (One-Time)

**POST** `/billing/credits/purchase`

```json
{
  "packageId": "50_credits",
  "quantity": 1
}
```

**Expected:** `200` with Stripe payment link or immediate credit grant. Verify credit balance increases.

---

### 14.7 Customer Portal

**POST** `/billing/portal`

**Expected:** `200` with `{ portalUrl: "https://billing.stripe.com/..." }`.

Navigating to that URL: user can update payment method, view invoices.

---

### 14.8 List Invoices

**GET** `/billing/invoices?page=1&limit=10`

**Expected:** Paginated list of past invoices with amounts and dates.

---

### 14.9 Webhook Handler

**POST** `/billing/webhook`  
_(Stripe sends this — test via Stripe CLI)_

```bash
# Install Stripe CLI and forward events
stripe listen --forward-to localhost:5000/api/billing/webhook

# Trigger a test event
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

**Expected:** Each event processed, DB updated accordingly (credits granted, plan updated).

---

## 15. Referral System

### 15.1 Get Referral Code

```bash
GET /users/me
# → user.referralCode is a unique 8-char code (e.g. "AB12CD34")
```

---

### 15.2 Register with Referral Code

```bash
POST /auth/register
{
  "firstName": "New",
  "lastName": "User",
  "email": "test+referred@example.com",
  "password": "Password123!",
  "referralCode": "AB12CD34"  ← code from referrer's account
}
```

**Expected:**
- New user gets 10 signup credits
- Referrer's credits increase by 5
- Referral transaction logged in DB for both users

---

### 15.3 View Referrals

```bash
GET /users/me/referrals
# → { referrals: [...], totalEarned: 5 }
```

**UI Test:** Go to `/settings` or referral page → verify referred users list and earnings are displayed.

---

## 16. Email Delivery

> Test all transactional emails using a real SMTP service (Mailhog locally, or check inbox if using real SMTP).

### 16.1 Email Checklist

| Trigger | Email | Expected Content |
|---|---|---|
| Register new account | Verification Email | Verify button with token link |
| Register new account | Welcome Email | "10 free credits ready", dashboard CTA |
| POST `/auth/forgot-password` | Password Reset Email | Reset link, 10 min expiry note |
| Complete Stripe payment | Payment Success Email | Amount, plan name, receipt details |
| Credits drop to ≤ 3 | Low Credits Email | Current balance, upgrade/buy CTA |
| Portfolio deployed | Portfolio Deployed Email | Public URL, share CTA |

### 16.2 Verify Email HTML Rendering

Open each email in an email client or use React Email preview:

```bash
cd backend && npx tsx src/emails/preview.tsx
# (if a preview script exists)
```

Check for:
- Brand colors and logo render correctly
- All buttons are clickable with correct URLs
- No broken images
- Dark mode renders correctly

---

## 17. Background Jobs

### 17.1 Job Queue Health

**GET** `/jobs/health`

**Expected:** `200` with queue stats (active, waiting, completed counts).

---

### 17.2 Async PDF Generation

**POST** `/jobs/resume/:id/pdf`

**Expected:** `200` with `{ jobId: "..." }`.

```bash
# Poll for completion
GET /jobs/:jobId
# → { status: "completed", result: { pdfUrl: "..." } }
```

**Verify:** PDF URL is accessible and downloads a valid PDF.

---

### 17.3 Async ATS Score

**POST** `/jobs/resume/:id/ats-score`

With body: `{ "jobDescription": "..." }`

**Expected:** `200` with `{ jobId: "..." }`. Poll status until `"completed"`, then verify score object in result.

---

### 17.4 List My Jobs

**GET** `/jobs/mine`

**Expected:** All background jobs for the current user with statuses.

---

## 18. Security & Edge Cases

### 18.1 Authentication Guards

```bash
# Access protected route without token → 401
GET /users/me
# No Authorization header → 401

# Access with expired token → 401
Authorization: Bearer eyJ...(expired)...

# Access with tampered token → 401
Authorization: Bearer eyJ...(modified)...
```

---

### 18.2 Authorization (Own Resources Only)

1. Create a resume with User A
2. Log in as User B
3. Attempt `GET /resumes/<userA_resume_id>` → must return `404` (not `403` — don't reveal existence)
4. Attempt `DELETE /resumes/<userA_resume_id>` → must return `404`

---

### 18.3 Rate Limiting

```bash
# Make 31 AI requests in under 10 minutes (limit is 30)
# 31st request should return 429 Too Many Requests
```

---

### 18.4 Input Validation

```bash
# Register with XSS payload → 400 or sanitized
POST /auth/register
{ "firstName": "<script>alert('xss')</script>", "email": "x@x.com", "password": "Pass123!" }

# SQL injection attempt → 400 (Prisma parameterizes all queries)
POST /auth/login
{ "email": "admin'--", "password": "' OR '1'='1" }

# Oversized payload → 413
POST /resumes
{ "title": "A".repeat(100000) }
```

---

### 18.5 File Upload Security

```bash
# Upload a renamed .exe as PDF (magic bytes don't match)
POST /resumes/upload (with file = malware.pdf that is actually an EXE)
# → 400 "Invalid file type"

# Upload oversized file
# → 413
```

---

### 18.6 Token Reuse (Refresh Token Rotation)

1. Get a valid refresh token (from login response cookie)
2. Use it once to refresh → get new tokens
3. Try to use the OLD refresh token again → must return `401` (token revoked)

---

## 19. Full User Journey (Golden Path)

This test covers the complete new-user experience end-to-end.

### Steps

1. **Register** at `/auth/register` — verify welcome + verification emails arrive
2. **Verify email** — click link in email
3. **Complete onboarding** — fill all wizard steps at `/onboarding`
4. **Create resume** — go to `/resume-builder`, create from scratch
5. **ATS score** — paste a job description and run ATS analysis (1 credit)
6. **Tailor resume** — tailor to the job description (3 credits)
7. **Generate cover letter** — use the same job description (2 credits)
8. **Optimize LinkedIn** — paste profile text, get improvements (3 credits)
9. **Prep for interview** — generate 5 questions for the role (2 credits)
10. **Answer a question** — submit answer and get AI feedback (1 credit)
11. **Track the job** — add to job tracker with status "APPLIED"
12. **Check credit balance** — should be: 10 - 1 - 3 - 2 - 3 - 2 - 1 = **-2** (need more credits!)
13. **Purchase credits** — go to `/pricing`, buy a credit pack via Stripe test card
14. **Verify credits added** — balance increases
15. **Build portfolio** — create portfolio at `/portfolio`, add projects
16. **Refer a friend** — share referral code, register new account with it
17. **Verify referral bonus** — original account gains 5 credits
18. **Upgrade to Pro** — go to `/pricing`, upgrade (Stripe test card)
19. **Verify plan change** — `GET /users/me` shows `plan: "PRO"`
20. **Logout** — verify token is revoked, redirect to `/auth/login`

---

## Appendix A — Useful curl Snippets

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"Password123!"}'

# Login and save token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}' \
  | jq -r '.data.accessToken')

# Use token in subsequent requests
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/users/me

# Optimize LinkedIn (3 credits)
curl -X POST http://localhost:5000/api/ai/optimize-linkedin \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profileText": "Senior Software Engineer at TechCorp. 8 years experience building React apps.",
    "targetRole": "Engineering Manager",
    "industry": "SaaS"
  }'
```

---

## Appendix B — DB Queries for Verification

```sql
-- Check user credits and plan
SELECT id, email, credits, plan, "onboardingComplete", "emailVerified"
FROM "User" WHERE email = 'test@example.com';

-- View credit transactions
SELECT type, amount, description, "balanceAfter", "createdAt"
FROM "CreditTransaction"
WHERE "userId" = '<user-id>'
ORDER BY "createdAt" DESC;

-- Verify refresh token rotation (old token should be revoked)
SELECT token, revoked, "expiresAt"
FROM "RefreshToken"
WHERE "userId" = '<user-id>'
ORDER BY "createdAt" DESC;

-- List all documents for user
SELECT id, type, title, "createdAt"
FROM "Document"
WHERE "userId" = '<user-id>'
ORDER BY "createdAt" DESC;
```

---

## Appendix C — Pass/Fail Checklist

Copy this checklist and mark each item as you test:

```
[ ] Email registration + verification
[ ] Email login with wrong password → 401
[ ] Google OAuth login
[ ] GitHub OAuth login
[ ] Token refresh
[ ] Token revocation on logout
[ ] Forgot/reset password flow
[ ] Onboarding wizard completes and sets flag
[ ] Profile update
[ ] Avatar upload
[ ] Password change
[ ] Resume CRUD (create, read, update, delete)
[ ] Resume version history + restore
[ ] Resume PDF generation
[ ] Resume file upload (PDF/DOCX)
[ ] Resume enhance (2 credits)
[ ] Resume tailor (3 credits)
[ ] ATS score (1 credit)
[ ] Cover letter generate (2 credits)
[ ] Cover letter regenerate (2 credits)
[ ] SOP generate (3 credits)
[ ] Motivation letter generate (2 credits)
[ ] Bio generate (1 credit)
[ ] Interview session generate (2 credits)
[ ] Interview answer feedback (1 credit)
[ ] LinkedIn optimizer (3 credits)
[ ] Job tracker CRUD
[ ] Job status Kanban drag
[ ] Portfolio create/update
[ ] Portfolio Vercel deploy
[ ] Credit deduction accuracy
[ ] 402 on insufficient credits
[ ] Low credits email trigger
[ ] Referral registration (referrer +5 credits)
[ ] Stripe checkout (test card)
[ ] Subscription status
[ ] Cancel + reactivate subscription
[ ] Credit purchase
[ ] Invoices list
[ ] Stripe webhook processing
[ ] Welcome email delivered
[ ] Verification email delivered
[ ] Password reset email delivered
[ ] Payment success email delivered
[ ] Low credits email delivered
[ ] Background job PDF generation
[ ] Background job ATS score
[ ] Rate limit 429 on >30 AI requests
[ ] Unauthorized access to other user's resources → 404
[ ] XSS input sanitized
[ ] File magic bytes validation
[ ] Refresh token rotation (old token rejected)
```
