import apiClient from '@/lib/api/client';

// ── Request Types ──────────────────────────────────────────────────────────

export interface CreateResumeRequest {
  title: string;
  template?: string;
  targetRole?: string;
  industry?: string;
  personalInfo?: Record<string, unknown>;
  summary?: string;
  experience?: unknown[];
  education?: unknown[];
  skills?: unknown;
  certifications?: unknown[];
  projects?: unknown[];
  languages?: unknown[];
  styling?: unknown;
}

export interface UpdateResumeRequest {
  title?: string;
  template?: string;
  targetRole?: string;
  industry?: string;
  personalInfo?: Record<string, unknown>;
  summary?: string;
  experience?: unknown[];
  education?: unknown[];
  skills?: unknown;
  certifications?: unknown[];
  projects?: unknown[];
  languages?: unknown[];
  styling?: unknown;
}

export interface TailorResumeRequest {
  baseResumeId: string;
  jobDescription: string;
  companyName?: string;
  jobTitle?: string;
  aggressiveness?: 'subtle' | 'moderate' | 'aggressive';
}

// ── Response Types ─────────────────────────────────────────────────────────

export interface Resume {
  id: string;
  title: string;
  template: string;
  targetRole?: string;
  industry?: string;
  status?: string;
  atsScore?: number;
  keywordMatch?: number;
  formatScore?: number;
  impactScore?: number;
  personalInfo?: Record<string, unknown>;
  summary?: string;
  experience?: unknown[];
  education?: unknown[];
  skills?: unknown;
  certifications?: unknown[];
  projects?: unknown[];
  languages?: unknown[];
  styling?: unknown;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeListResponse {
  data: Resume[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResumeVersionSummary {
  id: string;
  versionNum: number;
  createdAt: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: 'processing' | 'complete' | 'failed';
  result: Record<string, unknown> | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
}

// ── API Module ──────────────────────────────────────────────────────────────

export const resumeApi = {
  /** GET /resumes */
  list: (): Promise<ResumeListResponse> =>
    apiClient.get('/resumes').then((r) => r.data.data),

  /** GET /resumes/:id */
  getById: (id: string): Promise<Resume> =>
    apiClient.get(`/resumes/${id}`).then((r) => r.data.data.resume),

  /** POST /resumes */
  create: (data: CreateResumeRequest): Promise<Resume> =>
    apiClient.post('/resumes', data).then((r) => r.data.data.resume),

  /** PUT /resumes/:id */
  update: (id: string, data: UpdateResumeRequest): Promise<Resume> =>
    apiClient.put(`/resumes/${id}`, data).then((r) => r.data.data.resume),

  /** DELETE /resumes/:id */
  delete: (id: string): Promise<void> =>
    apiClient.delete(`/resumes/${id}`).then(() => undefined),

  /** POST /resumes/:id/duplicate */
  duplicate: (id: string): Promise<Resume> =>
    apiClient.post(`/resumes/${id}/duplicate`).then((r) => r.data.data.resume),

  /** POST /resumes/upload  — multipart form data */
  uploadFile: (file: File, title?: string): Promise<Resume> => {
    const form = new FormData();
    form.append('file', file);
    if (title) form.append('title', title);
    return apiClient
      .post('/resumes/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data.resume);
  },

  /** POST /jobs/resume/:id/pdf */
  generatePdf: (
    id: string
  ): Promise<{ jobId: string; status: 'processing' }> =>
    apiClient.post(`/jobs/resume/${id}/pdf`).then((r) => r.data.data),

  /** GET /jobs/:jobId — poll for job status (BullMQ flow) */
  getPdfStatus: (jobId: string): Promise<JobStatusResponse> =>
    apiClient.get(`/jobs/${jobId}`).then((r) => r.data.data),

  /** GET /resumes/:id/versions */
  getVersions: (id: string): Promise<ResumeVersionSummary[]> =>
    apiClient.get(`/resumes/${id}/versions`).then((r) => r.data.data.versions ?? r.data.data),

  /** POST /resumes/:id/restore/:versionId */
  restoreVersion: (id: string, versionId: string): Promise<Resume> =>
    apiClient.post(`/resumes/${id}/restore/${versionId}`).then((r) => r.data.data.resume),

  /** POST /resumes/:id/enhance */
  enhance: (
    id: string,
    data: { section: 'summary' | 'experience' | 'skills' | 'all'; targetRole?: string; industry?: string }
  ): Promise<unknown> => apiClient.post(`/resumes/${id}/enhance`, data).then((r) => r.data.data),

  /** POST /resumes/:id/ats-score */
  getAtsScore: (
    id: string,
    data: { jobDescription: string; returnSuggestions?: boolean }
  ): Promise<unknown> => apiClient.post(`/resumes/${id}/ats-score`, data).then((r) => r.data.data),

  /** POST /resumes/:id/optimize */
  optimize: (id: string, jobDescription: string): Promise<unknown> =>
    apiClient.post(`/resumes/${id}/optimize`, { jobDescription }).then((r) => r.data.data),

  /** POST /resumes/tailor */
  tailor: (data: TailorResumeRequest): Promise<unknown> =>
    apiClient.post('/resumes/tailor', data).then((r) => r.data.data),

  /** GET /resumes/tailor/history */
  getTailorHistory: (): Promise<unknown> =>
    apiClient.get('/resumes/tailor/history').then((r) => r.data.data),

  /** GET /resumes/tailor/:id */
  getTailoredById: (id: string): Promise<unknown> =>
    apiClient.get(`/resumes/tailor/${id}`).then((r) => r.data.data),

  /** DELETE /resumes/tailor/:id */
  deleteTailored: (id: string): Promise<void> =>
    apiClient.delete(`/resumes/tailor/${id}`).then(() => undefined),
};
