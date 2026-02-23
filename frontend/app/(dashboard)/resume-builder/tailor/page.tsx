'use client';

import ResumeBuilderPage from '../page';

/**
 * For now, we reuse the main ResumeBuilderPage logic 
 * but default it to the 'optimizer' flow.
 */
export default function TailorResumePage() {
    return <ResumeBuilderPage initialFlow="editor" initialTab="optimizer" />;
}
