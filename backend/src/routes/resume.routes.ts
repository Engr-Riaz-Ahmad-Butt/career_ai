import { Router } from 'express';
import {
  listResumes, createResume, getResume, updateResume, deleteResume,
  duplicateResume, generatePdf, listVersions, restoreVersion, uploadResume,
  extractResume, optimizeResume,
} from '../controllers/resume.controller';
import { tailorResume, getTailorHistory, getTailored, deleteTailored } from '../controllers/tailoring.controller';
import { enhanceResume, scoreAts } from '../controllers/ai.controller';
import { authenticate, requireCredits, requireCreditsForAction } from '../middleware/auth';
// Upload resume: FILE_UPLOAD_PARSE costs proportional to user plan
router.post('/upload', resumeUpload.single('file'), requireCreditsForAction('FILE_UPLOAD_PARSE'), uploadResume);
// Tailor resume content: calculated based on plan
router.post('/tailor', validate(tailorResumeSchema), requireCreditsForAction('RESUME_TAILOR'), tailorResume);
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
router.post('/upload', resumeUpload.single('file'), requireCredits(2), uploadResume);

// Tailoring sub-routes
router.post('/tailor', validate(tailorResumeSchema), requireCredits(3), tailorResume);
router.get('/tailor/history', getTailorHistory);
router.get('/tailor/:id', getTailored);
router.delete('/tailor/:id', deleteTailored);

// CRUD
router.get('/', validate(paginationSchema, 'query'), listResumes);
router.post('/', validate(createResumeSchema), createResume);
// Enhance resume content with AI: calculated based on plan+router.post('/:id/enhance', requireCreditsForAction('RESUME_ENHANCE'), enhanceResume);
router.get('/:id', getResume);
router.put('/:id', validate(updateResumeSchema), updateResume);
router.delete('/:id', deleteResume);

// Actions on a specific resume
router.post('/:id/duplicate', duplicateResume);
router.post('/:id/pdf', generatePdf);
router.get('/:id/versions', listVersions);
router.post('/:id/restore/:versionId', restoreVersion);
router.post('/:id/enhance', requireCredits(2), enhanceResume);
router.post('/:id/ats-score', requireCreditsForAction('ATS_SCORE'), scoreAts);
// Optimize resume for ATS: calculated based on plan+router.post('/:id/optimize', requireCreditsForAction('RESUME_IMPROVE'), optimizeResume);
// Extract resume data from file: calculated based on plan
router.post('/extract', resumeUpload.single('file'), requireCreditsForAction('FILE_UPLOAD_PARSE'), extractResume);
router.post('/:id/optimize', requireCredits(3), optimizeResume);

// Multi-step & Extraction
router.post('/extract', resumeUpload.single('file'), requireCredits(2), extractResume);

export default router;

