import apiClient from '@/lib/api/client';

// ── Types ──────────────────────────────────────────────────────────────────

export type DocumentType =
  | 'COVER_LETTER'
  | 'SOP'
  | 'MOTIVATION_LETTER'
  | 'RESIGNATION_LETTER'
  | 'LINKEDIN_BIO'
  | 'PORTFOLIO'
  | 'STUDY_PLAN'
  | 'FINANCIAL_LETTER'
  | 'BIO';

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  content: string;
  status?: string;
  metadata?: Record<string, unknown>;
  jobTitle?: string;
  company?: string;
  targetSchool?: string;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentListResponse {
  data: Document[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── API Module ──────────────────────────────────────────────────────────────

export const documentApi = {
    /** GET /documents */
    list: (params?: { type?: DocumentType; status?: string; search?: string; page?: number; limit?: number }): Promise<DocumentListResponse> =>
        apiClient.get('/documents', { params: params ?? {} }).then((r) => r.data.data),

    /** GET /documents/:id */
    getById: (id: string): Promise<Document> =>
        apiClient.get(`/documents/${id}`).then((r) => r.data.data.document),

    /** PUT /documents/:id */
    update: (id: string, data: Partial<Pick<Document, 'title' | 'content' | 'status'>>): Promise<Document> =>
        apiClient.put(`/documents/${id}`, data).then((r) => r.data.data.document),

    /** DELETE /documents/:id */
    delete: (id: string): Promise<void> =>
        apiClient.delete(`/documents/${id}`).then(() => undefined),

    /** POST /documents/:id/pdf */
    generatePdf: (id: string): Promise<{ pdfUrl: string; expiresAt: string }> =>
        apiClient.post(`/documents/${id}/pdf`).then((r) => r.data.data),

    /** POST /documents/:id/duplicate */
    duplicate: (id: string): Promise<Document> =>
        apiClient.post(`/documents/${id}/duplicate`).then((r) => r.data.data.document),

    /** POST /documents/cover-letter/generate */
    generateCoverLetter: (data: Record<string, unknown>): Promise<Document> =>
        apiClient.post('/documents/cover-letter/generate', data).then((r) => r.data.data.document),

    /** POST /documents/sop/generate */
    generateSop: (data: Record<string, unknown>): Promise<Document> =>
        apiClient.post('/documents/sop/generate', data).then((r) => r.data.data.document),

    /** POST /documents/bio/generate */
    generateBio: (data: Record<string, unknown>): Promise<Document> =>
        apiClient.post('/documents/bio/generate', data).then((r) => r.data.data.document),
};
