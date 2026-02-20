import { Router } from 'express';
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
  exportResume,
  uploadResume,
} from '../controllers/resume.controller';
import { authenticate, requireCredits } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { asyncHandler } from '../middleware/error';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/resumes
 * @desc    Create new resume
 * @access  Private
 */
router.post('/', requireCredits(1), asyncHandler(createResume));

/**
 * @route   GET /api/resumes
 * @desc    Get all resumes
 * @access  Private
 */
router.get('/', asyncHandler(getResumes));

/**
 * @route   GET /api/resumes/:id
 * @desc    Get resume by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(getResumeById));

/**
 * @route   PUT /api/resumes/:id
 * @desc    Update resume
 * @access  Private
 */
router.put('/:id', asyncHandler(updateResume));

/**
 * @route   DELETE /api/resumes/:id
 * @desc    Delete resume
 * @access  Private
 */
router.delete('/:id', asyncHandler(deleteResume));

/**
 * @route   POST /api/resumes/:id/duplicate
 * @desc    Duplicate resume
 * @access  Private
 */
router.post('/:id/duplicate', asyncHandler(duplicateResume));

/**
 * @route   GET /api/resumes/:id/export
 * @desc    Export resume (PDF/DOCX)
 * @access  Private
 */
router.get('/:id/export', asyncHandler(exportResume));


/**
 * @route   POST /api/resumes/upload
 * @desc    Upload resume file
 * @access  Private
 */
router.post('/upload', upload.single('resume'), asyncHandler(uploadResume));

export default router;
