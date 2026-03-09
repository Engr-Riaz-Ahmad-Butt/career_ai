'use client';

import { Card } from '@/components/ui/card';
import type { AnalysisSuggestion } from '@/types/atsAnalysis.types';

interface AnalyzeSuggestionsListProps {
  readonly title: string;
  readonly suggestions: readonly AnalysisSuggestion[];
}

export function AnalyzeSuggestionsList({ title, suggestions }: AnalyzeSuggestionsListProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-6 font-semibold text-slate-900 dark:text-white">{title}</h3>

      <ul className="space-y-4">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id} className="flex items-start gap-3">
            <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {suggestion.rank}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">{suggestion.text}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
