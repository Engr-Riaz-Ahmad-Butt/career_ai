import { z } from 'zod';

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
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Resume Schemas
export const personalInfoSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional().or(z.literal('')),
    portfolio: z.string().optional().or(z.literal('')),
});

export const experienceSchema = z.object({
    id: z.string(),
    position: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company is required'),
    location: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string(),
    currentlyWorking: z.boolean().optional(),
    description: z.string(),
    achievements: z.array(z.string()),
});

export const educationSchema = z.object({
    id: z.string(),
    degree: z.string().min(1, 'Degree is required'),
    school: z.string().min(1, 'School is required'),
    field: z.string().optional().default(''),
    location: z.string().optional().default(''),
    startDate: z.string().optional().default(''),
    endDate: z.string().optional().default(''),
    gpa: z.string().optional().default(''),
    description: z.string().optional().default(''),
});

export const createResumeSchema = z.object({
    title: z.string().min(1, 'Project title is required').max(255),
    template: z.string().optional().default('modern'),
    personalInfo: personalInfoSchema.optional(),
    summary: z.string().optional(),
    experience: z.array(experienceSchema).optional(),
    education: z.array(educationSchema).optional(),
    skills: z.object({
        technical: z.array(z.string()),
        soft: z.array(z.string()),
    }).optional(),
});

export const updateProfileSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    bio: z.string().optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// API Query Params
export const getResumesParamsSchema = z.object({
    page: z.number().positive().optional(),
    limit: z.number().positive().optional(),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
}).strict();

export const getDocumentsParamsSchema = z.object({
    page: z.number().positive().optional(),
    limit: z.number().positive().optional(),
    type: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
}).strict();

export const getSettingsParamsSchema = z.object({
    category: z.string().optional(),
}).strict();

type ResumeParams = z.infer<typeof getResumesParamsSchema>;
type DocumentParams = z.infer<typeof getDocumentsParamsSchema>;
type SettingsParams = z.infer<typeof getSettingsParamsSchema>;

// Document Schemas
export const generateCoverLetterSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    jobDescription: z.string().min(10, 'Job description is required'),
    companyName: z.string().optional(),
    targetRole: z.string().optional(),
});

export const generateSOPSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    programName: z.string().min(1, 'Program name is required'),
    targetRole: z.string().optional(),
    motivation: z.string().optional(),
});

export const generateMotivationLetterSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    companyName: z.string().min(1, 'Company name is required'),
    targetRole: z.string().optional(),
    motivation: z.string().optional(),
});

export const generateStudyPlanSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    programName: z.string().min(1, 'Program name is required'),
    duration: z.number().positive().optional(),
});

export const generateFinancialLetterSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    amount: z.number().positive(),
    currency: z.string().min(1),
});

export const generateBioSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    platform: z.enum(['linkedin', 'twitter', 'instagram']).optional(),
});

// Portfolio Schemas
export const generatePortfolioSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    projectIds: z.array(z.string()).optional(),
    theme: z.string().optional(),
});

// AI Schemas
export const generateResumeSchema = z.object({
    jobTitle: z.string().min(1, 'Job title is required'),
    experience: z.string().min(10).optional(),
    skills: z.array(z.string()).optional(),
    education: z.string().optional(),
});

export const tailorResumeSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    jobDescription: z.string().min(10, 'Job description is required'),
});

export const improveResumeSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    focusArea: z.enum(['keywords', 'formatting', 'content']).optional(),
});

export const analyzeATSSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    jobDescription: z.string().optional(),
});

export const generateInterviewPrepSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    jobDescription: z.string().min(10, 'Job description is required'),
    jobTitle: z.string().min(1, 'Job title is required'),
    numberOfQuestions: z.number().positive().optional().default(10),
});

export type { ResumeParams, DocumentParams, SettingsParams };
