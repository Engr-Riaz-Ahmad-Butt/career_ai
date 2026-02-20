import prisma from '../config/database';
import { AIService } from './ai/aiService';
import { ApiError } from '../middleware/error';

const ai = new AIService();

export class InterviewService {

    async generateSession(userId: string, data: {
        resumeId: string;
        jobDescription?: string;
        questionCount?: number;
        categories?: string[];
        difficulty?: string;
        includeAnswerTips?: boolean;
    }) {
        const result = await ai.generateInterviewQuestions(userId, data);

        const session = await prisma.interviewSession.create({
            data: {
                userId,
                resumeId: data.resumeId,
                jobDescription: data.jobDescription,
                questionCount: data.questionCount || 10,
                categories: data.categories || [],
                difficulty: data.difficulty,
                questions: result.questions || [],
            },
        });

        return session;
    }

    async listSessions(userId: string, params: { page?: number; limit?: number }) {
        const page = params.page || 1;
        const limit = Math.min(params.limit || 10, 50);
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.interviewSession.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip, take: limit,
                select: { id: true, difficulty: true, questionCount: true, categories: true, createdAt: true },
            }),
            prisma.interviewSession.count({ where: { userId } }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getSessionById(userId: string, id: string) {
        const session = await prisma.interviewSession.findFirst({ where: { id, userId } });
        if (!session) throw new ApiError(404, 'Interview session not found');
        return session;
    }

    async submitFeedback(userId: string, sessionId: string, data: { questionId: string; userAnswer: string }) {
        const session = await prisma.interviewSession.findFirst({ where: { id: sessionId, userId } });
        if (!session) throw new ApiError(404, 'Session not found');

        const questions = session.questions as any[];
        const question = questions.find((q: any) => q.id === data.questionId);
        if (!question) throw new ApiError(404, 'Question not found in session');

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
        const session = await prisma.interviewSession.findFirst({ where: { id, userId } });
        if (!session) throw new ApiError(404, 'Session not found');
        await prisma.interviewSession.delete({ where: { id } });
    }
}
