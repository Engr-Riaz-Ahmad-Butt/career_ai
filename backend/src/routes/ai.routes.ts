import { Router } from 'express';
import { authenticate, requireCredits } from '@/middleware/auth';
import { aiRateLimit, heavyAiRateLimit } from '@/middleware/userRateLimit';
import {
  enhanceResume, scoreAts, getSuggestions, extractKeywords, fixGrammar, improveText
} from '@/controllers/ai.controller';
import {
  generateCoverLetter, generateSOP, generateMotivationLetter,
  generateStudyPlan, generateFinancialLetter, generateBio,
} from '@/controllers/document.controller';
import { tailorResume } from '@/controllers/tailoring.controller';
import { generateSession, submitFeedback } from '@/controllers/interview.controller';
import { analyzeCommunicationAI } from '@/controllers/communication.controller';
import { validate } from '@/middleware/validate';
import {
  enhanceResumeSchema,
  tailorResumeSchema,
  atsScoreSchema,
  aiSuggestionsSchema,
  extractKeywordsSchema,
  fixGrammarSchema,
  improveTextSchema
} from '@/utils/validation';

const router = Router();
router.use(authenticate);
router.use(aiRateLimit); // 30 AI requests per 10 min per user

// ── Resume AI ─────────────────────────────────────────────────────────────
router.post('/resume/enhance', validate(enhanceResumeSchema), requireCredits(2), enhanceResume);
router.post('/resume/tailor', heavyAiRateLimit, validate(tailorResumeSchema), requireCredits(3), tailorResume);
router.post('/resume/ats-score', validate(atsScoreSchema), requireCredits(1), scoreAts);
router.post('/resume/suggestions', validate(aiSuggestionsSchema), getSuggestions);

// ── Document Generators (aliases at /ai/* per spec) ──────────────────────
router.post('/cover-letter/generate', requireCredits(2), generateCoverLetter);
router.post('/sop/generate', heavyAiRateLimit, requireCredits(3), generateSOP);
router.post('/motivation-letter/generate', requireCredits(2), generateMotivationLetter);
router.post('/bio/generate', requireCredits(1), generateBio);
router.post('/study-plan/generate', heavyAiRateLimit, requireCredits(2), generateStudyPlan);

// ── Interview ─────────────────────────────────────────────────────────────
router.post('/interview/generate', requireCredits(2), generateSession);
router.post('/interview/feedback', requireCredits(1), submitFeedback);

// ── Analysis ─────────────────────────────────────────────────────────────
router.post('/communication/analyze', requireCredits(1), analyzeCommunicationAI);

// ── Utilities ─────────────────────────────────────────────────────────────
router.post('/keywords/extract', validate(extractKeywordsSchema), extractKeywords);
router.post('/grammar/fix', validate(fixGrammarSchema), fixGrammar);
router.post('/text/improve', validate(improveTextSchema), improveText);

export default router;

