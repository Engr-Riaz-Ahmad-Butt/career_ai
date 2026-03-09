import { resumeAnalysis } from '@/lib/mockData';
import type { AnalysisKeyword, AnalysisMetric } from '@/types/atsAnalysis.types';

export const MIN_JOB_DESCRIPTION_LENGTH = 50;

export const ATS_CHART_COLORS = ['#4f46e5', '#a855f7', '#ec4899', '#f59e0b'] as const;

export const ANALYZE_PAGE_COPY = {
  header: {
    title: 'ATS Analysis',
    description: 'Optimize your resume for specific job descriptions',
  },
  form: {
    title: 'New Analysis',
    description: 'Select a resume and provide a job description for AI analysis',
    resumeLabel: 'Select Resume',
    resumePlaceholder: 'Select a resume...',
    jobDescriptionLabel: 'Job Description',
    jobDescriptionPlaceholder: 'Paste the job description here (at least 50 characters)...',
    backgroundButton: 'Analyze In Background',
    streamButton: 'Live Stream Analysis',
  },
  states: {
    loadingResumes: 'Loading your resumes...',
    loadingAnalysis: 'Running ATS analysis...',
    resumeErrorTitle: 'Unable to load resumes',
    analysisErrorTitle: 'Analysis failed',
    noResumesTitle: 'No resumes available',
    noResumesDescription: 'Create or upload a resume to start ATS analysis.',
    noAnalysisTitle: 'No analysis yet',
    noAnalysisDescription: 'Run an analysis to see ATS scores and recommendations.',
    retryButton: 'Retry',
  },
  results: {
    keywordMatchTitle: 'Top Keywords Match',
    keywordDistributionTitle: 'Keyword Distribution',
    recommendationsTitle: 'AI Recommendations',
    streamIdle: 'Idle',
  },
  messages: {
    queued: 'ATS analysis queued. Polling for result...',
    completed: 'ATS analysis complete',
    queueFailed: 'Failed to queue ATS analysis',
    streamFailed: 'Live stream analysis failed',
  },
} as const;

export const DEFAULT_METRICS: readonly AnalysisMetric[] = [
  { label: 'Communication', score: resumeAnalysis.communicationScore },
  { label: 'Clarity', score: resumeAnalysis.clarityScore },
  { label: 'Keyword Density', score: resumeAnalysis.keywordDensityScore },
  { label: 'Readability', score: resumeAnalysis.readabilityScore },
] as const;

export const DEFAULT_KEYWORDS: readonly AnalysisKeyword[] = [
  { id: 'keyword-javascript', name: 'JavaScript', value: 45 },
  { id: 'keyword-react', name: 'React', value: 38 },
  { id: 'keyword-python', name: 'Python', value: 28 },
  { id: 'keyword-aws', name: 'AWS', value: 22 },
] as const;

export const DEFAULT_SUGGESTIONS = resumeAnalysis.suggestions as readonly string[];
