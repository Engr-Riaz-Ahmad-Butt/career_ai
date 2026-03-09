/**
 * AsyncBoundary - Combines loading, error, and success states
 * Eliminates repetitive conditional rendering patterns
 */

import React from 'react';

import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingSpinner';

export interface AsyncBoundaryProps<T> {
  isLoading: boolean;
  error?: Error | string | null;
  data?: T | null;
  isEmpty?: boolean;
  children: React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRetry?: () => void;
}

/**
 * Wrapper component for async data fetching states
 * 
 * @example
 * <AsyncBoundary
 *   isLoading={isLoading}
 *   error={error}
 *   data={data}
 *   isEmpty={data?.length === 0}
 *   emptyMessage="No resumes found"
 * >
 *   <ResumeList resumes={data} />
 * </AsyncBoundary>
 */
export function AsyncBoundary<T>({
  isLoading,
  error,
  data,
  isEmpty = false,
  children,
  loadingMessage = 'Loading...',
  errorMessage,
  emptyMessage = 'No data found',
  emptyIcon,
  onRetry,
}: AsyncBoundaryProps<T>) {
  // Loading state
  if (isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  // Error state
  if (error) {
    const errorText = typeof error === 'string' ? error : error.message;
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-lg font-semibold">
            {errorMessage || 'Something went wrong'}
          </p>
          <p className="text-sm text-slate-500 mt-2">{errorText}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state
  if (isEmpty || !data) {
    return (
      <EmptyState
        title={emptyMessage}
      />
    );
  }

  // Success - render children
  return <>{children}</>;
}
