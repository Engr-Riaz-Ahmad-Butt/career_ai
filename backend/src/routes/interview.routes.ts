import { Router } from 'express';
import { authenticate, requireCredits } from '../middleware/auth';
import { generateSession, listSessions, getSession, submitFeedback, deleteSession } from '../controllers/interview.controller';
import { validate } from '../middleware/validate';
import { generateInterviewSchema, interviewFeedbackSchema, paginationSchema } from '../utils/validation';

const router = Router();
router.use(authenticate);

router.post('/generate', validate(generateInterviewSchema), requireCredits(2), generateSession);
router.get('/', validate(paginationSchema, 'query'), listSessions);
router.get('/:id', getSession);
router.post('/:id/feedback', validate(interviewFeedbackSchema), requireCredits(1), submitFeedback);
router.delete('/:id', deleteSession);

export default router;

