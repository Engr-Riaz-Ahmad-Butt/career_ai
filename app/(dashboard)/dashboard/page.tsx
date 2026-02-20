'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsSection } from '@/components/dashboard/analytics-section';
import { StatsCard } from '@/components/common/stats-card';
import { mockStats, mockResumes } from '@/lib/mock-data';
import { useJobTrackerStore } from '@/store/jobTrackerStore';
import {
  BarChart3,
  Zap,
  FileText,
  TrendingUp,
  ArrowRight,
  Plus,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function DashboardPage() {
  const jobStats = useJobTrackerStore((state) => state.stats);

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Career Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track your job search journey and career growth in real-time
        </p>
      </motion.div>

      {/* Top Quick Stats */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatsCard
            icon={Briefcase}
            label="Active Applications"
            value={jobStats.total}
            change={jobStats.byStatus.applied}
            changeLabel="pending"
            trend="up"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard
            icon={CheckCircle2}
            label="Conversion Rate"
            value={`${jobStats.conversionRate.toFixed(1)}%`}
            change={5}
            changeLabel="vs last month"
            trend="up"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard
            icon={BarChart3}
            label="Avg Resume Score"
            value="91/100"
            change={9}
            changeLabel="from last week"
            trend="up"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard
            icon={TrendingUp}
            label="Offers Received"
            value={jobStats.byStatus.offer}
            change={1}
            changeLabel="pending decision"
            trend="up"
          />
        </motion.div>
      </motion.div>

      {/* Advanced Analytics Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <AnalyticsSection />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Link href="/resume-builder">
          <Button className="w-full h-24 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex flex-col items-center justify-center gap-2">
            <Plus className="h-6 w-6" />
            <span>Create Resume</span>
          </Button>
        </Link>
        <Link href="/tailor">
          <Button className="w-full h-24 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex flex-col items-center justify-center gap-2">
            <Zap className="h-6 w-6" />
            <span>Tailor Resume</span>
          </Button>
        </Link>
        <Link href="/jobs">
          <Button className="w-full h-24 bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white flex flex-col items-center justify-center gap-2">
            <Briefcase className="h-6 w-6" />
            <span>Track Jobs</span>
          </Button>
        </Link>
        <Link href="/interview-prep">
          <Button className="w-full h-24 bg-gradient-to-br from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white flex flex-col items-center justify-center gap-2">
            <FileText className="h-6 w-6" />
            <span>Interview Prep</span>
          </Button>
        </Link>
      </motion.div>

      {/* Recent Resumes */}
      <motion.div
        variants={itemVariants}
        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Your Resumes
          </h2>
          <Link href="/documents">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {mockResumes.map((resume) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 dark:text-white">
                  {resume.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Last modified {resume.lastModified.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {resume.atsScore}%
                  </div>
                  <div className="text-xs text-slate-500">ATS Score</div>
                </div>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
