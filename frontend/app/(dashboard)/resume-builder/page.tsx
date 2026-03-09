'use client';

import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { Suspense } from 'react';
import { FeatureErrorBoundary } from '@/components/errors/FeatureErrorBoundary';

export default function ResumeBuilderPage() {
  return (
    <FeatureErrorBoundary featureName="Resume Builder">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading builder...</div>}>
        <ResumeBuilder />
      </Suspense>
    </FeatureErrorBoundary>
  );
}
