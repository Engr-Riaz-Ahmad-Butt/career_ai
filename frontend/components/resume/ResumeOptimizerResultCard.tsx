'use client';

import { Check, CheckCircle2, Copy, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ResumeImprovement } from '@/types/resumeOptimizer.types';

interface ResumeOptimizerResultLabels {
  readonly title: string;
  readonly description: string;
  readonly originalSummaryTitle: string;
  readonly optimizedSummaryTitle: string;
  readonly improvedBadge: string;
  readonly improvementsTitle: string;
  readonly emptyImprovements: string;
  readonly startOverButton: string;
  readonly applyButton: string;
}

interface ResumeOptimizerResultCardProps {
  readonly labels: ResumeOptimizerResultLabels;
  readonly originalSummary: string;
  readonly optimizedSummary: string;
  readonly improvements: readonly ResumeImprovement[];
  readonly isSummaryCopied: boolean;
  readonly onCopySummary: () => void;
  readonly onStartOver: () => void;
  readonly onApply: () => void;
}

export function ResumeOptimizerResultCard({
  labels,
  originalSummary,
  optimizedSummary,
  improvements,
  isSummaryCopied,
  onCopySummary,
  onStartOver,
  onApply,
}: ResumeOptimizerResultCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-green-100 bg-green-50 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-green-500 p-3 text-white">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-900">{labels.title}</h3>
            <p className="text-green-700">{labels.description}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onStartOver}>{labels.startOverButton}</Button>
          <Button onClick={onApply} className="bg-green-600 hover:bg-green-700">{labels.applyButton}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="space-y-4 border-slate-200 bg-slate-50/50 p-6 opacity-70">
          <h4 className="flex items-center gap-2 font-bold">
            <FileText className="h-4 w-4" />
            {labels.originalSummaryTitle}
          </h4>
          <p className="line-clamp-6 text-sm italic text-muted-foreground">{originalSummary}</p>
        </Card>

        <Card className="relative space-y-4 overflow-hidden border-primary/20 bg-primary/5 p-6">
          <div className="absolute right-0 top-0 p-2">
            <div className="rounded-bl bg-primary px-2 py-0.5 text-[10px] font-bold text-white">{labels.improvedBadge}</div>
          </div>

          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-2 font-bold text-primary">
              <Sparkles className="h-4 w-4" />
              {labels.optimizedSummaryTitle}
            </h4>
            <Button variant="ghost" size="icon" onClick={onCopySummary}>
              {isSummaryCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <p className="text-sm leading-relaxed text-slate-900">{optimizedSummary}</p>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-bold">{labels.improvementsTitle}</h4>

        {improvements.length === 0 ? <p className="text-sm text-slate-600">{labels.emptyImprovements}</p> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {improvements.map((improvement) => (
            <div key={improvement.id} className="flex gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                {improvement.rank}
              </div>
              <p className="text-sm text-slate-700">{improvement.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
