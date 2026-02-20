export interface KeywordAnalysis {
  keyword: string;
  found: boolean;
  count: number;
  density: number;
  importance: 'high' | 'medium' | 'low';
}

export interface ATSScoreBreakdown {
  totalScore: number;
  formatScore: number;
  contentScore: number;
  keywordScore: number;
  experienceScore: number;
  sections: string[];
  missingSections: string[];
}

export interface ATSAnalysis {
  score: number;
  breakdown: ATSScoreBreakdown;
  keywords: KeywordAnalysis[];
  missingKeywords: string[];
  recommendations: string[];
  interviewProbability: number;
  explanation: string;
}

const commonATS Keywords = [
  // Technical Skills
  { word: 'JavaScript', importance: 'high' as const },
  { word: 'React', importance: 'high' as const },
  { word: 'TypeScript', importance: 'high' as const },
  { word: 'Node.js', importance: 'high' as const },
  { word: 'Python', importance: 'high' as const },
  { word: 'AWS', importance: 'high' as const },
  { word: 'SQL', importance: 'high' as const },
  { word: 'MongoDB', importance: 'medium' as const },
  { word: 'Git', importance: 'medium' as const },
  { word: 'Docker', importance: 'medium' as const },
  // Soft Skills
  { word: 'Leadership', importance: 'high' as const },
  { word: 'Communication', importance: 'high' as const },
  { word: 'Problem-solving', importance: 'high' as const },
  { word: 'Team Collaboration', importance: 'medium' as const },
  { word: 'Project Management', importance: 'medium' as const },
  // Experience Keywords
  { word: 'Designed', importance: 'high' as const },
  { word: 'Implemented', importance: 'high' as const },
  { word: 'Developed', importance: 'high' as const },
  { word: 'Led', importance: 'high' as const },
  { word: 'Managed', importance: 'medium' as const },
];

export function analyzeResume(resumeText: string, jobDescription: string = ''): ATSAnalysis {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  // Extract keywords from job description
  const jobKeywords = extractKeywords(jobLower);
  
  // Analyze keywords found in resume
  const keywordAnalysis = analyzeKeywords(resumeLower, jobKeywords);
  
  // Calculate scores
  const formatScore = calculateFormatScore(resumeText);
  const contentScore = calculateContentScore(resumeText);
  const keywordScore = calculateKeywordScore(keywordAnalysis);
  const experienceScore = calculateExperienceScore(resumeText);
  
  const totalScore = Math.round(
    (formatScore * 0.2 + contentScore * 0.2 + keywordScore * 0.4 + experienceScore * 0.2) / 100 * 100
  );

  // Get missing sections
  const sections = detectSections(resumeText);
  const requiredSections = ['Contact', 'Summary', 'Experience', 'Education', 'Skills'];
  const missingSections = requiredSections.filter(s => !sections.includes(s));

  // Get missing keywords
  const missingKeywords = keywordAnalysis
    .filter(k => !k.found)
    .map(k => k.keyword)
    .slice(0, 5);

  // Get recommendations
  const recommendations = generateRecommendations(
    totalScore,
    missingSections,
    missingKeywords,
    keywordScore
  );

  // Calculate interview probability
  const interviewProbability = Math.min(
    Math.round((totalScore / 100) * 100 * (1 + keywordScore / 200)),
    95
  );

  // Generate AI explanation
  const explanation = generateExplanation(totalScore, keywordScore, contentScore, formatScore);

  return {
    score: totalScore,
    breakdown: {
      totalScore,
      formatScore,
      contentScore,
      keywordScore,
      experienceScore,
      sections,
      missingSections,
    },
    keywords: keywordAnalysis,
    missingKeywords,
    recommendations,
    interviewProbability,
    explanation,
  };
}

function extractKeywords(text: string): string[] {
  // Extract keywords from job description
  const words = text.match(/\b[a-z+#.]+\b/g) || [];
  return [...new Set(words)]
    .filter(w => w.length > 3)
    .slice(0, 20);
}

function analyzeKeywords(resumeText: string, jobKeywords: string[]): KeywordAnalysis[] {
  const allKeywords = [...commonATS Keywords.map(k => k.word), ...jobKeywords];
  
  return allKeywords.map(keyword => {
    const regex = new RegExp(keyword, 'gi');
    const matches = resumeText.match(regex) || [];
    const count = matches.length;
    const importance = commonATS Keywords.find(k => k.word.toLowerCase() === keyword.toLowerCase())
      ?.importance || 'low';
    
    return {
      keyword,
      found: count > 0,
      count,
      density: (count / resumeText.split(/\s+/).length) * 100,
      importance,
    };
  });
}

function calculateFormatScore(text: string): number {
  let score = 50;
  
  // Check for contact info
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) score += 10;
  if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) score += 10;
  if (/linkedin\.com/.test(text)) score += 10;
  if (/github\.com/.test(text)) score += 10;
  
  return Math.min(score, 100);
}

function calculateContentScore(text: string): number {
  let score = 30;
  
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 200 && wordCount < 1000) score += 20;
  
  // Check for action verbs
  const actionVerbs = ['achieved', 'designed', 'developed', 'implemented', 'led', 'managed'];
  const actionVerbCount = actionVerbs.filter(verb => text.toLowerCase().includes(verb)).length;
  if (actionVerbCount > 3) score += 30;
  
  // Check for metrics
  if (/\d+%|\$\d+|increased|decreased|improved/.test(text)) score += 20;
  
  return Math.min(score, 100);
}

function calculateKeywordScore(keywords: KeywordAnalysis[]): number {
  const found = keywords.filter(k => k.found).length;
  const total = keywords.length;
  const baseScore = (found / total) * 60;
  
  // Bonus for high-importance keywords
  const highImportanceFound = keywords
    .filter(k => k.found && k.importance === 'high')
    .length;
  const highImportanceTotal = keywords
    .filter(k => k.importance === 'high')
    .length;
  
  const highBonus = (highImportanceFound / highImportanceTotal) * 40;
  
  return Math.min(baseScore + highBonus, 100);
}

function calculateExperienceScore(text: string): number {
  let score = 40;
  
  // Check for years of experience
  if (/\d+\+?\s*years?/.test(text)) score += 15;
  
  // Check for company names (common tech companies)
  const companies = ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Netflix', 'Tesla'];
  const companyCount = companies.filter(c => text.includes(c)).length;
  if (companyCount > 0) score += Math.min(companyCount * 10, 20);
  
  // Check for achievements
  if (/led|managed|directed|oversaw|spearheaded/.test(text.toLowerCase())) score += 15;
  
  return Math.min(score, 100);
}

function detectSections(text: string): string[] {
  const sections: string[] = [];
  const textLower = text.toLowerCase();
  
  if (/contact|email|phone/.test(textLower)) sections.push('Contact');
  if (/summary|objective|professional summary/.test(textLower)) sections.push('Summary');
  if (/experience|work history|employment/.test(textLower)) sections.push('Experience');
  if (/education|degree|school|university/.test(textLower)) sections.push('Education');
  if (/skills|technical|proficiency/.test(textLower)) sections.push('Skills');
  if (/certification|credential|license/.test(textLower)) sections.push('Certifications');
  
  return sections;
}

function generateRecommendations(
  score: number,
  missingSections: string[],
  missingKeywords: string[],
  keywordScore: number
): string[] {
  const recommendations: string[] = [];
  
  if (score < 70) {
    recommendations.push('Your resume ATS score is below average. Consider optimizing for ATS compatibility.');
  }
  
  if (missingSections.length > 0) {
    recommendations.push(`Add missing sections: ${missingSections.join(', ')}`);
  }
  
  if (missingKeywords.length > 0) {
    recommendations.push(`Include these important keywords: ${missingKeywords.slice(0, 3).join(', ')}`);
  }
  
  if (keywordScore < 50) {
    recommendations.push('Add more relevant keywords from the job description to improve keyword matching.');
  }
  
  recommendations.push('Use a single column layout for better ATS parsing.');
  recommendations.push('Avoid graphics, images, and tables in your resume.');
  recommendations.push('Use standard fonts and avoid special characters.');
  
  return recommendations;
}

function generateExplanation(
  score: number,
  keywordScore: number,
  contentScore: number,
  formatScore: number
): string {
  let explanation = '';
  
  if (score >= 90) {
    explanation = `Your resume is excellent for ATS systems! With a score of ${score}/100, your resume is highly likely to pass ATS screening. `;
  } else if (score >= 75) {
    explanation = `Your resume is good for ATS systems (${score}/100), but has room for improvement. `;
  } else if (score >= 60) {
    explanation = `Your resume has some ATS compatibility issues (${score}/100). `;
  } else {
    explanation = `Your resume needs significant ATS optimization (${score}/100). `;
  }
  
  if (keywordScore < 50) {
    explanation += `The main issue is insufficient keywords. Make sure you include terms from the job description. `;
  }
  
  if (contentScore < 50) {
    explanation += `Your content could be strengthened with more specific achievements and quantified results. `;
  }
  
  if (formatScore < 60) {
    explanation += `Simplify your formatting - use standard fonts and remove complex layouts for better ATS parsing.`;
  }
  
  return explanation;
}
