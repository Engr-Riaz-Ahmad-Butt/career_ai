'use client';

import { Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ResumeOption } from '@/types/atsAnalysis.types';

interface AnalyzeFormLabels {
  readonly title: string;
  readonly description: string;
  readonly resumeLabel: string;
  readonly resumePlaceholder: string;
  readonly jobDescriptionLabel: string;
  readonly jobDescriptionPlaceholder: string;
  readonly backgroundButton: string;
  readonly streamButton: string;
}

interface AnalyzeFormCardProps {
  readonly labels: AnalyzeFormLabels;
  readonly resumes: readonly ResumeOption[];
  readonly selectedResumeId: string;
  readonly jobDescription: string;
  readonly canStartAnalysis: boolean;
  readonly isBackgroundAnalyzing: boolean;
  readonly isStreamAnalyzing: boolean;
  readonly onSelectResume: (resumeId: string) => void;
  readonly onJobDescriptionChange: (value: string) => void;
  readonly onRunBackground: () => void;
  readonly onRunStream: () => void;
}

export function AnalyzeFormCard({
  labels,
  resumes,
  selectedResumeId,
  jobDescription,
  canStartAnalysis,
  isBackgroundAnalyzing,
  isStreamAnalyzing,
  onSelectResume,
  onJobDescriptionChange,
  onRunBackground,
  onRunStream,
}: AnalyzeFormCardProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">{labels.title}</CardTitle>
        <CardDescription>{labels.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">{labels.resumeLabel}</label>
            <select
              value={selectedResumeId}
              onChange={(event) => onSelectResume(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="">{labels.resumePlaceholder}</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{labels.jobDescriptionLabel}</label>
          <Textarea
            value={jobDescription}
            placeholder={labels.jobDescriptionPlaceholder}
            className="min-h-[150px]"
            onChange={(event) => onJobDescriptionChange(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            className="h-11 bg-indigo-600 px-8 hover:bg-indigo-700"
            disabled={!canStartAnalysis || isStreamAnalyzing}
            onClick={onRunBackground}
          >
            {isBackgroundAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            {labels.backgroundButton}
          </Button>

          <Button
            variant="outline"
            className="h-11 px-8"
            disabled={!canStartAnalysis || isBackgroundAnalyzing}
            onClick={onRunStream}
          >
            {isStreamAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            {labels.streamButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
