import prisma from '../config/database';
import { ApiError } from '../middleware/error';
import aiService from './ai/aiService';
import pdf from 'pdf-parse';
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
};

export class ResumeService {

    // GET /resumes
    async listResumes(userId: string, params: { page?: number; limit?: number; sortBy?: string; order?: string }) {
        const page = params.page || 1;
        const limit = Math.min(params.limit || 10, 50);
        const skip = (page - 1) * limit;
        const orderBy: any = { [params.sortBy || 'updatedAt']: params.order || 'desc' };

        const [resumes, total] = await Promise.all([
            prisma.resume.findMany({ where: { userId }, select: RESUME_SELECT, orderBy, skip, take: limit }),
            prisma.resume.count({ where: { userId } }),
        ]);

        return { data: resumes, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // POST /resumes
    async createResume(userId: string, data: {
        title: string;
        template: string;
        targetRole?: string;
        industry?: string;
    }) {
        // Deduct credits
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });
        if (!user || user.credits < 1) throw new ApiError(402, 'Insufficient credits');

        const resume = await prisma.resume.create({
            data: { userId, ...data, version: 1 },
            select: RESUME_SELECT,
        });

        await this._deductCredit(userId, 'CREATE_RESUME', 1, resume.id);
        return resume;
    }

    // GET /resumes/:id
    async getResumeById(userId: string, id: string) {
        const resume = await prisma.resume.findFirst({ where: { id, userId }, select: RESUME_SELECT });
        if (!resume) throw new ApiError(404, 'Resume not found');
        return resume;
    }

    // PUT /resumes/:id
    async updateResume(userId: string, id: string, data: Record<string, any>) {
        const existing = await prisma.resume.findFirst({ where: { id, userId } });
        if (!existing) throw new ApiError(404, 'Resume not found');

        // Auto-snapshot: save current version before overwriting (keep last 5)
        await this._createSnapshot(existing);

        const updated = await prisma.resume.update({
            where: { id },
            data: { ...data, version: { increment: 1 } },
            select: RESUME_SELECT,
        });
        return updated;
    }

    // DELETE /resumes/:id
    async deleteResume(userId: string, id: string) {
        const resume = await prisma.resume.findFirst({ where: { id, userId } });
        if (!resume) throw new ApiError(404, 'Resume not found');
        await prisma.resume.delete({ where: { id } });
    }

    // POST /resumes/:id/duplicate
    async duplicateResume(userId: string, id: string) {
        const original = await prisma.resume.findFirst({ where: { id, userId } });
        if (!original) throw new ApiError(404, 'Resume not found');

        const duplicate = await prisma.resume.create({
            data: {
                userId,
                title: `${original.title} (Copy)`,
                template: original.template,
                targetRole: original.targetRole ?? undefined,
                industry: original.industry ?? undefined,
                personalInfo: original.personalInfo as any,
                summary: original.summary ?? undefined,
                experience: original.experience as any,
                education: original.education as any,
                skills: original.skills as any,
                certifications: original.certifications as any,
                projects: original.projects as any,
                languages: original.languages as any,
                version: 1,
            },
            select: RESUME_SELECT,
        });
        return duplicate;
    }

    // POST /resumes/:id/pdf
    async generatePdf(userId: string, id: string): Promise<{ pdfUrl: string; expiresAt: Date }> {
        const resume = await prisma.resume.findFirst({ where: { id, userId } });
        if (!resume) throw new ApiError(404, 'Resume not found');

        // TODO: integrate with puppeteer/wkhtmltopdf + S3 upload
        // Returning a placeholder URL for now
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        return { pdfUrl: `${process.env.API_URL || 'http://localhost:5000'}/api/v1/resumes/${id}/download`, expiresAt };
    }

    // GET /resumes/:id/versions
    async listVersions(userId: string, id: string) {
        const resume = await prisma.resume.findFirst({ where: { id, userId } });
        if (!resume) throw new ApiError(404, 'Resume not found');

        const versions = await prisma.resumeVersion.findMany({
            where: { resumeId: id },
            orderBy: { versionNum: 'desc' },
            take: 5,
            select: { id: true, versionNum: true, createdAt: true },
        });
        return versions;
    }

    // POST /resumes/:id/restore/:versionId
    async restoreVersion(userId: string, id: string, versionId: string) {
        const resume = await prisma.resume.findFirst({ where: { id, userId } });
        if (!resume) throw new ApiError(404, 'Resume not found');

        const version = await prisma.resumeVersion.findFirst({ where: { id: versionId, resumeId: id } });
        if (!version) throw new ApiError(404, 'Version not found');

        const data = version.data as Record<string, any>;
        const restored = await prisma.resume.update({
            where: { id },
            data: { ...data, version: { increment: 1 } },
            select: RESUME_SELECT,
        });
        return restored;
    }

    // POST /resumes/upload
    async uploadResume(userId: string, file: Express.Multer.File, title?: string) {
        const text = await this.extractTextFromBuffer(file.buffer, file.mimetype);
        const parsed = await aiService.extractResumeData(text);

        const resume = await prisma.resume.create({
            data: {
                userId,
                title: title || file.originalname,
                template: 'modern',
                personalInfo: parsed.personalInfo || {},
                summary: parsed.summary || '',
                experience: parsed.experience || [],
                education: parsed.education || [],
                skills: parsed.skills || {},
                projects: parsed.projects || [],
                version: 1,
            },
            select: RESUME_SELECT,
        });

        await this._deductCredit(userId, 'UPLOAD_RESUME', 1, resume.id);
        return resume;
    }

    async extractAndParse(userId: string, file: Express.Multer.File) {
        const text = await this.extractTextFromBuffer(file.buffer, file.mimetype);
        const parsed = await aiService.extractResumeData(text);
        return parsed;
    }

    async optimizeResume(userId: string, id: string, jobDescription: string) {
        const resume = await prisma.resume.findFirst({ where: { id, userId } });
        if (!resume) throw new ApiError(404, 'Resume not found');

        const result = await aiService.optimizeResumeForJD(resume, jobDescription);
        return result;
    }

    private async extractTextFromBuffer(buffer: Buffer, mimetype: string): Promise<string> {
        if (mimetype === 'application/pdf') {
            const data = await (pdf as any)(buffer);
            return data.text;
        } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        } else {
            throw new ApiError(400, 'Unsupported file type. Please upload PDF or DOCX.');
        }
    }

    // ── Private helpers ────────────────────────────────────────────────────

    private async _createSnapshot(resume: any) {
        const { id, userId, createdAt, updatedAt, ...data } = resume;

        const count = await prisma.resumeVersion.count({ where: { resumeId: id } });

        if (count >= 5) {
            // Delete oldest
            const oldest = await prisma.resumeVersion.findFirst({
                where: { resumeId: id },
                orderBy: { versionNum: 'asc' },
            });
            if (oldest) await prisma.resumeVersion.delete({ where: { id: oldest.id } });
        }

        await prisma.resumeVersion.create({
            data: {
                resumeId: id,
                versionNum: resume.version,
                data,
            },
        });
    }

    private async _deductCredit(userId: string, action: string, amount: number, resourceId?: string) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: amount }, lifetimeCreditsUsed: { increment: amount } },
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
}
