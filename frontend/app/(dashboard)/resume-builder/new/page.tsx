'use client';

import { Suspense } from 'react';

import { FeatureErrorBoundary } from '@/components/errors/FeatureErrorBoundary';
import { ResumeBuilder } from '@/components/resume/ResumeBuilder';

export default function NewResumePage() {
    return (
        <FeatureErrorBoundary featureName="Resume Builder">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <ResumeBuilder />
            </Suspense>
        </FeatureErrorBoundary>
    );
}
