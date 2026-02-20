import prisma from '../config/database';
import { ApiError } from '../middleware/error';
import { DocumentType, DocumentStatus } from '@prisma/client';

export class DocumentService {

    private PAGE_LIMIT = 20;

    // GET /documents
    async listDocuments(userId: string, params: {
        type?: string;
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        order?: string;
    }) {
        const page = params.page || 1;
        const limit = Math.min(params.limit || this.PAGE_LIMIT, 50);
        const skip = (page - 1) * limit;

        const where: any = { userId };
        if (params.type) where.type = params.type.toUpperCase() as DocumentType;
        if (params.status) where.status = params.status.toUpperCase() as DocumentStatus;
        if (params.search) where.title = { contains: params.search, mode: 'insensitive' };

        const orderBy: any = { [params.sortBy || 'updatedAt']: params.order || 'desc' };

        const [docs, total] = await Promise.all([
            prisma.document.findMany({ where, orderBy, skip, take: limit }),
            prisma.document.count({ where }),
        ]);

        return { data: docs, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // GET /documents/:id
    async getDocumentById(userId: string, id: string) {
        const doc = await prisma.document.findFirst({ where: { id, userId } });
        if (!doc) throw new ApiError(404, 'Document not found');
        return doc;
    }

    // PUT /documents/:id
    async updateDocument(userId: string, id: string, data: { content?: string; title?: string; status?: string }) {
        const doc = await prisma.document.findFirst({ where: { id, userId } });
        if (!doc) throw new ApiError(404, 'Document not found');

        const updated = await prisma.document.update({
            where: { id },
            data: {
                ...(data.content && { content: data.content, wordCount: data.content.split(/\s+/).length }),
                ...(data.title && { title: data.title }),
                ...(data.status && { status: data.status.toUpperCase() as DocumentStatus }),
            },
        });
        return updated;
    }

    // DELETE /documents/:id
    async deleteDocument(userId: string, id: string) {
        const doc = await prisma.document.findFirst({ where: { id, userId } });
        if (!doc) throw new ApiError(404, 'Document not found');
        await prisma.document.delete({ where: { id } });
    }

    // POST /documents/:id/pdf
    async generatePdf(userId: string, id: string): Promise<{ pdfUrl: string; expiresAt: Date }> {
        const doc = await prisma.document.findFirst({ where: { id, userId } });
        if (!doc) throw new ApiError(404, 'Document not found');

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        return { pdfUrl: `${process.env.API_URL || 'http://localhost:5000'}/api/v1/documents/${id}/download`, expiresAt };
    }

    // POST /documents/:id/duplicate
    async duplicateDocument(userId: string, id: string) {
        const original = await prisma.document.findFirst({ where: { id, userId } });
        if (!original) throw new ApiError(404, 'Document not found');

        const duplicate = await prisma.document.create({
            data: {
                userId,
                type: original.type,
                title: `${original.title} (Copy)`,
                content: original.content,
                status: 'DRAFT',
                metadata: original.metadata as any,
                jobTitle: original.jobTitle ?? undefined,
                company: original.company ?? undefined,
                targetSchool: original.targetSchool ?? undefined,
                wordCount: original.wordCount ?? undefined,
            },
        });
        return duplicate;
    }

    // Create a document from AI generation result
    async createFromGeneration(userId: string, type: DocumentType, title: string, content: string, metadata: Record<string, any>) {
        const doc = await prisma.document.create({
            data: {
                userId,
                type,
                title,
                content,
                status: 'DRAFT',
                wordCount: content.split(/\s+/).length,
                metadata,
                jobTitle: metadata.jobTitle,
                company: metadata.companyName,
                targetSchool: metadata.university,
            },
        });
        return doc;
    }
}
