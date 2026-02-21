'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScoreCircle } from '@/components/common/score-circle';
import { resumeAnalysis } from '@/lib/mock-data';
import { useQuery, useMutation } from '@tanstack/react-query';
import { aiApi } from '@/lib/api/ai';
import { resumeApi } from '@/lib/api/resume';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap, Loader2, Search, FileSearch } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const keywordData = [
  { name: 'JavaScript', value: 45 },
  { name: 'React', value: 38 },
  { name: 'Python', value: 28 },
  { name: 'AWS', value: 22 },
];

const COLORS = ['#4f46e5', '#a855f7', '#ec4899', '#f59e0b'];

export default function AnalyzePage() {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const { data: resumesData, isLoading: resumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeApi.getResumes,
  });

  const analyzeMutation = useMutation({
    mutationFn: () => aiApi.scoreAts(selectedResumeId, jobDescription),
    onSuccess: (data: any) => {
      setAnalysisResult(data.data);
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
      alert('Failed to analyze resume. Please try again.');
    }
  });

  const resumes = resumesData?.data?.resumes || [];
  const metrics = analysisResult?.score ? [
    { label: 'Overall Score', score: analysisResult.score },
    { label: 'Keyword Match', score: analysisResult.keywordMatch || 0 },
    { label: 'Formatting', score: analysisResult.formatting || 0 },
    { label: 'Readability', score: analysisResult.readability || 0 },
  ] : [
    { label: 'Communication', score: resumeAnalysis.communicationScore },
    { label: 'Clarity', score: resumeAnalysis.clarityScore },
    { label: 'Keyword Density', score: resumeAnalysis.keywordDensityScore },
    { label: 'Readability', score: resumeAnalysis.readabilityScore },
  ];

  const suggestions = analysisResult?.suggestions || resumeAnalysis.suggestions;
  const keywords = analysisResult?.keywords || keywordData;

  if (resumesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              ATS Analysis
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Optimize your resume for specific job descriptions
            </p>
          </div>
        </motion.div>

        {/* Action Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">New Analysis</CardTitle>
            <CardDescription>Select a resume and provide a job description for AI analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select a resume...</option>
                  {resumes.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description</label>
              <Textarea
                placeholder="Paste the job description here (at least 50 characters)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8"
              disabled={!selectedResumeId || jobDescription.length < 50 || analyzeMutation.isPending}
              onClick={() => analyzeMutation.mutate()}
            >
              {analyzeMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              Analyze Now
            </Button>
          </CardContent>
        </Card>

        {/* Results Sections (Shown always with mock/real data) */}
        <div className={analyzeMutation.isPending ? 'opacity-50 pointer-events-none' : ''}>
          {/* Scores Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          >
            {metrics.map((metric) => (
              <Card key={metric.label} className="flex flex-col items-center justify-center p-6 h-48">
                <ScoreCircle
                  score={metric.score}
                  label={metric.label}
                  size="sm"
                  showLabel={true}
                />
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Keyword Frequency Chart */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
                Top Keywords Match
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={keywords}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Keyword Distribution Pie Chart */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
                Keyword Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={keywords}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {keywords.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Suggestions */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
              AI Recommendations
            </h3>
            <ul className="space-y-4">
              {suggestions.map((suggestion: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-700 dark:text-slate-300">{suggestion}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
