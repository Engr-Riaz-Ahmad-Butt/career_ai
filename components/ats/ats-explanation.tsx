'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';

interface ATSExplanationProps {
  explanation: string;
  score: number;
  recommendations: string[];
}

export function ATSExplanation({
  explanation,
  score,
  recommendations,
}: ATSExplanationProps) {
  const getSeverity = (score: number) => {
    if (score >= 85) return { level: 'success', icon: CheckCircle2, title: 'Great' };
    if (score >= 70) return { level: 'info', icon: AlertCircle, title: 'Good' };
    if (score >= 50) return { level: 'warning', icon: AlertTriangle, title: 'Warning' };
    return { level: 'error', icon: AlertTriangle, title: 'Critical' };
  };

  const severity = getSeverity(score);
  const Icon = severity.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Explanation */}
      <Alert className={`border-2 ${
        severity.level === 'success'
          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20'
          : severity.level === 'warning'
          ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20'
          : severity.level === 'error'
          ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20'
          : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20'
      }`}>
        <Icon className={`h-5 w-5 ${
          severity.level === 'success'
            ? 'text-green-600 dark:text-green-400'
            : severity.level === 'warning'
            ? 'text-yellow-600 dark:text-yellow-400'
            : severity.level === 'error'
            ? 'text-red-600 dark:text-red-400'
            : 'text-blue-600 dark:text-blue-400'
        }`} />
        <AlertTitle className={`text-lg ${
          severity.level === 'success'
            ? 'text-green-900 dark:text-green-100'
            : severity.level === 'warning'
            ? 'text-yellow-900 dark:text-yellow-100'
            : severity.level === 'error'
            ? 'text-red-900 dark:text-red-100'
            : 'text-blue-900 dark:text-blue-100'
        }`}>
          {severity.title}
        </AlertTitle>
        <AlertDescription className={
          severity.level === 'success'
            ? 'text-green-800 dark:text-green-200'
            : severity.level === 'warning'
            ? 'text-yellow-800 dark:text-yellow-200'
            : severity.level === 'error'
            ? 'text-red-800 dark:text-red-200'
            : 'text-blue-800 dark:text-blue-200'
        }>
          {explanation}
        </AlertDescription>
      </Alert>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Why Your Resume Works (or Doesn't)</CardTitle>
          <CardDescription>AI-powered analysis of your ATS compatibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Format & Structure
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {score >= 70
                  ? 'Your resume formatting is clean and ATS-friendly. Good use of standard fonts and simple structure.'
                  : 'Consider simplifying your resume format. Remove complex layouts, tables, and graphics that ATS systems struggle to parse.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Content Quality
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {score >= 70
                  ? 'Your resume contains strong action verbs and quantified achievements. Keep highlighting metrics and results.'
                  : 'Strengthen your content with specific achievements, metrics, and quantifiable results. Use action verbs like "led", "designed", "implemented".'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Keywords & Relevance
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {score >= 70
                  ? 'Your resume includes relevant keywords for your industry. Continue tailoring to specific job descriptions.'
                  : 'Add more industry-specific keywords and tailor your resume to job descriptions. Include technical skills and tools relevant to the role.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle>Actionable Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {recommendations.slice(0, 5).map((rec, index) => (
              <motion.li
                key={rec}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-300">{rec}</span>
              </motion.li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </motion.div>
  );
}
