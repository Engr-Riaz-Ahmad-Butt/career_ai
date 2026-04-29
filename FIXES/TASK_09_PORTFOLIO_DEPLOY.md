# TASK 09 — Portfolio Deploy (GitHub OAuth + Deploy Flow)

**Priority:** 🟡 Medium — Strong Differentiator, ~1 Week Build  
**Estimated Time:** 5–7 days  
**Status:** Open

---

## Current State

**Done:**
- `Portfolio` model in DB schema with `deployStatus`, `liveUrl`, `githubToken`, `lastDeployedAt`
- `User.githubToken` and `User.githubUsername` — stored during GitHub OAuth
- `backend/src/features/portfolio/` directory exists
- GitHub OAuth is set up in `auth.service.ts`

**Missing:**
- `deployPortfolio()` logic in `portfolio.service.ts`
- Vercel API integration (or GitHub Pages approach)
- Frontend portfolio builder + deploy modal
- Dashboard page for portfolio management

---

## Deployment Strategy — Two Options

### Option A: GitHub Pages (Simpler, Recommended First)

1. Generate static HTML from resume data (simple Handlebars/EJS template)
2. Create a GitHub repo in the user's account via GitHub API using stored `githubToken`
3. Push the HTML as `index.html` to the `gh-pages` branch
4. The site is live at `username.github.io/careerforge-portfolio`

No Vercel account needed. Uses the GitHub token already stored.

### Option B: Vercel API (More Control)

1. Ask user to connect their Vercel account (new OAuth flow or PAT)
2. Deploy via Vercel API → get a `vercel.app` subdomain
3. More complex but gives a nicer URL and HTTPS by default

**Recommendation: Build Option A first. Add Option B later as a "custom domain" upgrade.**

---

## Backend Implementation

### `portfolio.service.ts` — `deployPortfolio()`

```ts
async function deployPortfolio(userId: string, portfolioId: string): Promise<string> {
  const user = await getUserOrThrow(userId);
  if (!user.githubToken) throw new ForbiddenError('GitHub account not connected');

  const portfolio = await getPortfolioOrThrow(portfolioId, userId);
  const resume = portfolio.resumeId ? await getResumeOrThrow(portfolio.resumeId, userId) : null;

  // Step 1: Generate HTML from resume data
  const html = generatePortfolioHTML(resume, portfolio);

  // Step 2: Create or update GitHub repo
  const repoName = 'careerforge-portfolio';
  await createOrUpdateGitHubRepo(user.githubToken, user.githubUsername, repoName, html);

  // Step 3: Update portfolio record
  const liveUrl = `https://${user.githubUsername}.github.io/${repoName}`;
  await prisma.portfolio.update({
    where: { id: portfolioId },
    data: { deployStatus: 'DEPLOYED', liveUrl, lastDeployedAt: new Date() },
  });

  return liveUrl;
}
```

### GitHub API Calls Needed

```ts
// Create repo if not exists
POST https://api.github.com/user/repos
Authorization: token {githubToken}
{ name: 'careerforge-portfolio', private: false, auto_init: true }

// Enable GitHub Pages
POST https://api.github.com/repos/{owner}/{repo}/pages
{ source: { branch: 'main', path: '/' } }

// Create/update index.html
PUT https://api.github.com/repos/{owner}/{repo}/contents/index.html
{ message: 'Update portfolio', content: base64(html), sha: existingFileSha }
```

---

## Frontend Implementation

### Portfolio Management Page

Create `frontend/app/(dashboard)/portfolio/page.tsx`:

- Show current portfolio (if exists) with deploy status, live URL, last deployed date
- "Create Portfolio" button if none exists
- "Redeploy" button to push latest resume changes
- Theme selector (Minimal, Modern, Creative, Dark, Academic)

### Deploy Modal Component

```tsx
// frontend/components/portfolio/DeployModal.tsx
// Shows:
// 1. GitHub account connection status (green if githubToken exists)
// 2. Resume selector (which resume to use)
// 3. Theme picker
// 4. "Deploy" button → calls POST /api/v1/portfolio/:id/deploy
// 5. Loading state while deploying
// 6. Success state with live URL + copy button
```

### Portfolio Route

```
POST /api/v1/portfolio/:id/deploy   → triggers deployPortfolio()
GET  /api/v1/portfolio              → list user's portfolios
POST /api/v1/portfolio              → create portfolio record
PATCH /api/v1/portfolio/:id         → update theme/sections
```

---

## HTML Template

Create a simple but professional static template in `backend/src/features/portfolio/templates/`:

```ts
function generatePortfolioHTML(resume: ResumeData, portfolio: Portfolio): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${resume.personalInfo?.name} — Portfolio</title>
  <style>/* Inline CSS for the chosen theme */</style>
</head>
<body>
  <header>
    <h1>${resume.personalInfo?.name}</h1>
    <p>${resume.summary}</p>
  </header>
  <section id="experience">
    ${resume.experience?.map(exp => `<div>...</div>`).join('')}
  </section>
  <!-- skills, projects, contact -->
</body>
</html>`;
}
```

---

## Files to Create/Change

| File | Change |
|---|---|
| `backend/src/features/portfolio/portfolio.service.ts` | Add `deployPortfolio()`, `generatePortfolioHTML()` |
| `backend/src/features/portfolio/portfolio.routes.ts` | Add `POST /:id/deploy` route |
| `backend/src/features/portfolio/portfolio.controller.ts` | Add `deployPortfolio` handler |
| `backend/src/features/portfolio/templates/` | Create HTML template files |
| `frontend/app/(dashboard)/portfolio/page.tsx` | **Create** portfolio management page |
| `frontend/components/portfolio/DeployModal.tsx` | **Create** deploy flow modal |
| `frontend/lib/api/endpoints/portfolio.api.ts` | **Create** API client for portfolio endpoints |
