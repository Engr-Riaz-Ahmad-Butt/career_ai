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
    linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    portfolio: z.string().url('Invalid Website URL').optional().or(z.literal('')),
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
    field: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    gpa: z.string(),
    description: z.string(),
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
