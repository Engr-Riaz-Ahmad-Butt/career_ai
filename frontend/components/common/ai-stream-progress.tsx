'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';
import type { StreamChunk } from '@/lib/api/endpoints/stream.api';

interface AIStreamProgressLabels {
  readonly liveTitle: string;
  readonly updateTitle: string;
  readonly stopButton: string;
  readonly streamingMessage: string;
  readonly idleMessage: string;
}

interface AIStreamProgressProps {
  isStreaming: boolean;
  latestChunk: StreamChunk | null;
  error: string | null;
  onStop: () => void;
  labels?: AIStreamProgressLabels;
}

const DEFAULT_LABELS: AIStreamProgressLabels = {
  liveTitle: 'Live AI Stream',
  updateTitle: 'Stream Update',
  stopButton: 'Stop Stream',
  streamingMessage: 'Streaming...',
  idleMessage: 'Idle',
};

export function AIStreamProgress({
  isStreaming,
  latestChunk,
  error,
  onStop,
  labels = DEFAULT_LABELS,
}: AIStreamProgressProps) {
  const progress = Math.max(0, Math.min(100, latestChunk?.progress ?? 0));

  if (!isStreaming && !error && !latestChunk) {
    return null;
  }

  return (
    <Card className="mb-8 border-indigo-200 bg-indigo-50/40 dark:border-indigo-900/40 dark:bg-indigo-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          {isStreaming ? (
            <>
              <LoadingSpinner size="sm" variant="primary" />
              {labels.liveTitle}
            </>
          ) : (
            <>
              <Radio className="h-4 w-4 text-indigo-600" />
              {labels.updateTitle}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {error ?? latestChunk?.message ?? (isStreaming ? labels.streamingMessage : labels.idleMessage)}
        </p>

        {isStreaming && (
          <Button variant="outline" size="sm" onClick={onStop} className="rounded-xl">
            {labels.stopButton}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
