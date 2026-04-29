# CareerForge AI — Project Overview

CareerForge AI is a state-of-the-art career optimization platform designed to empower job seekers with AI-driven tools. From building ATS-friendly resumes to preparing for technical interviews, CareerForge AI provides a comprehensive suite of features to accelerate career growth.

---

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **UI Components**: Ant Design (Table/Select) & Custom UI components
- **Testing**: Playwright (E2E)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with HttpOnly Cookies, Google OAuth, GitHub OAuth
- **Background Jobs**: BullMQ & Redis
- **Documentation**: Swagger/OpenAPI
- **Validation**: Zod

---

## 🛠️ Core Modules & Functionalities

### 1. Authentication & Security
- **Multi-Provider Auth**: Supports traditional Email/Password, Google OAuth, and GitHub OAuth.
- **Session Management**: Secure JWT implementation using Access Tokens and rotating Refresh Tokens (stored in HttpOnly cookies).
- **Email Services**: Verification emails and password reset flows via Nodemailer.

### 2. Resume Builder (The Core)
- **Manual Builder Wizard**: A step-by-step interface (Personal Info → Experience → Education → Skills → Projects) with live preview.
- **Template System**: Multiple professional themes (Modern, Classic, Creative, Executive, etc.).
- **AI Tailoring**: Automatically modifies resume content to match specific job descriptions using LLMs (Gemini).
- **ATS Optimization**: Scores resumes based on keyword matching and formatting best practices.

### 3. AI Career Tools
- **Cover Letter Generator**: Generates personalized cover letters based on user resumes and job descriptions.
- **Statement of Purpose (SOP)**: Specialized generator for academic and visa applications.
- **Interview Prep**: AI-simulated interview sessions with feedback on clarity, tone, and technical accuracy.
- **Bio Generator**: Creates professional summaries for LinkedIn, Portfolios, and Social Media.
- **Communication Analyzer**: Analyzes emails and messages for professionalism and impact.

### 4. Job Tracker & Analytics
- **Application Pipeline**: Track job applications through stages (Wishlist → Applied → Interview → Offer → Rejected).
- **Dashboard Metrics**: Visualizes application progress, credit usage, and resume performance.
- **Skill Gap Analysis**: Identifies missing skills based on target roles and suggests learning paths.

### 5. Credits & Billing
- **Credit-Based Usage**: Every AI action (tailoring, generating, analyzing) consumes credits.
- **Monetization**: Tiered subscription plans (Free, Pro, Team) and credit top-ups integrated with **Stripe**.
- **Signup Bonus**: New users receive 10 free credits upon registration.

### 6. Portfolio & Deployment
- **Portfolio Generator**: Automatically creates a personal portfolio website from resume data.
- **GitHub Deployment**: One-click deployment that creates a repository in the user's GitHub account and hosts it (using the GitHub OAuth token).

### 7. Admin Dashboard
- **User Management**: Overview of active users, subscription statuses, and credit balances.
- **System Monitoring**: Stats on AI generation success rates and system health.

---

## 🏗️ Project Architecture

### Backend Structure (`/backend`)
- `src/controllers/`: Request handlers and response logic.
- `src/services/`: Core business logic (AI calls, DB operations).
- `src/routes/`: API endpoint definitions.
- `src/middleware/`: Auth guards, validation, and error handling.
- `src/workers/`: Background job processing (e.g., PDF parsing, heavy AI tasks).
- `prisma/`: Database schema and migrations.

### Frontend Structure (`/frontend`)
- `app/(public)/`: Marketing and landing pages.
- `app/(auth)/`: Login, registration, and password recovery.
- `app/(dashboard)/`: Protected routes for user features.
- `store/`: Zustand global state definitions.
- `hooks/`: Reusable React hooks for API interaction.
- `components/`: Modular UI components (Resume previews, form builders).

---

## 🧪 Testing Strategy
The project uses **Playwright** for End-to-End testing, covering:
- **Critical Paths**: Registration/Login, Resume Creation, and Navigation.
- **Edge Cases**: Form validation, unauthorized access redirection, and responsive design verification.
