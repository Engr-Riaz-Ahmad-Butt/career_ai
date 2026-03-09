export const JOB_QUEUE_NAME = 'career_ai_jobs';

export const JOB_NAMES = {
  RESUME_PDF: 'resume_pdf',
  RESUME_ATS_SCORE: 'resume_ats_score',
} as const;

export type QueueJobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES];

export interface ResumePdfJobPayload {
  userId: string;
  resumeId: string;
}

export interface ResumeAtsScoreJobPayload {
  userId: string;
  resumeId: string;
  jobDescription: string;
  returnSuggestions: boolean;
}

export type QueueJobPayload = ResumePdfJobPayload | ResumeAtsScoreJobPayload;

export interface QueueJobStatus {
  jobId: string;
  type: QueueJobName;
  status: 'processing' | 'complete' | 'failed';
  result: unknown | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
  userId?: string;
}
