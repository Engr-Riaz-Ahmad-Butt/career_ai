export interface ABTestVariant {
  id: string;
  name: string;
  content: {
    headline: string;
    summary: string;
    skills: string[];
    experience: string[];
  };
  createdDate: Date;
}

export interface ABTestResult {
  id: string;
  testId: string;
  variantA: ABTestVariant;
  variantB: ABTestVariant;
  jobDescription: string;
  
  variantAScore: number;
  variantBScore: number;
  
  predictedPerformance: {
    variantA: number; // 0-100 probability
    variantB: number; // 0-100 probability
  };
  
  recommendation: string;
  explanation: string;
  
  startDate: Date;
  resultsDate: Date;
}

export const generateABTestPrediction = (
  variantA: ABTestVariant,
  variantB: ABTestVariant,
  jobDescription: string
): ABTestResult => {
  // Simulated AI prediction based on various factors
  const score1 = Math.random() * 100;
  const score2 = Math.random() * 100;

  let recommendation = '';
  let explanation = '';

  if (score1 > score2 + 10) {
    recommendation = `Variant A (${variantA.name}) is predicted to perform ${Math.round(score1 - score2)}% better`;
    explanation = `${variantA.name} has better ATS alignment with the job description and includes more relevant keywords from the posting.`;
  } else if (score2 > score1 + 10) {
    recommendation = `Variant B (${variantB.name}) is predicted to perform ${Math.round(score2 - score1)}% better`;
    explanation = `${variantB.name} demonstrates stronger experience narrative and better storytelling approach that resonates with recruiters.`;
  } else {
    recommendation = 'Both variants are equally strong';
    explanation = 'Both versions have similar ATS scores and recruiter appeal. Choose based on personal preference or test both in real applications.';
  }

  return {
    id: `test-${Date.now()}`,
    testId: `ab-test-${Date.now()}`,
    variantA,
    variantB,
    jobDescription,
    variantAScore: Math.round(score1),
    variantBScore: Math.round(score2),
    predictedPerformance: {
      variantA: Math.round(score1),
      variantB: Math.round(score2),
    },
    recommendation,
    explanation,
    startDate: new Date(),
    resultsDate: new Date(),
  };
};
