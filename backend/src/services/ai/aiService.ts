import { generateContent, generateStructuredContent, MODELS } from '../../config/gemini';
import PROMPTS from './prompts';
import ENHANCED_PROMPTS from './enhanced-prompts';
import prisma from '../../config/database';

// Use enhanced prompts for better results
const USE_ENHANCED_PROMPTS = process.env.USE_ENHANCED_PROMPTS !== 'false';

/**
 * AIService — class-based facade for all AI generation & analysis
 * Integrates with Google Gemini via the existing config/gemini helpers.
 */
export class AIService {

  // ── Resume Enhancement ────────────────────────────────────────────────

  async enhanceResumeSection(userId: string, resumeId: string, section: string, targetRole?: string, industry?: string) {
    const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
    if (!resume) throw new Error('Resume not found');

    const prompt = `You are a professional resume writer. Enhance the "${section}" section of this resume.
Target Role: ${targetRole || 'Not specified'}
Industry: ${industry || 'Not specified'}

Current resume data:
${JSON.stringify(resume, null, 2)}

Return JSON: { "enhanced": { ... section data }, "suggestions": ["improvement 1", ...] }`;

    return generateStructuredContent<any>(prompt, MODELS.PRO);
  }

  async scoreATS(userId: string, resumeId: string, jobDescription: string, returnSuggestions = true) {
    const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
    if (!resume) throw new Error('Resume not found');

    const P = USE_ENHANCED_PROMPTS ? ENHANCED_PROMPTS : PROMPTS;
    return generateStructuredContent<any>(P.ATS_ANALYZE(resume, jobDescription), MODELS.FLASH);
  }

  async generateSuggestions(userId: string, resumeId: string, section: string, targetRole?: string) {
    const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
    if (!resume) throw new Error('Resume not found');

    const prompt = `Provide actionable improvement suggestions for the "${section}" section of this resume.
Target Role: ${targetRole || 'Not specified'}
Resume: ${JSON.stringify(resume)}
Return JSON: { "suggestions": [{ "type": string, "original": string, "suggested": string, "reason": string }] }`;

    return generateStructuredContent<any>(prompt, MODELS.FLASH);
  }

  async tailorResume(input: {
    resume: any;
    jobDescription: string;
    companyName?: string;
    jobTitle?: string;
    aggressiveness: 'subtle' | 'moderate' | 'aggressive';
  }) {
    const P = USE_ENHANCED_PROMPTS ? ENHANCED_PROMPTS : PROMPTS;
    const prompt = P.RESUME_TAILOR(input.resume, input.jobDescription);
    const result = await generateStructuredContent<any>(prompt, MODELS.PRO);

    return {
      tailoredContent: result.tailoredResume || result,
      extractedKeywords: result.extractedKeywords || [],
      matchedKeywords: result.matchedKeywords || [],
      missingKeywords: result.missingKeywords || [],
      atsScore: result.atsScore || 0,
      suggestions: result.suggestions || [],
    };
  }

  // ── Resume Extraction & Optimization ──────────────────────────────────

  async extractResumeData(text: string) {
    const prompt = `Extract all professional information from this raw resume text and convert it into a structured JSON format.
Make sure to clean up any parsing errors and present the data clearly.

Raw text:
${text.substring(0, 10000)}

Return JSON in this EXACT structure:
{
  "personalInfo": {
    "name": "Full Name",
    "email": "Email Address",
    "phone": "Phone Number",
    "location": "City, Country"
  },
  "summary": "Professional Summary",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "description": "Role description",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University/School",
      "location": "Location",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY"
    }
  ],
  "skills": {
    "technical": ["Skill 1", "Skill 2"],
    "soft": ["Skill 1", "Skill 2"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["Tech 1", "Tech 2"]
    }
  ]
}`;

    return generateStructuredContent<any>(prompt, MODELS.PRO);
  }

  async optimizeResumeForJD(resume: any, jobDescription: string) {
    const prompt = `Optimize the following resume based on the job description.
Follow these rules:
1. Extract important keywords from JD.
2. Compare them with the resume.
3. Rewrite the summary to be more aligned with the role.
4. Improve bullet points using action verbs and quantifiable results.
5. Add missing relevant skills that the candidate likely has based on their experience.
6. Provide a before/after comparison for each major change.

Resume:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription}

Return JSON:
{
  "optimizedResume": { ... },
  "keyChanges": [
    { "section": "summary", "before": "...", "after": "...", "reason": "..." },
    { "section": "experience", "before": "...", "after": "...", "reason": "..." }
  ],
  "missingKeywords": ["...", "..."],
  "matchedKeywords": ["...", "..."]
}`;

    return generateStructuredContent<any>(prompt, MODELS.PRO);
  }

  // ── Cover Letter ─────────────────────────────────────────────────────

  async generateCoverLetter(userId: string, data: {
    type: string;
    resumeId?: string;
    jobDescription?: string;
    companyName?: string;
    jobTitle?: string;
    hiringManagerName?: string;
    tone?: string;
    wordLimit?: number;
    keyPoints?: string[];
    customContext?: string;
    language?: string;
  }): Promise<string> {
    let resumeData: any = null;
    if (data.resumeId) {
      resumeData = await prisma.resume.findFirst({ where: { id: data.resumeId, userId } });
    }

    const prompt = `You are an expert cover letter writer. Write a ${data.wordLimit || 350}-word ${data.type} cover letter.
${resumeData ? `Candidate Info: ${JSON.stringify({ name: (resumeData.personalInfo as any)?.name, summary: resumeData.summary })}` : ''}
Company: ${data.companyName || 'N/A'} | Role: ${data.jobTitle || 'N/A'}
Tone: ${data.tone || 'professional'} | Language: ${data.language || 'en'}
${data.hiringManagerName ? `Hiring Manager: ${data.hiringManagerName}` : ''}
${data.jobDescription ? `Job Description: ${data.jobDescription.substring(0, 1000)}` : ''}
${data.keyPoints ? `Key Points to Include: ${data.keyPoints.join(', ')}` : ''}
${data.customContext || ''}

Return JSON: { "content": "full cover letter text" }`;

    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.PRO);
    return result.content;
  }

  // ── SOP ──────────────────────────────────────────────────────────────

  async generateSOP(userId: string, data: {
    university: string;
    program: string;
    country?: string;
    resumeId?: string;
    researchInterests?: string;
    whyThisProgram?: string;
    careerGoals: string;
    achievements?: string[];
    challenges?: string;
    wordLimit?: number;
    scholarshipName?: string;
    language?: string;
  }): Promise<string> {
    const prompt = `Write a compelling Statement of Purpose (${data.wordLimit || 800} words) for:
University: ${data.university} | Program: ${data.program} ${data.country ? `| Country: ${data.country}` : ''}
Career Goals: ${data.careerGoals}
${data.researchInterests ? `Research Interests: ${data.researchInterests}` : ''}
${data.whyThisProgram ? `Why This Program: ${data.whyThisProgram}` : ''}
${data.achievements ? `Achievements: ${data.achievements.join(', ')}` : ''}
${data.challenges ? `Challenges Overcome: ${data.challenges}` : ''}
${data.scholarshipName ? `For Scholarship: ${data.scholarshipName}` : ''}
Language: ${data.language || 'en'}

Return JSON: { "content": "full SOP text" }`;

    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.PRO);
    return result.content;
  }

  // ── Motivation Letter ─────────────────────────────────────────────────

  async generateMotivationLetter(userId: string, data: {
    university: string;
    program: string;
    resumeId?: string;
    personalBackground?: string;
    motivation: string;
    careerGoals: string;
    wordLimit?: number;
  }): Promise<string> {
    const prompt = `Write a compelling Motivation Letter (${data.wordLimit || 600} words) for:
University: ${data.university} | Program: ${data.program}
Motivation: ${data.motivation}
Career Goals: ${data.careerGoals}
${data.personalBackground ? `Background: ${data.personalBackground}` : ''}

Return JSON: { "content": "full motivation letter text" }`;

    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.PRO);
    return result.content;
  }

  // ── Study Plan ────────────────────────────────────────────────────────

  async generateStudyPlan(userId: string, data: {
    university: string;
    program: string;
    duration: string;
    currentQualification: string;
    intendedCourses?: string[];
    researchPlan?: string;
    postStudyPlans?: string;
    wordLimit?: number;
  }): Promise<string> {
    const prompt = `Write a detailed Study Plan (${data.wordLimit || 600} words) for:
University: ${data.university} | Program: ${data.program} | Duration: ${data.duration}
Current Qualification: ${data.currentQualification}
${data.intendedCourses ? `Intended Courses: ${data.intendedCourses.join(', ')}` : ''}
${data.researchPlan ? `Research Plan: ${data.researchPlan}` : ''}
${data.postStudyPlans ? `Post-Study Plans: ${data.postStudyPlans}` : ''}

Return JSON: { "content": "full study plan text" }`;

    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.PRO);
    return result.content;
  }

  // ── Financial Letter ──────────────────────────────────────────────────

  async generateFinancialLetter(userId: string, data: {
    scholarshipName: string;
    university: string;
    financialSituation: string;
    supportingDetails?: string;
    wordLimit?: number;
  }): Promise<string> {
    const prompt = `Write a Financial Need Letter (${data.wordLimit || 400} words) for:
Scholarship: ${data.scholarshipName} | University: ${data.university}
Financial Situation: ${data.financialSituation}
${data.supportingDetails ? `Supporting Details: ${data.supportingDetails}` : ''}

Return JSON: { "content": "full financial letter text" }`;

    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.PRO);
    return result.content;
  }

  // ── Bio ───────────────────────────────────────────────────────────────

  async generateBio(userId: string, data: {
    bioType: string;
    resumeId?: string;
    name?: string;
    currentRole?: string;
    company?: string;
    yearsOfExperience?: number;
    keySkills?: string[];
    tone?: string;
    wordLimit?: number;
    includeCallToAction?: boolean;
  }): Promise<string> {
    let resumeData: any = null;
    if (data.resumeId) {
      resumeData = await prisma.resume.findFirst({ where: { id: data.resumeId, userId } });
    }

    const prompt = `Write a compelling ${data.bioType} bio${data.wordLimit ? ` (max ${data.wordLimit} words)` : ''}.
Name: ${data.name || (resumeData?.personalInfo as any)?.name || 'Professional'}
Role: ${data.currentRole} ${data.company ? `at ${data.company}` : ''}
Experience: ${data.yearsOfExperience} years
Skills: ${data.keySkills?.join(', ') || ''}
Tone: ${data.tone || 'professional'}
${data.includeCallToAction ? 'Include a call to action at the end.' : ''}

Return JSON: { "content": "bio text" }`;

    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.FLASH);
    return result.content;
  }

  // ── Interview ─────────────────────────────────────────────────────────

  async generateInterviewQuestions(userId: string, data: {
    resumeId: string;
    jobDescription?: string;
    questionCount?: number;
    categories?: string[];
    difficulty?: string;
    includeAnswerTips?: boolean;
  }) {
    const resume = await prisma.resume.findFirst({ where: { id: data.resumeId, userId } });

    const prompt = `Generate ${data.questionCount || 10} interview questions.
Categories: ${(data.categories || ['behavioral', 'technical', 'situational']).join(', ')}
Difficulty: ${data.difficulty || 'mid'}
${data.jobDescription ? `Job Description: ${data.jobDescription.substring(0, 800)}` : ''}
${resume ? `Candidate Background: ${JSON.stringify({ summary: resume.summary, experience: resume.experience?.slice(0, 2) })}` : ''}

Return JSON: { "questions": [{ "id": "q1", "category": string, "question": string, "difficulty": string, "answerTip": string }] }`;

    return generateStructuredContent<any>(prompt, MODELS.PRO);
  }

  async generateInterviewFeedback(questionId: string, question: string, userAnswer: string) {
    const prompt = `Evaluate this interview answer:
Question: ${question}
Answer: ${userAnswer}

Return JSON: { "score": 0-10, "feedback": string, "strengths": [string], "improvements": [string], "suggestedAnswer": string }`;

    return generateStructuredContent<any>(prompt, MODELS.PRO);
  }

  // ── Communication Analyzer ────────────────────────────────────────────

  async analyzeCommunication(userId: string, data: {
    text: string;
    context?: string;
    targetAudience?: string;
  }) {
    const prompt = `Analyze this professional communication sample.
Context: ${data.context || 'general'}
Target Audience: ${data.targetAudience || 'general'}
Text: ${data.text.substring(0, 3000)}

Return JSON: {
  "overallScore": 0-100,
  "clarity": 0-100,
  "grammar": 0-100,
  "tone": 0-100,
  "professionalism": 0-100,
  "suggestions": [{ "type": string, "issue": string, "fix": string }],
  "highlights": [{ "text": string, "type": "strength"|"weakness", "comment": string }]
}`;

    return generateStructuredContent<any>(prompt, MODELS.FLASH);
  }

  // ── Keywords ──────────────────────────────────────────────────────────

  async extractKeywords(text: string, maxKeywords = 30, includeWeights = false) {
    const prompt = `Extract the top ${maxKeywords} professional keywords from this text.
Text: ${text.substring(0, 3000)}

Return JSON: { "keywords": [string], ${includeWeights ? '"weights": { "keyword": number }' : ''} }`;

    return generateStructuredContent<any>(prompt, MODELS.FLASH);
  }

  // ── Grammar & Text ────────────────────────────────────────────────────

  async fixGrammar(text: string, mode: string = 'grammar_only') {
    const prompt = `Fix grammar and style in this text. Mode: ${mode}.
Text: ${text}

Return JSON: { "original": string, "corrected": string, "changes": [{ "original": string, "corrected": string, "reason": string }] }`;

    return generateStructuredContent<any>(prompt, MODELS.FLASH);
  }

  async improveText(text: string, tone?: string, context?: string) {
    const prompt = `Improve this text.
Tone: ${tone || 'professional'} | Context: ${context || 'general'}
Text: ${text}

Return JSON: { "improved": string, "changes": [{ "description": string }] }`;

    return generateStructuredContent<any>(prompt, MODELS.FLASH);
  }
}

// Keep backward compatibility with existing functional exports
export {
  generateContent,
};

export default new AIService();
