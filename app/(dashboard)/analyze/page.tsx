'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScoreCircle } from '@/components/common/score-circle';
import { resumeAnalysis } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap } from 'lucide-react';

const keywordData = [
  { name: 'JavaScript', value: 45 },
  { name: 'React', value: 38 },
  { name: 'Python', value: 28 },
  { name: 'AWS', value: 22 },
];

const COLORS = ['#4f46e5', '#a855f7', '#ec4899', '#f59e0b'];

export default function AnalyzePage() {
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
            Resume Analysis
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Get detailed insights about your resume quality
          </p>
        </motion.div>

        {/* Scores Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Communication', score: resumeAnalysis.communicationScore },
            { label: 'Clarity', score: resumeAnalysis.clarityScore },
            { label: 'Keyword Density', score: resumeAnalysis.keywordDensityScore },
            { label: 'Readability', score: resumeAnalysis.readabilityScore },
          ].map((metric) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <ScoreCircle
                score={metric.score}
                label={metric.label}
                size="sm"
                showLabel={false}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Keyword Frequency Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
              Top Keywords
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={keywordData}>
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
          </motion.div>

          {/* Keyword Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
              Keyword Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={keywordData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {keywordData.map((entry, index) => (
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
          </motion.div>
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
            Improvement Suggestions
          </h3>
          <ul className="space-y-4">
            {resumeAnalysis.suggestions.map((suggestion, index) => (
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
          <Button className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <Zap className="h-4 w-4 mr-2" />
            Get AI Recommendations
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
