import { Router } from 'express';
import {
  enqueueResumePdfJob,
  enqueueAtsScoreJob,
  getJobStatus,
  listMyJobs,
  jobQueueHealth,
} from '../controllers/job.controller';
import { authenticate, requireCreditsForAction } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/health', jobQueueHealth);
router.get('/mine', listMyJobs);
router.post('/resume/:id/pdf', enqueueResumePdfJob);
router.post('/resume/:id/ats-score', requireCreditsForAction('ATS_SCORE'), enqueueAtsScoreJob);
router.get('/:jobId', getJobStatus);

export default router;
