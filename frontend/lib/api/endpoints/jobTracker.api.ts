import apiClient from '@/lib/api/client';

export interface JobTrackerEntry {
  id: string;
  title: string;
  company: string;
  location?: string;
  url?: string;
  description?: string;
  status: 'WISHLIST' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'ACCEPTED' | 'REJECTED';
  appliedAt?: string;
  notes?: string;
  salary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobTrackerListResponse {
  data: JobTrackerEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const jobTrackerApi = {
  list: (params?: { status?: string; page?: number; limit?: number }): Promise<JobTrackerListResponse> =>
    apiClient.get('/jobs', { params: params ?? {} }).then((r) => r.data.data),

  create: (data: Omit<JobTrackerEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ job: JobTrackerEntry }> =>
    apiClient.post('/jobs', data).then((r) => r.data.data),

  update: (id: string, data: Partial<JobTrackerEntry>): Promise<{ job: JobTrackerEntry }> =>
    apiClient.patch(`/jobs/${id}`, data).then((r) => r.data.data),

  remove: (id: string): Promise<void> =>
    apiClient.delete(`/jobs/${id}`).then((r) => r.data),
};
