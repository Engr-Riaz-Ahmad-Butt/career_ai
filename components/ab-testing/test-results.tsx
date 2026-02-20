'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ABTestResult } from '@/lib/ab-testing-data';
import { TrendingUp, Trophy, AlertCircle, Trash2 } from 'lucide-react';

interface TestResultsProps {
  results: ABTestResult[];
  onDelete: (id: string) => void;
}

export function TestResults({ results, onDelete }: TestResultsProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-slate-500">No A/B tests yet. Create one to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Test Results</h2>
      
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {results.map((result) => {
          const variantAWins = result.variantAScore > result.variantBScore;
          const margin = Math.abs(result.variantAScore - result.variantBScore);

          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg">
                        {result.variantA.name} vs {result.variantB.name}
                      </CardTitle>
                      <CardDescription>
                        Created {result.startDate.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(result.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Score Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {result.variantA.name}
                        </span>
                        {variantAWins && (
                          <Trophy className="h-4 w-4 text-amber-600" />
                        )}
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${result.variantAScore}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {result.variantAScore}%
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {result.variantB.name}
                        </span>
                        {!variantAWins && margin > 0 && (
                          <Trophy className="h-4 w-4 text-amber-600" />
                        )}
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${result.variantBScore}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {result.variantBScore}%
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-400">
                          {result.recommendation}
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Job Description Preview */}
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Target Job Description
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                      {result.jobDescription}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
