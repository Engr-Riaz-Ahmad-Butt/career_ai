import { Router } from 'express';
import {
  streamEnhanceResume,
  streamATSScore,
  streamGenerateDocument,
  streamGenerateInterview,
  streamPing,
} from '../controllers/streaming.controller';
import { authenticate, requireCreditsForAction } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/ping', streamPing);
router.get('/enhance-resume/:resumeId', requireCreditsForAction('RESUME_ENHANCE'), streamEnhanceResume);
router.post('/ats-score/:resumeId', requireCreditsForAction('ATS_SCORE'), streamATSScore);
router.post('/document/generate', requireCreditsForAction('COVER_LETTER_GENERATE'), streamGenerateDocument);
router.get('/interview/generate', requireCreditsForAction('INTERVIEW_GENERATE'), streamGenerateInterview);

export default router;
