import { useState } from 'react';
import { message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { RESUME_OPTIMIZER_COPY } from '@/constants/resumeOptimizer.constants';
import { resumeApi } from '@/lib/api/endpoints/resume.api';
import { transformResumeOptimizerPayload } from '@/lib/mappers/resumeOptimizer.mapper';
import type {
  ResumeOptimizationViewData,
  ResumeOptimizerAsyncState,
} from '@/types/resumeOptimizer.types';

interface UseResumeOptimizerOptions {
  readonly resumeId: string;
  readonly originalSummary: string;
  readonly onOptimize: (optimizedData: Record<string, unknown>) => void;
}

interface UseResumeOptimizerResult {
  readonly jobDescription: string;
  readonly optimizerState: ResumeOptimizerAsyncState;
  readonly isSummaryCopied: boolean;
  readonly setJobDescription: (value: string) => void;
  readonly handleOptimize: () => void;
  readonly handleStartOver: () => void;
  readonly handleApply: () => void;
  readonly handleCopySummary: (summary: string) => Promise<void>;
}

function isSuccessState(
  state: ResumeOptimizerAsyncState
): state is { status: 'success'; data: ResumeOptimizationViewData } {
  return state.status === 'success';
}

export function useResumeOptimizer({
  resumeId,
  originalSummary,
  onOptimize,
}: UseResumeOptimizerOptions): UseResumeOptimizerResult {
  const [jobDescription, setJobDescription] = useState('');
  const [optimizerState, setOptimizerState] = useState<ResumeOptimizerAsyncState>({ status: 'idle' });
  const [isSummaryCopied, setIsSummaryCopied] = useState(false);

  const optimizeMutation = useMutation({
    mutationFn: (description: string) => resumeApi.optimize(resumeId, description),
  });

  function handleOptimize(): void {
    if (!jobDescription.trim()) {
      message.error(RESUME_OPTIMIZER_COPY.messages.missingJobDescription);
      return;
    }

    setOptimizerState({ status: 'loading' });

    optimizeMutation.mutate(jobDescription, {
      onSuccess: (payload) => {
        const transformedPayload = transformResumeOptimizerPayload(payload, originalSummary);
        setOptimizerState({ status: 'success', data: transformedPayload });
        message.success(RESUME_OPTIMIZER_COPY.messages.optimizationSuccess);
      },
      onError: () => {
        setOptimizerState({ status: 'error', error: RESUME_OPTIMIZER_COPY.messages.optimizationFailed });
        message.error(RESUME_OPTIMIZER_COPY.messages.optimizationFailed);
      },
    });
  }

  function handleStartOver(): void {
    setOptimizerState({ status: 'idle' });
    setIsSummaryCopied(false);
  }

  function handleApply(): void {
    if (!isSuccessState(optimizerState)) {
      return;
    }

    onOptimize(optimizerState.data.optimizedResume);
    message.success(RESUME_OPTIMIZER_COPY.messages.applySuccess);
  }

  async function handleCopySummary(summary: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(summary);
      setIsSummaryCopied(true);
      message.success(RESUME_OPTIMIZER_COPY.messages.copySuccess);
      window.setTimeout(() => setIsSummaryCopied(false), 2000);
    } catch {
      message.error(RESUME_OPTIMIZER_COPY.messages.copyFailed);
    }
  }

  return {
    jobDescription,
    optimizerState,
    isSummaryCopied,
    setJobDescription,
    handleOptimize,
    handleStartOver,
    handleApply,
    handleCopySummary,
  };
}
