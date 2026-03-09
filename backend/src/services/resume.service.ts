import prisma from '../config/database';
import { ApiError } from '../middleware/error';
import aiService from './ai/aiService';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { z } from 'zod';

const RESUME_SELECT = {
    id: true,
    title: true,
    template: true,
    targetRole: true,
    industry: true,
    status: true,
    atsScore: true,
    keywordMatch: true,
    formatScore: true,
    impactScore: true,
    personalInfo: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    certifications: true,
    projects: true,
    languages: true,
    styling: true,
    version: true,
    createdAt: true,
    updatedAt: true,
} as const;

// ─── Types & Interfaces ──────────────────────────────────────────────────

interface ListResumesOptions {
    readonly page?: number;
    readonly limit?: number;
    readonly sortBy?: string;
    readonly order?: 'asc' | 'desc';
}

interface CreateResumeOptions {
    readonly title: string;
    readonly template: string;
    readonly targetRole?: string;
    readonly industry?: string;
}

// ─── Validation ──────────────────────────────────────────────────────

function normalizeListOptions(options: ListResumesOptions = {}): {
    readonly page: number;
    readonly limit: number;
    readonly skip: number;
    readonly sortBy: string;
    readonly order: 'asc' | 'desc';
} {
    const page = Math.max(options.page || 1, 1);
    const limit = Math.min(options.limit || 10, 50);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'updatedAt';
    const order = (options.order || 'desc') as 'asc' | 'desc';

    return { page, limit, skip, sortBy, order };
}

// ─── Service Class ──────────────────────────────────────────────────────

export class ResumeService {

    // GET /resumes - Fetch paginated resumes
    async listResumes(
        userId: string,
        options: ListResumesOptions = {}
    ): Promise<{ data: typeof RESUME_SELECT[]; total: number; page: number; limit: number; totalPages: number }> {
        if (!userId) throw new ApiError(400, 'userId is required');

        const { page, limit, skip, sortBy, order } = normalizeListOptions(options);
        const orderBy = { [sortBy]: order };

        const [resumes, total] = await Promise.all([
            prisma.resume.findMany({
                where: { userId },
                select: RESUME_SELECT,
                orderBy,
                skip,
                take: limit,
            }),
            prisma.resume.count({ where: { userId } }),
        ]);

        return { data: resumes, total, page, limit, totalPages: Math.ceil(total / limit) };
    }


    // POST /resumes - Create new resume
    async createResume(userId: string, options: CreateResumeOptions): Promise<typeof RESUME_SELECT> {
        if (!userId) throw new ApiError(400, 'userId is required');
        if (!options.title) throw new ApiError(400, 'title is required');
        if (!options.template) throw new ApiError(400, 'template is required');

        const user = await this.getUserOrThrow(userId);
        if (user.credits < 1) throw new ApiError(402, 'Insufficient credits');

        const resume = await prisma.resume.create({
            data: {
                userId,
                title: options.title,
                template: options.template,
                targetRole: options.targetRole,
                industry: options.industry,
                version: 1,
            },
            select: RESUME_SELECT,
        });

        await this.deductCredit(userId, 'CREATE_RESUME', 1, resume.id);
        return resume;
    }

    // GET /resumes/:id - Fetch single resume
    async getResumeById(userId: string, id: string): Promise<typeof RESUME_SELECT> {
        if (!userId || !id) throw new ApiError(400, 'userId and id are required');

        const resume = await prisma.resume.findFirst({
            where: { id, userId },
            select: RESUME_SELECT,
        });

        if (!resume) throw new ApiError(404, 'Resume not found');
        return resume;
    }

    // PUT /resumes/:id - Update resume
    async updateResume(userId: string, id: string, data: Record<string, unknown>): Promise<typeof RESUME_SELECT> {
        if (!userId || !id) throw new ApiError(400, 'userId and id are required');
        if (!data || Object.keys(data).length === 0) throw new ApiError(400, 'No data to update');

        const existing = await this.getResumeById(userId, id);
        await this.createSnapshot(existing);

        const updated = await prisma.resume.update({
            where: { id },
            data: { ...data, version: { increment: 1 } },
            select: RESUME_SELECT,
        });

        return updated;
    }

    // DELETE /resumes/:id - Delete resume
    async deleteResume(userId: string, id: string): Promise<void> {
        if (!userId || !id) throw new ApiError(400, 'userId and id are required');

        const existing = await this.getResumeById(userId, id);
        await prisma.resume.delete({ where: { id: existing.id } });
    }

    // POST /resumes/:id/duplicate - Duplicate resume
    async duplicateResume(userId: string, id: string): Promise<typeof RESUME_SELECT> {
        if (!userId || !id) throw new ApiError(400, 'userId and id are required');

        const original = await this.getResumeById(userId, id);
        const duplicate = await this.createResumeFromTemplate(userId, original);

        return duplicate;
    }

    // POST /resumes/:id/pdf - Generate PDF
    async generatePdf(userId: string, id: string): Promise<{ pdfUrl: string; expiresAt: Date }> {
        if (!userId || !id) throw new ApiError(400, 'userId and id are required');

        await this.getResumeById(userId, id); // Verify ownership

        const expiresAt = new Date(Date.now() + 3600000); // 1 hour
        const pdfUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/v1/resumes/${id}/download`;

        return { pdfUrl, expiresAt };
    }

    // GET /resumes/:id/versions - List resume versions
    async listVersions(userId: string, id: string): Promise<readonly { readonly id: string; readonly versionNum: number; readonly createdAt: Date }[]> {
        if (!userId || !id) throw new ApiError(400, 'userId and id are required');

        await this.getResumeById(userId, id); // Verify ownership

        const versions = await prisma.resumeVersion.findMany({
            where: { resumeId: id },
            orderBy: { versionNum: 'desc' },
            take: 5,
            select: { id: true, versionNum: true, createdAt: true },
        });

        return versions;
    }

    // POST /resumes/:id/restore/:versionId - Restore version
    async restoreVersion(userId: string, id: string, versionId: string): Promise<typeof RESUME_SELECT> {
        if (!userId || !id || !versionId) throw new ApiError(400, 'userId, id, and versionId are required');

        const existing = await this.getResumeById(userId, id);
        const version = await this.getVersionOrThrow(versionId, id);

        await this.createSnapshot(existing);

        const restored = await prisma.resume.update({
            where: { id },
            data: { ...version.data, version: { increment: 1 } },
            select: RESUME_SELECT,
        });

        return restored;
    }

    // POST /resumes/upload - Upload and parse resume
    async uploadResume(userId: string, file: Express.Multer.File, title?: string): Promise<typeof RESUME_SELECT> {
        if (!userId || !file) throw new ApiError(400, 'userId and file are required');

        const user = await this.getUserOrThrow(userId);
        if (user.credits < 1) throw new ApiError(402, 'Insufficient credits');

        const text = await this.extractTextFromBuffer(file.buffer, file.mimetype);
        const parsed = await aiService.extractResumeData(text);

        const resume = await prisma.resume.create({
            data: {
                userId,
                title: title || file.originalname || 'Uploaded Resume',
                template: 'modern',
                personalInfo: parsed.personalInfo ?? {},
                summary: parsed.summary ?? '',
                experience: parsed.experience ?? [],
                education: parsed.education ?? [],
                skills: parsed.skills ?? {},
                projects: parsed.projects ?? [],
                version: 1,
            },
            select: RESUME_SELECT,
        });

        await this.deductCredit(userId, 'UPLOAD_RESUME', 1, resume.id);
        return resume;
    }

    // POST /resumes/extract - Extract and parse resume
    async extractAndParse(userId: string, file: Express.Multer.File): Promise<unknown> {
        if (!userId || !file) throw new ApiError(400, 'userId and file are required');

        const text = await this.extractTextFromBuffer(file.buffer, file.mimetype);
        return aiService.extractResumeData(text);
    }

    // POST /resumes/:id/optimize - Optimize for job description
    async optimizeResume(userId: string, id: string, jobDescription: string): Promise<unknown> {
        if (!userId || !id || !jobDescription) throw new ApiError(400, 'userId, id, and jobDescription are required');

        const resume = await this.getResumeById(userId, id);
        return aiService.optimizeResumeForJD(resume, jobDescription);
    }


    // ── Private Helpers ──────────────────────────────────────────────────

    private async getUserOrThrow(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true, id: true },
        });

        if (!user) throw new ApiError(404, 'User not found');
        return user;
    }

    private async getVersionOrThrow(versionId: string, resumeId: string) {
        const version = await prisma.resumeVersion.findFirst({
            where: { id: versionId, resumeId },
        });

        if (!version) throw new ApiError(404, 'Version not found');
        return version;
    }

    private async createResumeFromTemplate(
        userId: string,
        template: typeof RESUME_SELECT
    ): Promise<typeof RESUME_SELECT> {
        return prisma.resume.create({
            data: {
                userId,
                title: `${template.title} (Copy)`,
                template: template.template,
                targetRole: template.targetRole ?? undefined,
                industry: template.industry ?? undefined,
                personalInfo: template.personalInfo,
                summary: template.summary ?? undefined,
                experience: template.experience,
                education: template.education,
                skills: template.skills,
                certifications: template.certifications,
                projects: template.projects,
                languages: template.languages,
                version: 1,
            },
            select: RESUME_SELECT,
        });
    }

    private async createSnapshot(resume: typeof RESUME_SELECT): Promise<void> {
        const { id, ...data } = resume;

        const count = await prisma.resumeVersion.count({ where: { resumeId: id } });

        if (count >= 5) {
            const oldest = await prisma.resumeVersion.findFirst({
                where: { resumeId: id },
                orderBy: { versionNum: 'asc' },
            });
            if (oldest) {
                await prisma.resumeVersion.delete({ where: { id: oldest.id } });
            }
        }

        await prisma.resumeVersion.create({
            data: {
                resumeId: id,
                versionNum: resume.version,
                data: data as Record<string, unknown>,
            },
        });
    }

    private async deductCredit(
        userId: string,
        action: string,
        amount: number,
        resourceId?: string
    ): Promise<void> {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                credits: { decrement: amount },
                lifetimeCreditsUsed: { increment: amount },
            },
            select: { credits: true },
        });

        await prisma.creditTransaction.create({
            data: {
                userId,
                amount: -amount,
                type: 'USAGE',
                description: `${action} — resource: ${resourceId || 'N/A'}`,
                balanceAfter: user.credits,
            },
        });
    }

    private async extractTextFromBuffer(buffer: Buffer, mimetype: string): Promise<string> {
        if (mimetype === 'application/pdf') {
            const data = await (pdf as any)(buffer);
            return data.text || '';
        }

        if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer });
            return result.value || '';
        }

        throw new ApiError(400, 'Unsupported file type. Please upload PDF or DOCX.');
    }
}

