'use client';

import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { Suspense } from 'react';

/**
 * For now, we reuse the main ResumeBuilderPage logic 
 * but default it to the 'optimizer' flow.
 */
export default function TailorResumePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Preparing AI Tailoring...</div>}>
            <ResumeBuilder initialFlow="editor" initialTab="optimizer" />
        </Suspense>
    );
}
