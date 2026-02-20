'use client';

import { Pie } from '@ant-design/plots';
import { applicationsByStatus } from '@/lib/analytics-data';

export function InterviewRateChart() {
  const total = applicationsByStatus.reduce((sum, item) => sum + item.value, 0);

  const config = {
    data: applicationsByStatus,
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    innerRadius: 0.6,
    height: 280,
    animate: { enter: { type: 'fadeIn' } },
    label: {
      text: (d: any) => `${d.name} ${(d.value / total * 100).toFixed(0)}%`,
      position: 'outside',
    },
    legend: {
      color: {
        position: 'bottom',
        layout: 'horizontal',
        alignment: 'center',
      },
    },
    tooltip: {
      showMarkers: false,
    },
    scale: {
      color: {
        range: applicationsByStatus.map(item => item.color),
      },
    },
  };

  return (
    <div className="space-y-4">
      <Pie {...config} />

      <div className="space-y-2 text-sm">
        {applicationsByStatus.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
              <span className="text-slate-600 dark:text-slate-400">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
