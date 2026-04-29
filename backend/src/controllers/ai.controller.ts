import { Request, Response } from 'express';
import crypto from 'crypto';
import { CACHE_TTL } from '@/constants/cacheTtl';
import { AIService } from '@/services/ai/aiService';
import { asyncHandler } from '@/middleware/error';
import { UnauthorizedError, ValidationError } from '@/utils/errorHandler';
import { getCacheService } from '@/services/cache.service';

const cache = getCacheService();

const ai = new AIService();

// ── Helpers ────────────────────────────────────────────────────────────

function createHash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

function requireUserId(req: Request): string {
  if (!req.user?.userId) throw new UnauthorizedError();
  return req.user.userId;
}

function requireResumeId(req: Request): string {
  if (!req.params.id) throw new ValidationError('Resume ID is required');
  return req.params.id;
}

// ── Resume AI Endpoints ────────────────────────────────────────────────────

// Cache enhanced sections for 24 hours to avoid re-processing same content
export const enhanceResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const resumeId = requireResumeId(req);
  const { section, targetRole, industry } = req.body;
  
  if (!section) throw new ValidationError('section is required');

  const cacheKey = `resume:${resumeId}:enhance:${section}:${targetRole}:${industry}`;
  
  const result = await cache.getOrFetch(
    cacheKey,
    () => ai.enhanceResumeSection(userId, resumeId, { section, targetRole, industry }),
    CACHE_TTL.RESUME_ENHANCE_SECONDS
  );
  
  res.json({ success: true, data: result });
});

// Cache ATS scores for 24 hours — job descriptions don't change often
export const scoreAts = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const resumeId = requireResumeId(req);
  const { jobDescription } = req.body;
  
  if (!jobDescription) throw new ValidationError('jobDescription is required');

  const jobDescriptionHash = createHash(jobDescription);
  const cacheKey = `resume:${resumeId}:ats:${jobDescriptionHash}`;
  
  const result = await cache.getOrFetch(
    cacheKey,
    () => ai.scoreATS(userId, resumeId, jobDescription),
    CACHE_TTL.ATS_SCORE_SECONDS
  );
  
  res.json({ success: true, data: result });
});

export const getSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const { section, targetRole } = req.body;
  
  if (!section) throw new ValidationError('section is required');

  const result = await ai.generateSuggestions(userId, req.params.resumeId, section, targetRole);
  res.json({ success: true, data: result });
});

// ── General AI Utility Endpoints ───────────────────────────────────────────

// Cache keyword extraction results for 1 week
export const extractKeywords = asyncHandler(async (req: Request, res: Response) => {
  const { text, maxKeywords, includeWeights } = req.body;
  
  if (!text) throw new ValidationError('text is required');

  const textHash = createHash(text);
  const cacheKey = `keyword:${textHash}:${maxKeywords}:${includeWeights}`;
  
  const result = await cache.getOrFetch(
    cacheKey,
    () => ai.extractKeywords(text, maxKeywords, includeWeights),
    CACHE_TTL.KEYWORD_EXTRACTION_SECONDS
  );
  
  res.json({ success: true, data: result });
});

export const fixGrammar = asyncHandler(async (req: Request, res: Response) => {
  const { text, mode } = req.body;
  
  if (!text) throw new ValidationError('text is required');

  const result = await ai.fixGrammar(text, mode);
  res.json({ success: true, data: result });
});

export const improveText = asyncHandler(async (req: Request, res: Response) => {
  const { text, tone, context } = req.body;
  
  if (!text) throw new ValidationError('text is required');

  const result = await ai.improveText(text, tone, context);
  res.json({ success: true, data: result });
});

