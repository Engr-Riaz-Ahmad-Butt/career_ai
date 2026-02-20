import { generateContent, generateStructuredContent, MODELS } from '../../config/gemini';
import PROMPTS from './prompts';
import ENHANCED_PROMPTS from './enhanced-prompts';
import prisma from '../../config/database';

// Use enhanced prompts for better results
const USE_ENHANCED_PROMPTS = process.env.USE_ENHANCED_PROMPTS !== 'false'; // Default to true

/**
 * AI Service for CareerForge
 * Handles all AI-powered generation and analysis
 */

interface ResumeGenerationInput {
  name: string;
  email: string;
  phone?: string;
  targetRole: string;
  experience?: string;
  education?: string;
  skills?: string;
  additionalInfo?: string;
}

interface ResumeTailoringInput {
  resume: any;
  jobDescription: string;
}

interface CoverLetterInput {
  resumeData: any;
  jobDescription?: string;
  company?: string;
  role?: string;
  letterType: 'job_application' | 'networking' | 'inquiry' | 'referral';
}

interface SOPInput {
  personalInfo: any;
  targetProgram: string;
  university: string;
  background: string;
  goals: string;
  whyThisProgram: string;
}

/**
 * Generate resume from scratch using AI
 */
export const generateResume = async (input: ResumeGenerationInput, userId: string) => {
  try {
    // Use enhanced prompts for better results
    const promptTemplate = USE_ENHANCED_PROMPTS ? ENHANCED_PROMPTS : PROMPTS;
    const prompt = promptTemplate.RESUME_GENERATE(input);
    const result = await generateStructuredContent<any>(prompt, MODELS.PRO);

    // Log credit usage
    await logCreditUsage(userId, 'resume_generate', 2);

    return result;
  } catch (error: any) {
    throw new Error(`Resume generation failed: ${error.message}`);
  }
};

/**
 * Tailor existing resume for job description
 */
export const tailorResume = async (input: ResumeTailoringInput, userId: string) => {
  try {
    const promptTemplate = USE_ENHANCED_PROMPTS ? ENHANCED_PROMPTS : PROMPTS;
    const prompt = promptTemplate.RESUME_TAILOR(input.resume, input.jobDescription);
    const result = await generateStructuredContent<any>(prompt, MODELS.PRO);

    // Log credit usage
    await logCreditUsage(userId, 'resume_tailor', 2);

    return result;
  } catch (error: any) {
    throw new Error(`Resume tailoring failed: ${error.message}`);
  }
};

/**
 * Improve uploaded resume
 */
export const improveResume = async (resumeText: string, userId: string) => {
  try {
    const prompt = PROMPTS.RESUME_IMPROVE(resumeText);
    const result = await generateStructuredContent<any>(prompt, MODELS.PRO);

    // Log credit usage
    await logCreditUsage(userId, 'resume_improve', 1);

    return result;
  } catch (error: any) {
    throw new Error(`Resume improvement failed: ${error.message}`);
  }
};

/**
 * Generate cover letter
 */
export const generateCoverLetter = async (input: CoverLetterInput, userId: string) => {
  try {
    const promptTemplate = USE_ENHANCED_PROMPTS ? ENHANCED_PROMPTS : PROMPTS;
    const prompt = promptTemplate.COVER_LETTER(input);
    const result = await generateStructuredContent<any>(prompt, MODELS.PRO);

    // Log credit usage
    await logCreditUsage(userId, 'cover_letter_generate', 1);

    return result;
  } catch (error: any) {
    throw new Error(`Cover letter generation failed: ${error.message}`);
  }
};

/**
 * Generate Statement of Purpose
 */
export const generateSOP = async (input: SOPInput, userId: string) => {
  try {
    const prompt = PROMPTS.SOP_GENERATE(input);
    const result = await generateStructuredContent<any>(prompt, MODELS.PRO);

    // Log credit usage
    await logCreditUsage(userId, 'sop_generate', 2);

    return result;
  } catch (error: any) {
    throw new Error(`SOP generation failed: ${error.message}`);
  }
};

/**
 * Analyze resume for ATS score
 */
export const analyzeATS = async (resume: any, jobDescription?: string, userId?: string) => {
  try {
    const promptTemplate = USE_ENHANCED_PROMPTS ? ENHANCED_PROMPTS : PROMPTS;
    const prompt = promptTemplate.ATS_ANALYZE(resume, jobDescription);
    const result = await generateStructuredContent<any>(prompt, MODELS.FLASH);

    if (userId) {
      // Log credit usage (ATS is free but we track it)
      await logCreditUsage(userId, 'ats_analyze', 0);
    }

    return result;
  } catch (error: any) {
    throw new Error(`ATS analysis failed: ${error.message}`);
  }
};

/**
 * Generate LinkedIn bio
 */
export const generateLinkedInBio = async (
  resumeData: any,
  tone: 'professional' | 'casual' | 'creative',
  targetAudience: string,
  userId: string
) => {
  try {
    const prompt = PROMPTS.LINKEDIN_BIO({ resumeData, tone, targetAudience });
    const result = await generateStructuredContent<any>(prompt, MODELS.FLASH);

    // Log credit usage
    await logCreditUsage(userId, 'linkedin_bio', 1);

    return result;
  } catch (error: any) {
    throw new Error(`LinkedIn bio generation failed: ${error.message}`);
  }
};

/**
 * Generate interview preparation questions
 */
export const generateInterviewQuestions = async (
  resumeData: any,
  jobDescription: string,
  userId: string
) => {
  try {
    const promptTemplate = USE_ENHANCED_PROMPTS ? ENHANCED_PROMPTS : PROMPTS;
    const prompt = promptTemplate.INTERVIEW_PREP(resumeData, jobDescription);
    const result = await generateStructuredContent<any>(prompt, MODELS.PRO);

    // Log credit usage
    await logCreditUsage(userId, 'interview_prep', 1);

    return result;
  } catch (error: any) {
    throw new Error(`Interview prep generation failed: ${error.message}`);
  }
};

/**
 * Analyze communication skills
 */
export const analyzeCommunication = async (writingSample: string, userId: string) => {
  try {
    const prompt = PROMPTS.COMMUNICATION_ANALYZE(writingSample);
    const result = await generateStructuredContent<any>(prompt, MODELS.FLASH);

    // Log credit usage
    await logCreditUsage(userId, 'communication_analyze', 1);

    return result;
  } catch (error: any) {
    throw new Error(`Communication analysis failed: ${error.message}`);
  }
};

/**
 * Extract keywords from job description
 */
export const extractKeywords = async (jobDescription: string, userId?: string) => {
  try {
    const prompt = PROMPTS.EXTRACT_KEYWORDS(jobDescription);
    const result = await generateStructuredContent<any>(prompt, MODELS.FLASH);

    if (userId) {
      // Free operation, just track it
      await logCreditUsage(userId, 'keyword_extract', 0);
    }

    return result;
  } catch (error: any) {
    throw new Error(`Keyword extraction failed: ${error.message}`);
  }
};

/**
 * Generate motivation letter for scholarship
 */
export const generateMotivationLetter = async (
  data: {
    personalInfo: any;
    targetProgram: string;
    university: string;
    background: string;
    motivation: string;
  },
  userId: string
) => {
  try {
    const prompt = `You are an expert scholarship application writer. Create a compelling motivation letter.

APPLICANT: ${data.personalInfo.name}
PROGRAM: ${data.targetProgram}
UNIVERSITY: ${data.university}
BACKGROUND: ${data.background}
MOTIVATION: ${data.motivation}

Create a 500-700 word motivation letter that:
1. Shows genuine passion for the field
2. Demonstrates fit with the program
3. Highlights relevant achievements
4. Explains future impact and goals

Return JSON: { "letter": "full letter", "wordCount": number }`;

    const result = await generateStructuredContent<any>(prompt, MODELS.PRO);

    // Log credit usage
    await logCreditUsage(userId, 'motivation_letter', 2);

    return result;
  } catch (error: any) {
    throw new Error(`Motivation letter generation failed: ${error.message}`);
  }
};

/**
 * Log AI credit usage
 */
const logCreditUsage = async (userId: string, action: string, credits: number) => {
  try {
    // Deduct credits from user
    if (credits > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: credits,
          },
        },
      });
    }

    // Log the usage
    await prisma.creditUsage.create({
      data: {
        userId,
        action,
        credits,
      },
    });
  } catch (error) {
    console.error('Failed to log credit usage:', error);
  }
};

/**
 * Check if user has enough credits
 */
export const checkCredits = async (userId: string, required: number): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, plan: true },
  });

  if (!user) return false;

  // Premium users have unlimited credits
  if (user.plan === 'PREMIUM' || user.plan === 'ENTERPRISE') {
    return true;
  }

  return user.credits >= required;
};

export default {
  generateResume,
  tailorResume,
  improveResume,
  generateCoverLetter,
  generateSOP,
  analyzeATS,
  generateLinkedInBio,
  generateInterviewQuestions,
  analyzeCommunication,
  extractKeywords,
  generateMotivationLetter,
  checkCredits,
};
