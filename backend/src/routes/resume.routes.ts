import { Router } from 'express';
import {
  listResumes, createResume, getResume, updateResume, deleteResume,
  duplicateResume, generatePdf, listVersions, restoreVersion, uploadResume,
  extractResume, optimizeResume,
} from '../controllers/resume.controller';
import { tailorResume, getTailorHistory, getTailored, deleteTailored } from '../controllers/tailoring.controller';
import { enhanceResume, scoreAts } from '../controllers/ai.controller';
import { authenticate, requireCredits } from '../middleware/auth';
import { uploadResume as resumeUpload } from '../middleware/upload';

const router = Router();
router.use(authenticate);

// Upload (before /:id routes)
router.post('/upload', resumeUpload.single('file'), requireCredits(2), uploadResume);

// Tailoring sub-routes
router.post('/tailor', requireCredits(3), tailorResume);
router.get('/tailor/history', getTailorHistory);
router.get('/tailor/:id', getTailored);
router.delete('/tailor/:id', deleteTailored);

// CRUD
router.get('/', listResumes);
router.post('/', requireCredits(1), createResume);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

// Actions on a specific resume
router.post('/:id/duplicate', duplicateResume);
router.post('/:id/pdf', generatePdf);
router.get('/:id/versions', listVersions);
router.post('/:id/restore/:versionId', restoreVersion);
router.post('/:id/enhance', requireCredits(2), enhanceResume);
router.post('/:id/ats-score', requireCredits(1), scoreAts);
router.post('/:id/optimize', requireCredits(3), optimizeResume);

// Multi-step & Extraction
router.post('/extract', resumeUpload.single('file'), requireCredits(2), extractResume);

export default router;
