import { generateContent, generateStructuredContent, MODELS } from '@/config/gemini';
import { env } from '@/config/env';
import { INTERVIEW } from '@/constants/interview';
import PROMPTS from '@/services/ai/prompts';
import ENHANCED_PROMPTS from '@/services/ai/enhancedPrompts';
import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/utils/errorHandler';

// Use enhanced prompts for better results
const USE_ENHANCED_PROMPTS = env.USE_ENHANCED_PROMPTS;

// ── Type Definitions ──────────────────────────────────────────────────────

interface EnhanceResumeOptions {
  readonly section: string;
  readonly targetRole?: string;
  readonly industry?: string;
}

interface TailorResumeOptions {
  readonly resume: any;
  readonly jobDescription: string;
  readonly companyName?: string;
  readonly jobTitle?: string;
  readonly aggressiveness: 'subtle' | 'moderate' | 'aggressive';
}

interface CoverLetterOptions {
  readonly type: string;
  readonly resumeId?: string;
  readonly jobDescription?: string;
  readonly companyName?: string;
  readonly jobTitle?: string;
  readonly hiringManagerName?: string;
  readonly tone?: string;
  readonly wordLimit?: number;
  readonly keyPoints?: string[];
  readonly customContext?: string;
  readonly language?: string;
}

interface SOPOptions {
  readonly university: string;
  readonly program: string;
  readonly careerGoals: string;
  readonly country?: string;
  readonly resumeId?: string;
  readonly researchInterests?: string;
  readonly whyThisProgram?: string;
  readonly achievements?: string[];
  readonly challenges?: string;
  readonly wordLimit?: number;
  readonly scholarshipName?: string;
  readonly language?: string;
}

interface MotivationLetterOptions {
  readonly university: string;
  readonly program: string;
  readonly motivation: string;
  readonly careerGoals: string;
  readonly resumeId?: string;
  readonly personalBackground?: string;
  readonly wordLimit?: number;
}

interface StudyPlanOptions {
  readonly university: string;
  readonly program: string;
  readonly duration: string;
  readonly currentQualification: string;
  readonly intendedCourses?: string[];
  readonly researchPlan?: string;
  readonly postStudyPlans?: string;
  readonly wordLimit?: number;
}

interface FinancialLetterOptions {
  readonly scholarshipName: string;
  readonly university: string;
  readonly financialSituation: string;
  readonly supportingDetails?: string;
  readonly wordLimit?: number;
}

interface BioOptions {
  readonly bioType: string;
  readonly resumeId?: string;
  readonly name?: string;
  readonly currentRole?: string;
  readonly company?: string;
  readonly yearsOfExperience?: number;
  readonly keySkills?: string[];
  readonly tone?: string;
  readonly wordLimit?: number;
  readonly includeCallToAction?: boolean;
}

interface InterviewQuestionsOptions {
  readonly resumeId: string;
  readonly jobDescription?: string;
  readonly questionCount?: number;
  readonly categories?: string[];
  readonly difficulty?: string;
  readonly includeAnswerTips?: boolean;
}

interface CommunicationAnalysisOptions {
  readonly text: string;
  readonly context?: string;
  readonly targetAudience?: string;
}

// ── Helper Functions ──────────────────────────────────────────────────────

async function getResumeOrThrow(resumeId: string, userId: string): Promise<any> {
  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
  if (!resume) throw new NotFoundError('Resume not found');
  return resume;
}

function validateUserId(userId: string): void {
  if (!userId) throw new ValidationError('userId is required');
}

function validateResumeId(resumeId: string): void {
  if (!resumeId) throw new ValidationError('resumeId is required');
}

/**
 * AIService — class-based facade for all AI generation & analysis
 * Integrates with Google Gemini via the existing config/gemini helpers.
 */
export class AIService {

  // ── Resume Enhancement ────────────────────────────────────────────────

  async enhanceResumeSection(userId: string, resumeId: string, options: EnhanceResumeOptions) {
    validateUserId(userId);
    validateResumeId(resumeId);
    if (!options.section) throw new ValidationError('section is required');

    const resume = await getResumeOrThrow(resumeId, userId);

    const prompt = `You are a professional resume writer. Enhance the "${options.section}" section of this resume.
Target Role: ${options.targetRole || 'Not specified'}
Industry: ${options.industry || 'Not specified'}

Current resume data:
${JSON.stringify(resume, null, 2)}

Return JSON: { "enhanced": { ... section data }, "suggestions": ["improvement 1", ...] }`;

    return generateStructuredContent<any>(prompt, MODELS.PRO);
  }

  async scoreATS(userId: string, resumeId: string, jobDescription: string) {
    validateUserId(userId);
    validateResumeId(resumeId);
    if (!jobDescription) throw new ValidationError('jobDescription is required');

    const resume = await getResumeOrThrow(resumeId, userId);
    const P = USE_ENHANCED_PROMPTS ? ENHANCED_PROMPTS : PROMPTS;
    
    return generateStructuredContent<any>(P.ATS_ANALYZE(resume, jobDescription), MODELS.FLASH);
  }

  async generateSuggestions(userId: string, resumeId: string, section: string, targetRole?: string) {
    validateUserId(userId);
    validateResumeId(resumeId);
    if (!section) throw new ValidationError('section is required');

    const resume = await getResumeOrThrow(resumeId, userId);

    const prompt = `Provide actionable improvement suggestions for the "${section}" section of this resume.
Target Role: ${targetRole || 'Not specified'}
Resume: ${JSON.stringify(resume)}
Return JSON: { "suggestions": [{ "type": string, "original": string, "suggested": string, "reason": string }] }`;

    return generateStructuredContent<any>(prompt, MODELS.FLASH);
  }

  async tailorResume(options: TailorResumeOptions) {
    if (!options.resume) throw new ValidationError('resume is required');
    if (!options.jobDescription) throw new ValidationError('jobDescription is required');

    const P = USE_ENHANCED_PROMPTS ? ENHANCED_PROMPTS : PROMPTS;
    const prompt = P.RESUME_TAILOR(options.resume, options.jobDescription);
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
    if (!resume) throw new ValidationError('resume is required');
    if (!jobDescription) throw new ValidationError('jobDescription is required');

    const prompt = this.buildOptimizationPrompt(resume, jobDescription);
    return generateStructuredContent<any>(prompt, MODELS.PRO);
  }

  private buildOptimizationPrompt(resume: any, jobDescription: string): string {
    return `Optimize the following resume based on the job description.
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
  }

  // ── Cover Letter ─────────────────────────────────────────────────────

  async generateCoverLetter(userId: string, options: CoverLetterOptions): Promise<string> {
    validateUserId(userId);
    if (!options.type) throw new ValidationError('type is required');

    const resumeData = await this.getResumeIfProvided(userId, options.resumeId);
    const prompt = this.buildCoverLetterPrompt(options, resumeData);
    
    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.PRO);
    return result.content;
  }

  private async getResumeIfProvided(userId: string, resumeId?: string): Promise<any | null> {
    if (!resumeId) return null;
    return getResumeOrThrow(resumeId, userId);
  }

  private buildCoverLetterPrompt(options: CoverLetterOptions, resumeData: any): string {
    return `You are an expert cover letter writer. Write a ${options.wordLimit || 350}-word ${options.type} cover letter.
${resumeData ? `Candidate Info: ${JSON.stringify({ name: (resumeData.personalInfo as any)?.name, summary: resumeData.summary })}` : ''}
Company: ${options.companyName || 'N/A'} | Role: ${options.jobTitle || 'N/A'}
Tone: ${options.tone || 'professional'} | Language: ${options.language || 'en'}
${options.hiringManagerName ? `Hiring Manager: ${options.hiringManagerName}` : ''}
${options.jobDescription ? `Job Description: ${options.jobDescription.substring(0, 1000)}` : ''}
${options.keyPoints ? `Key Points to Include: ${options.keyPoints.join(', ')}` : ''}
${options.customContext || ''}

Return JSON: { "content": "full cover letter text" }`;
  }

  // ── SOP ──────────────────────────────────────────────────────────────

  async generateSOP(userId: string, options: SOPOptions): Promise<string> {
    validateUserId(userId);
    if (!options.university) throw new ValidationError('university is required');
    if (!options.program) throw new ValidationError('program is required');
    if (!options.careerGoals) throw new ValidationError('careerGoals is required');

    const prompt = this.buildSOPPrompt(options);
    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.PRO);
    return result.content;
  }

  private buildSOPPrompt(options: SOPOptions): string {
    return `Write a compelling Statement of Purpose (${options.wordLimit || 800} words) for:
University: ${options.university} | Program: ${options.program} ${options.country ? `| Country: ${options.country}` : ''}
Career Goals: ${options.careerGoals}
${options.researchInterests ? `Research Interests: ${options.researchInterests}` : ''}
${options.whyThisProgram ? `Why This Program: ${options.whyThisProgram}` : ''}
${options.achievements ? `Achievements: ${options.achievements.join(', ')}` : ''}
${options.challenges ? `Challenges Overcome: ${options.challenges}` : ''}
${options.scholarshipName ? `For Scholarship: ${options.scholarshipName}` : ''}
Language: ${options.language || 'en'}

Return JSON: { "content": "full SOP text" }`;
  }

  // ── Motivation Letter ─────────────────────────────────────────────────

  async generateMotivationLetter(userId: string, options: MotivationLetterOptions): Promise<string> {
    validateUserId(userId);
    if (!options.university) throw new ValidationError('university is required');
    if (!options.program) throw new ValidationError('program is required');
    if (!options.motivation) throw new ValidationError('motivation is required');
    if (!options.careerGoals) throw new ValidationError('careerGoals is required');

    const prompt = `Write a compelling Motivation Letter (${options.wordLimit || 600} words) for:
University: ${options.university} | Program: ${options.program}
Motivation: ${options.motivation}
Career Goals: ${options.careerGoals}
${options.personalBackground ? `Background: ${options.personalBackground}` : ''}

Return JSON: { "content": "full motivation letter text" }`;

    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.PRO);
    return result.content;
  }

  // ── Study Plan ────────────────────────────────────────────────────────

  async generateStudyPlan(userId: string, options: StudyPlanOptions): Promise<string> {
    validateUserId(userId);
    if (!options.university) throw new ValidationError('university is required');
    if (!options.program) throw new ValidationError('program is required');
    if (!options.duration) throw new ValidationError('duration is required');
    if (!options.currentQualification) throw new ValidationError('currentQualification is required');

    const prompt = `Write a detailed Study Plan (${options.wordLimit || 600} words) for:
University: ${options.university} | Program: ${options.program} | Duration: ${options.duration}
Current Qualification: ${options.currentQualification}
${options.intendedCourses ? `Intended Courses: ${options.intendedCourses.join(', ')}` : ''}
${options.researchPlan ? `Research Plan: ${options.researchPlan}` : ''}
${options.postStudyPlans ? `Post-Study Plans: ${options.postStudyPlans}` : ''}

Return JSON: { "content": "full study plan text" }`;

    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.PRO);
    return result.content;
  }

  // ── Financial Letter ──────────────────────────────────────────────────

  async generateFinancialLetter(userId: string, options: FinancialLetterOptions): Promise<string> {
    validateUserId(userId);
    if (!options.scholarshipName) throw new ValidationError('scholarshipName is required');
    if (!options.university) throw new ValidationError('university is required');
    if (!options.financialSituation) throw new ValidationError('financialSituation is required');

    const prompt = `Write a Financial Need Letter (${options.wordLimit || 400} words) for:
Scholarship: ${options.scholarshipName} | University: ${options.university}
Financial Situation: ${options.financialSituation}
${options.supportingDetails ? `Supporting Details: ${options.supportingDetails}` : ''}

Return JSON: { "content": "full financial letter text" }`;

    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.PRO);
    return result.content;
  }

  // ── Bio ───────────────────────────────────────────────────────────────

  async generateBio(userId: string, options: BioOptions): Promise<string> {
    validateUserId(userId);
    if (!options.bioType) throw new ValidationError('bioType is required');

    const resumeData = await this.getResumeIfProvided(userId, options.resumeId);
    const prompt = this.buildBioPrompt(options, resumeData);

    const result = await generateStructuredContent<{ content: string }>(prompt, MODELS.FLASH);
    return result.content;
  }

  private buildBioPrompt(options: BioOptions, resumeData: any): string {
    return `Write a compelling ${options.bioType} bio${options.wordLimit ? ` (max ${options.wordLimit} words)` : ''}.
Name: ${options.name || (resumeData?.personalInfo as any)?.name || 'Professional'}
Role: ${options.currentRole} ${options.company ? `at ${options.company}` : ''}
Experience: ${options.yearsOfExperience} years
Skills: ${options.keySkills?.join(', ') || ''}
Tone: ${options.tone || 'professional'}
${options.includeCallToAction ? 'Include a call to action at the end.' : ''}

Return JSON: { "content": "bio text" }`;
  }

  // ── Interview ─────────────────────────────────────────────────────────

  async generateInterviewQuestions(userId: string, options: InterviewQuestionsOptions) {
    validateUserId(userId);
    validateResumeId(options.resumeId);

    const resume = await getResumeOrThrow(options.resumeId, userId);
    const prompt = this.buildInterviewQuestionsPrompt(options, resume);

    return generateStructuredContent<any>(prompt, MODELS.PRO);
  }

  private buildInterviewQuestionsPrompt(options: InterviewQuestionsOptions, resume: any): string {
    const categories = options.categories || ['behavioral', 'technical', 'situational'];
    return `Generate ${options.questionCount || INTERVIEW.DEFAULT_QUESTION_COUNT} interview questions.
Categories: ${categories.join(', ')}
Difficulty: ${options.difficulty || 'mid'}
${options.jobDescription ? `Job Description: ${options.jobDescription.substring(0, 800)}` : ''}
Candidate Background: ${JSON.stringify({ summary: resume.summary, experience: resume.experience?.slice(0, 2) })}

Return JSON: { "questions": [{ "id": "q1", "category": string, "question": string, "difficulty": string, "answerTip": string }] }`;
  }

  async generateInterviewFeedback(questionId: string, question: string, userAnswer: string) {
    if (!questionId) throw new ValidationError('questionId is required');
    if (!question) throw new ValidationError('question is required');
    if (!userAnswer) throw new ValidationError('userAnswer is required');

    const prompt = `Evaluate this interview answer:
Question: ${question}
Answer: ${userAnswer}

Return JSON: { "score": 0-10, "feedback": string, "strengths": [string], "improvements": [string], "suggestedAnswer": string }`;

    return generateStructuredContent<any>(prompt, MODELS.PRO);
  }

  // ── Communication Analyzer ────────────────────────────────────────────

  async analyzeCommunication(userId: string, options: CommunicationAnalysisOptions) {
    validateUserId(userId);
    if (!options.text) throw new ValidationError('text is required');

    const prompt = `Analyze this professional communication sample.
Context: ${options.context || 'general'}
Target Audience: ${options.targetAudience || 'general'}
Text: ${options.text.substring(0, 3000)}

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
    if (!text) throw new ValidationError('text is required');

    const prompt = `Extract the top ${maxKeywords} professional keywords from this text.
Text: ${text.substring(0, 3000)}

Return JSON: { "keywords": [string], ${includeWeights ? '"weights": { "keyword": number }' : ''} }`;

    return generateStructuredContent<any>(prompt, MODELS.FLASH);
  }

  // ── Grammar & Text ────────────────────────────────────────────────────

  async fixGrammar(text: string, mode = 'grammar_only') {
    if (!text) throw new ValidationError('text is required');

    const prompt = `Fix grammar and style in this text. Mode: ${mode}.
Text: ${text}

Return JSON: { "original": string, "corrected": string, "changes": [{ "original": string, "corrected": string, "reason": string }] }`;

    return generateStructuredContent<any>(prompt, MODELS.FLASH);
  }

  async improveText(text: string, tone?: string, context?: string) {
    if (!text) throw new ValidationError('text is required');

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

