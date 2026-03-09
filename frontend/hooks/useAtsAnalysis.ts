import { Dispatch, SetStateAction, useEffect, useState } from 'react';
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

interface AnalysisStateSetter {
  readonly setAnalysisState: Dispatch<SetStateAction<AtsAnalysisAsyncState>>;
}

interface AtsInput {
  readonly selectedResumeId: string;
  readonly jobDescription: string;
}

interface StartBackgroundAnalysisOptions extends AnalysisStateSetter, AtsInput {
  readonly setActiveJobId: Dispatch<SetStateAction<string | null>>;
  readonly mutate: ReturnType<typeof useResumeAtsScoreJob>['mutate'];
}

interface StartLiveAnalysisOptions extends AnalysisStateSetter, AtsInput {
  readonly startAtsScoreStream: (resumeId: string, jobDescription: string) => void;
}

interface StopLiveAnalysisOptions extends AnalysisStateSetter {
  readonly closeStream: () => void;
  readonly currentState: AtsAnalysisAsyncState;
}

interface ResumesQueryState {
  readonly resumes: readonly ResumeOption[];
  readonly isResumesLoading: boolean;
  readonly resumesError: string | null;
  readonly hasNoResumes: boolean;
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

function hasValidAnalysisInput(input: AtsInput): boolean {
  return Boolean(input.selectedResumeId) && input.jobDescription.trim().length >= MIN_JOB_DESCRIPTION_LENGTH;
}

function canStartAtsAnalysis(options: {
  selectedResumeId: string;
  jobDescription: string;
  isBackgroundAnalyzing: boolean;
  isStreaming: boolean;
}): boolean {
  return hasValidAnalysisInput(options) && !options.isBackgroundAnalyzing && !options.isStreaming;
}

function useResumesQueryState(): ResumesQueryState {
  const resumesQuery = useQuery({
    queryKey: queryKeys.resumes.all(),
    queryFn: () => resumeApi.list(),
    staleTime: STALE_TIMES.RESUME_LIST,
    gcTime: GC_TIMES.RESUME_LIST,
  });

  const resumes = toResumeOptions(resumesQuery.data?.data ?? []);
  const resumesError = resumesQuery.error instanceof Error ? resumesQuery.error.message : null;
  const hasNoResumes = resumesQuery.isSuccess && resumes.length === 0;

  return {
    resumes,
    isResumesLoading: resumesQuery.isLoading,
    resumesError,
    hasNoResumes,
    retryLoadResumes: () => {
      void resumesQuery.refetch();
    },
  };
}

function useBackgroundJobEffects(
  jobData: ReturnType<typeof useJobStatus>['data'],
  setAnalysisState: Dispatch<SetStateAction<AtsAnalysisAsyncState>>,
  setActiveJobId: Dispatch<SetStateAction<string | null>>
): void {
  useEffect(() => {
    if (!jobData) return;

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
  }, [jobData, setAnalysisState, setActiveJobId]);
}

function useStreamEffects(
  latestChunk: StreamChunk | null,
  streamError: string | null,
  setAnalysisState: Dispatch<SetStateAction<AtsAnalysisAsyncState>>
): void {
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
  }, [latestChunk, setAnalysisState]);

  useEffect(() => {
    if (!streamError) return;
    setAnalysisState({ status: 'error', error: streamError });
  }, [streamError, setAnalysisState]);
}

function startBackgroundAnalysis(options: StartBackgroundAnalysisOptions): void {
  if (!hasValidAnalysisInput(options)) return;

  options.setAnalysisState({ status: 'loading', mode: 'background' });
  options.mutate(
    {
      resumeId: options.selectedResumeId,
      jobDescription: options.jobDescription,
      returnSuggestions: true,
    },
    {
      onSuccess: (job) => {
        options.setActiveJobId(job.jobId);
        message.info(ANALYZE_PAGE_COPY.messages.queued);
      },
      onError: () => {
        options.setAnalysisState({ status: 'error', error: ANALYZE_PAGE_COPY.messages.queueFailed });
        message.error(ANALYZE_PAGE_COPY.messages.queueFailed);
      },
    }
  );
}

function startLiveAnalysis(options: StartLiveAnalysisOptions): void {
  if (!hasValidAnalysisInput(options)) return;
  options.setAnalysisState({ status: 'loading', mode: 'stream' });
  options.startAtsScoreStream(options.selectedResumeId, options.jobDescription);
}

function stopLiveAnalysis(options: StopLiveAnalysisOptions): void {
  options.closeStream();
  if (options.currentState.status === 'loading' && options.currentState.mode === 'stream') {
    options.setAnalysisState({ status: 'idle' });
  }
}

export function useAtsAnalysis(): UseAtsAnalysisResult {
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisState, setAnalysisState] = useState<AtsAnalysisAsyncState>({ status: 'idle' });
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const resumesState = useResumesQueryState();

  const analyzeMutation = useResumeAtsScoreJob();
  const jobStatusQuery = useJobStatus(activeJobId);
  const { isStreaming, latestChunk, error: streamError, startAtsScoreStream, closeStream } = useAIStream();

  useBackgroundJobEffects(jobStatusQuery.data, setAnalysisState, setActiveJobId);
  useStreamEffects(latestChunk, streamError, setAnalysisState);

  const isBackgroundAnalyzing =
    analyzeMutation.isPending ||
    isProcessingStatus(jobStatusQuery.data?.status);

  const canStartAnalysis = canStartAtsAnalysis({
    selectedResumeId,
    jobDescription,
    isBackgroundAnalyzing,
    isStreaming,
  });

  const handleBackgroundAnalysis = () =>
    startBackgroundAnalysis({
      selectedResumeId,
      jobDescription,
      setAnalysisState,
      setActiveJobId,
      mutate: analyzeMutation.mutate,
    });

  const handleLiveAnalysis = () =>
    startLiveAnalysis({
      selectedResumeId,
      jobDescription,
      setAnalysisState,
      startAtsScoreStream,
    });

  const handleStopStream = () =>
    stopLiveAnalysis({
      currentState: analysisState,
      closeStream,
      setAnalysisState,
    });

  return {
    analysisState,
    resumes: resumesState.resumes,
    selectedResumeId,
    jobDescription,
    isBackgroundAnalyzing,
    isStreamAnalyzing: isStreaming,
    isResumesLoading: resumesState.isResumesLoading,
    resumesError: resumesState.resumesError,
    hasNoResumes: resumesState.hasNoResumes,
    streamError,
    latestChunk,
    canStartAnalysis,
    setSelectedResumeId,
    setJobDescription,
    handleBackgroundAnalysis,
    handleLiveAnalysis,
    handleStopStream,
    retryLoadResumes: resumesState.retryLoadResumes,
  };
}
