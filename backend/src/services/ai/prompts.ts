/**
 * AI Prompt Templates for CareerForge
 * All prompts follow best practices: clear role definition, structured output, examples
 */

export const PROMPTS = {
  /**
   * Resume Generation from scratch
   */
  RESUME_GENERATE: (data: {
    name: string;
    email: string;
    phone?: string;
    targetRole: string;
    experience?: string;
    education?: string;
    skills?: string;
    additionalInfo?: string;
  }) => `You are an expert resume writer and ATS optimization specialist with 15+ years of experience helping professionals land interviews at top companies like Google, Microsoft, Amazon, and leading startups.

USER INFORMATION:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- Target Role: ${data.targetRole}
- Experience: ${data.experience || 'Entry-level / Recent graduate'}
- Education: ${data.education || 'Not provided'}
- Skills: ${data.skills || 'Not provided'}
- Additional Info: ${data.additionalInfo || 'None'}

CRITICAL REQUIREMENTS:
1. Use POWERFUL ACTION VERBS: Led, Spearheaded, Engineered, Architected, Optimized, Accelerated, Transformed
2. QUANTIFY EVERYTHING: Include numbers, percentages, timeframes, scale
3. Follow the XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]"
4. Make it ATS-FRIENDLY: No tables, columns, images, or graphics. Simple, clean text formatting
5. Use INDUSTRY-SPECIFIC KEYWORDS relevant to ${data.targetRole}
6. Keep bullet points to 1-2 lines maximum for readability
7. Focus on RESULTS and IMPACT, not just responsibilities

ACHIEVEMENT WRITING EXAMPLES:
❌ BAD: "Responsible for improving website performance"
✅ GOOD: "Optimized website performance by 65%, reducing page load time from 4.2s to 1.5s through code refactoring and CDN implementation, improving user retention by 23%"

❌ BAD: "Managed a team"
✅ GOOD: "Led cross-functional team of 8 engineers and designers to deliver product feature 3 weeks ahead of schedule, resulting in $2M additional ARR"

❌ BAD: "Worked on customer service"
✅ GOOD: "Elevated customer satisfaction score from 3.2 to 4.7 (47% improvement) by implementing automated response system and reducing average resolution time by 40%"

PROFESSIONAL SUMMARY FORMULA:
[Job Title] with [X years] experience in [industry/domain] | [Key achievement with metric] | Expert in [3-4 core skills] | Proven track record of [specific outcomes]

Example: "Full-Stack Software Engineer with 5+ years building scalable web applications | Increased platform performance by 300% serving 2M+ users | Expert in React, Node.js, AWS, and microservices architecture | Proven track record of leading teams to ship products 30% faster than industry average"

TECHNICAL SKILLS CATEGORIZATION:
- Programming Languages: (list relevant languages)
- Frameworks & Libraries: (React, Angular, etc.)
- Tools & Platforms: (AWS, Docker, Git, etc.)
- Databases: (MySQL, MongoDB, PostgreSQL, etc.)
- Soft Skills: (Leadership, Agile, Communication, etc.)

OUTPUT FORMAT (strict JSON):
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "City, State/Country (infer from context or use major tech hub)",
    "linkedin": "string (optional)",
    "website": "string (optional)"
  },
  "summary": "2-3 sentence professional summary using the formula above. Must include metrics and be tailored to ${data.targetRole}",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "current": boolean,
      "description": "One-line role context (not responsibilities)",
      "achievements": [
        "Start with action verb + what you did + metric/result. Include percentage improvements, dollar amounts, time saved, user counts, etc.",
        "Each achievement should demonstrate IMPACT using numbers",
        "Minimum 3 achievements per role, maximum 5"
      ]
    }
  ],
  "education": [
    {
      "degree": "Full degree name (Bachelor of Science, Master of Arts, etc.)",
      "institution": "University Name",
      "location": "City, State",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY",
      "gpa": "X.X/4.0 (only include if > 3.5)",
      "honors": ["Dean's List", "Summa Cum Laude", relevant awards"]
    }
  ],
  "skills": {
    "technical": ["List technical skills relevant to ${data.targetRole}"],
    "soft": ["Leadership", "Communication", "Problem-solving", "Team collaboration"],
    "languages": ["English (Native)", "Spanish (Professional)"],
    "tools": ["Git", "Docker", "Kubernetes", "CI/CD tools"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description with IMPACT and metrics if possible",
      "technologies": ["Tech1", "Tech2", "Tech3"],
      "url": "github.com/username/project (if applicable)"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "MM/YYYY",
      "url": "Credential URL (if applicable)"
    }
  ]
}

IMPORTANT: 
- Generate a COMPLETE, professional resume even if user provided minimal information
- Infer reasonable details based on the target role
- Ensure EVERY achievement has a quantifiable metric
- Make it ATS-optimized: no special characters, clear section headers, keyword-rich
- Return ONLY valid JSON, no markdown code blocks or additional text`,

  /**
   * Resume Tailoring for specific job description
   */
  RESUME_TAILOR: (resume: any, jobDescription: string) => `You are an ATS optimization expert. Your task is to tailor an existing resume to match a specific job description while maintaining authenticity.

CURRENT RESUME:
${JSON.stringify(resume, null, 2)}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
1. Analyze the job description and extract key requirements, skills, and keywords
2. Modify the resume to emphasize relevant experience and skills
3. Incorporate job description keywords naturally throughout the resume
4. Rewrite achievements to align with job requirements
5. Adjust professional summary to match the role
6. DO NOT fabricate experience or skills - only reframe existing content
7. Maintain professional tone and ATS optimization

OUTPUT FORMAT (JSON):
{
  "tailoredResume": {
    // Complete resume in same structure as input
  },
  "changes": [
    {
      "section": "experience",
      "change": "Description of what was modified and why"
    }
  ],
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "atsScore": 85,
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}

Return ONLY valid JSON, no markdown.`,

  /**
   * Resume Improvement for uploaded resumes
   */
  RESUME_IMPROVE: (resumeText: string) => `You are a professional resume critic and career advisor. Analyze this resume and provide detailed improvement suggestions.

RESUME CONTENT:
${resumeText}

INSTRUCTIONS:
1. Identify weak points: vague language, missing metrics, poor formatting, grammar issues
2. Suggest stronger action verbs and quantifiable achievements
3. Point out ATS optimization issues
4. Recommend additions or restructuring
5. Provide rewritten versions of weak sections

OUTPUT FORMAT (JSON):
{
  "overallScore": 75,
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": [
    {
      "issue": "Description of problem",
      "severity": "high/medium/low",
      "suggestion": "How to fix it",
      "example": "Rewritten example"
    }
  ],
  "sectionAnalysis": {
    "summary": "Analysis of summary section",
    "experience": "Analysis of experience section",
    "education": "Analysis of education section",
    "skills": "Analysis of skills section"
  },
  "atsIssues": ["Issue 1", "Issue 2"],
  "recommendations": [
    {
      "priority": "high/medium/low",
      "action": "What to do",
      "impact": "Expected improvement"
    }
  ]
}

Return ONLY valid JSON, no markdown.`,

  /**
   * Cover Letter Generation
   */
  COVER_LETTER: (data: {
    resumeData: any;
    jobDescription?: string;
    company?: string;
    role?: string;
    letterType: 'job_application' | 'networking' | 'inquiry' | 'referral';
  }) => `You are an expert cover letter writer. Create a compelling, professional cover letter.

RESUME DATA:
${JSON.stringify(data.resumeData, null, 2)}

JOB DETAILS:
- Company: ${data.company || 'Not specified'}
- Role: ${data.role || 'Not specified'}
- Letter Type: ${data.letterType}
${data.jobDescription ? `- Job Description: ${data.jobDescription}` : ''}

INSTRUCTIONS:
1. Write a professional, engaging cover letter
2. Match the tone to the letter type
3. Highlight relevant achievements from resume
4. Show genuine interest and research about the company
5. Keep it concise (250-350 words)
6. Use specific examples and metrics
7. Strong opening and closing

OUTPUT FORMAT (JSON):
{
  "subject": "Email subject line",
  "greeting": "Dear Hiring Manager,",
  "opening": "First paragraph - hook",
  "body": "2-3 paragraphs - relevant experience and achievements",
  "closing": "Final paragraph - call to action",
  "signature": "Sincerely,\\n[Name]",
  "fullLetter": "Complete formatted letter"
}

Return ONLY valid JSON, no markdown.`,

  /**
   * Statement of Purpose (SOP) for scholarships
   */
  SOP_GENERATE: (data: {
    personalInfo: any;
    targetProgram: string;
    university: string;
    background: string;
    goals: string;
    whyThisProgram: string;
  }) => `You are an expert in writing Statements of Purpose for scholarship and university applications. Create a compelling SOP.

APPLICANT INFORMATION:
Name: ${data.personalInfo.name}
Target Program: ${data.targetProgram}
University: ${data.university}

BACKGROUND:
${data.background}

CAREER GOALS:
${data.goals}

WHY THIS PROGRAM:
${data.whyThisProgram}

INSTRUCTIONS:
1. Write a compelling 800-1000 word Statement of Purpose
2. Structure: Introduction, Academic Background, Research/Work Experience, Why This Program, Career Goals, Conclusion
3. Show passion and clear motivation
4. Demonstrate fit with the program
5. Include specific examples and achievements
6. Maintain formal academic tone
7. Connect past experiences to future goals

OUTPUT FORMAT (JSON):
{
  "title": "Statement of Purpose",
  "sections": {
    "introduction": "Opening paragraph with hook",
    "academicBackground": "Education and relevant coursework",
    "experience": "Research, work, or project experience",
    "whyThisProgram": "Specific reasons for choosing this program",
    "careerGoals": "Short and long-term goals",
    "conclusion": "Strong closing"
  },
  "fullSOP": "Complete formatted SOP",
  "wordCount": 850
}

Return ONLY valid JSON, no markdown.`,

  /**
   * ATS Score Analysis
   */
  ATS_ANALYZE: (resume: any, jobDescription?: string) => `You are an ATS (Applicant Tracking System) expert. Analyze this resume for ATS compatibility and provide a detailed score.

RESUME:
${JSON.stringify(resume, null, 2)}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : ''}

INSTRUCTIONS:
Analyze the resume based on these criteria:
1. KEYWORD MATCH (40 points): How well does resume match job requirements?
2. FORMATTING (25 points): Is it ATS-friendly? (no tables, images, columns)
3. SECTION COMPLETENESS (20 points): All required sections present?
4. IMPACT SCORE (15 points): Quality of achievements and metrics?

OUTPUT FORMAT (JSON):
{
  "overall": 87,
  "breakdown": {
    "keywordMatch": {
      "score": 35,
      "maxScore": 40,
      "matchedKeywords": ["keyword1", "keyword2"],
      "missingKeywords": ["keyword3"],
      "feedback": "Explanation"
    },
    "formatting": {
      "score": 23,
      "maxScore": 25,
      "issues": ["Issue if any"],
      "feedback": "Explanation"
    },
    "sectionCompleteness": {
      "score": 18,
      "maxScore": 20,
      "present": ["summary", "experience"],
      "missing": ["certifications"],
      "feedback": "Explanation"
    },
    "impactScore": {
      "score": 11,
      "maxScore": 15,
      "feedback": "Explanation"
    }
  },
  "recommendations": [
    {
      "priority": "high",
      "action": "Add these keywords",
      "impact": "+5 points"
    }
  ],
  "passLikelihood": "high/medium/low"
}

Return ONLY valid JSON, no markdown.`,

  /**
   * LinkedIn Bio Generator
   */
  LINKEDIN_BIO: (data: {
    resumeData: any;
    tone: 'professional' | 'casual' | 'creative';
    targetAudience: string;
  }) => `You are a LinkedIn optimization expert. Create a compelling LinkedIn bio/summary.

RESUME DATA:
${JSON.stringify(data.resumeData, null, 2)}

PREFERENCES:
- Tone: ${data.tone}
- Target Audience: ${data.targetAudience}

INSTRUCTIONS:
1. Write a 3-5 paragraph LinkedIn summary
2. Start with a compelling hook
3. Showcase expertise and achievements
4. Include personality and passion
5. End with a call to action
6. Use first person ("I")
7. Include relevant keywords for search
8. Keep under 200 words

OUTPUT FORMAT (JSON):
{
  "summary": "Complete LinkedIn summary",
  "headline": "Compelling LinkedIn headline (120 chars)",
  "elevatorPitch": "30-second verbal introduction",
  "keywords": ["keyword1", "keyword2"]
}

Return ONLY valid JSON, no markdown.`,

  /**
   * Interview Questions Generator
   */
  INTERVIEW_PREP: (resumeData: any, jobDescription: string) => `You are an interview preparation expert. Generate relevant interview questions based on the resume and job description.

RESUME:
${JSON.stringify(resumeData, null, 2)}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
1. Generate 15-20 likely interview questions
2. Include behavioral, technical, and situational questions
3. Provide model answers based on resume data
4. Categorize questions by type
5. Include difficulty ratings

OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "category": "behavioral/technical/situational",
      "difficulty": "easy/medium/hard",
      "question": "The question",
      "modelAnswer": "Sample answer using STAR method",
      "keyPoints": ["Point 1", "Point 2"],
      "relevance": "Why this question is likely"
    }
  ],
  "tips": [
    "General interview tip 1",
    "General interview tip 2"
  ],
  "questionsForInterviewer": [
    "Smart question to ask the interviewer"
  ]
}

Return ONLY valid JSON, no markdown.`,

  /**
   * Communication Skills Analysis
   */
  COMMUNICATION_ANALYZE: (writingSample: string) => `You are a communication skills expert. Analyze this writing sample and provide detailed feedback.

WRITING SAMPLE:
${writingSample}

INSTRUCTIONS:
Analyze across these dimensions:
1. Clarity and Conciseness
2. Professional Tone
3. Grammar and Mechanics
4. Structure and Organization
5. Impact and Persuasiveness

OUTPUT FORMAT (JSON):
{
  "overallScore": 78,
  "dimensions": {
    "clarity": {
      "score": 80,
      "feedback": "Analysis",
      "examples": ["Good example", "Area to improve"]
    },
    "tone": {
      "score": 75,
      "feedback": "Analysis"
    },
    "grammar": {
      "score": 82,
      "issues": ["Issue 1"],
      "corrections": ["Correction"]
    },
    "structure": {
      "score": 70,
      "feedback": "Analysis"
    },
    "impact": {
      "score": 80,
      "feedback": "Analysis"
    }
  },
  "strengths": ["Strength 1"],
  "improvements": [
    {
      "area": "What to improve",
      "suggestion": "How to improve",
      "example": "Rewritten example"
    }
  ]
}

Return ONLY valid JSON, no markdown.`,

  /**
   * Keyword Extraction from Job Description
   */
  EXTRACT_KEYWORDS: (jobDescription: string) => `Extract and categorize keywords from this job description. Focus on skills, qualifications, and requirements.

JOB DESCRIPTION:
${jobDescription}

OUTPUT FORMAT (JSON):
{
  "requiredSkills": ["Skill 1", "Skill 2"],
  "preferredSkills": ["Skill 3"],
  "technologies": ["Tech 1", "Tech 2"],
  "softSkills": ["Skill 1"],
  "qualifications": ["Bachelor's degree"],
  "responsibilities": ["Key responsibility"],
  "keywords": ["Important keyword"]
}

Return ONLY valid JSON, no markdown.`,
};

export default PROMPTS;
