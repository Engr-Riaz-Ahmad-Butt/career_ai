'use client';

import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { Suspense } from 'react';

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading builder...</div>}>
      <ResumeBuilder />
    </Suspense>
  );
}
