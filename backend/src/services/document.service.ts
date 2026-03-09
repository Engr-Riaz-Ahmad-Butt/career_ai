import prisma from '@/config/database';
import { createHttpError } from '@/utils/errorHandler';
import { DocumentType, DocumentStatus } from '@prisma/client';

// ─── Types & Interfaces ──────────────────────────────────────────────────

interface ListDocumentsOptions {
    readonly type?: DocumentType;
    readonly status?: DocumentStatus;
    readonly search?: string;
    readonly page?: number;
    readonly limit?: number;
    readonly sortBy?: string;
    readonly order?: 'asc' | 'desc';
}

interface UpdateDocumentOptions {
    readonly content?: string;
    readonly title?: string;
    readonly status?: DocumentStatus;
}

// ─── Validation Helpers ──────────────────────────────────────────────────

function normalizeDocumentListOptions(options: ListDocumentsOptions = {}): {
    readonly page: number;
    readonly limit: number;
    readonly skip: number;
    readonly sortBy: string;
    readonly order: 'asc' | 'desc';
    readonly filters: Record<string, unknown>;
} {
    const page = Math.max(options.page || 1, 1);
    const limit = Math.min(options.limit || 20, 50);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'updatedAt';
    const order = (options.order || 'desc') as 'asc' | 'desc';

    const filters: Record<string, unknown> = { userId: '' }; // userId added by caller

    if (options.type) filters.type = options.type;
    if (options.status) filters.status = options.status;
    if (options.search) {
        filters.title = { contains: options.search, mode: 'insensitive' };
    }

    return { page, limit, skip, sortBy, order, filters };
}

function calculateWordCount(content: string): number {
    return content.split(/\s+/).filter(w => w.length > 0).length;
}

// ─── Service Class ──────────────────────────────────────────────────────

export class DocumentService {

    // GET /documents - List user documents
    async listDocuments(
        userId: string,
        options: ListDocumentsOptions = {}
    ): Promise<{ data: any[]; total: number; page: number; limit: number; totalPages: number }> {
        if (!userId) throw createHttpError(400, 'userId is required');

        const { page, limit, skip, sortBy, order, filters } = normalizeDocumentListOptions(options);
        const where = { ...filters, userId } as Record<string, unknown>;
        const orderBy = { [sortBy]: order };

        const [docs, total] = await Promise.all([
            prisma.document.findMany({
                where: where as any,
                orderBy: orderBy as any,
                skip,
                take: limit,
            }),
            prisma.document.count({ where: where as any }),
        ]);

        return { data: docs, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // GET /documents/:id
    async getDocumentById(userId: string, id: string): Promise<any> {
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');

        const doc = await prisma.document.findFirst({ where: { id, userId } });
        if (!doc) throw createHttpError(404, 'Document not found');

        return doc;
    }

    // PUT /documents/:id
    async updateDocument(userId: string, id: string, options: UpdateDocumentOptions): Promise<any> {
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');
        if (!options || Object.keys(options).length === 0) throw createHttpError(400, 'No data to update');

        await this.getDocumentById(userId, id); // Verify ownership

        const updateData = this.buildDocumentUpdateData(options);
        const updated = await prisma.document.update({
            where: { id },
            data: updateData,
        });

        return updated;
    }

    // DELETE /documents/:id
    async deleteDocument(userId: string, id: string): Promise<void> {
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');

        await this.getDocumentById(userId, id); // Verify ownership
        await prisma.document.delete({ where: { id } });
    }

    // GET /documents/:id/pdf
    async generatePdf(userId: string, id: string): Promise<{ pdfUrl: string; expiresAt: Date }> {
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');

        await this.getDocumentById(userId, id); // Verify ownership

        const expiresAt = new Date(Date.now() + 3600000); // 1 hour
        const pdfUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/v1/documents/${id}/download`;

        return { pdfUrl, expiresAt };
    }

    // POST /documents/:id/duplicate
    async duplicateDocument(userId: string, id: string): Promise<any> {
        if (!userId || !id) throw createHttpError(400, 'userId and id are required');

        const original = await this.getDocumentById(userId, id);
        const duplicate = await this.createDocumentCopy(userId, original);

        return duplicate;
    }

    // POST /documents - Create from AI generation
    async createFromGeneration(
        userId: string,
        type: DocumentType,
        title: string,
        content: string,
        metadata: Record<string, unknown> = {}
    ): Promise<any> {
        if (!userId || !type || !title || !content) {
            throw createHttpError(400, 'userId, type, title, and content are required');
        }

        return this.createDocument(userId, {
            type,
            title,
            content,
            status: 'DRAFT' as DocumentStatus,
            metadata: metadata as any,
        });
    }

    // ── Private Helpers ──────────────────────────────────────────────────

    private buildDocumentUpdateData(options: UpdateDocumentOptions): Record<string, unknown> {
        const data: Record<string, unknown> = {};

        if (options.title) data.title = options.title;
        if (options.status) data.status = options.status;
        if (options.content) {
            data.content = options.content;
            data.wordCount = calculateWordCount(options.content);
        }

        return data;
    }

    private async createDocumentCopy(userId: string, original: any): Promise<any> {
        return prisma.document.create({
            data: {
                userId,
                type: original.type,
                title: `${original.title} (Copy)`,
                content: original.content,
                status: 'DRAFT' as DocumentStatus,
                metadata: original.metadata,
                jobTitle: original.jobTitle ?? undefined,
                company: original.company ?? undefined,
                targetSchool: original.targetSchool ?? undefined,
                wordCount: original.wordCount ?? undefined,
            },
        });
    }

    private async createDocument(
        userId: string,
        data: {
            type: DocumentType;
            title: string;
            content: string;
            status: DocumentStatus;
            metadata: any;
        }
    ): Promise<any> {
        const wordCount = calculateWordCount(data.content);

        return prisma.document.create({
            data: {
                userId,
                type: data.type,
                title: data.title,
                content: data.content,
                status: data.status,
                wordCount,
                metadata: data.metadata,
                jobTitle: data.metadata?.jobTitle,
                company: data.metadata?.companyName,
                targetSchool: data.metadata?.university,
            },
        });
    }
}

