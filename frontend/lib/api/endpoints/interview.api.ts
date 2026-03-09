import apiClient from '@/lib/api/client';

// ── Types ──────────────────────────────────────────────────────────────────

export interface InterviewSessionSummary {
  id: string;
  difficulty?: string | null;
  questionCount: number;
  categories: string[];
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  resumeId: string;
  jobDescription?: string | null;
  questionCount: number;
  categories: string[];
  difficulty?: string | null;
  questions: unknown[];
  createdAt: string;
}

export interface PaginatedInterviewSessions {
  data: InterviewSessionSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GenerateSessionRequest {
  resumeId: string;
  jobDescription?: string;
  questionCount?: number;
  categories?: string[];
  difficulty?: string;
  includeAnswerTips?: boolean;
}

// ── API Module ──────────────────────────────────────────────────────────────

export const interviewApi = {
  /** GET /interview */
  getSessions: (page?: number, limit?: number): Promise<PaginatedInterviewSessions> =>
    apiClient.get('/interview', { params: { page, limit } }).then((r) => r.data.data),

  /** POST /interview/generate */
  generateSession: (data: GenerateSessionRequest): Promise<InterviewSession> =>
    apiClient.post('/interview/generate', data).then((r) => r.data.data.session),

  /** GET /interview/:id */
  getSessionById: (id: string): Promise<InterviewSession> =>
    apiClient.get(`/interview/${id}`).then((r) => r.data.data.session),

  /** POST /interview/:id/feedback */
  submitFeedback: (id: string, feedback: { questionId: string; userAnswer: string }): Promise<unknown> =>
    apiClient.post(`/interview/${id}/feedback`, feedback).then((r) => r.data.data.feedback),

  /** DELETE /interview/:id */
  deleteSession: (id: string): Promise<void> =>
    apiClient.delete(`/interview/${id}`).then(() => undefined),
};
