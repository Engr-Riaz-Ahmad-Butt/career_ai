import { z } from 'zod';
import { PAGINATION } from '@/constants/pagination';

// Auth Schemas
export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  referralCode: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const googleAuthSchema = z.object({
  token: z.string().min(1, 'Google token is required'),
});

// ... existing code ...
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

// Resume Schemas
export const createResumeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  template: z.string().optional().default('modern'),
  personalInfo: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().url().optional(),
    website: z.string().url().optional(),
  }).optional(),
  summary: z.string().optional(),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
    achievements: z.array(z.string()).optional(),
  })).optional(),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  skills: z.array(z.object({
    category: z.string(),
    items: z.array(z.string()),
  })).optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string().optional(),
    date: z.string().optional(),
    url: z.string().url().optional(),
  })).optional(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    url: z.string().url().optional(),
    technologies: z.array(z.string()).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })).optional(),
  languages: z.array(z.object({
    language: z.string(),
    proficiency: z.string().optional(),
  })).optional(),
  styling: z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    fontFamily: z.string().max(64).optional(),
    fontSize: z.number().min(8).max(20).optional(),
    lineHeight: z.number().min(1).max(3).optional(),
    margins: z.object({
      top: z.number().min(0).max(100).optional(),
      bottom: z.number().min(0).max(100).optional(),
      left: z.number().min(0).max(100).optional(),
      right: z.number().min(0).max(100).optional(),
    }).optional(),
  }).optional(),
});

// updateResumeSchema only allows content fields — internal fields (userId, version, atsScore) are never updatable
export const updateResumeSchema = createResumeSchema
  .omit({ template: true })
  .extend({ template: z.string().optional() })
  .partial();

export const tailorResumeSchema = z.object({
  baseResumeId: z.string().uuid('Invalid resume ID'),
  jobDescription: z.string().min(50, 'Job description too short'),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  aggressiveness: z.enum(['subtle', 'moderate', 'aggressive']).optional(),
});

// AI Schemas
export const enhanceResumeSchema = z.object({
  section: z.enum(['summary', 'experience', 'skills', 'all']),
  targetRole: z.string().optional(),
  industry: z.string().optional(),
  stream: z.boolean().optional(),
});

export const atsScoreSchema = z.object({
  jobDescription: z.string().min(10, 'Job description too short'),
  returnSuggestions: z.boolean().optional().default(true),
});

export const aiSuggestionsSchema = z.object({
  section: z.string().min(1, 'Section is required'),
  targetRole: z.string().optional(),
});

export const extractKeywordsSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  maxKeywords: z.number().int().positive().optional().default(30),
  includeWeights: z.boolean().optional().default(false),
});

export const fixGrammarSchema = z.object({
  text: z.string().min(1, 'Text is required').max(10000),
  mode: z.enum(['grammar_only', 'grammar_and_style', 'full_rewrite']).optional().default('grammar_only'),
});

export const improveTextSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  tone: z.string().optional(),
  context: z.string().optional(),
});

// Document Schemas
export const createDocumentSchema = z.object({
  type: z.enum([
    'COVER_LETTER',
    'SOP',
    'MOTIVATION_LETTER',
    'RESIGNATION_LETTER',
    'LINKEDIN_BIO',
    'PORTFOLIO',
    'STUDY_PLAN',
    'FINANCIAL_LETTER',
  ]),
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  targetSchool: z.string().optional(),
});

export const coverLetterSchema = z.object({
  type: z.enum(['job_application', 'resignation', 'recommendation', 'acceptance', 'motivation', 'scholarship', 'networking']),
  resumeId: z.string().uuid().optional(),
  jobDescription: z.string().optional(),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  hiringManagerName: z.string().optional(),
  tone: z.enum(['professional', 'friendly', 'formal', 'enthusiastic']).optional(),
  wordLimit: z.number().int().positive().optional().default(350),
  keyPoints: z.array(z.string()).optional(),
  customContext: z.string().optional(),
  language: z.string().optional().default('en'),
  stream: z.boolean().optional(),
});

export const sopSchema = z.object({
  university: z.string().min(1, 'University is required'),
  program: z.string().min(1, 'Program is required'),
  country: z.string().optional(),
  resumeId: z.string().uuid().optional(),
  researchInterests: z.string().optional(),
  whyThisProgram: z.string().optional(),
  careerGoals: z.string().min(1, 'Career goals are required'),
  achievements: z.array(z.string()).optional(),
  challenges: z.string().optional(),
  wordLimit: z.number().int().positive().optional().default(800),
  scholarshipName: z.string().optional(),
  language: z.string().optional().default('en'),
  stream: z.boolean().optional(),
});

export const motivationSchema = z.object({
  university: z.string().min(1, 'University is required'),
  program: z.string().min(1, 'Program is required'),
  resumeId: z.string().uuid().optional(),
  personalBackground: z.string().optional(),
  motivation: z.string().min(1, 'Motivation is required'),
  careerGoals: z.string().min(1, 'Career goals are required'),
  wordLimit: z.number().int().positive().optional().default(600),
  stream: z.boolean().optional(),
});

export const studyPlanSchema = z.object({
  university: z.string().min(1, 'University is required'),
  program: z.string().min(1, 'Program is required'),
  duration: z.string().min(1, 'Duration is required'),
  currentQualification: z.string().min(1, 'Current qualification is required'),
  intendedCourses: z.array(z.string()).optional(),
  researchPlan: z.string().optional(),
  postStudyPlans: z.string().optional(),
  wordLimit: z.number().int().positive().optional().default(600),
});

export const financialLetterSchema = z.object({
  scholarshipName: z.string().min(1, 'Scholarship name is required'),
  university: z.string().min(1, 'University is required'),
  financialSituation: z.string().min(1, 'Financial situation is required'),
  supportingDetails: z.string().optional(),
  wordLimit: z.number().int().positive().optional().default(400),
});

export const bioSchema = z.object({
  bioType: z.enum(['linkedin', 'elevator_pitch', 'portfolio', 'twitter', 'speaker', 'executive']),
  resumeId: z.string().uuid().optional(),
  name: z.string().optional(),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  yearsOfExperience: z.number().int().nonnegative().optional(),
  keySkills: z.array(z.string()).optional(),
  tone: z.enum(['professional', 'casual', 'creative', 'academic']).optional(),
  wordLimit: z.number().int().positive().optional(),
  includeCallToAction: z.boolean().optional().default(false),
});

export const updateDocumentSchema = createDocumentSchema.partial().extend({
  id: z.string().uuid(),
});

// Job Schemas
export const createJobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().optional(),
  url: z.string().url().optional(),
  description: z.string().optional(),
  status: z.enum(['WISHLIST', 'APPLIED', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED']).optional(),
  deadline: z.string().datetime().optional(),
  salary: z.string().optional(),
  notes: z.string().optional(),
});

export const updateJobSchema = createJobSchema.partial().extend({
  id: z.string().uuid(),
});

export const updateJobStatusSchema = z.object({
  status: z.enum(['WISHLIST', 'APPLIED', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED']),
});

// Interview Schemas
export const generateInterviewSchema = z.object({
  resumeId: z.string().uuid('Invalid resume ID'),
  jobDescription: z.string().optional(),
  questionCount: z.number().int().min(1).max(30).optional().default(10),
  categories: z.array(z.string()).optional(),
  difficulty: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
  includeAnswerTips: z.boolean().optional().default(true),
});

export const interviewFeedbackSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  userAnswer: z.string().min(1, 'Answer cannot be empty'),
});

export const referralSchema = z.object({
  referralCode: z.string().min(1, 'Referral code is required'),
});

export const generatePortfolioSchema = z.object({
  resumeId: z.string().uuid('Invalid resume ID'),
  theme: z.enum(['minimal', 'modern', 'creative', 'dark', 'academic']).optional().default('modern'),
  customDomain: z.string().optional(),
  sections: z.array(z.string()).optional(),
  colorScheme: z.string().optional(),
});

export const updatePortfolioSchema = z.object({
  theme: z.string().optional(),
  sections: z.array(z.string()).optional(),
  colorScheme: z.string().optional(),
  customDomain: z.string().optional(),
});

export const analyzeCommunicationSchema = z.object({
  text: z.string().max(30000, 'Text too long (max 30,000 characters)'),
  context: z.enum(['email', 'cover_letter', 'bio', 'essay', 'general']).optional(),
  targetAudience: z.enum(['hiring_manager', 'professor', 'executive', 'general']).optional(),
});

// User Profile Schema
export const userUpdateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  currentRole: z.string().optional(),
  targetRole: z.string().optional(),
  industry: z.string().optional(),
  country: z.string().length(2).optional(), // ISO 3166 alpha-2
  preferences: z.object({
    defaultTemplate: z.string().optional(),
    language: z.string().optional(),
    notifications: z.boolean().optional(),
  }).optional(),
});

export const userChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// Admin Schemas
export const adminUpdatePlanSchema = z.object({
  plan: z.enum(['FREE', 'PRO', 'TEAM', 'ENTERPRISE']),
  reason: z.string().optional(),
});

export const adminAdjustCreditsSchema = z.object({
  amount: z.number().int(),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
});

export const adminBroadcastSchema = z.object({
  subject: z.string().min(5, 'Subject too short'),
  body: z.string().min(20, 'Body too short'),
  segment: z.enum(['all', 'free', 'pro', 'team', 'inactive']),
});
// Billing Schemas
export const checkoutSchema = z.object({
  plan: z.enum(['pro_monthly', 'pro_annual', 'team_monthly', 'enterprise']),
  successUrl: z.string().url('Invalid success URL'),
  cancelUrl: z.string().url('Invalid cancel URL'),
});

export const purchaseCreditsSchema = z.object({
  credits: z.number().positive().multipleOf(50, 'Credits must be multiple of 50'),
  successUrl: z.string().url('Invalid success URL'),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().max(PAGINATION.MAX_LIMIT).optional().default(PAGINATION.DEFAULT_LIMIT),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default(PAGINATION.DEFAULT_SORT_ORDER),
});

export type SignupInput = z.infer<typeof signupSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
