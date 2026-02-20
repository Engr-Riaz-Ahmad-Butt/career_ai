import { z } from 'zod';

// Auth Schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const googleAuthSchema = z.object({
  token: z.string().min(1, 'Google token is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
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
});

export const updateResumeSchema = createResumeSchema.partial();

export const tailorResumeSchema = z.object({
  resumeId: z.string().uuid('Invalid resume ID'),
  jobDescription: z.string().min(50, 'Job description too short'),
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

// User Profile Schema
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

// Pagination Schema
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional().default('10'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
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
