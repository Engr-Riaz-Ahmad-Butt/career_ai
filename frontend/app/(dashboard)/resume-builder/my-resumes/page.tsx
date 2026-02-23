'use client';

import ResumeBuilderPage from '../page';

/**
 * For now, we reuse the main ResumeBuilderPage logic 
 * but default it to the 'overview' tab.
 */
export default function MyResumesPage() {
    return <ResumeBuilderPage initialFlow="editor" initialTab="overview" />;
}
