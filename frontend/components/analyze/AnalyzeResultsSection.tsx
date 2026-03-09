'use client';

import { AnalyzeKeywordCharts } from '@/components/analyze/AnalyzeKeywordCharts';
import { AnalyzeMetricsGrid } from '@/components/analyze/AnalyzeMetricsGrid';
import { AnalyzeStateCard } from '@/components/analyze/AnalyzeStateCard';
import { AnalyzeSuggestionsList } from '@/components/analyze/AnalyzeSuggestionsList';
import type { AtsAnalysisAsyncState } from '@/types/atsAnalysis.types';

interface AnalyzeResultsLabels {
  readonly loadingAnalysis: string;
  readonly analysisErrorTitle: string;
  readonly noAnalysisTitle: string;
  readonly noAnalysisDescription: string;
  readonly recommendationsTitle: string;
  readonly keywordMatchTitle: string;
  readonly keywordDistributionTitle: string;
}

interface AnalyzeResultsSectionProps {
  readonly labels: AnalyzeResultsLabels;
  readonly state: AtsAnalysisAsyncState;
  readonly chartColors: readonly string[];
}

export function AnalyzeResultsSection({
  labels,
  state,
  chartColors,
}: AnalyzeResultsSectionProps) {
  if (state.status === 'idle') {
    return (
      <AnalyzeStateCard
        variant="empty"
        title={labels.noAnalysisTitle}
        description={labels.noAnalysisDescription}
      />
    );
  }

  if (state.status === 'loading') {
    return <AnalyzeStateCard variant="loading" title={labels.loadingAnalysis} />;
  }

  if (state.status === 'error') {
    return (
      <AnalyzeStateCard
        variant="error"
        title={labels.analysisErrorTitle}
        description={state.error}
      />
    );
  }

  return (
    <div>
      <AnalyzeMetricsGrid metrics={state.data.metrics} />
      <AnalyzeKeywordCharts
        labels={{
          keywordMatchTitle: labels.keywordMatchTitle,
          keywordDistributionTitle: labels.keywordDistributionTitle,
        }}
        keywords={state.data.keywords}
        colors={chartColors}
      />
      <AnalyzeSuggestionsList title={labels.recommendationsTitle} suggestions={state.data.suggestions} />
    </div>
  );
}
