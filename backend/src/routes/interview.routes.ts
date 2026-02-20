import { Router } from 'express';
import { authenticate, requireCredits } from '../middleware/auth';
import { generateSession, listSessions, getSession, submitFeedback, deleteSession } from '../controllers/interview.controller';

const router = Router();
router.use(authenticate);

router.post('/generate', requireCredits(2), generateSession);
router.get('/', listSessions);
router.get('/:id', getSession);
router.post('/:id/feedback', requireCredits(1), submitFeedback);
router.delete('/:id', deleteSession);

export default router;
