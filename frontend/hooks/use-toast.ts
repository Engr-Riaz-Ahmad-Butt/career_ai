import { message } from 'antd';
import { useCallback } from 'react';

export interface ToastOptions {
  /**
   * Duration in seconds
   */
  duration?: number;
}

export interface UseToastReturn {
  success: (content: string, options?: ToastOptions) => void;
  error: (content: string, options?: ToastOptions) => void;
  info: (content: string, options?: ToastOptions) => void;
  warning: (content: string, options?: ToastOptions) => void;
  loading: (content: string, options?: ToastOptions) => void;
}

/**
 * Hook for showing toast notifications
 * Wraps antd message API for consistent usage
 * 
 * @example
 * ```tsx
 * const toast = useToast();
 * 
 * toast.success('Operation completed!');
 * toast.error('Something went wrong');
 * ```
 */
export function useToast(): UseToastReturn {
  const success = useCallback((content: string, options?: ToastOptions) => {
    message.success(content, options?.duration);
  }, []);

  const error = useCallback((content: string, options?: ToastOptions) => {
    message.error(content, options?.duration);
  }, []);

  const info = useCallback((content: string, options?: ToastOptions) => {
    message.info(content, options?.duration);
  }, []);

  const warning = useCallback((content: string, options?: ToastOptions) => {
    message.warning(content, options?.duration);
  }, []);

  const loading = useCallback((content: string, options?: ToastOptions) => {
    message.loading(content, options?.duration);
  }, []);

  return {
    success,
    error,
    info,
    warning,
    loading,
  };
}
