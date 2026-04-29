import prisma from '@/config/database';
import { INTERVIEW } from '@/constants/interview';
import { PAGINATION } from '@/constants/pagination';
import { AIService } from '@/services/ai/aiService';
import { createHttpError, ValidationError } from '@/utils/errorHandler';

const ai = new AIService();

interface GenerateSessionData {
    readonly resumeId: string;
    readonly jobDescription?: string;
    readonly questionCount?: number;
    readonly categories?: string[];
    readonly difficulty?: string;
    readonly includeAnswerTips?: boolean;
}

interface ListSessionsOptions {
    readonly page?: number;
    readonly limit?: number;
}

interface SubmitFeedbackData {
    readonly questionId: string;
    readonly userAnswer: string;
}

interface InterviewQuestion {
    readonly id: string;
    readonly question: string;
}

function normalizeListOptions(options: ListSessionsOptions = {}): { page: number; limit: number; skip: number } {
    const page = Math.max(options.page ?? PAGINATION.DEFAULT_PAGE, PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
        Math.max(options.limit ?? PAGINATION.DEFAULT_LIMIT, PAGINATION.DEFAULT_PAGE),
        PAGINATION.SERVICE_MAX_LIMIT
    );
    return { page, limit, skip: (page - 1) * limit };
}

function isInterviewQuestion(value: unknown): value is InterviewQuestion {
    if (!value || typeof value !== 'object') return false;
    const question = value as Record<string, unknown>;
    return typeof question.id === 'string' && typeof question.question === 'string';
}

function parseQuestions(value: unknown): InterviewQuestion[] {
    if (!Array.isArray(value)) return [];
    return value.filter(isInterviewQuestion);
}

export class InterviewService {

    async generateSession(userId: string, data: GenerateSessionData) {
        if (!userId || !data?.resumeId) throw new ValidationError('userId and resumeId are required');

        const result = await ai.generateInterviewQuestions(userId, data);

        const session = await prisma.interviewSession.create({
            data: {
                userId,
                resumeId: data.resumeId,
                jobDescription: data.jobDescription,
                questionCount: data.questionCount || INTERVIEW.DEFAULT_QUESTION_COUNT,
                categories: data.categories || [],
                difficulty: data.difficulty,
                questions: result.questions || [],
            },
        });

        return session;
    }

    async listSessions(userId: string, params: ListSessionsOptions = {}) {
        if (!userId) throw new ValidationError('userId is required');

        const { page, limit, skip } = normalizeListOptions(params);

        const [data, total] = await Promise.all([
            prisma.interviewSession.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip, take: limit,
                select: { id: true, difficulty: true, questionCount: true, categories: true, createdAt: true, questions: true },
            }),
            prisma.interviewSession.count({ where: { userId } }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getSessionById(userId: string, id: string) {
        if (!userId || !id) throw new ValidationError('userId and session id are required');

        const session = await prisma.interviewSession.findFirst({ where: { id, userId } });
        if (!session) throw createHttpError(404, 'Interview session not found');
        return session;
    }

    async submitFeedback(userId: string, sessionId: string, data: SubmitFeedbackData) {
        if (!userId || !sessionId || !data?.questionId || !data?.userAnswer) {
            throw new ValidationError('userId, sessionId, questionId, and userAnswer are required');
        }

        const session = await this.getSessionById(userId, sessionId);
        const questions = parseQuestions(session.questions);
        const question = questions.find((item) => item.id === data.questionId);
        if (!question) throw createHttpError(404, 'Question not found in session');

        const result = await ai.generateInterviewFeedback(data.questionId, question.question, data.userAnswer);

        const feedback = await prisma.interviewFeedback.create({
            data: {
                sessionId,
                questionId: data.questionId,
                userAnswer: data.userAnswer,
                score: result.score || 5,
                feedback: result.feedback || '',
                strengths: result.strengths || [],
                improvements: result.improvements || [],
                suggestedAnswer: result.suggestedAnswer,
            },
        });

        return feedback;
    }

    async deleteSession(userId: string, id: string) {
        await this.getSessionById(userId, id);
        await prisma.interviewSession.delete({ where: { id } });
    }
}

