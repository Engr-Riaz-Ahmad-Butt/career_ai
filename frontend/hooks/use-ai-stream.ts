import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { streamApi, StreamChunk } from '@/lib/api/endpoints/stream.api';
import { useAuthStore } from '@/store/authStore';

export function useAIStream() {
  const sourceRef = useRef<EventSource | null>(null);
  const [chunks, setChunks] = useState<StreamChunk[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeStream = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setChunks([]);
    setError(null);
  }, []);

  const handleChunk = useCallback((chunk: StreamChunk) => {
    setChunks((prev) => [...prev, chunk]);

    if (chunk.type === 'error') {
      setError(chunk.message ?? 'Streaming failed');
      setIsStreaming(false);
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }
      return;
    }

    if (chunk.type === 'complete') {
      setIsStreaming(false);
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }
    }
  }, []);

  const handleTransportError = useCallback(() => {
    setError('Stream connection failed');
    setIsStreaming(false);
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
  }, []);

  const startAtsScoreStream = useCallback(
    (resumeId: string, jobDescription: string) => {
      const token = useAuthStore.getState().accessToken;
      if (!token) {
        setError('Please login to start streaming');
        return;
      }

      closeStream();
      reset();
      setIsStreaming(true);

      sourceRef.current = streamApi.openAtsScoreStream(resumeId, {
        jobDescription,
        token,
        onChunk: handleChunk,
        onError: handleTransportError,
      });
    },
    [closeStream, handleChunk, handleTransportError, reset]
  );

  const startEnhanceResumeStream = useCallback(
    (resumeId: string, section: string, targetRole?: string) => {
      const token = useAuthStore.getState().accessToken;
      if (!token) {
        setError('Please login to start streaming');
        return;
      }

      closeStream();
      reset();
      setIsStreaming(true);

      sourceRef.current = streamApi.openEnhanceResumeStream(resumeId, {
        section,
        targetRole,
        token,
        onChunk: handleChunk,
        onError: handleTransportError,
      });
    },
    [closeStream, handleChunk, handleTransportError, reset]
  );

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.close();
      }
    };
  }, []);

  const latestChunk = useMemo(() => (chunks.length > 0 ? chunks[chunks.length - 1] : null), [chunks]);

  return {
    chunks,
    latestChunk,
    isStreaming,
    error,
    closeStream,
    reset,
    startAtsScoreStream,
    startEnhanceResumeStream,
  };
}
