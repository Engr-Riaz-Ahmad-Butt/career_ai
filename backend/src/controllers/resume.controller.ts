import { Request, Response } from 'express';
import { resumeService } from '../services/resume.service';
import { ApiError } from '../middleware/error';
import {
  createResumeSchema,
  updateResumeSchema,
  paginationSchema,
} from '../utils/validation';

/**
 * @route   POST /api/resumes
 * @desc    Create a new resume
 * @access  Private
 */
export const createResume = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const validatedData = createResumeSchema.parse(req.body);
  const resume = await resumeService.createResume(req.user.userId, {
    title: validatedData.title,
    template: validatedData.template || 'modern',
    personalInfo: validatedData.personalInfo || {},
    summary: validatedData.summary || {},
    experience: validatedData.experience || [],
    education: validatedData.education || [],
    skills: validatedData.skills || [],
  });

  res.status(201).json({
    success: true,
    message: 'Resume created successfully',
    data: { resume },
  });
};

/**
 * @route   GET /api/resumes
 * @desc    Get all resumes for current user
 * @access  Private
 */
export const getResumes = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { page, limit, sortBy, sortOrder } = paginationSchema.parse(req.query);
  const skip = (Number(page) - 1) * Number(limit);

  const { resumes, total } = await resumeService.getResumes(req.user.userId, {
    skip,
    take: Number(limit),
    sortBy,
    sortOrder: sortOrder as any,
  });

  res.json({
    success: true,
    data: {
      resumes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
};

/**
 * @route   GET /api/resumes/:id
 * @desc    Get single resume by ID
 * @access  Private
 */
export const getResumeById = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const resume = await resumeService.getResumeById(req.user.userId, req.params.id);

  res.json({
    success: true,
    data: { resume },
  });
};

/**
 * @route   PUT /api/resumes/:id
 * @desc    Update resume
 * @access  Private
 */
export const updateResume = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const validatedData = updateResumeSchema.parse(req.body);
  const resume = await resumeService.updateResume(req.user.userId, req.params.id, validatedData);

  res.json({
    success: true,
    message: 'Resume updated successfully',
    data: { resume },
  });
};

/**
 * @route   DELETE /api/resumes/:id
 * @desc    Delete resume
 * @access  Private
 */
export const deleteResume = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  await resumeService.deleteResume(req.user.userId, req.params.id);

  res.json({
    success: true,
    message: 'Resume deleted successfully',
  });
};

/**
 * @route   POST /api/resumes/:id/duplicate
 * @desc    Duplicate a resume
 * @access  Private
 */
export const duplicateResume = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const duplicate = await resumeService.duplicateResume(req.user.userId, req.params.id);

  res.status(201).json({
    success: true,
    message: 'Resume duplicated successfully',
    data: { resume: duplicate },
  });
};

/**
 * @route   POST /api/resumes/upload
 * @desc    Upload an existing resume (PDF/DOCX)
 * @access  Private
 */
export const uploadResume = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const result = await resumeService.uploadResume(req.user.userId, req.file);

  res.status(201).json({
    success: true,
    message: 'Resume uploaded successfully',
    data: result,
  });
};

/**
 * @route   GET /api/resumes/:id/export
 * @desc    Export resume as PDF/DOCX
 * @access  Private
 */
export const exportResume = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const resume = await resumeService.getResumeById(req.user.userId, req.params.id);
  const format = req.query.format || 'pdf';

  // TODO: Implement actual PDF/DOCX generation logic in ResumeService

  res.json({
    success: true,
    message: `Resume export as ${format} will be implemented`,
    data: { resume },
  });
};
