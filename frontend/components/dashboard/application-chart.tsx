'use client';

import { Line } from '@ant-design/plots';
import { applicationTrend } from '@/lib/analytics-data';
import { useMemo } from 'react';

export function ApplicationChart() {
  const data = useMemo(() => {
    return applicationTrend.flatMap((item) => [
      { date: item.date, value: item.applications, type: 'Total Applications' },
      { date: item.date, value: item.interviews, type: 'Interviews' },
      { date: item.date, value: item.offers, type: 'Offers' },
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
      y: { label: { style: { fill: '#6b7280' } } },
      x: { label: { style: { fill: '#6b7280' } } },
    },
    scale: {
      color: { range: ['#6366f1', '#3b82f6', '#10b981'] },
    },
  };

  return <Line {...config} />;
}
