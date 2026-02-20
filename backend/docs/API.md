# CareerForge API Documentation

Complete REST API for CareerForge AI - Resume builder and career document generation platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)

---

## Overview

The CareerForge API provides endpoints for:
- User authentication (email/password and Google OAuth)
- Resume creation and management
- Document generation (cover letters, SOPs, etc.)
- Job application tracking
- Credit management

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Token Types

1. **Access Token** - Short-lived (15 minutes), used for API requests
2. **Refresh Token** - Long-lived (7 days), used to get new access tokens

### Using Tokens

Include the access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Token Refresh Flow

1. When access token expires, use refresh token to get a new one
2. Call `POST /api/auth/refresh` with refresh token
3. Receive new access token
4. Continue making requests

---

## Base URL

```
Development: http://localhost:5000
Production: https://api.careerforge.ai
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

## Error Handling

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- Headers returned:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time until reset

---

## Endpoints

## 📌 Authentication

### 1. Register (Email/Password)

**POST** `/api/auth/signup`

Create a new account with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "plan": "FREE",
      "credits": 10,
      "createdAt": "2025-02-19T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 2. Login (Email/Password)

**POST** `/api/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "plan": "FREE",
      "credits": 10,
      "avatar": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 3. Google OAuth

**POST** `/api/auth/google`

Login or signup with Google OAuth token.

**Request Body:**
```json
{
  "token": "google_oauth_token_here"
}
```

**How to get Google token:**
1. Use Google Sign-In on frontend
2. Get ID token from Google
3. Send token to this endpoint

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Google authentication successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@gmail.com",
      "name": "John Doe",
      "plan": "FREE",
      "credits": 10,
      "avatar": "https://lh3.googleusercontent.com/..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 4. Refresh Token

**POST** `/api/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 5. Logout

**POST** `/api/auth/logout`

Logout and invalidate refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 6. Get Current User

**GET** `/api/auth/me`

Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": null,
      "plan": "FREE",
      "credits": 10,
      "phone": null,
      "location": null,
      "timezone": null,
      "emailVerified": false,
      "createdAt": "2025-02-19T00:00:00.000Z",
      "lastLoginAt": "2025-02-19T10:00:00.000Z"
    }
  }
}
```

---

## 📌 Resumes

### 1. Create Resume

**POST** `/api/resumes`

Create a new resume. **Costs 1 credit.**

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Software Engineer Resume",
  "template": "modern",
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "linkedin": "https://linkedin.com/in/johndoe",
    "website": "https://johndoe.com"
  },
  "summary": "Experienced software engineer with 5+ years...",
  "experience": [
    {
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2020-01",
      "endDate": "2024-12",
      "current": false,
      "description": "Led development of scalable microservices",
      "achievements": [
        "Reduced API latency by 40%",
        "Mentored 5 junior developers"
      ]
    }
  ],
  "education": [
    {
      "degree": "B.S. Computer Science",
      "school": "Stanford University",
      "location": "Stanford, CA",
      "startDate": "2015-09",
      "endDate": "2019-06",
      "gpa": "3.8/4.0"
    }
  ],
  "skills": [
    {
      "category": "Programming",
      "items": ["Python", "JavaScript", "TypeScript", "Go"]
    },
    {
      "category": "Frameworks",
      "items": ["React", "Node.js", "Django", "Flask"]
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Resume created successfully",
  "data": {
    "resume": {
      "id": "uuid",
      "userId": "uuid",
      "title": "Software Engineer Resume",
      "template": "modern",
      "atsScore": null,
      "isTailored": false,
      "isPublished": false,
      "createdAt": "2025-02-19T00:00:00.000Z",
      "updatedAt": "2025-02-19T00:00:00.000Z"
    }
  }
}
```

---

### 2. Get All Resumes

**GET** `/api/resumes`

Get all resumes for current user with pagination.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `sortBy` (optional) - Field to sort by
- `sortOrder` (optional, default: desc) - Sort order (asc/desc)

**Example:**
```
GET /api/resumes?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "resumes": [
      {
        "id": "uuid",
        "title": "Software Engineer Resume",
        "template": "modern",
        "atsScore": 87,
        "isTailored": true,
        "isPublished": true,
        "createdAt": "2025-02-19T00:00:00.000Z",
        "updatedAt": "2025-02-19T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 4,
      "totalPages": 1
    }
  }
}
```

---

### 3. Get Resume by ID

**GET** `/api/resumes/:id`

Get full details of a specific resume.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "resume": {
      "id": "uuid",
      "userId": "uuid",
      "title": "Software Engineer Resume",
      "template": "modern",
      "personalInfo": { /* ... */ },
      "summary": { /* ... */ },
      "experience": [ /* ... */ ],
      "education": [ /* ... */ ],
      "skills": [ /* ... */ ],
      "atsScore": 87,
      "keywordMatch": 38,
      "formatScore": 25,
      "impactScore": 14,
      "createdAt": "2025-02-19T00:00:00.000Z",
      "updatedAt": "2025-02-19T10:00:00.000Z"
    }
  }
}
```

---

### 4. Update Resume

**PUT** `/api/resumes/:id`

Update an existing resume.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "experience": [ /* updated experience */ ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Resume updated successfully",
  "data": {
    "resume": { /* updated resume */ }
  }
}
```

---

### 5. Delete Resume

**DELETE** `/api/resumes/:id`

Delete a resume.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

### 6. Duplicate Resume

**POST** `/api/resumes/:id/duplicate`

Create a copy of an existing resume.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Resume duplicated successfully",
  "data": {
    "resume": {
      "id": "new-uuid",
      "title": "Software Engineer Resume (Copy)",
      /* ... */
    }
  }
}
```

---

### 7. Export Resume

**GET** `/api/resumes/:id/export?format=pdf`

Export resume as PDF or DOCX.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `format` (optional, default: pdf) - Export format (pdf/docx)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Resume export as pdf will be implemented",
  "data": {
    "resume": { /* resume data */ }
  }
}
```

---

## 📌 Credit System

- **Free Plan**: 10 credits/month
- **Pro Plan**: 200 credits/month
- **Team Plan**: 500 shared credits/month

### Credit Costs

- Create Resume: 1 credit
- Tailor Resume: 2 credits
- Generate Cover Letter: 1 credit
- Generate SOP: 2 credits
- Interview Prep: 1 credit

---

## 📌 Common Errors

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden (Insufficient Credits)
```json
{
  "success": false,
  "message": "Insufficient credits",
  "creditsNeeded": 2,
  "creditsAvailable": 0
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### 400 Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## 📌 Best Practices

1. **Store tokens securely** - Never expose tokens in URLs or logs
2. **Refresh tokens proactively** - Refresh before expiry to avoid interruptions
3. **Handle rate limits** - Implement exponential backoff
4. **Validate input** - Always validate user input on frontend
5. **Use HTTPS** - Always use HTTPS in production

---

## 📞 Support

- **Email**: support@careerforge.ai
- **Docs**: https://docs.careerforge.ai
- **GitHub**: https://github.com/careerforge/api

---

## 📌 AI & Document Generation

All AI endpoints require authentication and consume credits (except where noted as free).

### Credit System

- **Free Plan**: 10 credits/month
- **Pro Plan**: 200 credits/month  
- **Premium Plan**: Unlimited credits

**Credit Costs:**
- Generate Resume: 2 credits
- Tailor Resume: 2 credits
- Improve Resume: 1 credit
- Generate SOP: 2 credits
- Cover Letter: 1 credit
- LinkedIn Bio: 1 credit
- Interview Prep: 1 credit
- Communication Analysis: 1 credit
- ATS Analysis: Free
- Extract Keywords: Free

---

### 1. Generate Resume from Scratch

**POST** `/api/ai/generate-resume`

Generate a complete ATS-optimized resume using AI. **Costs 2 credits.**

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "targetRole": "Software Engineer",
  "experience": "3 years of full-stack development experience at startups",
  "education": "B.S. Computer Science from Stanford University",
  "skills": "Python, JavaScript, React, Node.js, AWS",
  "additionalInfo": "Led team of 3 developers, increased API performance by 40%"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Resume generated successfully",
  "data": {
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "linkedin": "",
      "website": ""
    },
    "summary": "Results-driven Software Engineer with 3+ years of experience...",
    "experience": [
      {
        "title": "Software Engineer",
        "company": "Tech Startup",
        "location": "San Francisco, CA",
        "startDate": "01/2021",
        "endDate": "Present",
        "current": true,
        "description": "Full-stack development for SaaS platform",
        "achievements": [
          "Improved API performance by 40% through optimization",
          "Led team of 3 developers in implementing new features"
        ]
      }
    ],
    "education": [...],
    "skills": {...},
    "projects": [...],
    "certifications": [...]
  },
  "creditsUsed": 2
}
```

---

### 2. Tailor Resume for Job

**POST** `/api/ai/tailor-resume`

Optimize an existing resume for a specific job description. **Costs 2 credits.**

**Request Body:**
```json
{
  "resumeId": "resume-uuid-here",
  "jobDescription": "We are seeking a Senior Software Engineer with 5+ years experience in React, Node.js, and AWS. Must have leadership experience and strong communication skills..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Resume tailored successfully",
  "data": {
    "tailoredResume": {
      // Modified resume with optimized content
    },
    "changes": [
      {
        "section": "summary",
        "change": "Enhanced summary to highlight React and AWS experience"
      },
      {
        "section": "experience",
        "change": "Reworded achievements to match leadership requirements"
      }
    ],
    "matchedKeywords": ["React", "Node.js", "AWS", "Leadership"],
    "missingKeywords": ["Docker", "Kubernetes"],
    "atsScore": 87,
    "recommendations": [
      "Consider adding Docker experience if applicable",
      "Quantify team leadership experience more clearly"
    ]
  },
  "creditsUsed": 2
}
```

---

### 3. Improve Uploaded Resume

**POST** `/api/ai/improve-resume`

Get AI-powered suggestions to improve an existing resume. **Costs 1 credit.**

**Request Body:**
```json
{
  "resumeText": "John Doe\\nEmail: john@example.com\\n\\nExperience:\\nWorked at Company X doing software development..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Resume analysis complete",
  "data": {
    "overallScore": 68,
    "strengths": [
      "Clear contact information",
      "Relevant work experience"
    ],
    "weaknesses": [
      {
        "issue": "Vague achievement descriptions",
        "severity": "high",
        "suggestion": "Add quantifiable metrics to achievements",
        "example": "Improved system performance by 40%, reducing load time from 5s to 3s"
      },
      {
        "issue": "Missing professional summary",
        "severity": "medium",
        "suggestion": "Add 2-3 sentence summary at the top",
        "example": "Results-driven Software Engineer with..."
      }
    ],
    "sectionAnalysis": {
      "summary": "Missing - add professional summary",
      "experience": "Good structure but needs metrics",
      "education": "Complete and well-formatted",
      "skills": "Consider categorizing by type"
    },
    "atsIssues": [
      "Using tables may cause ATS parsing issues",
      "Some section headers non-standard"
    ],
    "recommendations": [
      {
        "priority": "high",
        "action": "Replace vague verbs with action verbs",
        "impact": "Will increase ATS score by ~10 points"
      }
    ]
  },
  "creditsUsed": 1
}
```

---

### 4. Analyze ATS Score

**POST** `/api/ai/analyze-ats`

Calculate ATS (Applicant Tracking System) compatibility score. **Free.**

**Request Body:**
```json
{
  "resumeId": "resume-uuid-here",
  "jobDescription": "Optional - job description for keyword matching"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "ATS analysis complete",
  "data": {
    "overall": 87,
    "breakdown": {
      "keywordMatch": {
        "score": 35,
        "maxScore": 40,
        "matchedKeywords": ["Python", "React", "AWS", "Leadership"],
        "missingKeywords": ["Docker", "CI/CD"],
        "feedback": "Strong keyword coverage with 80% match rate"
      },
      "formatting": {
        "score": 23,
        "maxScore": 25,
        "issues": [],
        "feedback": "Excellent ATS-friendly formatting"
      },
      "sectionCompleteness": {
        "score": 18,
        "maxScore": 20,
        "present": ["summary", "experience", "education", "skills"],
        "missing": ["certifications"],
        "feedback": "All essential sections present"
      },
      "impactScore": {
        "score": 11,
        "maxScore": 15,
        "feedback": "Good use of metrics, some achievements could be stronger"
      }
    },
    "recommendations": [
      {
        "priority": "medium",
        "action": "Add Docker and CI/CD keywords if applicable",
        "impact": "+3 points"
      }
    ],
    "passLikelihood": "high"
  }
}
```

---

### 5. Generate Cover Letter

**POST** `/api/ai/generate-cover-letter`

Generate a professional cover letter. **Costs 1 credit.**

**Request Body:**
```json
{
  "resumeId": "resume-uuid-here",
  "company": "Google",
  "role": "Senior Software Engineer",
  "letterType": "job_application",
  "jobDescription": "Optional - for better customization"
}
```

**Letter Types:**
- `job_application` - Standard job application
- `networking` - Networking/informational interview
- `inquiry` - General inquiry about opportunities
- `referral` - Application with employee referral

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cover letter generated successfully",
  "data": {
    "subject": "Application for Senior Software Engineer Position",
    "greeting": "Dear Hiring Manager,",
    "opening": "I am writing to express my strong interest in the Senior Software Engineer position at Google...",
    "body": "With over 5 years of experience in full-stack development and a proven track record of delivering scalable solutions...",
    "closing": "I would welcome the opportunity to discuss how my experience aligns with Google's mission...",
    "signature": "Sincerely,\\nJohn Doe",
    "fullLetter": "Complete formatted letter..."
  },
  "creditsUsed": 1
}
```

---

### 6. Generate Statement of Purpose

**POST** `/api/ai/generate-sop`

Generate SOP for scholarship/university applications. **Costs 2 credits.**

**Request Body:**
```json
{
  "personalInfo": {
    "name": "Jane Smith",
    "education": "B.S. Computer Science"
  },
  "targetProgram": "Master of Science in Artificial Intelligence",
  "university": "Stanford University",
  "background": "Graduated top of class with focus on machine learning. Published 2 papers...",
  "goals": "Become an AI research scientist working on ethical AI systems",
  "whyThisProgram": "Stanford's AI lab and Professor X's work on responsible AI align perfectly with my interests..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Statement of Purpose generated successfully",
  "data": {
    "title": "Statement of Purpose",
    "sections": {
      "introduction": "My fascination with artificial intelligence began...",
      "academicBackground": "During my undergraduate studies at...",
      "experience": "My research experience includes...",
      "whyThisProgram": "Stanford's MS in AI program stands out because...",
      "careerGoals": "Upon completing this program, I aim to...",
      "conclusion": "I am confident that Stanford's rigorous curriculum..."
    },
    "fullSOP": "Complete formatted SOP...",
    "wordCount": 872
  },
  "creditsUsed": 2
}
```

---

### 7. Generate LinkedIn Bio

**POST** `/api/ai/generate-linkedin-bio`

Generate LinkedIn summary and elevator pitch. **Costs 1 credit.**

**Request Body:**
```json
{
  "resumeId": "resume-uuid-here",
  "tone": "professional",
  "targetAudience": "recruiters"
}
```

**Tones:** `professional`, `casual`, `creative`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "LinkedIn bio generated successfully",
  "data": {
    "summary": "I'm a passionate Software Engineer specializing in building scalable web applications...",
    "headline": "Senior Software Engineer | Full-Stack Developer | React & Node.js Expert",
    "elevatorPitch": "Hi, I'm John. I build high-performance web applications that handle millions of users. Currently at TechCo where I led the redesign that improved load times by 40%.",
    "keywords": ["Software Engineer", "Full-Stack", "React", "Node.js", "AWS"]
  },
  "creditsUsed": 1
}
```

---

### 8. Interview Preparation

**POST** `/api/ai/interview-prep`

Generate likely interview questions with model answers. **Costs 1 credit.**

**Request Body:**
```json
{
  "resumeId": "resume-uuid-here",
  "jobDescription": "Senior Software Engineer role focusing on React and system design..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Interview preparation generated successfully",
  "data": {
    "questions": [
      {
        "category": "technical",
        "difficulty": "medium",
        "question": "Explain how you would optimize a React application with performance issues",
        "modelAnswer": "I would start by using React DevTools Profiler to identify slow components. Then implement React.memo for expensive renders, use useCallback and useMemo for optimization...",
        "keyPoints": [
          "Profiling first",
          "React.memo usage",
          "Code splitting",
          "Lazy loading"
        ],
        "relevance": "Matches React expertise in resume"
      },
      {
        "category": "behavioral",
        "difficulty": "easy",
        "question": "Tell me about a time you improved system performance",
        "modelAnswer": "At my previous role, I noticed our API response times were degrading. I analyzed the queries and implemented database indexing, which reduced response time by 40%...",
        "keyPoints": [
          "Situation: Slow API",
          "Task: Improve performance",
          "Action: Added indexing",
          "Result: 40% improvement"
        ],
        "relevance": "Achievement mentioned in resume"
      }
    ],
    "tips": [
      "Research the company culture beforehand",
      "Prepare questions about the team and tech stack"
    ],
    "questionsForInterviewer": [
      "What does a typical sprint look like for your team?",
      "What are the biggest technical challenges you're facing?"
    ]
  },
  "creditsUsed": 1
}
```

---

### 9. Analyze Communication Skills

**POST** `/api/ai/analyze-communication`

Analyze professional writing sample. **Costs 1 credit.**

**Request Body:**
```json
{
  "writingSample": "I am writing to express my interest in the position. I have experience in software development and I think I would be a good fit for your company..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Communication analysis complete",
  "data": {
    "overallScore": 72,
    "dimensions": {
      "clarity": {
        "score": 75,
        "feedback": "Generally clear but some vague statements",
        "examples": [
          "Good: Specific role mentioned",
          "Improve: 'I think I would be good' is weak"
        ]
      },
      "tone": {
        "score": 70,
        "feedback": "Professional but could be more confident"
      },
      "grammar": {
        "score": 85,
        "issues": ["Repetitive sentence structure"],
        "corrections": ["Vary sentence openings"]
      },
      "structure": {
        "score": 68,
        "feedback": "Needs stronger opening and closing"
      },
      "impact": {
        "score": 65,
        "feedback": "Lacks specific achievements and metrics"
      }
    },
    "strengths": [
      "Grammatically correct",
      "Professional tone maintained"
    ],
    "improvements": [
      {
        "area": "Opening strength",
        "suggestion": "Start with a compelling hook",
        "example": "With 5+ years of proven experience in software development..."
      },
      {
        "area": "Confidence",
        "suggestion": "Replace 'I think' with assertive statements",
        "example": "My experience in X makes me well-suited for..."
      }
    ]
  },
  "creditsUsed": 1
}
```

---

### 10. Extract Keywords

**POST** `/api/ai/extract-keywords`

Extract key requirements from job description. **Free.**

**Request Body:**
```json
{
  "jobDescription": "We're seeking a Senior Software Engineer with 5+ years experience in React, Node.js, and AWS. Must have strong leadership skills and experience with agile methodologies..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Keywords extracted successfully",
  "data": {
    "requiredSkills": ["React", "Node.js", "AWS", "Leadership"],
    "preferredSkills": ["Docker", "Kubernetes"],
    "technologies": ["React", "Node.js", "AWS"],
    "softSkills": ["Leadership", "Communication", "Team collaboration"],
    "qualifications": ["5+ years experience", "Bachelor's degree"],
    "responsibilities": ["Lead team", "Design architecture", "Code review"],
    "keywords": ["Senior", "Software Engineer", "Agile", "Leadership"]
  }
}
```

---

### 11. Get Remaining Credits

**GET** `/api/ai/credits`

Check remaining AI credits and usage history.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "credits": 142,
    "plan": "PRO",
    "unlimited": false,
    "recentUsage": [
      {
        "id": "uuid",
        "action": "resume_tailor",
        "credits": 2,
        "createdAt": "2025-02-19T10:30:00.000Z"
      },
      {
        "id": "uuid",
        "action": "cover_letter_generate",
        "credits": 1,
        "createdAt": "2025-02-19T09:15:00.000Z"
      }
    ]
  }
}
```

---

## 💡 AI Best Practices

1. **Check credits before operations** - Use GET `/api/ai/credits` to check remaining credits
2. **Provide context** - More detailed input = better AI output
3. **Iterate** - Use improve/tailor endpoints to refine documents
4. **Start with free operations** - Use ATS analysis and keyword extraction (free) before spending credits
5. **Upgrade when needed** - Pro plan gives 200 credits/month, Premium is unlimited

---

## 🎯 Common AI Workflows

### New User Resume Creation
1. `POST /api/ai/generate-resume` - Generate initial resume (2 credits)
2. `POST /api/ai/analyze-ats` - Check ATS score (free)
3. `POST /api/ai/generate-cover-letter` - Create cover letter (1 credit)

### Job Application Optimization
1. `POST /api/ai/extract-keywords` - Analyze job posting (free)
2. `POST /api/ai/tailor-resume` - Customize resume (2 credits)
3. `POST /api/ai/analyze-ats` - Verify improvements (free)
4. `POST /api/ai/interview-prep` - Prepare for interview (1 credit)

### Resume Improvement
1. `POST /api/ai/improve-resume` - Get suggestions (1 credit)
2. Manually update resume
3. `POST /api/ai/analyze-ats` - Verify score improved (free)

