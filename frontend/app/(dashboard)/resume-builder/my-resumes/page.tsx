'use client';

import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { Suspense } from 'react';

/**
 * For now, we reuse the main ResumeBuilderPage logic 
 * but default it to the 'overview' tab.
 */
export default function MyResumesPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading resumes...</div>}>
            <ResumeBuilder initialFlow="editor" initialTab="overview" />
        </Suspense>
    );
}
