import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getDashboard, getRecentDocuments, getDashboardStats, getActivityFeed } from '../controllers/dashboard.controller';

const router = Router();
router.use(authenticate);

router.get('/', getDashboard);
router.get('/recent', getRecentDocuments);
router.get('/stats', getDashboardStats);
router.get('/activity', getActivityFeed);

export default router;
