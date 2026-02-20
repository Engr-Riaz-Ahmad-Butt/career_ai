'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { KeywordAnalysis } from '@/lib/ats-analyzer';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

interface KeywordDensityAnalyzerProps {
  keywords: KeywordAnalysis[];
  missingKeywords: string[];
}

export function KeywordDensityAnalyzer({
  keywords,
  missingKeywords,
}: KeywordDensityAnalyzerProps) {
  const foundKeywords = keywords.filter(k => k.found);
  const highImportanceFound = foundKeywords.filter(k => k.importance === 'high').length;
  const highImportanceTotal = keywords.filter(k => k.importance === 'high').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Analysis</CardTitle>
          <CardDescription>Keywords found and their density in your resume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {foundKeywords.length}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Keywords Found
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {highImportanceFound}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                High Priority
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {missingKeywords.length}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Missing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Found Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Found Keywords</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {foundKeywords.map((keyword, index) => (
            <motion.div
              key={keyword.keyword}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-slate-900 dark:text-white">
                    {keyword.keyword}
                  </span>
                  <Badge
                    variant={
                      keyword.importance === 'high'
                        ? 'default'
                        : keyword.importance === 'medium'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="text-xs"
                  >
                    {keyword.importance}
                  </Badge>
                </div>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {keyword.count}x
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={Math.min(keyword.density * 10, 100)} className="flex-1" />
                <span className="text-xs text-slate-600 dark:text-slate-400 w-12 text-right">
                  {keyword.density.toFixed(2)}%
                </span>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Missing Keywords */}
      {missingKeywords.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-lg text-amber-900 dark:text-amber-100">
                Missing Keywords
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
              Add these keywords to improve your ATS score:
            </p>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keyword Density Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Optimal Keyword Density
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Aim for 1-3% keyword density for each important keyword
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Natural Integration
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Use keywords naturally in context, not keyword stuffing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
