'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, ZapOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InterviewProbabilityProps {
  probability: number;
  atsScore: number;
  keywordMatch: number;
}

export function InterviewProbability({
  probability,
  atsScore,
  keywordMatch,
}: InterviewProbabilityProps) {
  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return 'text-green-600 dark:text-green-400';
    if (prob >= 60) return 'text-blue-600 dark:text-blue-400';
    if (prob >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProbabilityBg = (prob: number) => {
    if (prob >= 80) return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
    if (prob >= 60) return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800';
    if (prob >= 40) return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
  };

  const getMessage = (prob: number) => {
    if (prob >= 80) {
      return 'Excellent! Your resume has a very high chance of getting you an interview.';
    }
    if (prob >= 60) {
      return 'Good! Your resume has a strong chance of passing ATS screening.';
    }
    if (prob >= 40) {
      return 'Fair. Your resume might pass ATS screening, but needs improvement.';
    }
    return 'Low. Consider optimizing your resume significantly.';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Probability Card */}
      <Card className={`border-2 ${getProbabilityBg(probability)}`}>
        <CardHeader>
          <CardTitle>Interview Call Probability</CardTitle>
          <CardDescription>Estimated likelihood based on ATS analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Probability Display */}
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-200 dark:text-slate-800"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className={getProbabilityColor(probability)}
                  strokeDasharray={`${(probability / 100) * 439.82} 439.82`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getProbabilityColor(probability)}`}>
                  {probability}%
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Probability
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center">
            <p className={`font-medium text-lg ${getProbabilityColor(probability)}`}>
              {getMessage(probability)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contributing Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contributing Factors</CardTitle>
          <CardDescription>What influences your interview probability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ATS Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  ATS Compatibility Score
                </span>
              </div>
              <span className={`text-lg font-bold ${getProbabilityColor(atsScore)}`}>
                {atsScore}%
              </span>
            </div>
            <Progress value={atsScore} className="h-2" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              How well your resume format and structure work with ATS systems
            </p>
          </motion.div>

          {/* Keyword Match */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  Keyword Match Rate
                </span>
              </div>
              <span className={`text-lg font-bold ${getProbabilityColor(keywordMatch)}`}>
                {keywordMatch}%
              </span>
            </div>
            <Progress value={keywordMatch} className="h-2" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              How many job-specific keywords you've included
            </p>
          </motion.div>
        </CardContent>
      </Card>

      {/* Tips to Improve */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-lg">How to Improve Your Chances</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {probability < 60 && (
              <>
                <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span>
                    Tailor your resume to each job description by including relevant keywords
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span>Simplify formatting: use standard fonts, no graphics or tables</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span>Add quantifiable results and metrics to your achievements</span>
                </li>
              </>
            )}
            {probability < 80 && (
              <>
                <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Include all relevant certifications and technical skills</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span>Make sure all important sections are clearly labeled</span>
                </li>
              </>
            )}
            {probability >= 80 && (
              <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span>Great work! Your resume is highly optimized for ATS screening.</span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
