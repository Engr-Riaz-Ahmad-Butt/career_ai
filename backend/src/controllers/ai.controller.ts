import { Request, Response } from 'express';
import { AIService } from '../services/ai/aiService';
import { asyncHandler } from '../middleware/error';

const ai = new AIService();

// ── Resume AI Endpoints ────────────────────────────────────────────────────

export const enhanceResume = asyncHandler(async (req: Request, res: Response) => {
  const { section, targetRole, industry } = req.body;
  const result = await ai.enhanceResumeSection(req.user!.userId, req.params.id, section, targetRole, industry);
  res.json({ success: true, data: result });
});

export const scoreAts = asyncHandler(async (req: Request, res: Response) => {
  const { jobDescription, returnSuggestions } = req.body;
  const result = await ai.scoreATS(req.user!.userId, req.params.id, jobDescription, returnSuggestions);
  res.json({ success: true, data: result });
});

export const getSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const { section, targetRole } = req.body;
  const result = await ai.generateSuggestions(req.user!.userId, req.params.resumeId, section, targetRole);
  res.json({ success: true, data: result });
});

// ── General AI Utility Endpoints ───────────────────────────────────────────

export const extractKeywords = asyncHandler(async (req: Request, res: Response) => {
  const { text, maxKeywords, includeWeights } = req.body;
  const result = await ai.extractKeywords(text, maxKeywords, includeWeights);
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

