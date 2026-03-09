'use client';

import { FeatureErrorBoundary } from '@/components/errors/FeatureErrorBoundary';
import { AIStreamProgress } from '@/components/common/AiStreamProgress';
import { AnalyzeFormCard } from '@/components/analyze/AnalyzeFormCard';
import { AnalyzePageHeader } from '@/components/analyze/AnalyzePageHeader';
import { AnalyzeResultsSection } from '@/components/analyze/AnalyzeResultsSection';
import { AnalyzeStateCard } from '@/components/analyze/AnalyzeStateCard';
import { ATS_CHART_COLORS, ANALYZE_PAGE_COPY } from '@/constants/analyze.constants';
import { useAtsAnalysis } from '@/hooks/useAtsAnalysis';

export default function AnalyzePage() {
  const {
    analysisState,
    resumes,
    selectedResumeId,
    jobDescription,
    isBackgroundAnalyzing,
    isStreamAnalyzing,
    isResumesLoading,
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
    retryLoadResumes,
  } = useAtsAnalysis();

  if (isResumesLoading) {
    return (
      <AnalyzeStateCard
        variant="loading"
        title={ANALYZE_PAGE_COPY.states.loadingResumes}
      />
    );
  }

  if (resumesError) {
    return (
      <AnalyzeStateCard
        variant="error"
        title={ANALYZE_PAGE_COPY.states.resumeErrorTitle}
        description={resumesError}
        actionLabel={ANALYZE_PAGE_COPY.states.retryButton}
        onAction={retryLoadResumes}
      />
    );
  }

  if (hasNoResumes) {
    return (
      <AnalyzeStateCard
        variant="empty"
        title={ANALYZE_PAGE_COPY.states.noResumesTitle}
        description={ANALYZE_PAGE_COPY.states.noResumesDescription}
      />
    );
  }

  return (
    <FeatureErrorBoundary featureName={ANALYZE_PAGE_COPY.header.title}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-950 dark:to-slate-900 sm:p-8">
        <div className="mx-auto max-w-7xl">
          <AnalyzePageHeader
            title={ANALYZE_PAGE_COPY.header.title}
            description={ANALYZE_PAGE_COPY.header.description}
          />

          <AnalyzeFormCard
            labels={ANALYZE_PAGE_COPY.form}
            resumes={resumes}
            selectedResumeId={selectedResumeId}
            jobDescription={jobDescription}
            canStartAnalysis={canStartAnalysis}
            isBackgroundAnalyzing={isBackgroundAnalyzing}
            isStreamAnalyzing={isStreamAnalyzing}
            onSelectResume={setSelectedResumeId}
            onJobDescriptionChange={setJobDescription}
            onRunBackground={handleBackgroundAnalysis}
            onRunStream={handleLiveAnalysis}
          />

          <AIStreamProgress
            isStreaming={isStreamAnalyzing}
            latestChunk={latestChunk}
            error={streamError}
            onStop={handleStopStream}
          />

          <AnalyzeResultsSection
            labels={{
              loadingAnalysis: ANALYZE_PAGE_COPY.states.loadingAnalysis,
              analysisErrorTitle: ANALYZE_PAGE_COPY.states.analysisErrorTitle,
              noAnalysisTitle: ANALYZE_PAGE_COPY.states.noAnalysisTitle,
              noAnalysisDescription: ANALYZE_PAGE_COPY.states.noAnalysisDescription,
              recommendationsTitle: ANALYZE_PAGE_COPY.results.recommendationsTitle,
              keywordMatchTitle: ANALYZE_PAGE_COPY.results.keywordMatchTitle,
              keywordDistributionTitle: ANALYZE_PAGE_COPY.results.keywordDistributionTitle,
            }}
            state={analysisState}
            chartColors={ATS_CHART_COLORS}
          />
        </div>
      </div>
    </FeatureErrorBoundary>
  );
}
