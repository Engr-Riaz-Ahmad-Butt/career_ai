import { Router } from 'express';
import {
    listDocuments, getDocument, updateDocument, deleteDocument, generateDocPdf, duplicateDocument,
    generateCoverLetter, regenerateCoverLetter,
    generateSOP, generateMotivationLetter, generateStudyPlan, generateFinancialLetter, generateBio,
} from '@/controllers/document.controller';
import { authenticate, requireCredits, requireCreditsForAction } from '@/middleware/auth';

// ── AI Generation endpoints ───────────────────────────────────────────────
import { validate } from '@/middleware/validate';
import {
    coverLetterSchema,
    sopSchema,
    motivationSchema,
    studyPlanSchema,
    financialLetterSchema,
    bioSchema,
    createDocumentSchema,
    updateDocumentSchema,
    paginationSchema
} from '@/utils/validation';

const router = Router();
router.use(authenticate);

// ── AI Generation endpoints ───────────────────────────────────────────────
router.post('/cover-letter/generate', validate(coverLetterSchema), requireCreditsForAction('COVER_LETTER_GENERATE'), generateCoverLetter);
router.post('/cover-letter/:id/regenerate', requireCreditsForAction('COVER_LETTER_GENERATE'), regenerateCoverLetter);
router.post('/sop/generate', validate(sopSchema), requireCreditsForAction('SOP_GENERATE'), generateSOP);
router.post('/motivation-letter/generate', validate(motivationSchema), requireCreditsForAction('MOTIVATION_LETTER_GENERATE'), generateMotivationLetter);
router.post('/study-plan/generate', validate(studyPlanSchema), requireCreditsForAction('SCHOLARSHIP_GENERATE'), generateStudyPlan);
router.post('/financial-letter/generate', validate(financialLetterSchema), requireCreditsForAction('RECOMMENDATION_GENERATE'), generateFinancialLetter);
router.post('/bio/generate', validate(bioSchema), requireCreditsForAction('BIO_GENERATE'), generateBio);

// ── Universal CRUD ────────────────────────────────────────────────────────
router.get('/', validate(paginationSchema, 'query'), listDocuments);
router.get('/:id', getDocument);
router.put('/:id', validate(updateDocumentSchema), updateDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/pdf', generateDocPdf);
router.post('/:id/duplicate', duplicateDocument);

// ── Cover letter sub-routes (Spec Section 5) ─────────────────────────────
router.get('/cover-letter', validate(paginationSchema, 'query'), listDocuments);
router.get('/cover-letter/:id', getDocument);
router.put('/cover-letter/:id', validate(updateDocumentSchema), updateDocument);
router.delete('/cover-letter/:id', deleteDocument);
router.post('/cover-letter/:id/pdf', generateDocPdf);

export default router;

