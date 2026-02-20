'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScoreCircle } from '@/components/common/score-circle';
import { KeywordTag } from '@/components/common/keyword-tag';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Copy, Check } from 'lucide-react';

export default function TailorPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [copied, setCopied] = useState(false);

  const mockAnalysis = {
    atsScore: 87,
    keywordMatch: 92,
    missingKeywords: ['machine learning', 'data pipeline', 'cloud architecture'],
    foundKeywords: ['Python', 'React', 'TypeScript', 'AWS', 'SQL', 'agile'],
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    setHasAnalyzed(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            AI Resume Tailor
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Optimize your resume for any job description with AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Job Description Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-4"
          >
            <div>
              <Label htmlFor="job-desc" className="text-base font-semibold">
                Job Description
              </Label>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Paste the job description you want to tailor your resume for
              </p>
            </div>

            <Textarea
              id="job-desc"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-96 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    ⚙️
                  </motion.span>
                  <span className="ml-2">Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze & Tailor
                </>
              )}
            </Button>
          </motion.div>

          {/* Right - Analysis Results */}
          {hasAnalyzed && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Scores */}
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
                  Optimization Score
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col items-center">
                    <ScoreCircle
                      score={mockAnalysis.atsScore}
                      label="ATS Score"
                      size="md"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <ScoreCircle
                      score={mockAnalysis.keywordMatch}
                      label="Keyword Match"
                      size="md"
                    />
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Found Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mockAnalysis.foundKeywords.map((keyword) => (
                      <KeywordTag
                        key={keyword}
                        text={keyword}
                        status="found"
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mockAnalysis.missingKeywords.map((keyword) => (
                      <KeywordTag
                        key={keyword}
                        text={keyword}
                        status="missing"
                      />
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate AI Suggestions
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!hasAnalyzed && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 p-8 flex items-center justify-center min-h-96"
            >
              <div className="text-center">
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/20 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Ready to Tailor Your Resume?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Paste a job description to get AI-powered optimization suggestions
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* AI Suggestions Panel */}
        {hasAnalyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6"
          >
            <Tabs defaultValue="before" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="before">Before</TabsTrigger>
                <TabsTrigger value="after">After (AI-Tailored)</TabsTrigger>
              </TabsList>

              <TabsContent value="before" className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {`Senior Software Engineer with 5 years of experience in building web applications using React and Node.js. Strong background in database design and optimization. Experienced in leading small teams and mentoring junior developers.`}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="after" className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  <p className="text-sm text-emerald-900 dark:text-emerald-300 whitespace-pre-wrap">
                    {`Senior Software Engineer with 5 years of experience architecting and deploying scalable web applications using React, TypeScript, and Node.js. Specialized in machine learning pipeline development and cloud architecture on AWS. Demonstrated expertise in database optimization, designing systems that reduced query latency by 40%. Proven track record leading cross-functional teams, mentoring 8+ junior developers, and implementing agile methodologies across organizations.`}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopy(
                      'Senior Software Engineer with 5 years of experience architecting and deploying scalable web applications...'
                    )
                  }
                  className="w-full"
                  variant="outline"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Resume
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}
