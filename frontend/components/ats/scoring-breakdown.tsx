'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ATSScoreBreakdown } from '@/lib/ats-analyzer';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ScoringBreakdownProps {
  breakdown: ATSScoreBreakdown;
}

export function ScoringBreakdown({ breakdown }: ScoringBreakdownProps) {
  const scores = [
    { label: 'Format Score', value: breakdown.formatScore, color: 'bg-blue-600' },
    { label: 'Content Score', value: breakdown.contentScore, color: 'bg-purple-600' },
    { label: 'Keyword Score', value: breakdown.keywordScore, color: 'bg-indigo-600' },
    { label: 'Experience Score', value: breakdown.experienceScore, color: 'bg-green-600' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
    if (score >= 70) return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800';
    if (score >= 50) return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Overall Score */}
      <Card className={`border ${getScoreBgColor(breakdown.totalScore)}`}>
        <CardHeader>
          <CardTitle>Overall ATS Score</CardTitle>
          <CardDescription>Recruiter-style scoring breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-200 dark:text-slate-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className={getScoreColor(breakdown.totalScore)}
                  strokeDasharray={`${(breakdown.totalScore / 100) * 351.86} 351.86`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(breakdown.totalScore)}`}>
                  {breakdown.totalScore}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">/100</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            {breakdown.totalScore >= 85 && (
              <p className="text-green-700 dark:text-green-300 font-medium">
                Excellent! Your resume will likely pass ATS screening.
              </p>
            )}
            {breakdown.totalScore >= 70 && breakdown.totalScore < 85 && (
              <p className="text-blue-700 dark:text-blue-300 font-medium">
                Good! Your resume has a strong chance of passing ATS screening.
              </p>
            )}
            {breakdown.totalScore >= 50 && breakdown.totalScore < 70 && (
              <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                Fair. Consider optimizing your resume for better ATS compatibility.
              </p>
            )}
            {breakdown.totalScore < 50 && (
              <p className="text-red-700 dark:text-red-300 font-medium">
                Low score. Significant optimization needed for ATS compatibility.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scores.map((score, index) => (
            <motion.div
              key={score.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900 dark:text-white">
                  {score.label}
                </span>
                <span className={`text-lg font-bold ${getScoreColor(score.value)}`}>
                  {score.value}%
                </span>
              </div>
              <Progress value={score.value} className="h-2" />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Sections Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resume Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Found Sections */}
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Found Sections
            </p>
            <div className="space-y-2">
              {breakdown.sections.map((section) => (
                <div key={section} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{section}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Sections */}
          {breakdown.missingSections.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Missing Sections
              </p>
              <div className="space-y-2">
                {breakdown.missingSections.map((section) => (
                  <div key={section} className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{section}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
