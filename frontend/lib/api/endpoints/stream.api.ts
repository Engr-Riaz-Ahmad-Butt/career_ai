import { captureClientError } from '@/lib/errorHandling';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export interface StreamChunk {
  type: 'progress' | 'data' | 'error' | 'complete';
  id?: string;
  message?: string;
  progress?: number;
  data?: Record<string, unknown>;
  timestamp?: string;
}

interface StreamHandlers {
  onChunk: (chunk: StreamChunk) => void;
  onError?: (error: Event) => void;
}

function buildUrl(path: string, query: Record<string, string | number | boolean>): string {
  const url = new URL(`${BASE_URL}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

function openStream(
  path: string,
  query: Record<string, string | number | boolean>,
  handlers: StreamHandlers
): EventSource {
  const url = buildUrl(path, query);
  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.onmessage = (event) => {
    try {
      const chunk = JSON.parse(event.data) as StreamChunk;
      handlers.onChunk(chunk);
    } catch {
      captureClientError(new Error('Invalid stream payload'), {
        source: 'stream_api',
        action: 'invalid_stream_payload',
        extras: {
          path,
          payload: event.data,
        },
      });

      handlers.onChunk({
        type: 'error',
        message: 'Invalid stream payload',
      });
    }
  };

  eventSource.onerror = (error) => {
    captureClientError(new Error('Stream connection failed'), {
      source: 'stream_api',
      action: 'stream_connection_failed',
      extras: {
        path,
      },
    });
    handlers.onError?.(error);
  };

  return eventSource;
}

export const streamApi = {
  openAtsScoreStream: (
    resumeId: string,
    options: {
      jobDescription: string;
      token: string;
      onChunk: (chunk: StreamChunk) => void;
      onError?: (error: Event) => void;
    }
  ): EventSource =>
    openStream(
      `/stream/ats-score/${encodeURIComponent(resumeId)}`,
      {
        jobDescription: options.jobDescription,
        token: options.token,
      },
      {
        onChunk: options.onChunk,
        onError: options.onError,
      }
    ),

  openEnhanceResumeStream: (
    resumeId: string,
    options: {
      section: string;
      targetRole?: string;
      token: string;
      onChunk: (chunk: StreamChunk) => void;
      onError?: (error: Event) => void;
    }
  ): EventSource =>
    openStream(
      `/stream/enhance-resume/${encodeURIComponent(resumeId)}`,
      {
        section: options.section,
        targetRole: options.targetRole ?? 'General',
        token: options.token,
      },
      {
        onChunk: options.onChunk,
        onError: options.onError,
      }
    ),
};
