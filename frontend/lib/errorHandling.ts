import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

interface ApiErrorPayload {
  message?: string;
  error?: {
    code?: string;
    details?: unknown;
  };
}

export interface ErrorCaptureContext {
  source: string;
  action?: string;
  tags?: Record<string, string>;
  extras?: Record<string, unknown>;
}

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

function getApiPayload(data: unknown): ApiErrorPayload {
  if (!data || typeof data !== 'object') return {};
  return data as ApiErrorPayload;
}

export function getErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MESSAGE): string {
  if (axios.isAxiosError(error)) {
    const payload = getApiPayload(error.response?.data);
    if (payload.message && payload.message.trim().length > 0) {
      return payload.message;
    }

    if (error.code === 'ERR_NETWORK') {
      return 'Network connection failed. Please check your internet and try again.';
    }

    if (error.response?.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    if (error.response && error.response.status >= 500) {
      return 'The server is temporarily unavailable. Please try again shortly.';
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}

export function isRetryableNetworkError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;

  if (!error.response) {
    return true;
  }

  const status = error.response.status;
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

export function shouldRetryRequest(error: unknown, failureCount: number, maxRetries = 3): boolean {
  if (failureCount >= maxRetries) {
    return false;
  }

  return isRetryableNetworkError(error);
}

export function getRetryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 10000);
}

export function captureClientError(error: unknown, context: ErrorCaptureContext): void {
  Sentry.withScope((scope) => {
    scope.setTag('error_source', context.source);

    if (context.action) {
      scope.setTag('error_action', context.action);
    }

    if (context.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context.extras) {
      Object.entries(context.extras).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (axios.isAxiosError(error)) {
      scope.setTag('http_status', String(error.response?.status ?? 'none'));
      scope.setExtra('request_url', error.config?.url);
      scope.setExtra('request_method', error.config?.method);
      scope.setExtra('response_data', error.response?.data);
    }

    const normalizedError =
      error instanceof Error ? error : new Error(getErrorMessage(error, 'Unknown client error'));

    Sentry.captureException(normalizedError);
  });
}
