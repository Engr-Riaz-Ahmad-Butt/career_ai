'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card } from '@/components/ui/card';
import type { AnalysisKeyword } from '@/types/atsAnalysis.types';

interface AnalyzeKeywordChartsLabels {
  readonly keywordMatchTitle: string;
  readonly keywordDistributionTitle: string;
}

interface AnalyzeKeywordChartsProps {
  readonly labels: AnalyzeKeywordChartsLabels;
  readonly keywords: readonly AnalysisKeyword[];
  readonly colors: readonly string[];
}

const TOOLTIP_STYLE = {
  backgroundColor: '#1e293b',
  border: '1px solid #475569',
  borderRadius: '8px',
};

const TOOLTIP_LABEL_STYLE = { color: '#e2e8f0' };

export function AnalyzeKeywordCharts({ labels, keywords, colors }: AnalyzeKeywordChartsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-6 font-semibold text-slate-900 dark:text-white">{labels.keywordMatchTitle}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={keywords}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL_STYLE} />
            <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-6 font-semibold text-slate-900 dark:text-white">{labels.keywordDistributionTitle}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={keywords}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
              fill="#8884d8"
            >
              {keywords.map((keyword, colorIndex) => (
                <Cell key={keyword.id} fill={colors[colorIndex % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
