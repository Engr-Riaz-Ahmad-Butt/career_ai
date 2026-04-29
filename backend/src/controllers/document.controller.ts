import { Request, Response } from 'express';
import { DocumentStatus, DocumentType } from '@prisma/client';
import { DocumentService } from '@/services/document.service';
import { AIService } from '@/services/ai/aiService';
import { asyncHandler } from '@/middleware/error';
import prisma from '@/config/database';
import { UnauthorizedError, ValidationError } from '@/utils/errorHandler';

const docService = new DocumentService();
const aiService = new AIService();
const DOCUMENT_TYPES = new Set(Object.values(DocumentType));
const DOCUMENT_STATUSES = new Set(Object.values(DocumentStatus));

function parseDocumentType(value: unknown): DocumentType | undefined {
  if (typeof value !== 'string') return undefined;
  return DOCUMENT_TYPES.has(value as DocumentType) ? (value as DocumentType) : undefined;
}

function parseDocumentStatus(value: unknown): DocumentStatus | undefined {
  if (typeof value !== 'string') return undefined;
  return DOCUMENT_STATUSES.has(value as DocumentStatus) ? (value as DocumentStatus) : undefined;
}

// ── Helper Functions ────────────────────────────────────────────────────

function extractDocumentListOptions(query: Record<string, unknown>): {
  type?: DocumentType;
  status?: DocumentStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
} {
  return {
    type: parseDocumentType(query.type),
    status: parseDocumentStatus(query.status),
    search: typeof query.search === 'string' ? query.search : undefined,
    page: typeof query.page === 'string' ? parseInt(query.page, 10) : undefined,
    limit: typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined,
    sortBy: typeof query.sortBy === 'string' ? query.sortBy : undefined,
    order: query.order === 'asc' || query.order === 'desc' ? query.order : undefined,
  };
}

async function deductDocumentCredits(userId: string, action: string, amount: number): Promise<void> {
  if (!userId || !action || amount <= 0) {
    throw new ValidationError('Invalid credit deduction parameters');
  }

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
      description: action,
      balanceAfter: user.credits,
    },
  });
}

// ── Universal Document CRUD ────────────────────────────────────────────────

export const listDocuments = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const options = extractDocumentListOptions(req.query);
  const result = await docService.listDocuments(req.user.userId, options);

  res.json({ success: true, data: result });
});

export const getDocument = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const doc = await docService.getDocumentById(req.user.userId, req.params.id);

  res.json({ success: true, data: { document: doc } });
});

export const updateDocument = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const doc = await docService.updateDocument(req.user.userId, req.params.id, req.body);

  res.json({ success: true, message: 'Document updated', data: { document: doc } });
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  await docService.deleteDocument(req.user.userId, req.params.id);

  res.json({ success: true, message: 'Document deleted' });
});

export const generateDocPdf = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const result = await docService.generatePdf(req.user.userId, req.params.id);

  res.json({ success: true, data: result });
});

export const duplicateDocument = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const doc = await docService.duplicateDocument(req.user.userId, req.params.id);

  res.status(201).json({ success: true, message: 'Document duplicated', data: { document: doc } });
});


// ── Document Generation Helper ──────────────────────────────────────────

interface GenerateDocumentOptions {
  readonly userId: string;
  readonly generator: (userId: string, data: Record<string, unknown>) => Promise<string>;
  readonly documentType: 'COVER_LETTER' | 'SOP' | 'MOTIVATION_LETTER' | 'STUDY_PLAN' | 'FINANCIAL_LETTER' | 'BIO';
  readonly title: string;
  readonly credits: number;
  readonly action: string;
  readonly data: Record<string, unknown>;
}

async function generateAndSaveDocument(options: GenerateDocumentOptions): Promise<any> {
  const { userId, generator, documentType, title, credits, action, data } = options;

  const content = await generator(userId, data);
  const document = await docService.createFromGeneration(userId, documentType, title, content, data);

  await deductDocumentCredits(userId, action, credits);

  return document;
}

// ── Cover Letter ─────────────────────────────────────────────────────────

export const generateCoverLetter = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const data = req.body;
  if (!data || typeof data !== 'object') throw new ValidationError('Invalid request body');

  const title = data.type === 'job_application'
    ? `Cover Letter — ${data.companyName || 'Application'}`
    : `${data.type} Letter`;

  const document = await generateAndSaveDocument({
    userId: req.user.userId,
    generator: (uid, d) => aiService.generateCoverLetter(uid, d as any),
    documentType: 'COVER_LETTER',
    title,
    credits: 2,
    action: 'GENERATE_COVER_LETTER',
    data,
  });

  res.status(201).json({ success: true, message: 'Cover letter generated', data: { document } });
});

export const regenerateCoverLetter = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();
  if (!req.params.id) throw new ValidationError('Document ID required');

  const original = await docService.getDocumentById(req.user.userId, req.params.id);
  const metadata = (original.metadata as Record<string, unknown>) ?? {};

  const content = await aiService.generateCoverLetter(req.user.userId, metadata as any);
  const doc = await docService.updateDocument(req.user.userId, req.params.id, { content });

  await deductDocumentCredits(req.user.userId, 'REGENERATE_COVER_LETTER', 2);

  res.json({ success: true, message: 'Cover letter regenerated', data: { document: doc } });
});

// ── SOP ─────────────────────────────────────────────────────────────────

export const generateSOP = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const data = req.body;
  const title = `SOP — ${data.program} at ${data.university}`;

  const document = await generateAndSaveDocument({
    userId: req.user.userId,
    generator: (uid, d) => aiService.generateSOP(uid, d as any),
    documentType: 'SOP',
    title,
    credits: 3,
    action: 'GENERATE_SOP',
    data,
  });

  res.status(201).json({ success: true, message: 'SOP generated', data: { document } });
});

// ── Motivation Letter ─────────────────────────────────────────────────

export const generateMotivationLetter = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const data = req.body;
  const title = `Motivation Letter — ${data.program}`;

  const document = await generateAndSaveDocument({
    userId: req.user.userId,
    generator: (uid, d) => aiService.generateMotivationLetter(uid, d as any),
    documentType: 'MOTIVATION_LETTER',
    title,
    credits: 2,
    action: 'GENERATE_MOTIVATION_LETTER',
    data,
  });

  res.status(201).json({ success: true, message: 'Motivation letter generated', data: { document } });
});

// ── Study Plan ────────────────────────────────────────────────────────

export const generateStudyPlan = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const data = req.body;
  const title = `Study Plan — ${data.program} at ${data.university}`;

  const document = await generateAndSaveDocument({
    userId: req.user.userId,
    generator: (uid, d) => aiService.generateStudyPlan(uid, d as any),
    documentType: 'STUDY_PLAN',
    title,
    credits: 2,
    action: 'GENERATE_STUDY_PLAN',
    data,
  });

  res.status(201).json({ success: true, message: 'Study plan generated', data: { document } });
});

// ── Financial Letter ──────────────────────────────────────────────────

export const generateFinancialLetter = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const data = req.body;
  const title = `Financial Letter — ${data.scholarshipName}`;

  const document = await generateAndSaveDocument({
    userId: req.user.userId,
    generator: (uid, d) => aiService.generateFinancialLetter(uid, d as any),
    documentType: 'FINANCIAL_LETTER',
    title,
    credits: 2,
    action: 'GENERATE_FINANCIAL_LETTER',
    data,
  });

  res.status(201).json({ success: true, message: 'Financial letter generated', data: { document } });
});

// ── Bio ────────────────────────────────────────────────────────────────

export const generateBio = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new UnauthorizedError();

  const data = req.body;
  const title = `${data.bioType} Bio`;

  const document = await generateAndSaveDocument({
    userId: req.user.userId,
    generator: (uid, d) => aiService.generateBio(uid, d as any),
    documentType: 'BIO',
    title,
    credits: 1,
    action: 'GENERATE_BIO',
    data,
  });

  res.status(201).json({ success: true, message: 'Bio generated', data: { document } });
});


