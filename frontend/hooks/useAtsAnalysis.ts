import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import {
  ANALYZE_PAGE_COPY,
  MIN_JOB_DESCRIPTION_LENGTH,
} from '@/constants/analyze.constants';
import { useAIStream } from '@/hooks/use-ai-stream';
import { useJobStatus, useResumeAtsScoreJob } from '@/hooks/use-job-poller';
import { transformAtsAnalysisPayload } from '@/lib/mappers/atsAnalysis.mapper';
import { resumeApi } from '@/lib/api/endpoints/resume.api';
import { GC_TIMES, STALE_TIMES } from '@/lib/queryConfig';
import { queryKeys } from '@/lib/queryKeys';
import type {
  AtsAnalysisAsyncState,
  ResumeOption,
} from '@/types/atsAnalysis.types';
import type { StreamChunk } from '@/lib/api/endpoints/stream.api';

interface UseAtsAnalysisResult {
  readonly analysisState: AtsAnalysisAsyncState;
  readonly resumes: readonly ResumeOption[];
  readonly selectedResumeId: string;
  readonly jobDescription: string;
  readonly isBackgroundAnalyzing: boolean;
  readonly isStreamAnalyzing: boolean;
  readonly isResumesLoading: boolean;
  readonly resumesError: string | null;
  readonly hasNoResumes: boolean;
  readonly streamError: string | null;
  readonly latestChunk: StreamChunk | null;
  readonly canStartAnalysis: boolean;
  readonly setSelectedResumeId: (value: string) => void;
  readonly setJobDescription: (value: string) => void;
  readonly handleBackgroundAnalysis: () => void;
  readonly handleLiveAnalysis: () => void;
  readonly handleStopStream: () => void;
  readonly retryLoadResumes: () => void;
}

function toResumeOptions(resumes: readonly { id: string; title: string }[]): readonly ResumeOption[] {
  return resumes.map((resume) => ({
    id: resume.id,
    title: resume.title,
  }));
}

function isProcessingStatus(status: string | undefined): boolean {
  return status === 'processing';
}

export function useAtsAnalysis(): UseAtsAnalysisResult {
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisState, setAnalysisState] = useState<AtsAnalysisAsyncState>({ status: 'idle' });
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const resumesQuery = useQuery({
    queryKey: queryKeys.resumes.all(),
    queryFn: () => resumeApi.list(),
    staleTime: STALE_TIMES.RESUME_LIST,
    gcTime: GC_TIMES.RESUME_LIST,
  });

  const analyzeMutation = useResumeAtsScoreJob();
  const jobStatusQuery = useJobStatus(activeJobId);
  const { isStreaming, latestChunk, error: streamError, startAtsScoreStream, closeStream } = useAIStream();

  useEffect(() => {
    const jobData = jobStatusQuery.data;
    if (!jobData) {
      return;
    }

    if (jobData.status === 'complete') {
      setAnalysisState({ status: 'success', data: transformAtsAnalysisPayload(jobData.result) });
      setActiveJobId(null);
      message.success(ANALYZE_PAGE_COPY.messages.completed);
      return;
    }

    if (jobData.status === 'failed') {
      const errorMessage = jobData.error ?? ANALYZE_PAGE_COPY.messages.queueFailed;
      setAnalysisState({ status: 'error', error: errorMessage });
      setActiveJobId(null);
      message.error(errorMessage);
    }
  }, [jobStatusQuery.data]);

  useEffect(() => {
    if (latestChunk?.type === 'data') {
      setAnalysisState({ status: 'success', data: transformAtsAnalysisPayload(latestChunk.data) });
      message.success(ANALYZE_PAGE_COPY.messages.completed);
      return;
    }

    if (latestChunk?.type === 'error') {
      const errorMessage = latestChunk.message ?? ANALYZE_PAGE_COPY.messages.streamFailed;
      setAnalysisState({ status: 'error', error: errorMessage });
    }
  }, [latestChunk]);

  useEffect(() => {
    if (!streamError) {
      return;
    }

    setAnalysisState({ status: 'error', error: streamError });
  }, [streamError]);

  function handleBackgroundAnalysis(): void {
    if (!selectedResumeId || jobDescription.trim().length < MIN_JOB_DESCRIPTION_LENGTH) {
      return;
    }

    setAnalysisState({ status: 'loading', mode: 'background' });

    analyzeMutation.mutate(
      {
        resumeId: selectedResumeId,
        jobDescription,
        returnSuggestions: true,
      },
      {
        onSuccess: (job) => {
          setActiveJobId(job.jobId);
          message.info(ANALYZE_PAGE_COPY.messages.queued);
        },
        onError: () => {
          setAnalysisState({ status: 'error', error: ANALYZE_PAGE_COPY.messages.queueFailed });
          message.error(ANALYZE_PAGE_COPY.messages.queueFailed);
        },
      }
    );
  }

  function handleLiveAnalysis(): void {
    if (!selectedResumeId || jobDescription.trim().length < MIN_JOB_DESCRIPTION_LENGTH) {
      return;
    }

    setAnalysisState({ status: 'loading', mode: 'stream' });
    startAtsScoreStream(selectedResumeId, jobDescription);
  }

  function handleStopStream(): void {
    closeStream();

    if (analysisState.status === 'loading' && analysisState.mode === 'stream') {
      setAnalysisState({ status: 'idle' });
    }
  }

  const resumes = toResumeOptions(resumesQuery.data?.data ?? []);
  const isBackgroundAnalyzing =
    analyzeMutation.isPending ||
    isProcessingStatus(jobStatusQuery.data?.status);

  const canStartAnalysis =
    Boolean(selectedResumeId) &&
    jobDescription.trim().length >= MIN_JOB_DESCRIPTION_LENGTH &&
    !isBackgroundAnalyzing &&
    !isStreaming;

  const resumesError = resumesQuery.error instanceof Error ? resumesQuery.error.message : null;
  const hasNoResumes = resumesQuery.isSuccess && resumes.length === 0;

  return {
    analysisState,
    resumes,
    selectedResumeId,
    jobDescription,
    isBackgroundAnalyzing,
    isStreamAnalyzing: isStreaming,
    isResumesLoading: resumesQuery.isLoading,
    resumesError,
    hasNoResumes,
    streamError,
    latestChunk,
    canStartAnalysis,
    setSelectedResumeId,
    setJobDescription,
    handleBackgroundAnalysis,
    handleLiveAnalysis,
    handleStopStream,
    retryLoadResumes: () => {
      void resumesQuery.refetch();
    },
  };
}
