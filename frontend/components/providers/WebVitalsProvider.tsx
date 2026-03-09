'use client';

import { useReportWebVitals } from 'next/web-vitals';

const CORE_WEB_VITAL_TARGETS = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
} as const;

export default function WebVitalsProvider() {
  useReportWebVitals((metric) => {
    const metricName = metric.name as keyof typeof CORE_WEB_VITAL_TARGETS;
    const budget = CORE_WEB_VITAL_TARGETS[metricName];

    if (budget === undefined) {
      return;
    }

    if (metric.value > budget) {
      console.warn('[WebVitals] Target exceeded', {
        metric: metric.name,
        value: metric.value,
        target: budget,
        id: metric.id,
      });
    }
  });

  return null;
}
