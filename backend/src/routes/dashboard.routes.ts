import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { getDashboard, getRecentDocuments, getDashboardStats, getActivityFeed } from '@/controllers/dashboard.controller';
import { validate } from '@/middleware/validate';
import { paginationSchema } from '@/utils/validation';

const router = Router();
router.use(authenticate);

router.get('/', getDashboard);
router.get('/recent', getRecentDocuments);
router.get('/stats', getDashboardStats);
router.get('/activity', validate(paginationSchema, 'query'), getActivityFeed);

export default router;

