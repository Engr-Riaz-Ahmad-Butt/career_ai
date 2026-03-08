'use client';

import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { Suspense } from 'react';

/**
 * For now, we reuse the main ResumeBuilderPage logic 
 * but default it to the 'selection' flow.
 */
export default function NewResumePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ResumeBuilder initialFlow="template-selection" />
        </Suspense>
    );
}
