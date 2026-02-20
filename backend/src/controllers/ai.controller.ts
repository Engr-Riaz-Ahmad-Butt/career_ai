import { Request, Response } from 'express';
import { ApiError } from '../middleware/error';
import aiService from '../services/ai/aiService';
import prisma from '../config/database';

/**
 * @route   POST /api/ai/generate-resume
 * @desc    Generate resume from scratch using AI
 * @access  Private (costs 2 credits)
 */
export const generateResume = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { name, email, phone, targetRole, experience, education, skills, additionalInfo } =
    req.body;

  // Check credits
  const hasCredits = await aiService.checkCredits(req.user.userId, 2);
  if (!hasCredits) {
    throw new ApiError(403, 'Insufficient AI credits');
  }

  // Generate resume
  const result = await aiService.generateResume(
    {
      name,
      email,
      phone,
      targetRole,
      experience,
      education,
      skills,
      additionalInfo,
    },
    req.user.userId
  );

  res.json({
    success: true,
    message: 'Resume generated successfully',
    data: result,
    creditsUsed: 2,
  });
};

/**
 * @route   POST /api/ai/tailor-resume
 * @desc    Tailor resume for specific job description
 * @access  Private (costs 2 credits)
 */
export const tailorResume = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { resumeId, jobDescription } = req.body;

  if (!resumeId || !jobDescription) {
    throw new ApiError(400, 'Resume ID and job description are required');
  }

  // Check credits
  const hasCredits = await aiService.checkCredits(req.user.userId, 2);
  if (!hasCredits) {
    throw new ApiError(403, 'Insufficient AI credits');
  }

  // Get resume
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: req.user.userId,
    },
  });

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  // Tailor resume
  const result = await aiService.tailorResume(
    {
      resume,
      jobDescription,
    },
    req.user.userId
  );

  // Create new version
  await prisma.resume.create({
    data: {
      userId: req.user.userId,
      title: `${resume.title} (Tailored)`,
      template: resume.template,
      ...result.tailoredResume,
      isTailored: true,
      atsScore: result.atsScore || null,
    },
  });

  res.json({
    success: true,
    message: 'Resume tailored successfully',
    data: result,
    creditsUsed: 2,
  });
};

/**
 * @route   POST /api/ai/improve-resume
 * @desc    Get AI suggestions to improve uploaded resume
 * @access  Private (costs 1 credit)
 */
export const improveResume = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { resumeText } = req.body;

  if (!resumeText || resumeText.length < 100) {
    throw new ApiError(400, 'Please provide resume text (minimum 100 characters)');
  }

  // Check credits
  const hasCredits = await aiService.checkCredits(req.user.userId, 1);
  if (!hasCredits) {
    throw new ApiError(403, 'Insufficient AI credits');
  }

  const result = await aiService.improveResume(resumeText, req.user.userId);

  res.json({
    success: true,
    message: 'Resume analysis complete',
    data: result,
    creditsUsed: 1,
  });
};

/**
 * @route   POST /api/ai/analyze-ats
 * @desc    Calculate ATS score for resume
 * @access  Private (free)
 */
export const analyzeATS = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { resumeId, jobDescription } = req.body;

  if (!resumeId) {
    throw new ApiError(400, 'Resume ID is required');
  }

  // Get resume
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: req.user.userId,
    },
  });

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  const result = await aiService.analyzeATS(resume, jobDescription, req.user.userId);

  // Update resume with ATS score
  await prisma.resume.update({
    where: { id: resumeId },
    data: {
      atsScore: result.overall,
      keywordMatch: result.breakdown?.keywordMatch?.score,
      formatScore: result.breakdown?.formatting?.score,
      impactScore: result.breakdown?.impactScore?.score,
    },
  });

  res.json({
    success: true,
    message: 'ATS analysis complete',
    data: result,
  });
};

/**
 * @route   POST /api/ai/generate-cover-letter
 * @desc    Generate cover letter using AI
 * @access  Private (costs 1 credit)
 */
export const generateCoverLetter = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { resumeId, jobDescription, company, role, letterType } = req.body;

  // Check credits
  const hasCredits = await aiService.checkCredits(req.user.userId, 1);
  if (!hasCredits) {
    throw new ApiError(403, 'Insufficient AI credits');
  }

  // Get resume
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: req.user.userId,
    },
  });

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  const result = await aiService.generateCoverLetter(
    {
      resumeData: resume,
      jobDescription,
      company,
      role,
      letterType: letterType || 'job_application',
    },
    req.user.userId
  );

  // Save cover letter
  await prisma.document.create({
    data: {
      userId: req.user.userId,
      type: 'COVER_LETTER',
      title: `Cover Letter - ${company || role || 'Application'}`,
      content: result.fullLetter,
      metadata: {
        company,
        role,
        jobDescription,
      },
    },
  });

  res.json({
    success: true,
    message: 'Cover letter generated successfully',
    data: result,
    creditsUsed: 1,
  });
};

/**
 * @route   POST /api/ai/generate-sop
 * @desc    Generate Statement of Purpose for scholarship
 * @access  Private (costs 2 credits)
 */
export const generateSOP = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { personalInfo, targetProgram, university, background, goals, whyThisProgram } =
    req.body;

  // Check credits
  const hasCredits = await aiService.checkCredits(req.user.userId, 2);
  if (!hasCredits) {
    throw new ApiError(403, 'Insufficient AI credits');
  }

  const result = await aiService.generateSOP(
    {
      personalInfo,
      targetProgram,
      university,
      background,
      goals,
      whyThisProgram,
    },
    req.user.userId
  );

  // Save SOP
  await prisma.document.create({
    data: {
      userId: req.user.userId,
      type: 'SOP',
      title: `SOP - ${targetProgram} at ${university}`,
      content: result.fullSOP,
      metadata: {
        targetProgram,
        university,
      },
    },
  });

  res.json({
    success: true,
    message: 'Statement of Purpose generated successfully',
    data: result,
    creditsUsed: 2,
  });
};

/**
 * @route   POST /api/ai/generate-linkedin-bio
 * @desc    Generate LinkedIn bio and elevator pitch
 * @access  Private (costs 1 credit)
 */
export const generateLinkedInBio = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { resumeId, tone, targetAudience } = req.body;

  // Check credits
  const hasCredits = await aiService.checkCredits(req.user.userId, 1);
  if (!hasCredits) {
    throw new ApiError(403, 'Insufficient AI credits');
  }

  // Get resume
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: req.user.userId,
    },
  });

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  const result = await aiService.generateLinkedInBio(
    resume,
    tone || 'professional',
    targetAudience || 'recruiters',
    req.user.userId
  );

  // Save bio
  await prisma.document.create({
    data: {
      userId: req.user.userId,
      type: 'LINKEDIN_BIO',
      title: 'LinkedIn Bio',
      content: result.summary,
      metadata: {
        headline: result.headline,
        elevatorPitch: result.elevatorPitch,
      },
    },
  });

  res.json({
    success: true,
    message: 'LinkedIn bio generated successfully',
    data: result,
    creditsUsed: 1,
  });
};

/**
 * @route   POST /api/ai/interview-prep
 * @desc    Generate interview questions and answers
 * @access  Private (costs 1 credit)
 */
export const generateInterviewPrep = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { resumeId, jobDescription } = req.body;

  if (!jobDescription) {
    throw new ApiError(400, 'Job description is required');
  }

  // Check credits
  const hasCredits = await aiService.checkCredits(req.user.userId, 1);
  if (!hasCredits) {
    throw new ApiError(403, 'Insufficient AI credits');
  }

  // Get resume
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: req.user.userId,
    },
  });

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  const result = await aiService.generateInterviewQuestions(
    resume,
    jobDescription,
    req.user.userId
  );

  res.json({
    success: true,
    message: 'Interview preparation generated successfully',
    data: result,
    creditsUsed: 1,
  });
};

/**
 * @route   POST /api/ai/analyze-communication
 * @desc    Analyze professional writing sample
 * @access  Private (costs 1 credit)
 */
export const analyzeCommunication = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { writingSample } = req.body;

  if (!writingSample || writingSample.length < 100) {
    throw new ApiError(400, 'Please provide a writing sample (minimum 100 characters)');
  }

  // Check credits
  const hasCredits = await aiService.checkCredits(req.user.userId, 1);
  if (!hasCredits) {
    throw new ApiError(403, 'Insufficient AI credits');
  }

  const result = await aiService.analyzeCommunication(writingSample, req.user.userId);

  res.json({
    success: true,
    message: 'Communication analysis complete',
    data: result,
    creditsUsed: 1,
  });
};

/**
 * @route   POST /api/ai/extract-keywords
 * @desc    Extract keywords from job description
 * @access  Private (free)
 */
export const extractKeywords = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const { jobDescription } = req.body;

  if (!jobDescription) {
    throw new ApiError(400, 'Job description is required');
  }

  const result = await aiService.extractKeywords(jobDescription, req.user.userId);

  res.json({
    success: true,
    message: 'Keywords extracted successfully',
    data: result,
  });
};

/**
 * @route   GET /api/ai/credits
 * @desc    Get user's remaining AI credits
 * @access  Private
 */
export const getCredits = async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      credits: true,
      plan: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Get credit usage history
  const usage = await prisma.creditUsage.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  res.json({
    success: true,
    data: {
      credits: user.credits,
      plan: user.plan,
      unlimited: user.plan === 'PREMIUM' || user.plan === 'ENTERPRISE',
      recentUsage: usage,
    },
  });
};
