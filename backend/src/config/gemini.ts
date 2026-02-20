import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Model configurations
export const MODELS = {
  PRO: 'gemini-1.5-pro-latest', // For complex tasks (resume generation, detailed analysis)
  FLASH: 'gemini-1.5-flash-latest', // For quick tasks (keyword extraction, simple improvements)
};

/**
 * Get Gemini model instance
 */
export const getModel = (modelName: string = MODELS.PRO): GenerativeModel => {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });
};

/**
 * Generate content with Gemini
 */
export const generateContent = async (
  prompt: string,
  modelType: string = MODELS.PRO
): Promise<string> => {
  try {
    const model = getModel(modelType);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini generation failed: ${error.message}`);
  }
};

/**
 * Generate content with structured JSON output
 */
export const generateStructuredContent = async <T>(
  prompt: string,
  modelType: string = MODELS.PRO
): Promise<T> => {
  try {
    const model = getModel(modelType);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(cleanedText) as T;
  } catch (error: any) {
    console.error('Gemini Structured Generation Error:', error);
    throw new Error(`Failed to generate structured content: ${error.message}`);
  }
};

/**
 * Count tokens in text (approximate)
 */
export const estimateTokens = (text: string): number => {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
};

/**
 * Calculate cost for API call
 */
export const estimateCost = (inputTokens: number, outputTokens: number, modelType: string): number => {
  // Pricing (approximate as of 2024)
  const pricing = {
    [MODELS.PRO]: {
      input: 0.00025, // per 1K tokens
      output: 0.0005,
    },
    [MODELS.FLASH]: {
      input: 0.00005,
      output: 0.0001,
    },
  };

  const prices = pricing[modelType] || pricing[MODELS.PRO];
  return ((inputTokens / 1000) * prices.input) + ((outputTokens / 1000) * prices.output);
};

export default {
  getModel,
  generateContent,
  generateStructuredContent,
  estimateTokens,
  estimateCost,
  MODELS,
};
