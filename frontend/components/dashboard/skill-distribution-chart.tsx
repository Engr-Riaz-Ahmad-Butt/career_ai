'use client';

import { Bar } from '@ant-design/plots';
import { skillDistribution } from '@/lib/analytics-data';

export function SkillDistributionChart() {
  const config = {
    data: skillDistribution,
    xField: 'name',
    yField: 'value',
    height: 250,
    animate: { enter: { type: 'fadeIn' } },
    label: {
      text: (d: any) => `${d.value}%`,
      position: 'right',
      style: { fill: '#6b7280' },
    },
    axis: {
      y: { label: { style: { fill: '#6b7280' } } },
      x: { label: { style: { fill: '#6b7280' } } },
    },
    style: {
      fill: '#6366f1',
      radius: 4,
    },
    tooltip: {
      showMarkers: false,
    },
  };

  return (
    <div className="space-y-4">
      <Bar {...config} />
    </div>
  );
}
