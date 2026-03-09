import { Router } from 'express';
import {
  streamEnhanceResume,
  streamATSScore,
  streamGenerateDocument,
  streamGenerateInterview,
  streamPing,
} from '../controllers/streaming.controller';
import { authenticateStream, requireCreditsForAction } from '../middleware/auth';

const router = Router();

router.use(authenticateStream);

router.get('/ping', streamPing);
router.get('/enhance-resume/:resumeId', requireCreditsForAction('RESUME_ENHANCE'), streamEnhanceResume);
router.get('/ats-score/:resumeId', requireCreditsForAction('ATS_SCORE'), streamATSScore);
router.post('/document/generate', requireCreditsForAction('COVER_LETTER_GENERATE'), streamGenerateDocument);
router.get('/interview/generate', requireCreditsForAction('INTERVIEW_GENERATE'), streamGenerateInterview);

export default router;
