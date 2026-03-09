import { Request, Response } from 'express';
import { AIService } from '../services/ai/aiService';
import { asyncHandler } from '../middleware/error';
import { getCacheService } from '../services/cache.service';
const cache = getCacheService();

const ai = new AIService();

// ── Resume AI Endpoints ────────────────────────────────────────────────────

// Cache enhanced sections for 24 hours to avoid re-processing same content
export const enhanceResume = asyncHandler(async (req: Request, res: Response) => {
  const { section, targetRole, industry } = req.body;
  const cacheKey = `resume:${req.params.id}:enhance:${section}:${targetRole}:${industry}`;
  
  const result = await cache.getOrFetch(
    cacheKey,
    () => ai.enhanceResumeSection(req.user!.userId, req.params.id, section, targetRole, industry),
    86400 // 24 hour TTL
  );
  
  res.json({ success: true, data: result });
});

// Cache ATS scores for 24 hours — job descriptions don't change often
export const scoreAts = asyncHandler(async (req: Request, res: Response) => {
  const { jobDescription, returnSuggestions } = req.body;
  const jobDescriptionHash = require('crypto')
    .createHash('md5')
    .update(jobDescription)
    .digest('hex');
  const cacheKey = `resume:${req.params.id}:ats:${jobDescriptionHash}`;
  
  const result = await cache.getOrFetch(
    cacheKey,
    () => ai.scoreATS(req.user!.userId, req.params.id, jobDescription, returnSuggestions),
    86400 // 24 hour TTL
  );
  
  res.json({ success: true, data: result });
});

export const getSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const { section, targetRole } = req.body;
  const result = await ai.generateSuggestions(req.user!.userId, req.params.resumeId, section, targetRole);
  res.json({ success: true, data: result });
});

// ── General AI Utility Endpoints ───────────────────────────────────────────

// Cache keyword extraction results for 1 week
export const extractKeywords = asyncHandler(async (req: Request, res: Response) => {
  const { text, maxKeywords, includeWeights } = req.body;
  const textHash = require('crypto')
    .createHash('md5')
    .update(text)
    .digest('hex');
  const cacheKey = `keyword:${textHash}:${maxKeywords}:${includeWeights}`;
  
  const result = await cache.getOrFetch(
    cacheKey,
    () => ai.extractKeywords(text, maxKeywords, includeWeights),
    604800 // 7 day TTL
  );
  
  res.json({ success: true, data: result });
});

export const fixGrammar = asyncHandler(async (req: Request, res: Response) => {
  const { text, mode } = req.body;
  const result = await ai.fixGrammar(text, mode);
  res.json({ success: true, data: result });
});

export const improveText = asyncHandler(async (req: Request, res: Response) => {
  const { text, tone, context } = req.body;
  const result = await ai.improveText(text, tone, context);
  res.json({ success: true, data: result });
});

