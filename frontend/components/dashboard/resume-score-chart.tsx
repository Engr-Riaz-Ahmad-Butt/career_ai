'use client';

import { Line } from '@ant-design/plots';
import { resumeScoreTrend } from '@/lib/analytics-data';
import { useMemo } from 'react';

export function ResumeScoreChart() {
  const data = useMemo(() => {
    return resumeScoreTrend.flatMap((item) => [
      { date: item.date, value: item.score, type: 'ATS Score' },
      { date: item.date, value: item.keywords, type: 'Keywords Found' },
    ]);
  }, []);

  const config = {
    data,
    xField: 'date',
    yField: 'value',
    colorField: 'type',
    height: 300,
    animate: { enter: { type: 'fadeIn' } },
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      showMarkers: true,
    },
    style: {
      lineWidth: 2,
    },
    axis: {
      y: {
        label: { style: { fill: '#6b7280' } },
        max: 100,
      },
      x: { label: { style: { fill: '#6b7280' } } },
    },
    scale: {
      color: { range: ['#8b5cf6', '#ec4899'] },
    },
  };

  return <Line {...config} />;
}
