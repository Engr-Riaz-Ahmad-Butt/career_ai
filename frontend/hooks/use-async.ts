import { useState, useCallback, useEffect } from 'react';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  status: AsyncStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
}

export interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<T | undefined>;
  reset: () => void;
  setData: (data: T | null) => void;
}

/**
 * Generic hook for managing async operations
 * Replaces repeated isLoading, error, data state patterns
 * 
 * @example
 * ```tsx
 * const { execute, isLoading, data, error } = useAsync(async (id: string) => {
 *   return await api.fetchUser(id);
 * });
 * 
 * const handleClick = () => execute('user-123');
 * ```
 */
export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');

  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      setStatus('loading');
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setData(response);
        setStatus('success');
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setStatus('error');
        return undefined;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    isIdle: status === 'idle',
    execute,
    reset,
    setData,
  };
}

/**
 * Variant for functions that don't need parameters
 */
export function useAsyncFn<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = []
): UseAsyncReturn<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedFn = useCallback(asyncFunction, deps);
  return useAsync(memoizedFn);
}
