import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '@/config/env';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'CareerForge AI API',
            version: '1.0.0',
            description:
                'REST API for CareerForge AI — AI-powered resume builder, career documents, and interview preparation.',
            contact: {
                name: 'CareerForge AI',
                url: env.FRONTEND_URL,
            },
            license: {
                name: 'MIT',
            },
        },
        servers: [
            {
                url: `${env.API_URL}/api/v1`,
                description: 'Current environment',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Access token obtained from POST /auth/login or POST /auth/refresh',
                },
            },
            schemas: {
                // ── Common ──────────────────────────────────────────────
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object' },
                    },
                },
                PaginatedResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: { type: 'array', items: {} },
                        total: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        totalPages: { type: 'integer' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        code: { type: 'string' },
                        details: { type: 'object' },
                    },
                },

                // ── Auth ─────────────────────────────────────────────────
                RegisterRequest: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'password'],
                    properties: {
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: {
                            type: 'string',
                            minLength: 8,
                            example: 'Password123!',
                            description: 'Must contain uppercase, lowercase, number, and special character',
                        },
                        referralCode: { type: 'string', example: 'A1B2C3D4' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                accessToken: { type: 'string' },
                                user: { $ref: '#/components/schemas/User' },
                            },
                        },
                    },
                },

                // ── User ──────────────────────────────────────────────────
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        email: { type: 'string', format: 'email' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        avatar: { type: 'string', format: 'uri' },
                        plan: { type: 'string', enum: ['FREE', 'PRO', 'TEAM', 'ENTERPRISE'] },
                        credits: { type: 'integer', minimum: 0 },
                        emailVerified: { type: 'boolean' },
                        onboardingComplete: { type: 'boolean' },
                        currentRole: { type: 'string' },
                        targetRole: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                // ── Resume ────────────────────────────────────────────────
                ResumePersonalInfo: {
                    type: 'object',
                    properties: {
                        fullName: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        phone: { type: 'string' },
                        location: { type: 'string' },
                        linkedin: { type: 'string', format: 'uri' },
                        website: { type: 'string', format: 'uri' },
                    },
                },
                Resume: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        title: { type: 'string' },
                        template: { type: 'string' },
                        targetRole: { type: 'string' },
                        industry: { type: 'string' },
                        status: { type: 'string', enum: ['DRAFT', 'COMPLETE', 'ARCHIVED'] },
                        atsScore: { type: 'number', minimum: 0, maximum: 100 },
                        personalInfo: { $ref: '#/components/schemas/ResumePersonalInfo' },
                        summary: { type: 'string' },
                        experience: { type: 'array', items: { type: 'object' } },
                        education: { type: 'array', items: { type: 'object' } },
                        skills: { type: 'array', items: { type: 'object' } },
                        version: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateResumeRequest: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: { type: 'string', example: 'Senior Engineer Resume' },
                        template: { type: 'string', example: 'modern' },
                        targetRole: { type: 'string', example: 'Senior Software Engineer' },
                        industry: { type: 'string', example: 'Technology' },
                    },
                },
            },
            responses: {
                Unauthorized: {
                    description: 'Missing or invalid access token',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                InsufficientCredits: {
                    description: 'User does not have enough credits',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                ValidationError: {
                    description: 'Request body failed validation',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth', description: 'Authentication & session management' },
            { name: 'Resumes', description: 'Resume CRUD and version history' },
            { name: 'AI', description: 'AI-powered resume enhancement and document generation' },
            { name: 'Documents', description: 'Cover letters, SOPs, bios, and other career documents' },
            { name: 'Credits', description: 'Credit balance, history, and referrals' },
            { name: 'Interview', description: 'AI interview preparation' },
            { name: 'Jobs', description: 'Job application tracker' },
            { name: 'Admin', description: 'Admin-only management endpoints' },
        ],
    },
    apis: ['./src/routes/*.ts', './src/features/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
