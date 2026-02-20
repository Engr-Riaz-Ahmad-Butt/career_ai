import { Request, Response } from 'express';
import prisma from '../config/database';
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

  const resume = await prisma.resume.create({
    data: {
      userId: req.user.userId,
      title: validatedData.title,
      template: validatedData.template || 'modern',
      personalInfo: validatedData.personalInfo || {},
      summary: validatedData.summary || {},
      experience: validatedData.experience || [],
      education: validatedData.education || [],
      skills: validatedData.skills || [],
    },
  });

  // Deduct credits
  await prisma.user.update({
    where: { id: req.user.userId },
    data: { credits: { decrement: 1 } },
  });

  // Log credit usage
  await prisma.creditUsage.create({
    data: {
      userId: req.user.userId,
      action: 'resume_create',
      credits: 1,
      metadata: { resumeId: resume.id },
    },
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

  const [resumes, total] = await Promise.all([
    prisma.resume.findMany({
      where: { userId: req.user.userId },
      skip,
      take: Number(limit),
      orderBy: sortBy
        ? { [sortBy]: sortOrder }
        : { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        template: true,
        atsScore: true,
        isTailored: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.resume.count({
      where: { userId: req.user.userId },
    }),
  ]);

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

  const resume = await prisma.resume.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.userId,
    },
  });

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

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

  // Check if resume exists and belongs to user
  const existingResume = await prisma.resume.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.userId,
    },
  });

  if (!existingResume) {
    throw new ApiError(404, 'Resume not found');
  }

  const resume = await prisma.resume.update({
    where: { id: req.params.id },
    data: validatedData,
  });

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

  const resume = await prisma.resume.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.userId,
    },
  });

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  await prisma.resume.delete({
    where: { id: req.params.id },
  });

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

  const original = await prisma.resume.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.userId,
    },
  });

  if (!original) {
    throw new ApiError(404, 'Resume not found');
  }

  const duplicate = await prisma.resume.create({
    data: {
      userId: req.user.userId,
      title: `${original.title} (Copy)`,
      template: original.template,
      personalInfo: original.personalInfo,
      summary: original.summary,
      experience: original.experience,
      education: original.education,
      skills: original.skills,
      certifications: original.certifications,
      projects: original.projects,
      languages: original.languages,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Resume duplicated successfully',
    data: { resume: duplicate },
  });
};

/**
 * @route   GET /api/resumes/:id/export
 * @desc    Export resume as PDF/DOCX
 * @access  Private
 */
export const exportResume = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const resume = await prisma.resume.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.userId,
    },
  });

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  const format = req.query.format || 'pdf';

  // TODO: Implement actual PDF/DOCX generation
  // For now, return the resume data

  res.json({
    success: true,
    message: `Resume export as ${format} will be implemented`,
    data: { resume },
  });
};
