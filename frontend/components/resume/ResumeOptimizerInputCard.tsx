'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ResumeOptimizerInputLabels {
  readonly title: string;
  readonly description: string;
  readonly placeholder: string;
  readonly optimizeButton: string;
  readonly loadingButton: string;
}

interface ResumeOptimizerInputCardProps {
  readonly labels: ResumeOptimizerInputLabels;
  readonly jobDescription: string;
  readonly isOptimizing: boolean;
  readonly error?: string;
  readonly onJobDescriptionChange: (value: string) => void;
  readonly onOptimize: () => void;
}

export function ResumeOptimizerInputCard({
  labels,
  jobDescription,
  isOptimizing,
  error,
  onJobDescriptionChange,
  onOptimize,
}: ResumeOptimizerInputCardProps) {
  return (
    <Card className="space-y-6 p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-2xl font-bold">{labels.title}</h3>
          <p className="text-muted-foreground">{labels.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          value={jobDescription}
          placeholder={labels.placeholder}
          className="min-h-[300px] bg-slate-50/50 p-4 text-lg"
          onChange={(event) => onJobDescriptionChange(event.target.value)}
        />

        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

        <Button
          className="h-14 w-full text-lg font-bold"
          disabled={isOptimizing || !jobDescription.trim()}
          onClick={onOptimize}
        >
          {isOptimizing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
          {isOptimizing ? labels.loadingButton : labels.optimizeButton}
        </Button>
      </div>
    </Card>
  );
}
