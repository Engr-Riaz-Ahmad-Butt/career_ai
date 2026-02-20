import { Router } from 'express';
import {
  generateResume,
  tailorResume,
  improveResume,
  analyzeATS,
  generateCoverLetter,
  generateSOP,
  generateLinkedInBio,
  generateInterviewPrep,
  analyzeCommunication,
  extractKeywords,
  getCredits,
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/ai/generate-resume
 * @desc    Generate resume from scratch (costs 2 credits)
 * @access  Private
 */
router.post('/generate-resume', asyncHandler(generateResume));

/**
 * @route   POST /api/ai/tailor-resume
 * @desc    Tailor resume for job (costs 2 credits)
 * @access  Private
 */
router.post('/tailor-resume', asyncHandler(tailorResume));

/**
 * @route   POST /api/ai/improve-resume
 * @desc    Get improvement suggestions (costs 1 credit)
 * @access  Private
 */
router.post('/improve-resume', asyncHandler(improveResume));

/**
 * @route   POST /api/ai/analyze-ats
 * @desc    Calculate ATS score (free)
 * @access  Private
 */
router.post('/analyze-ats', asyncHandler(analyzeATS));

/**
 * @route   POST /api/ai/generate-cover-letter
 * @desc    Generate cover letter (costs 1 credit)
 * @access  Private
 */
router.post('/generate-cover-letter', asyncHandler(generateCoverLetter));

/**
 * @route   POST /api/ai/generate-sop
 * @desc    Generate Statement of Purpose (costs 2 credits)
 * @access  Private
 */
router.post('/generate-sop', asyncHandler(generateSOP));

/**
 * @route   POST /api/ai/generate-linkedin-bio
 * @desc    Generate LinkedIn bio (costs 1 credit)
 * @access  Private
 */
router.post('/generate-linkedin-bio', asyncHandler(generateLinkedInBio));

/**
 * @route   POST /api/ai/interview-prep
 * @desc    Generate interview questions (costs 1 credit)
 * @access  Private
 */
router.post('/interview-prep', asyncHandler(generateInterviewPrep));

/**
 * @route   POST /api/ai/analyze-communication
 * @desc    Analyze writing sample (costs 1 credit)
 * @access  Private
 */
router.post('/analyze-communication', asyncHandler(analyzeCommunication));

/**
 * @route   POST /api/ai/extract-keywords
 * @desc    Extract keywords from JD (free)
 * @access  Private
 */
router.post('/extract-keywords', asyncHandler(extractKeywords));

/**
 * @route   GET /api/ai/credits
 * @desc    Get remaining AI credits
 * @access  Private
 */
router.get('/credits', asyncHandler(getCredits));

export default router;
