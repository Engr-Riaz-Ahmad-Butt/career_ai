import { Router } from 'express';
import { authenticate, requireCredits } from '../middleware/auth';
import { analyzeCommunicationAI, listAnalyses, getAnalysis } from '../controllers/communication.controller';

const router = Router();
router.use(authenticate);

router.post('/communication', requireCredits(1), analyzeCommunicationAI);
router.get('/communication/history', listAnalyses);
router.get('/communication/:id', getAnalysis);

export default router;
