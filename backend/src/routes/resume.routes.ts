import { Router } from 'express';
import {
  listResumes, createResume, getResume, updateResume, deleteResume,
  duplicateResume, generatePdf, listVersions, restoreVersion, uploadResume,
  extractResume, optimizeResume,
} from '@/controllers/resume.controller';
import { tailorResume, getTailorHistory, getTailored, deleteTailored } from '@/controllers/tailoring.controller';
import { enhanceResume, scoreAts } from '@/controllers/ai.controller';
import { authenticate, requireCreditsForAction } from '@/middleware/auth';
import { uploadRateLimit } from '@/middleware/userRateLimit';
import { uploadResume as resumeUpload, validateResumeMagicBytes } from '@/middleware/upload';
import { validate } from '@/middleware/validate';
import {
  createResumeSchema,
  updateResumeSchema,
  tailorResumeSchema,
  paginationSchema
} from '@/utils/validation';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /resumes/upload:
 *   post:
 *     summary: Upload a PDF or DOCX and parse it into a resume
 *     tags: [Resumes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resume parsed and created (costs 1 credit)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       402:
 *         $ref: '#/components/responses/InsufficientCredits'
 *       429:
 *         description: Upload rate limit exceeded (20/hr per user)
 */
// Upload (before /:id routes) — rate limited to 20 uploads/hour per user
router.post('/upload', uploadRateLimit, resumeUpload.single('file'), validateResumeMagicBytes, requireCreditsForAction('FILE_UPLOAD_PARSE'), uploadResume);

// Tailoring sub-routes
router.post('/tailor', validate(tailorResumeSchema), requireCreditsForAction('RESUME_TAILOR'), tailorResume);
router.get('/tailor/history', getTailorHistory);
router.get('/tailor/:id', getTailored);
router.delete('/tailor/:id', deleteTailored);

/**
 * @swagger
 * /resumes:
 *   get:
 *     summary: List all resumes for the authenticated user
 *     tags: [Resumes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: updatedAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Paginated list of resumes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', validate(paginationSchema, 'query'), listResumes);

/**
 * @swagger
 * /resumes:
 *   post:
 *     summary: Create a new blank resume
 *     tags: [Resumes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResumeRequest'
 *     responses:
 *       201:
 *         description: Resume created (costs 1 credit)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       402:
 *         $ref: '#/components/responses/InsufficientCredits'
 */
router.post('/', validate(createResumeSchema), createResume);

/**
 * @swagger
 * /resumes/{id}:
 *   get:
 *     summary: Get a resume by ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Resume data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', getResume);

/**
 * @swagger
 * /resumes/{id}:
 *   put:
 *     summary: Update resume content (snapshots previous version)
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Partial resume fields (title, summary, experience, education, skills, styling, etc.)
 *     responses:
 *       200:
 *         description: Updated resume
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', validate(updateResumeSchema), updateResume);

/**
 * @swagger
 * /resumes/{id}:
 *   delete:
 *     summary: Permanently delete a resume
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Resume deleted
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', deleteResume);

/**
 * @swagger
 * /resumes/{id}/duplicate:
 *   post:
 *     summary: Duplicate a resume
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Duplicate resume created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 */
router.post('/:id/duplicate', duplicateResume);

/**
 * @swagger
 * /resumes/{id}/pdf:
 *   post:
 *     summary: Generate a PDF download URL for the resume
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: PDF URL generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pdfUrl:
 *                   type: string
 *                   format: uri
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 */
router.post('/:id/pdf', generatePdf);

/**
 * @swagger
 * /resumes/{id}/versions:
 *   get:
 *     summary: List up to 5 recent version snapshots
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of version snapshots
 */
router.get('/:id/versions', listVersions);

/**
 * @swagger
 * /resumes/{id}/restore/{versionId}:
 *   post:
 *     summary: Restore a resume to a previous version snapshot
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: versionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Resume restored to selected version
 */
router.post('/:id/restore/:versionId', restoreVersion);

router.post('/:id/enhance', requireCreditsForAction('RESUME_ENHANCE'), enhanceResume);
router.post('/:id/ats-score', requireCreditsForAction('ATS_SCORE'), scoreAts);
router.post('/extract', resumeUpload.single('file'), validateResumeMagicBytes, requireCreditsForAction('FILE_UPLOAD_PARSE'), extractResume);
router.post('/:id/optimize', requireCreditsForAction('RESUME_IMPROVE'), optimizeResume);

export default router;
