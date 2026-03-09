'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ScoreCircle } from '@/components/common/score-circle';
import type { AnalysisMetric } from '@/types/atsAnalysis.types';

interface AnalyzeMetricsGridProps {
  readonly metrics: readonly AnalysisMetric[];
}

export function AnalyzeMetricsGrid({ metrics }: AnalyzeMetricsGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4"
    >
      {metrics.map((metric) => (
        <Card key={metric.label} className="flex h-48 flex-col items-center justify-center p-6">
          <ScoreCircle score={metric.score} label={metric.label} size="sm" showLabel />
        </Card>
      ))}
    </motion.div>
  );
}
