'use client';

import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, name: 'Resume', description: 'Upload or Build' },
  { id: 2, name: 'ATS Scan', description: 'Analyze Fit' },
  { id: 3, name: 'Generate', description: 'Create Document' },
  { id: 4, name: 'Portfolio', description: 'Final Preview' },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full mb-12">
      {STEPS.map((step, idx) => (
        <div key={step.id} className="flex flex-col items-center relative flex-1">
          {/* Connector Line */}
          {idx !== 0 && (
            <div
              className={`absolute left-0 top-5 -translate-x-1/2 w-full h-[2px] z-0 ${
                currentStep > step.id ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          )}

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300 ${
              currentStep === step.id
                ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/30'
                : currentStep > step.id
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
          </div>

          <div className="mt-3 text-center">
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                currentStep === step.id ? 'text-slate-900 dark:text-white' : 'text-slate-400'
              }`}
            >
              {step.name}
            </p>
            <p className="text-[10px] text-slate-400 hidden sm:block">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
