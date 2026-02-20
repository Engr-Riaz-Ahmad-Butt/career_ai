import { Request, Response } from 'express';
import { DocumentService } from '../services/document.service';
import { AIService } from '../services/ai/aiService';
import { z } from 'zod';
import { DocumentType } from '@prisma/client';

const docService = new DocumentService();
const aiService = new AIService();

// ── Universal Document CRUD ────────────────────────────────────────────────

export const listDocuments = async (req: Request, res: Response) => {
    const result = await docService.listDocuments(req.user!.userId, {
        type: req.query.type as string,
        status: req.query.status as string,
        search: req.query.search as string,
        page: +(req.query.page || 1),
        limit: +(req.query.limit || 20),
        sortBy: req.query.sortBy as string,
        order: req.query.order as string,
    });
    res.json({ success: true, data: result });
};

export const getDocument = async (req: Request, res: Response) => {
    const doc = await docService.getDocumentById(req.user!.userId, req.params.id);
    res.json({ success: true, data: { document: doc } });
};

export const updateDocument = async (req: Request, res: Response) => {
    const doc = await docService.updateDocument(req.user!.userId, req.params.id, req.body);
    res.json({ success: true, message: 'Document updated', data: { document: doc } });
};

export const deleteDocument = async (req: Request, res: Response) => {
    await docService.deleteDocument(req.user!.userId, req.params.id);
    res.json({ success: true, message: 'Document deleted' });
};

export const generateDocPdf = async (req: Request, res: Response) => {
    const result = await docService.generatePdf(req.user!.userId, req.params.id);
    res.json({ success: true, data: result });
};

export const duplicateDocument = async (req: Request, res: Response) => {
    const doc = await docService.duplicateDocument(req.user!.userId, req.params.id);
    res.status(201).json({ success: true, message: 'Document duplicated', data: { document: doc } });
};

// ── Cover Letter ─────────────────────────────────────────────────────────

const coverLetterSchema = z.object({
    type: z.enum(['job_application', 'resignation', 'recommendation', 'acceptance', 'motivation', 'scholarship', 'networking']),
    resumeId: z.string().optional(),
    jobDescription: z.string().optional(),
    companyName: z.string().optional(),
    jobTitle: z.string().optional(),
    hiringManagerName: z.string().optional(),
    tone: z.enum(['professional', 'friendly', 'formal', 'enthusiastic']).optional(),
    wordLimit: z.number().optional().default(350),
    keyPoints: z.array(z.string()).optional(),
    customContext: z.string().optional(),
    language: z.string().optional().default('en'),
    stream: z.boolean().optional(),
});

export const generateCoverLetter = async (req: Request, res: Response) => {
    const data = coverLetterSchema.parse(req.body);

    if (data.stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
    }

    const content = await aiService.generateCoverLetter(req.user!.userId, data);
    const doc = await docService.createFromGeneration(
        req.user!.userId, 'COVER_LETTER',
        `${data.type === 'job_application' ? `Cover Letter — ${data.companyName || 'Application'}` : `${data.type} Letter`}`,
        content, data
    );

    await _deductCredits(req.user!.userId, 'GENERATE_COVER_LETTER', 2);

    if (data.stream) {
        res.write(`data: ${JSON.stringify({ success: true, data: { document: doc } })}\n\n`);
        res.end();
    } else {
        res.status(201).json({ success: true, message: 'Cover letter generated', data: { document: doc } });
    }
};

export const regenerateCoverLetter = async (req: Request, res: Response) => {
    const original = await docService.getDocumentById(req.user!.userId, req.params.id);
    const metadata = original.metadata as any || {};
    const content = await aiService.generateCoverLetter(req.user!.userId, metadata);
    const doc = await docService.updateDocument(req.user!.userId, req.params.id, { content });
    await _deductCredits(req.user!.userId, 'REGENERATE_COVER_LETTER', 2);
    res.json({ success: true, message: 'Cover letter regenerated', data: { document: doc } });
};

// ── SOP ─────────────────────────────────────────────────────────────────

const sopSchema = z.object({
    university: z.string(),
    program: z.string(),
    country: z.string().optional(),
    resumeId: z.string().optional(),
    researchInterests: z.string().optional(),
    whyThisProgram: z.string().optional(),
    careerGoals: z.string(),
    achievements: z.array(z.string()).optional(),
    challenges: z.string().optional(),
    wordLimit: z.number().optional().default(800),
    scholarshipName: z.string().optional(),
    language: z.string().optional().default('en'),
    stream: z.boolean().optional(),
});

export const generateSOP = async (req: Request, res: Response) => {
    const data = sopSchema.parse(req.body);
    const content = await aiService.generateSOP(req.user!.userId, data);
    const doc = await docService.createFromGeneration(req.user!.userId, 'SOP', `SOP — ${data.program} at ${data.university}`, content, data);
    await _deductCredits(req.user!.userId, 'GENERATE_SOP', 3);
    res.status(201).json({ success: true, message: 'SOP generated', data: { document: doc } });
};

// ── Motivation Letter ─────────────────────────────────────────────────

const motivationSchema = z.object({
    university: z.string(),
    program: z.string(),
    resumeId: z.string().optional(),
    personalBackground: z.string().optional(),
    motivation: z.string(),
    careerGoals: z.string(),
    wordLimit: z.number().optional().default(600),
    stream: z.boolean().optional(),
});

export const generateMotivationLetter = async (req: Request, res: Response) => {
    const data = motivationSchema.parse(req.body);
    const content = await aiService.generateMotivationLetter(req.user!.userId, data);
    const doc = await docService.createFromGeneration(req.user!.userId, 'MOTIVATION_LETTER', `Motivation Letter — ${data.program}`, content, data);
    await _deductCredits(req.user!.userId, 'GENERATE_MOTIVATION_LETTER', 2);
    res.status(201).json({ success: true, message: 'Motivation letter generated', data: { document: doc } });
};

// ── Study Plan ────────────────────────────────────────────────────────

const studyPlanSchema = z.object({
    university: z.string(),
    program: z.string(),
    duration: z.string(),
    currentQualification: z.string(),
    intendedCourses: z.array(z.string()).optional(),
    researchPlan: z.string().optional(),
    postStudyPlans: z.string().optional(),
    wordLimit: z.number().optional().default(600),
});

export const generateStudyPlan = async (req: Request, res: Response) => {
    const data = studyPlanSchema.parse(req.body);
    const content = await aiService.generateStudyPlan(req.user!.userId, data);
    const doc = await docService.createFromGeneration(req.user!.userId, 'STUDY_PLAN', `Study Plan — ${data.program} at ${data.university}`, content, data);
    await _deductCredits(req.user!.userId, 'GENERATE_STUDY_PLAN', 2);
    res.status(201).json({ success: true, message: 'Study plan generated', data: { document: doc } });
};

// ── Financial Letter ──────────────────────────────────────────────────

const financialSchema = z.object({
    scholarshipName: z.string(),
    university: z.string(),
    financialSituation: z.string(),
    supportingDetails: z.string().optional(),
    wordLimit: z.number().optional().default(400),
});

export const generateFinancialLetter = async (req: Request, res: Response) => {
    const data = financialSchema.parse(req.body);
    const content = await aiService.generateFinancialLetter(req.user!.userId, data);
    const doc = await docService.createFromGeneration(req.user!.userId, 'FINANCIAL_LETTER', `Financial Letter — ${data.scholarshipName}`, content, data);
    await _deductCredits(req.user!.userId, 'GENERATE_FINANCIAL_LETTER', 2);
    res.status(201).json({ success: true, message: 'Financial letter generated', data: { document: doc } });
};

// ── Bio ────────────────────────────────────────────────────────────────

const bioSchema = z.object({
    bioType: z.enum(['linkedin', 'elevator_pitch', 'portfolio', 'twitter', 'speaker', 'executive']),
    resumeId: z.string().optional(),
    name: z.string().optional(),
    currentRole: z.string().optional(),
    company: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    keySkills: z.array(z.string()).optional(),
    tone: z.enum(['professional', 'casual', 'creative', 'academic']).optional(),
    wordLimit: z.number().optional(),
    includeCallToAction: z.boolean().optional().default(false),
});

export const generateBio = async (req: Request, res: Response) => {
    const data = bioSchema.parse(req.body);
    const content = await aiService.generateBio(req.user!.userId, data);
    const doc = await docService.createFromGeneration(req.user!.userId, 'BIO', `${data.bioType} Bio`, content, data);
    await _deductCredits(req.user!.userId, 'GENERATE_BIO', 1);
    res.status(201).json({ success: true, message: 'Bio generated', data: { document: doc } });
};

// ── Shared ─────────────────────────────────────────────────────────────

import prisma from '../config/database';

async function _deductCredits(userId: string, action: string, amount: number) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: amount }, lifetimeCreditsUsed: { increment: amount } },
        select: { credits: true },
    });
    await prisma.creditTransaction.create({
        data: { userId, amount: -amount, type: 'USAGE', description: action, balanceAfter: user.credits },
    });
}
