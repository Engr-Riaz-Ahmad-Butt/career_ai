import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { interviewApi } from '@/lib/api/endpoints/interview.api';
import { queryKeys } from '@/lib/queryKeys';

interface InterviewSessionItem {
  readonly id: string;
  readonly createdAt: string;
  readonly questionCount: number;
  readonly categories: readonly string[];
}

const DEFAULT_SESSION_REQUEST = {
  resumeId: 'default',
  jobDescription: 'Software Engineer Position',
  questionCount: 5,
};

function invalidateInterviewHistory(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.interview.history() });
}

function generateDefaultSession() {
  return interviewApi.generateSession(DEFAULT_SESSION_REQUEST);
}

function handleGenerateError(): void {
  message.error('Failed to generate interview session. Check credits.');
}

export function useInterviewPrep(): {
  readonly sessions: readonly InterviewSessionItem[];
  readonly isSessionsLoading: boolean;
  readonly isGeneratingSession: boolean;
  readonly generateSession: () => void;
  readonly deleteSession: (sessionId: string) => void;
} {
  const queryClient = useQueryClient();
  const invalidateHistory = () => invalidateInterviewHistory(queryClient);

  const sessionsQuery = useQuery({
    queryKey: queryKeys.interview.history(),
    queryFn: () => interviewApi.getSessions(),
  });

  const generateMutation = useMutation({
    mutationFn: generateDefaultSession,
    onSuccess: () => {
      invalidateHistory();
      message.success('Interview session generated successfully!');
    },
    onError: handleGenerateError,
  });

  const deleteMutation = useMutation({
    mutationFn: (sessionId: string) => interviewApi.deleteSession(sessionId),
    onSuccess: () => {
      invalidateHistory();
    },
  });

  function handleGenerateSession(): void {
    generateMutation.mutate();
  }

  function handleDeleteSession(sessionId: string): void {
    if (!sessionId) return;
    deleteMutation.mutate(sessionId);
  }

  return {
    sessions: sessionsQuery.data?.data ?? [],
    isSessionsLoading: sessionsQuery.isLoading,
    isGeneratingSession: generateMutation.isPending,
    generateSession: handleGenerateSession,
    deleteSession: handleDeleteSession,
  };
}
