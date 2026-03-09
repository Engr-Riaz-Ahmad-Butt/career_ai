export const RESUME_OPTIMIZER_COPY = {
  input: {
    title: 'Optimize for Job Description',
    description: 'Paste the job description below and AI will tailor your resume to match the role requirements.',
    placeholder: 'Paste the job description here...',
    optimizeButton: 'Optimize My Resume',
    loadingButton: 'Analyzing JD and tailoring resume...',
  },
  result: {
    title: 'Optimization Complete',
    description: 'Summary and experience were updated to align better with the target role.',
    originalSummaryTitle: 'Original Summary',
    optimizedSummaryTitle: 'Optimized Summary',
    improvedBadge: 'AI ENHANCED',
    improvementsTitle: 'Key Improvements',
    startOverButton: 'Start Over',
    applyButton: 'Apply All Changes',
    emptyImprovements: 'No detailed improvements were returned by AI.',
  },
  messages: {
    missingJobDescription: 'Please paste a job description',
    optimizationSuccess: 'Resume optimized successfully',
    optimizationFailed: 'Failed to optimize resume. Please try again.',
    applySuccess: 'Optimized changes applied to your resume',
    copySuccess: 'Optimized summary copied to clipboard',
    copyFailed: 'Copy failed. Please try again.',
  },
} as const;
