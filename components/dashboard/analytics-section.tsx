'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationChart } from './application-chart';
import { InterviewRateChart } from './interview-rate-chart';
import { ResumeScoreChart } from './resume-score-chart';
import { SkillDistributionChart } from './skill-distribution-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3, Zap, Target } from 'lucide-react';

interface AnalyticsSectionProps {
  metrics?: any;
}

export function AnalyticsSection({ metrics }: AnalyticsSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">65</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">+12 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">27.7%</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">18 interviews</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Offers</CardTitle>
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">5</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">27.8% offer rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Resume Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">91/100</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">+9 from last week</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Application Trend</CardTitle>
            <CardDescription>Your applications, interviews, and offers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationChart />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Resume Score Progress</CardTitle>
            <CardDescription>Improvement tracked weekly</CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeScoreChart />
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Analytics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Interview Rate & Conversion</CardTitle>
            <CardDescription>From applications to offers</CardDescription>
          </CardHeader>
          <CardContent>
            <InterviewRateChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
            <CardDescription>Your skill proficiency distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillDistributionChart />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
