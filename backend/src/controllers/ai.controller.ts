import { Request, Response } from 'express';
import { AIService } from '../services/ai/aiService';
import { z } from 'zod';

const ai = new AIService();

// ── Resume AI Endpoints ────────────────────────────────────────────────────

const enhanceSchema = z.object({
  section: z.enum(['summary', 'experience', 'skills', 'all']),
  targetRole: z.string().optional(),
  industry: z.string().optional(),
  stream: z.boolean().optional(),
});

export const enhanceResume = async (req: Request, res: Response) => {
  const { section, targetRole, industry } = enhanceSchema.parse(req.body);
  const result = await ai.enhanceResumeSection(req.user!.userId, req.params.id, section, targetRole, industry);
  res.json({ success: true, data: result });
};

const atsSchema = z.object({
  jobDescription: z.string().min(10),
  returnSuggestions: z.boolean().optional().default(true),
});

export const scoreAts = async (req: Request, res: Response) => {
  const { jobDescription, returnSuggestions } = atsSchema.parse(req.body);
  const result = await ai.scoreATS(req.user!.userId, req.params.id, jobDescription, returnSuggestions);
  res.json({ success: true, data: result });
};

const suggestSchema = z.object({
  section: z.string(),
  targetRole: z.string().optional(),
});

export const getSuggestions = async (req: Request, res: Response) => {
  const { section, targetRole } = suggestSchema.parse(req.body);
  const result = await ai.generateSuggestions(req.user!.userId, req.params.resumeId, section, targetRole);
  res.json({ success: true, data: result });
};

// Note: cover-letter, SOP, bio, etc. generators are in document.controller.ts
// and imported directly by ai.routes.ts – no bridge needed here.

const keywordsSchema = z.object({
  text: z.string(),
  maxKeywords: z.number().optional().default(30),
  includeWeights: z.boolean().optional().default(false),
});

export const extractKeywords = async (req: Request, res: Response) => {
  const { text, maxKeywords, includeWeights } = keywordsSchema.parse(req.body);
  const result = await ai.extractKeywords(text, maxKeywords, includeWeights);
  res.json({ success: true, data: result });
};

const grammarSchema = z.object({
  text: z.string().max(10000),
  mode: z.enum(['grammar_only', 'grammar_and_style', 'full_rewrite']).optional().default('grammar_only'),
});

export const fixGrammar = async (req: Request, res: Response) => {
  const { text, mode } = grammarSchema.parse(req.body);
  const result = await ai.fixGrammar(text, mode);
  res.json({ success: true, data: result });
};

const improveSchema = z.object({
  text: z.string(),
  tone: z.string().optional(),
  context: z.string().optional(),
});

export const improveText = async (req: Request, res: Response) => {
  const { text, tone, context } = improveSchema.parse(req.body);
  const result = await ai.improveText(text, tone, context);
  res.json({ success: true, data: result });
};
