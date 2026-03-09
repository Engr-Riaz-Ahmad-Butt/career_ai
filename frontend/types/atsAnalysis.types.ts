export interface AnalysisMetric {
  readonly label: string;
  readonly score: number;
}

export interface AnalysisKeyword {
  readonly id: string;
  readonly name: string;
  readonly value: number;
}

export interface AnalysisSuggestion {
  readonly id: string;
  readonly text: string;
  readonly rank: number;
}

export interface AtsAnalysisViewData {
  readonly metrics: readonly AnalysisMetric[];
  readonly keywords: readonly AnalysisKeyword[];
  readonly suggestions: readonly AnalysisSuggestion[];
}

export interface ResumeOption {
  readonly id: string;
  readonly title: string;
}

export type AnalysisMode = 'background' | 'stream';

export type AtsAnalysisAsyncState =
  | { status: 'idle' }
  | { status: 'loading'; mode: AnalysisMode }
  | { status: 'success'; data: AtsAnalysisViewData }
  | { status: 'error'; error: string };
