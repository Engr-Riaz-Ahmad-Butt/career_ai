import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { getBalance, getHistory, applyReferral, getCosts } from '@/controllers/credits.controller';
import { validate } from '@/middleware/validate';
import { referralSchema, paginationSchema } from '@/utils/validation';

const router = Router();

// GET /credits/costs (public)
router.get('/costs', getCosts);

router.use(authenticate);

// GET /credits/balance
router.get('/balance', getBalance);

// GET /credits/history
router.get('/history', validate(paginationSchema, 'query'), getHistory);

// POST /credits/referral/apply
router.post('/referral/apply', validate(referralSchema), applyReferral);

export default router;

