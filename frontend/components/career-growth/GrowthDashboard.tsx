'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCareerGrowthStore } from '@/store/careerGrowthStore';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const trendData = [
  { month: 'Jan', score: 65, interviews: 12, offers: 0 },
  { month: 'Feb', score: 72, interviews: 15, offers: 0 },
  { month: 'Mar', score: 78, interviews: 18, offers: 1 },
  { month: 'Apr', score: 85, interviews: 22, offers: 1 },
  { month: 'May', score: 89, interviews: 25, offers: 2 },
  { month: 'Jun', score: 92, interviews: 28, offers: 2 },
];

export function GrowthDashboard() {
  const metrics = useCareerGrowthStore((state) => state.metrics);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {metrics.map((metric) => (
          <motion.div key={metric.id} variants={item}>
            <Card className="relative overflow-hidden h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {metric.name}
                  </CardTitle>
                  {metric.trend === 'up' && (
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {metric.currentValue}
                    {metric.unit}
                  </div>
                  <p className="text-xs text-emerald-600 font-medium">
                    ↑ {metric.changePercent}% from last month
                  </p>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.currentValue / metric.target) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Target: {metric.target}
                  {metric.unit}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Trend Chart */}
      <motion.div variants={item} initial="hidden" animate="show">
        <Card>
          <CardHeader>
            <CardTitle>Career Progress Trend</CardTitle>
            <CardDescription>Your career growth metrics over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ fill: '#a855f7', r: 4 }}
                  name="Resume Score"
                />
                <Line
                  type="monotone"
                  dataKey="interviews"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ fill: '#0ea5e9', r: 4 }}
                  name="Interviews"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
