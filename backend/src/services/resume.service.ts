import prisma from '@/config/database';
import { env } from '@/config/env';
import { FILE_UPLOAD } from '@/constants/fileUpload';
import { PAGINATION } from '@/constants/pagination';
import { createHttpError } from '@/utils/errorHandler';
import { findResourceByIdOrThrow, paginateQuery } from '@/utils/dbHelpers';
import aiService from '@/services/ai/aiService';
import { updateResumeSchema } from '@/utils/validation';
import type { z } from 'zod';
import { Prisma } from '@prisma/client';

// Dynamic import to avoid type issues with the pdf-parse CommonJS module
const parsePdf = (buffer: Buffer): Promise<{ text: string }> =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    (require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>)(buffer);

import mammoth from 'mammoth';

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

type ResumeRecord = Prisma.ResumeGetPayload<{ select: typeof RESUME_SELECT }>;

type ResumeVersionRecord = {
    id: string;
    resumeId: string;
    versionNum: number;
    data: Prisma.JsonValue;
    createdAt: Date;
};

type UpdateResumeInput = z.infer<typeof updateResumeSchema>;

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

// ─── Helpers ──────────────────────────────────────────────────────

function normalizeListOptions(options: ListResumesOptions = {}): {
    readonly page: number;
    readonly limit: number;
    readonly skip: number;
    readonly sortBy: string;
    readonly order: 'asc' | 'desc';
} {
    const page = Math.max(options.page || PAGINATION.DEFAULT_PAGE, PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(options.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.SERVICE_MAX_LIMIT);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'updatedAt';
    const order = (options.order || 'desc') as 'asc' | 'desc';

    return { page, limit, skip, sortBy, order };
}

function toNullableInputJson(
    value: Prisma.JsonValue
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    if (value === null) {
        return Prisma.JsonNull;
    }
    return value as Prisma.InputJsonValue;
}

function toInputJsonArray(value: Prisma.JsonValue[]): Prisma.InputJsonValue[] {
    return value as unknown as Prisma.InputJsonValue[];
}

// ─── Service Class ──────────────────────────────────────────────────────

export class ResumeService {

    // GET /resumes - Fetch paginated resumes
    async listResumes(
        userId: string,
        options: ListResumesOptions = {}
    ): Promise<{ data: ResumeRecord[]; total: number; page: number; limit: number; totalPages: number }> {
        if (!userId) throw createHttpError(400, 'userId is required');

        const { page, limit, sortBy, order } = normalizeListOptions(options);
        const orderBy = sortBy ? { [sortBy]: order } : undefined;

        return paginateQuery<ResumeRecord>(
            prisma.resume,
            { userId },
            page,
            limit,
            { select: RESUME_SELECT },
            orderBy
        );
    }


    // POST /resumes - Create new resume
    async createResume(userId: string, options: CreateResumeOptions): Promise<ResumeRecord> {
        if (!userId) throw createHttpError(400, 'userId is required');
        if (!options.title) throw createHttpError(400, 'title is required');
        if (!options.template) throw createHttpError(400, 'template is required');

        const user = await this.getUserOrThrow(userId);
        if (user.credits < 1) throw createHttpError(402, 'Insufficient credits');

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
    async getResumeById(userId: string, id: string): Promise<ResumeRecord> {
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');

        return findResourceByIdOrThrow<ResumeRecord>(
            prisma.resume,
            id,
            { userId },
            RESUME_SELECT,
            'Resume not found'
        );
    }

    // PUT /resumes/:id - Update resume (validated + whitelisted fields only)
    async updateResume(userId: string, id: string, raw: unknown): Promise<ResumeRecord> {
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');

        const parsed = updateResumeSchema.safeParse(raw);
        if (!parsed.success) {
            throw createHttpError(400, parsed.error.errors.map((e) => e.message).join(', '));
        }

        const data: UpdateResumeInput = parsed.data;
        if (Object.keys(data).length === 0) throw createHttpError(400, 'No data to update');

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
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');

        const existing = await this.getResumeById(userId, id);
        await prisma.resume.delete({ where: { id: existing.id } });
    }

    // POST /resumes/:id/duplicate - Duplicate resume
    async duplicateResume(userId: string, id: string): Promise<ResumeRecord> {
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');

        const original = await this.getResumeById(userId, id);
        return this.createResumeFromTemplate(userId, original);
    }

    // POST /resumes/:id/pdf - Generate PDF
    async generatePdf(userId: string, id: string): Promise<{ pdfUrl: string; expiresAt: Date }> {
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');

        await this.getResumeById(userId, id); // Verify ownership

        const expiresAt = new Date(Date.now() + 3600000); // 1 hour
        const pdfUrl = `${env.API_URL}/api/v1/resumes/${id}/download`;

        return { pdfUrl, expiresAt };
    }

    // GET /resumes/:id/versions - List resume versions
    async listVersions(userId: string, id: string): Promise<readonly { readonly id: string; readonly versionNum: number; readonly createdAt: Date }[]> {
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');

        await this.getResumeById(userId, id); // Verify ownership

        return prisma.resumeVersion.findMany({
            where: { resumeId: id },
            orderBy: { versionNum: 'desc' },
            take: 5,
            select: { id: true, versionNum: true, createdAt: true },
        });
    }

    // POST /resumes/:id/restore/:versionId - Restore version
    async restoreVersion(userId: string, id: string, versionId: string): Promise<ResumeRecord> {
        if (!userId || !id || !versionId) throw createHttpError(400, 'userId, id, and versionId are required');

        const existing = await this.getResumeById(userId, id);
        const version = await this.getVersionOrThrow(versionId, id);

        await this.createSnapshot(existing);

        const versionData = version.data as Prisma.InputJsonObject;

        const restored = await prisma.resume.update({
            where: { id },
            data: { ...versionData, version: { increment: 1 } },
            select: RESUME_SELECT,
        });

        return restored;
    }

    // POST /resumes/upload - Upload and parse resume
    async uploadResume(userId: string, file: Express.Multer.File, title?: string): Promise<ResumeRecord> {
        if (!userId || !file) throw createHttpError(400, 'userId and file are required');

        const user = await this.getUserOrThrow(userId);
        if (user.credits < 1) throw createHttpError(402, 'Insufficient credits');

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
        if (!userId || !file) throw createHttpError(400, 'userId and file are required');

        const text = await this.extractTextFromBuffer(file.buffer, file.mimetype);
        return aiService.extractResumeData(text);
    }

    // POST /resumes/:id/optimize - Optimize for job description
    async optimizeResume(userId: string, id: string, jobDescription: string): Promise<unknown> {
        if (!userId || !id || !jobDescription) throw createHttpError(400, 'userId, id, and jobDescription are required');

        const resume = await this.getResumeById(userId, id);
        return aiService.optimizeResumeForJD(resume, jobDescription);
    }


    // ── Private Helpers ──────────────────────────────────────────────────

    private async getUserOrThrow(userId: string) {
        return findResourceByIdOrThrow<{ id: string; credits: number }>(
            prisma.user,
            userId,
            undefined,
            { id: true, credits: true },
            'User not found'
        );
    }

    private async getVersionOrThrow(versionId: string, resumeId: string): Promise<ResumeVersionRecord> {
        return findResourceByIdOrThrow<ResumeVersionRecord>(
            prisma.resumeVersion,
            versionId,
            { resumeId },
            undefined,
            'Version not found'
        );
    }

    private async createResumeFromTemplate(
        userId: string,
        template: ResumeRecord
    ): Promise<ResumeRecord> {
        return prisma.resume.create({
            data: {
                userId,
                title: `${template.title} (Copy)`,
                template: template.template,
                targetRole: template.targetRole ?? undefined,
                industry: template.industry ?? undefined,
                personalInfo: toNullableInputJson(template.personalInfo),
                summary: template.summary ?? undefined,
                experience: toInputJsonArray(template.experience),
                education: toInputJsonArray(template.education),
                skills: toNullableInputJson(template.skills),
                certifications: toInputJsonArray(template.certifications),
                projects: toInputJsonArray(template.projects),
                languages: toInputJsonArray(template.languages),
                version: 1,
            },
            select: RESUME_SELECT,
        });
    }

    private async createSnapshot(resume: ResumeRecord): Promise<void> {
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
                data: data as Prisma.InputJsonValue,
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
        if (mimetype === FILE_UPLOAD.MIME_TYPES.PDF) {
            const data = await parsePdf(buffer);
            return data.text || '';
        }

        if (mimetype === FILE_UPLOAD.MIME_TYPES.DOCX) {
            const result = await mammoth.extractRawText({ buffer });
            return result.value || '';
        }

        throw createHttpError(400, 'Unsupported file type. Please upload PDF or DOCX.');
    }
}
