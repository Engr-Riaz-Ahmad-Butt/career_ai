'use client';

import { motion } from 'framer-motion';
import { ABTestCreator } from '@/components/ab-testing/test-creator';
import { TestResults } from '@/components/ab-testing/test-results';
import { useABTestStore } from '@/store/abTestStore';
import { Sparkles } from 'lucide-react';

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

export default function ABTestingPage() {
  const tests = useABTestStore((state) => state.getTests());
  const deleteTest = useABTestStore((state) => state.deleteTest);

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={item}>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Resume A/B Testing
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Create two resume variants and let AI predict which one performs better with recruiters
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div
            variants={item}
            className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
          >
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              TESTS RUN
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{tests.length}</p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
          >
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              VARIANTS CREATED
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {tests.length * 2}
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
          >
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              IMPROVEMENT TRACKED
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">100%</p>
          </motion.div>
        </motion.div>

        {/* Test Creator */}
        <motion.div variants={item}>
          <ABTestCreator />
        </motion.div>

        {/* Test Results */}
        <motion.div variants={item}>
          <TestResults results={tests} onDelete={deleteTest} />
        </motion.div>

        {/* Guide Section */}
        <motion.div
          variants={item}
          className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6"
        >
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-400 mb-3">
            How A/B Testing Works
          </h3>
          <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-300">
            <li>1. Paste the job description you're applying to</li>
            <li>2. Create two different resume approaches (formatting, wording, emphasis)</li>
            <li>3. AI analyzes both against the job description and recruiter preferences</li>
            <li>4. Get a prediction on which variant is more likely to land interviews</li>
            <li>5. Use the recommended version for your actual application</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
