import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { interviewApi } from '@/lib/api/endpoints/interview.api';
import { queryKeys } from '@/lib/queryKeys';

interface InterviewSessionItem {
  readonly id: string;
  readonly createdAt: string;
  readonly questionCount: number;
  readonly categories: readonly string[];
}

export function useInterviewPrep(): {
  readonly sessions: readonly InterviewSessionItem[];
  readonly isSessionsLoading: boolean;
  readonly isGeneratingSession: boolean;
  readonly generateSession: () => void;
  readonly deleteSession: (sessionId: string) => void;
} {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: queryKeys.interview.history(),
    queryFn: () => interviewApi.getSessions(),
  });

  const generateMutation = useMutation({
    mutationFn: () =>
      interviewApi.generateSession({
        resumeId: 'default',
        jobDescription: 'Software Engineer Position',
        questionCount: 5,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.interview.history() });
      message.success('Interview session generated successfully!');
    },
    onError: () => {
      message.error('Failed to generate interview session. Check credits.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (sessionId: string) => interviewApi.deleteSession(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.interview.history() });
    },
  });

  return {
    sessions: sessionsQuery.data?.data ?? [],
    isSessionsLoading: sessionsQuery.isLoading,
    isGeneratingSession: generateMutation.isPending,
    generateSession: () => {
      generateMutation.mutate();
    },
    deleteSession: (sessionId: string) => {
      deleteMutation.mutate(sessionId);
    },
  };
}
