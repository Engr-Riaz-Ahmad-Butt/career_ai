'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Inbox } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';

type AnalyzeStateCardVariant = 'loading' | 'error' | 'empty';

interface AnalyzeStateCardProps {
  readonly variant: AnalyzeStateCardVariant;
  readonly title: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

function resolveIcon(variant: AnalyzeStateCardVariant) {
  if (variant === 'loading') {
    return <LoadingSpinner size="md" variant="primary" />;
  }

  if (variant === 'error') {
    return <AlertCircle className="h-6 w-6 text-rose-600" />;
  }

  return <Inbox className="h-6 w-6 text-slate-500" />;
}

export function AnalyzeStateCard({
  variant,
  title,
  description,
  actionLabel,
  onAction,
}: AnalyzeStateCardProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-8 text-center">
        {resolveIcon(variant)}
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
        {description ? (
          <p className="max-w-xl text-sm text-slate-600 dark:text-slate-400">{description}</p>
        ) : null}

        {actionLabel && onAction ? (
          <Button variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
