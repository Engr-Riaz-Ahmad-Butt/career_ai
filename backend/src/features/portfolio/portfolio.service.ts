import { PortfolioTheme } from '@prisma/client';
import prisma from '@/config/database';
import { emailService } from '@/services/email.service';
import { createHttpError, ValidationError } from '@/utils/errorHandler';

// ── Types ────────────────────────────────────────────────────────────────────

interface CreatePortfolioData {
    readonly resumeId: string;
    readonly theme: string;
    readonly customDomain?: string;
    readonly sections?: string[];
    readonly colorScheme?: string;
}

interface UpdatePortfolioData {
    readonly theme?: string;
    readonly customDomain?: string;
    readonly sections?: string[];
    readonly colorScheme?: string;
}

interface ResumeData {
    personalInfo?: {
        fullName?: string;
        email?: string;
        phone?: string;
        location?: string;
        linkedin?: string;
        portfolio?: string;
    };
    summary?: string | null;
    experience?: Array<{
        position?: string;
        company?: string;
        startDate?: string;
        endDate?: string;
        description?: string;
    }>;
    education?: Array<{
        degree?: string;
        school?: string;
        startDate?: string;
        endDate?: string;
    }>;
    skills?: { technical?: string[]; soft?: string[] };
}

// ── HTML Generator ────────────────────────────────────────────────────────────

function generatePortfolioHTML(resume: ResumeData, theme: PortfolioTheme, ownerName: string): string {
    const name = resume.personalInfo?.fullName || ownerName || 'My Portfolio';
    const email = resume.personalInfo?.email || '';
    const phone = resume.personalInfo?.phone || '';
    const location = resume.personalInfo?.location || '';
    const linkedin = resume.personalInfo?.linkedin || '';
    const summary = resume.summary || '';

    const experience = (resume.experience || []).map(e => `
        <div class="entry">
            <h3>${e.position || ''} <span>@ ${e.company || ''}</span></h3>
            <p class="date">${e.startDate || ''} – ${e.endDate || 'Present'}</p>
            <p>${e.description || ''}</p>
        </div>`).join('');

    const education = (resume.education || []).map(e => `
        <div class="entry">
            <h3>${e.degree || ''} <span>@ ${e.school || ''}</span></h3>
            <p class="date">${e.startDate || ''} – ${e.endDate || ''}</p>
        </div>`).join('');

    const techSkills = (resume.skills?.technical || []).map(s => `<span class="tag">${s}</span>`).join('');

    const themeColors: Record<PortfolioTheme, string> = {
        MINIMAL: '#f8f8f8,#111111,#555555',
        MODERN: '#0f172a,#6366f1,#94a3b8',
        CREATIVE: '#1e1b4b,#a78bfa,#ddd6fe',
        DARK: '#030712,#22d3ee,#6b7280',
        ACADEMIC: '#fafaf9,#1c1917,#78716c',
    };
    const [bg, primary, secondary] = themeColors[theme].split(',');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${name} — Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: ${bg}; color: ${secondary}; line-height: 1.7; }
  a { color: ${primary}; text-decoration: none; }
  .container { max-width: 860px; margin: 0 auto; padding: 60px 24px; }
  header { text-align: center; margin-bottom: 64px; }
  header h1 { font-size: 3rem; font-weight: 700; color: ${primary}; margin-bottom: 8px; }
  header p.tagline { font-size: 1.1rem; max-width: 600px; margin: 0 auto 24px; }
  .contact-links { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; font-size: 0.9rem; }
  section { margin-bottom: 56px; }
  section h2 { font-size: 1.4rem; font-weight: 700; color: ${primary}; border-bottom: 2px solid ${primary}; padding-bottom: 8px; margin-bottom: 24px; }
  .entry { margin-bottom: 24px; }
  .entry h3 { font-size: 1rem; font-weight: 600; color: ${secondary}; }
  .entry h3 span { font-weight: 400; opacity: 0.75; }
  .entry .date { font-size: 0.8rem; opacity: 0.6; margin-bottom: 6px; }
  .tag { display: inline-block; background: ${primary}22; color: ${primary}; border-radius: 99px; padding: 3px 12px; font-size: 0.78rem; margin: 4px 3px; font-weight: 500; }
  footer { text-align: center; font-size: 0.8rem; opacity: 0.4; margin-top: 80px; }
  footer a { color: inherit; }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>${name}</h1>
    ${summary ? `<p class="tagline">${summary}</p>` : ''}
    <div class="contact-links">
      ${email ? `<a href="mailto:${email}">${email}</a>` : ''}
      ${phone ? `<span>${phone}</span>` : ''}
      ${location ? `<span>${location}</span>` : ''}
      ${linkedin ? `<a href="${linkedin}" target="_blank">LinkedIn</a>` : ''}
    </div>
  </header>

  ${experience ? `<section id="experience"><h2>Experience</h2>${experience}</section>` : ''}
  ${education ? `<section id="education"><h2>Education</h2>${education}</section>` : ''}
  ${techSkills ? `<section id="skills"><h2>Skills</h2>${techSkills}</section>` : ''}

  <footer>Built with <a href="https://careerforge.ai">CareerForge AI</a></footer>
</div>
</body>
</html>`;
}

// ── GitHub API Helpers ────────────────────────────────────────────────────────

async function githubRequest(token: string, method: string, path: string, body?: object) {
    const res = await fetch(`https://api.github.com${path}`, {
        method,
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
}

async function ensureGitHubRepo(token: string, repoName: string) {
    const check = await githubRequest(token, 'GET', `/repos/${(await getGithubUsername(token))}/${repoName}`);
    if (check.ok) return check.data;

    const create = await githubRequest(token, 'POST', '/user/repos', {
        name: repoName,
        description: 'My portfolio — generated by CareerForge AI',
        private: false,
        auto_init: true,
    });
    if (!create.ok) throw new Error(`Failed to create GitHub repo: ${JSON.stringify(create.data)}`);
    // Wait a moment for GitHub to initialise the repo
    await new Promise(r => setTimeout(r, 2000));
    return create.data;
}

async function getGithubUsername(token: string): Promise<string> {
    const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${token}` },
    });
    const data = await res.json() as { login: string };
    return data.login;
}

async function pushFileToGitHub(token: string, owner: string, repo: string, path: string, content: string, message: string) {
    // Get existing file SHA if it exists
    const existing = await githubRequest(token, 'GET', `/repos/${owner}/${repo}/contents/${path}`);
    const sha = existing.ok ? (existing.data as any).sha : undefined;

    const result = await githubRequest(token, 'PUT', `/repos/${owner}/${repo}/contents/${path}`, {
        message,
        content: Buffer.from(content).toString('base64'),
        ...(sha ? { sha } : {}),
    });
    if (!result.ok) throw new Error(`Failed to push file to GitHub: ${JSON.stringify(result.data)}`);
    return result.data;
}

// ── Vercel API Helpers ────────────────────────────────────────────────────────

async function vercelRequest(token: string, method: string, path: string, body?: object) {
    const res = await fetch(`https://api.vercel.com${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
}

async function deployToVercel(vercelToken: string, githubToken: string, repoName: string, projectName: string): Promise<string> {
    const owner = await getGithubUsername(githubToken);

    // Check if Vercel project already exists
    const listRes = await vercelRequest(vercelToken, 'GET', `/v9/projects/${projectName}`);

    if (!listRes.ok) {
        // Create a new Vercel project linked to GitHub
        const createRes = await vercelRequest(vercelToken, 'POST', '/v10/projects', {
            name: projectName,
            framework: null,
            gitRepository: {
                type: 'github',
                repo: `${owner}/${repoName}`,
            },
        });
        if (!createRes.ok) throw new Error(`Failed to create Vercel project: ${JSON.stringify(createRes.data)}`);
    }

    // Trigger a new deployment
    const deployRes = await vercelRequest(vercelToken, 'POST', '/v13/deployments', {
        name: projectName,
        gitSource: {
            type: 'github',
            repoId: undefined, // Vercel resolves this from the linked project
            ref: 'main',
        },
        projectSettings: { framework: null },
    });

    if (!deployRes.ok) throw new Error(`Failed to trigger Vercel deployment: ${JSON.stringify(deployRes.data)}`);
    const deployment = deployRes.data as { url?: string; alias?: string[] };

    return `https://${deployment.alias?.[0] || deployment.url || `${projectName}.vercel.app`}`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function deductPortfolioCredits(userId: string): Promise<void> {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 5 }, lifetimeCreditsUsed: { increment: 5 } },
        select: { credits: true }
    });
    await prisma.creditTransaction.create({
        data: { userId, amount: -5, type: 'USAGE', description: 'GENERATE_PORTFOLIO', balanceAfter: user.credits }
    });
}

function parseTheme(theme: string): PortfolioTheme {
    const normalized = theme.toUpperCase();
    const validThemes: PortfolioTheme[] = ['MINIMAL', 'MODERN', 'CREATIVE', 'DARK', 'ACADEMIC'];
    if (!validThemes.includes(normalized as PortfolioTheme)) throw new ValidationError('Invalid portfolio theme');
    return normalized as PortfolioTheme;
}

// ── Service ───────────────────────────────────────────────────────────────────

export class PortfolioService {
    async createPortfolio(userId: string, data: CreatePortfolioData) {
        if (!userId || !data?.resumeId || !data?.theme) throw new ValidationError('Missing required fields');
        const theme = parseTheme(data.theme);

        const portfolio = await prisma.portfolio.create({
            data: {
                userId,
                resumeId: data.resumeId,
                theme,
                customDomain: data.customDomain,
                sections: data.sections || ['about', 'experience', 'skills', 'projects', 'contact'],
                colorScheme: data.colorScheme,
                deployStatus: 'PENDING',
                siteConfig: { generated: true, timestamp: new Date().toISOString() },
            },
        });
        await deductPortfolioCredits(userId);
        return portfolio;
    }

    async listPortfolios(userId: string) {
        if (!userId) throw new ValidationError('userId is required');
        return prisma.portfolio.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getPortfolioById(userId: string, id: string) {
        if (!userId || !id) throw new ValidationError('userId and portfolio id required');
        return prisma.portfolio.findFirst({ where: { id, userId } });
    }

    async updatePortfolio(userId: string, id: string, data: UpdatePortfolioData) {
        if (!userId || !id || !data) throw new ValidationError('Missing required parameters');
        const parsedTheme = data.theme ? parseTheme(data.theme) : undefined;

        return prisma.portfolio.update({
            where: { id, userId },
            data: { ...data, theme: parsedTheme }
        });
    }

    async deployPortfolio(userId: string, id: string) {
        if (!userId || !id) throw new ValidationError('userId and portfolio id required');

        const [portfolio, user] = await Promise.all([
            prisma.portfolio.findFirst({ where: { id, userId } }),
            prisma.user.findUnique({ where: { id: userId }, select: { githubToken: true, githubUsername: true, vercelToken: true, firstName: true, lastName: true, email: true } }),
        ]);

        if (!portfolio) throw createHttpError(404, 'Portfolio not found');
        if (!user?.githubToken) throw createHttpError(400, 'GitHub account not connected. Please connect GitHub first.');
        if (!user?.vercelToken) throw createHttpError(400, 'Vercel account not connected. Please connect Vercel first.');

        // Mark as deploying
        await prisma.portfolio.update({ where: { id }, data: { deployStatus: 'PENDING' } });

        try {
            // Get resume data
            let resumeData: ResumeData = {};
            if (portfolio.resumeId) {
                const resume = await prisma.resume.findFirst({ where: { id: portfolio.resumeId, userId } });
                if (resume) {
                    resumeData = {
                        personalInfo: resume.personalInfo as ResumeData['personalInfo'],
                        summary: resume.summary,
                        experience: resume.experience as ResumeData['experience'],
                        education: resume.education as ResumeData['education'],
                        skills: resume.skills as ResumeData['skills'],
                    };
                }
            }

            const ownerName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            const html = generatePortfolioHTML(resumeData, portfolio.theme, ownerName);

            // 1. Push HTML to GitHub
            const repoName = 'careerforge-portfolio';
            const githubOwner = user.githubUsername || await getGithubUsername(user.githubToken);
            await ensureGitHubRepo(user.githubToken, repoName);
            await pushFileToGitHub(user.githubToken, githubOwner, repoName, 'index.html', html, 'Update portfolio via CareerForge AI');

            // 2. Deploy to Vercel (linked to GitHub repo)
            const projectName = `careerforge-${userId.substring(0, 8)}`;
            const liveUrl = await deployToVercel(user.vercelToken, user.githubToken, repoName, projectName);

            // 3. Update portfolio record
            const updated = await prisma.portfolio.update({
                where: { id },
                data: { deployStatus: 'DEPLOYED', lastDeployedAt: new Date(), liveUrl },
            });
            
            // 4. Send email notification (fire and forget)
            if (user.email) {
                emailService.sendPortfolioDeployedEmail(user.email, user.firstName || 'User', liveUrl).catch(console.error);
            }
            
            return updated;
        } catch (error) {
            await prisma.portfolio.update({ where: { id }, data: { deployStatus: 'FAILED' } });
            throw error;
        }
    }

    async deletePortfolio(userId: string, id: string) {
        if (!userId || !id) throw new ValidationError('userId and portfolio id required');
        return prisma.portfolio.delete({ where: { id, userId } });
    }
}
