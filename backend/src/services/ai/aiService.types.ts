// ── Resume Shape ────────────────────────────────────────────────────────────

export interface ResumePersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  [key: string]: any;
}

export interface ResumeExperienceItem {
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
  [key: string]: any;
}

export interface ResumeEducationItem {
  degree: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export interface ResumeSkills {
  technical?: string[];
  soft?: string[];
  tools?: string[];
  languages?: string[];
  [key: string]: any;
}

export interface ResumeData {
  personalInfo?: ResumePersonalInfo;
  summary?: string;
  experience?: ResumeExperienceItem[];
  education?: ResumeEducationItem[];
  skills?: ResumeSkills;
  certifications?: unknown[];
  projects?: unknown[];
  languages?: unknown[];
  [key: string]: any;
}

// ── AI Response Shapes ───────────────────────────────────────────────────────

export interface ATSScoreResult {
  score: number;
  keywordMatch: number;
  formatScore: number;
  impactScore: number;
  extractedKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface TailorResumeResult {
  tailoredContent: ResumeData;
  extractedKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  atsScore: number;
  suggestions: Array<{ type: string; original: string; suggested: string; reason: string }>;
}

export interface EnhanceResumeResult {
  enhanced: Record<string, unknown>;
  suggestions: string[];
}

export interface SuggestionItem {
  type: string;
  original: string;
  suggested: string;
  reason: string;
}

export interface SuggestionsResult {
  suggestions: SuggestionItem[];
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  difficulty: string;
  answerTip: string;
  [key: string]: any;
}

export interface InterviewQuestionsResult {
  questions: InterviewQuestion[];
}

export interface InterviewFeedbackResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}

export interface CommunicationAnalysisResult {
  overallScore: number;
  clarity: number;
  grammar: number;
  tone: number;
  professionalism: number;
  suggestions: Array<{ type: string; issue: string; fix: string }>;
  highlights: Array<{ text: string; type: 'strength' | 'weakness'; comment: string }>;
}

export interface ExtractResumeResult {
  personalInfo: ResumePersonalInfo;
  summary: string;
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  skills: ResumeSkills;
  projects: Array<{ name: string; description: string; technologies: string[] }>;
}

export interface OptimizeResumeResult {
  optimizedResume: ResumeData;
  keyChanges: Array<{ section: string; before: string; after: string; reason: string }>;
  missingKeywords: string[];
  matchedKeywords: string[];
}

export interface KeywordsResult {
  keywords: string[];
  weights?: Record<string, number>;
}

export interface GrammarFixResult {
  original: string;
  corrected: string;
  changes: Array<{ original: string; corrected: string; reason: string }>;
}

export interface ImproveTextResult {
  improved: string;
  changes: Array<{ description: string }>;
}
