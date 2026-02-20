import prisma from '../config/database';
import { ApiError } from '../middleware/error';

export class ResumeService {
    async createResume(userId: string, data: any) {
        const resume = await prisma.resume.create({
            data: {
                userId,
                ...data,
            },
        });

        // Deduct credits (1 credit for creation)
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: 1 } },
        });

        // Log usage
        await prisma.creditUsage.create({
            data: {
                userId,
                action: 'resume_create',
                credits: 1,
                metadata: { resumeId: resume.id },
            },
        });

        return resume;
    }

    async getResumes(userId: string, options: {
        skip: number;
        take: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc'
    }) {
        const [resumes, total] = await Promise.all([
            prisma.resume.findMany({
                where: { userId },
                skip: options.skip,
                take: options.take,
                orderBy: options.sortBy
                    ? { [options.sortBy]: options.sortOrder }
                    : { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    template: true,
                    atsScore: true,
                    isTailored: true,
                    isPublished: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.resume.count({
                where: { userId },
            }),
        ]);

        return { resumes, total };
    }

    async getResumeById(userId: string, resumeId: string) {
        const resume = await prisma.resume.findFirst({
            where: {
                id: resumeId,
                userId,
            },
        });

        if (!resume) {
            throw new ApiError(404, 'Resume not found');
        }

        return resume;
    }

    async updateResume(userId: string, resumeId: string, data: any) {
        // Verify ownership
        await this.getResumeById(userId, resumeId);

        return await prisma.resume.update({
            where: { id: resumeId },
            data,
        });
    }

    async deleteResume(userId: string, resumeId: string) {
        // Verify ownership
        await this.getResumeById(userId, resumeId);

        await prisma.resume.delete({
            where: { id: resumeId },
        });
    }

    async duplicateResume(userId: string, resumeId: string) {
        const original = await this.getResumeById(userId, resumeId);

        const duplicate = await prisma.resume.create({
            data: {
                userId,
                title: `${original.title} (Copy)`,
                template: original.template,
                personalInfo: original.personalInfo as any,
                summary: original.summary as any,
                experience: original.experience as any,
                education: original.education as any,
                skills: original.skills as any,
                certifications: original.certifications as any,
                projects: original.projects as any,
                languages: original.languages as any,
            },
        });

        return duplicate;
    }

    async uploadResume(userId: string, file: Express.Multer.File) {
        const resume = await prisma.resume.create({
            data: {
                userId,
                title: file.originalname,
                template: 'uploaded',
                personalInfo: {},
                summary: `Uploaded file: ${file.filename}`,
            },
        });

        return {
            resume,
            file: {
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size
            }
        };
    }
}

export const resumeService = new ResumeService();
