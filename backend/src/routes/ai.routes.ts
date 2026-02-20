import { Router } from 'express';
import { authenticate, requireCredits } from '../middleware/auth';
import { enhanceResume, scoreAts, getSuggestions, extractKeywords, fixGrammar, improveText } from '../controllers/ai.controller';
import {
  generateCoverLetter, generateSOP, generateMotivationLetter,
  generateStudyPlan, generateFinancialLetter, generateBio,
} from '../controllers/document.controller';
import { tailorResume } from '../controllers/tailoring.controller';
import { generateSession, submitFeedback } from '../controllers/interview.controller';
import { analyzeCommunicationAI } from '../controllers/communication.controller';

const router = Router();
router.use(authenticate);

// ── Resume AI ─────────────────────────────────────────────────────────────
router.post('/resume/enhance', requireCredits(2), enhanceResume);           // route via req.body.resumeId
router.post('/resume/tailor', requireCredits(3), tailorResume);
router.post('/resume/ats-score', requireCredits(1), scoreAts);
router.post('/resume/suggestions', getSuggestions);

// ── Document Generators (aliases at /ai/* per spec) ──────────────────────
router.post('/cover-letter/generate', requireCredits(2), generateCoverLetter);
router.post('/sop/generate', requireCredits(3), generateSOP);
router.post('/motivation-letter/generate', requireCredits(2), generateMotivationLetter);
router.post('/bio/generate', requireCredits(1), generateBio);
router.post('/study-plan/generate', requireCredits(2), generateStudyPlan);

// ── Interview ─────────────────────────────────────────────────────────────
router.post('/interview/generate', requireCredits(2), generateSession);
router.post('/interview/feedback', requireCredits(1), submitFeedback);

// ── Analysis ─────────────────────────────────────────────────────────────
router.post('/communication/analyze', requireCredits(1), analyzeCommunicationAI);

// ── Utilities ─────────────────────────────────────────────────────────────
router.post('/keywords/extract', extractKeywords);
router.post('/grammar/fix', fixGrammar);
router.post('/text/improve', improveText);

export default router;
