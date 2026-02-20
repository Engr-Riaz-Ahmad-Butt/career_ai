'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GrowthDashboard } from '@/components/career-growth/growth-dashboard';
import { CareerReportList } from '@/components/career-growth/monthly-report';
import { useCareerGrowthStore } from '@/store/careerGrowthStore';
import { BarChart3, Download } from 'lucide-react';

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

export default function CareerGrowthPage() {
  const generateMonthlyReport = useCareerGrowthStore(
    (state) => state.generateMonthlyReport
  );

  const handleGenerateReport = () => {
    generateMonthlyReport();
  };

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
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
            className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <BarChart3 className="h-4 w-4" />
            Generate Report
          </Button>
        </motion.div>

        {/* Growth Dashboard */}
        <motion.div variants={item}>
          <GrowthDashboard />
        </motion.div>

        {/* Reports Section */}
        <motion.div variants={item}>
          <CareerReportList />
        </motion.div>
      </motion.div>
    </div>
  );
}
