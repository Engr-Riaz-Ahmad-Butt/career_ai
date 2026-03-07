import { Request, Response } from 'express';
import { DocumentService } from '../services/document.service';
import { AIService } from '../services/ai/aiService';
import { asyncHandler } from '../middleware/error';
import prisma from '../config/database';

const docService = new DocumentService();
const aiService = new AIService();

// ── Universal Document CRUD ────────────────────────────────────────────────

export const listDocuments = asyncHandler(async (req: Request, res: Response) => {
    const result = await docService.listDocuments(req.user!.userId, req.query as any);
    res.json({ success: true, data: result });
});

export const getDocument = asyncHandler(async (req: Request, res: Response) => {
    const doc = await docService.getDocumentById(req.user!.userId, req.params.id);
    res.json({ success: true, data: { document: doc } });
});

export const updateDocument = asyncHandler(async (req: Request, res: Response) => {
    const doc = await docService.updateDocument(req.user!.userId, req.params.id, req.body);
    res.json({ success: true, message: 'Document updated', data: { document: doc } });
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
    await docService.deleteDocument(req.user!.userId, req.params.id);
    res.json({ success: true, message: 'Document deleted' });
});

export const generateDocPdf = asyncHandler(async (req: Request, res: Response) => {
    const result = await docService.generatePdf(req.user!.userId, req.params.id);
    res.json({ success: true, data: result });
});

export const duplicateDocument = asyncHandler(async (req: Request, res: Response) => {
    const doc = await docService.duplicateDocument(req.user!.userId, req.params.id);
    res.status(201).json({ success: true, message: 'Document duplicated', data: { document: doc } });
});

// ── Cover Letter ─────────────────────────────────────────────────────────

export const generateCoverLetter = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

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
});

export const regenerateCoverLetter = asyncHandler(async (req: Request, res: Response) => {
    const original = await docService.getDocumentById(req.user!.userId, req.params.id);
    const metadata = original.metadata as any || {};
    const content = await aiService.generateCoverLetter(req.user!.userId, metadata);
    const doc = await docService.updateDocument(req.user!.userId, req.params.id, { content });
    await _deductCredits(req.user!.userId, 'REGENERATE_COVER_LETTER', 2);
    res.json({ success: true, message: 'Cover letter regenerated', data: { document: doc } });
});

// ── SOP ─────────────────────────────────────────────────────────────────

export const generateSOP = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const content = await aiService.generateSOP(req.user!.userId, data);
    const doc = await docService.createFromGeneration(req.user!.userId, 'SOP', `SOP — ${data.program} at ${data.university}`, content, data);
    await _deductCredits(req.user!.userId, 'GENERATE_SOP', 3);
    res.status(201).json({ success: true, message: 'SOP generated', data: { document: doc } });
});

// ── Motivation Letter ─────────────────────────────────────────────────

export const generateMotivationLetter = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const content = await aiService.generateMotivationLetter(req.user!.userId, data);
    const doc = await docService.createFromGeneration(req.user!.userId, 'MOTIVATION_LETTER', `Motivation Letter — ${data.program}`, content, data);
    await _deductCredits(req.user!.userId, 'GENERATE_MOTIVATION_LETTER', 2);
    res.status(201).json({ success: true, message: 'Motivation letter generated', data: { document: doc } });
});

// ── Study Plan ────────────────────────────────────────────────────────

export const generateStudyPlan = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const content = await aiService.generateStudyPlan(req.user!.userId, data);
    const doc = await docService.createFromGeneration(req.user!.userId, 'STUDY_PLAN', `Study Plan — ${data.program} at ${data.university}`, content, data);
    await _deductCredits(req.user!.userId, 'GENERATE_STUDY_PLAN', 2);
    res.status(201).json({ success: true, message: 'Study plan generated', data: { document: doc } });
});

// ── Financial Letter ──────────────────────────────────────────────────

export const generateFinancialLetter = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const content = await aiService.generateFinancialLetter(req.user!.userId, data);
    const doc = await docService.createFromGeneration(req.user!.userId, 'FINANCIAL_LETTER', `Financial Letter — ${data.scholarshipName}`, content, data);
    await _deductCredits(req.user!.userId, 'GENERATE_FINANCIAL_LETTER', 2);
    res.status(201).json({ success: true, message: 'Financial letter generated', data: { document: doc } });
});

// ── Bio ────────────────────────────────────────────────────────────────

export const generateBio = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const content = await aiService.generateBio(req.user!.userId, data);
    const doc = await docService.createFromGeneration(req.user!.userId, 'BIO', `${data.bioType} Bio`, content, data);
    await _deductCredits(req.user!.userId, 'GENERATE_BIO', 1);
    res.status(201).json({ success: true, message: 'Bio generated', data: { document: doc } });
});

// ── Shared ─────────────────────────────────────────────────────────────

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

