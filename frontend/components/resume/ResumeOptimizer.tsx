'use client';

import { ResumeOptimizerInputCard } from '@/components/resume/ResumeOptimizerInputCard';
import { ResumeOptimizerResultCard } from '@/components/resume/ResumeOptimizerResultCard';
import { RESUME_OPTIMIZER_COPY } from '@/constants/resumeOptimizer.constants';
import { useResumeOptimizer } from '@/hooks/useResumeOptimizer';
import type { ResumeOptimizerOriginalData } from '@/types/resumeOptimizer.types';

interface ResumeOptimizerProps {
  resumeId: string;
  originalData: ResumeOptimizerOriginalData;
  onOptimize: (optimizedData: Record<string, unknown>) => void;
}

export function ResumeOptimizer({ resumeId, originalData, onOptimize }: ResumeOptimizerProps) {
  const originalSummary =
    typeof originalData.summary === 'string' ? originalData.summary : '';

  const {
    jobDescription,
    optimizerState,
    isSummaryCopied,
    setJobDescription,
    handleOptimize,
    handleStartOver,
    handleApply,
    handleCopySummary,
  } = useResumeOptimizer({
    resumeId,
    originalSummary,
    onOptimize,
  });

  if (optimizerState.status === 'success') {
    return (
      <div className="mx-auto max-w-4xl space-y-8 p-4">
        <ResumeOptimizerResultCard
          labels={RESUME_OPTIMIZER_COPY.result}
          originalSummary={originalSummary}
          optimizedSummary={optimizerState.data.summary}
          improvements={optimizerState.data.improvements}
          isSummaryCopied={isSummaryCopied}
          onCopySummary={() => handleCopySummary(optimizerState.data.summary)}
          onStartOver={handleStartOver}
          onApply={handleApply}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4">
      <ResumeOptimizerInputCard
        labels={RESUME_OPTIMIZER_COPY.input}
        jobDescription={jobDescription}
        isOptimizing={optimizerState.status === 'loading'}
        error={optimizerState.status === 'error' ? optimizerState.error : undefined}
        onJobDescriptionChange={setJobDescription}
        onOptimize={handleOptimize}
      />
    </div>
  );
}
