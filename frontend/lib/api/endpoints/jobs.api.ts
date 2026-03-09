import apiClient from '@/lib/api/client';

export interface EnqueuedJob {
  jobId: string;
  status: 'processing';
}

export interface JobStatus {
  jobId: string;
  status: 'processing' | 'complete' | 'failed';
  result: Record<string, unknown> | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface JobStats {
  total: number;
  processing: number;
  complete: number;
  failed: number;
}

export const jobsApi = {
  startResumePdfJob: (resumeId: string): Promise<EnqueuedJob> =>
    apiClient.post(`/jobs/resume/${resumeId}/pdf`).then((r) => r.data.data),

  startResumeAtsScoreJob: (
    resumeId: string,
    payload: { jobDescription: string; returnSuggestions?: boolean }
  ): Promise<EnqueuedJob> =>
    apiClient.post(`/jobs/resume/${resumeId}/ats-score`, payload).then((r) => r.data.data),

  getJobStatus: (jobId: string): Promise<JobStatus> =>
    apiClient.get(`/jobs/${jobId}`).then((r) => r.data.data),

  listMyJobs: (): Promise<{ jobs: JobStatus[] }> =>
    apiClient.get('/jobs/mine').then((r) => r.data.data),

  getQueueHealth: (): Promise<{ stats: JobStats; cleaned: number }> =>
    apiClient.get('/jobs/health').then((r) => r.data.data),
};
