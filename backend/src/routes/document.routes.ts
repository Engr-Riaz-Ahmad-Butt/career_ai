import { Router } from 'express';
import {
    listDocuments, getDocument, updateDocument, deleteDocument, generateDocPdf, duplicateDocument,
    generateCoverLetter, regenerateCoverLetter,
    generateSOP, generateMotivationLetter, generateStudyPlan, generateFinancialLetter, generateBio,
} from '../controllers/document.controller';
import { authenticate, requireCredits } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// ── AI Generation endpoints ───────────────────────────────────────────────
router.post('/cover-letter/generate', requireCredits(2), generateCoverLetter);
router.post('/cover-letter/:id/regenerate', requireCredits(2), regenerateCoverLetter);
router.post('/sop/generate', requireCredits(3), generateSOP);
router.post('/motivation-letter/generate', requireCredits(2), generateMotivationLetter);
router.post('/study-plan/generate', requireCredits(2), generateStudyPlan);
router.post('/financial-letter/generate', requireCredits(2), generateFinancialLetter);
router.post('/bio/generate', requireCredits(1), generateBio);

// ── Universal CRUD ────────────────────────────────────────────────────────
router.get('/', listDocuments);
router.get('/:id', getDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/pdf', generateDocPdf);
router.post('/:id/duplicate', duplicateDocument);

// ── Cover letter sub-routes (Spec Section 5) ─────────────────────────────
router.get('/cover-letter', listDocuments);
router.get('/cover-letter/:id', getDocument);
router.put('/cover-letter/:id', updateDocument);
router.delete('/cover-letter/:id', deleteDocument);
router.post('/cover-letter/:id/pdf', generateDocPdf);

export default router;
