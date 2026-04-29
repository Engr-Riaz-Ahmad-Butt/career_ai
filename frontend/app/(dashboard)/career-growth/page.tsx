'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

import { GrowthDashboard } from '@/components/career-growth/GrowthDashboard';
import { CareerReportList } from '@/components/career-growth/MonthlyReport';
import { Button } from '@/components/ui/button';
import { useCareerGrowthStore } from '@/store/careerGrowthStore';
import { fadeInContainer, fadeInItem } from '@/lib/animations';
import { FeatureErrorBoundary } from '@/components/errors/FeatureErrorBoundary';


export default function CareerGrowthPage() {
  const generateMonthlyReport = useCareerGrowthStore(
    (state) => state.generateMonthlyReport
  );

  const handleGenerateReport = () => {
    generateMonthlyReport();
  };

  return (
    <FeatureErrorBoundary featureName="Career Growth">
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={fadeInContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={fadeInItem} className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Career Growth Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Monitor your professional development and track success metrics
            </p>
          </div>
          <Button
            onClick={handleGenerateReport}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700"
          >
            <BarChart3 className="h-4 w-4" />
            Generate Report
          </Button>
        </motion.div>

        {/* Growth Dashboard */}
        <motion.div variants={fadeInItem}>
          <GrowthDashboard />
        </motion.div>

        {/* Reports Section */}
        <motion.div variants={fadeInItem}>
          <CareerReportList />
        </motion.div>
      </motion.div>
    </div>
    </FeatureErrorBoundary>
  );
}
