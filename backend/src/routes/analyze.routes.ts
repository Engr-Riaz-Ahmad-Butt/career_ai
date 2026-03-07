import { Router } from 'express';
import { authenticate, requireCredits } from '../middleware/auth';
import { analyzeCommunicationAI, listAnalyses, getAnalysis } from '../controllers/communication.controller';
import { validate } from '../middleware/validate';
import { analyzeCommunicationSchema, paginationSchema } from '../utils/validation';

const router = Router();
router.use(authenticate);

router.post('/communication', validate(analyzeCommunicationSchema), requireCredits(1), analyzeCommunicationAI);
router.get('/communication/history', validate(paginationSchema, 'query'), listAnalyses);
router.get('/communication/:id', getAnalysis);

export default router;

