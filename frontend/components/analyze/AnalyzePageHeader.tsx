'use client';

import { motion } from 'framer-motion';

interface AnalyzePageHeaderProps {
  readonly title: string;
  readonly description: string;
}

export function AnalyzePageHeader({ title, description }: AnalyzePageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex items-center justify-between"
    >
      <div>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </motion.div>
  );
}
