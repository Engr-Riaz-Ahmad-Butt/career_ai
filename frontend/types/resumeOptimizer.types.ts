export interface ResumeOptimizerOriginalData {
  readonly summary?: string;
}

export interface ResumeImprovement {
  readonly id: string;
  readonly text: string;
  readonly rank: number;
}

export interface ResumeOptimizationViewData {
  readonly optimizedResume: Record<string, unknown>;
  readonly summary: string;
  readonly improvements: readonly ResumeImprovement[];
}

export type ResumeOptimizerAsyncState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: ResumeOptimizationViewData }
  | { status: 'error'; error: string };
