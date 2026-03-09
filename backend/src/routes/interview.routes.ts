import { Router } from 'express';
import { authenticate, requireCredits, requireCreditsForAction } from '../middleware/auth';
import { generateSession, listSessions, getSession, submitFeedback, deleteSession } from '../controllers/interview.controller';
import { validate } from '../middleware/validate';
import { generateInterviewSchema, interviewFeedbackSchema, paginationSchema } from '../utils/validation';

const router = Router();
router.use(authenticate);

router.post('/generate', validate(generateInterviewSchema), requireCreditsForAction('INTERVIEW_GENERATE'), generateSession);
router.get('/', validate(paginationSchema, 'query'), listSessions);
router.get('/:id', getSession);
router.post('/:id/feedback', validate(interviewFeedbackSchema), requireCreditsForAction('COMMUNICATION_ANALYZE'), submitFeedback);
router.delete('/:id', deleteSession);

export default router;

