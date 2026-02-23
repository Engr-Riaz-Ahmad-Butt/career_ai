'use client';

import ResumeBuilderPage from '../page';

/**
 * For now, we reuse the main ResumeBuilderPage logic 
 * but default it to the 'selection' flow.
 */
export default function NewResumePage() {
    return <ResumeBuilderPage initialFlow="selection" />;
}
