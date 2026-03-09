import { Router } from 'express';
import {
  listResumes, createResume, getResume, updateResume, deleteResume,
  duplicateResume, generatePdf, listVersions, restoreVersion, uploadResume,
  extractResume, optimizeResume,
} from '../controllers/resume.controller';
import { tailorResume, getTailorHistory, getTailored, deleteTailored } from '../controllers/tailoring.controller';
import { enhanceResume, scoreAts } from '../controllers/ai.controller';
import { authenticate, requireCreditsForAction } from '../middleware/auth';
import { uploadResume as resumeUpload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import {
  createResumeSchema,
  updateResumeSchema,
  tailorResumeSchema,
  paginationSchema
} from '../utils/validation';

const router = Router();
router.use(authenticate);

// Upload (before /:id routes)
router.post('/upload', resumeUpload.single('file'), requireCreditsForAction('FILE_UPLOAD_PARSE'), uploadResume);

// Tailoring sub-routes
router.post('/tailor', validate(tailorResumeSchema), requireCreditsForAction('RESUME_TAILOR'), tailorResume);
router.get('/tailor/history', getTailorHistory);
router.get('/tailor/:id', getTailored);
router.delete('/tailor/:id', deleteTailored);

// CRUD
router.get('/', validate(paginationSchema, 'query'), listResumes);
router.post('/', validate(createResumeSchema), createResume);
router.get('/:id', getResume);
router.put('/:id', validate(updateResumeSchema), updateResume);
router.delete('/:id', deleteResume);

// Actions on a specific resume
router.post('/:id/duplicate', duplicateResume);
router.post('/:id/pdf', generatePdf);
router.get('/:id/versions', listVersions);
router.post('/:id/restore/:versionId', restoreVersion);
router.post('/:id/enhance', requireCreditsForAction('RESUME_ENHANCE'), enhanceResume);
router.post('/:id/ats-score', requireCreditsForAction('ATS_SCORE'), scoreAts);
router.post('/extract', resumeUpload.single('file'), requireCreditsForAction('FILE_UPLOAD_PARSE'), extractResume);
router.post('/:id/optimize', requireCreditsForAction('RESUME_IMPROVE'), optimizeResume);

export default router;

