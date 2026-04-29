export interface LinkedInOptimizeResult {
  headline: string;
  summary: string;
  experienceBullets: Array<{ original: string; improved: string; reason: string }>;
  keywords: string[];
  overallTips: string[];
}
