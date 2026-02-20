import { create } from 'zustand';

export interface GrowthMetric {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface MonthlyReport {
  id: string;
  month: string;
  year: number;
  applicationsSent: number;
  interviewsScheduled: number;
  offersReceived: number;
  successRate: number;
  resumeImprovement: number;
  skillsLearned: string[];
  highlights: string[];
  generatedDate: Date;
}

interface CareerGrowthState {
  metrics: GrowthMetric[];
  reports: MonthlyReport[];
  addMetric: (metric: GrowthMetric) => void;
  updateMetric: (id: string, updates: Partial<GrowthMetric>) => void;
  generateMonthlyReport: () => MonthlyReport;
  getReports: () => MonthlyReport[];
  getMetricsTrend: (days: number) => GrowthMetric[];
}

const mockMetrics: GrowthMetric[] = [
  {
    id: '1',
    name: 'Resume Quality Score',
    currentValue: 92,
    previousValue: 85,
    target: 95,
    unit: '%',
    trend: 'up',
    changePercent: 8.2,
  },
  {
    id: '2',
    name: 'Interview Rate',
    currentValue: 28,
    previousValue: 22,
    target: 35,
    unit: '%',
    trend: 'up',
    changePercent: 27.3,
  },
  {
    id: '3',
    name: 'Application Success',
    currentValue: 15,
    previousValue: 12,
    target: 20,
    unit: '%',
    trend: 'up',
    changePercent: 25,
  },
  {
    id: '4',
    name: 'Skills Mastered',
    currentValue: 8,
    previousValue: 5,
    target: 15,
    unit: 'skills',
    trend: 'up',
    changePercent: 60,
  },
];

export const useCareerGrowthStore = create<CareerGrowthState>((set, get) => ({
  metrics: mockMetrics,
  reports: [],

  addMetric: (metric) =>
    set((state) => ({
      metrics: [...state.metrics, metric],
    })),

  updateMetric: (id, updates) =>
    set((state) => ({
      metrics: state.metrics.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  generateMonthlyReport: () => {
    const now = new Date();
    const report: MonthlyReport = {
      id: `report-${now.getTime()}`,
      month: now.toLocaleString('default', { month: 'long' }),
      year: now.getFullYear(),
      applicationsSent: 24,
      interviewsScheduled: 6,
      offersReceived: 1,
      successRate: 25,
      resumeImprovement: 12,
      skillsLearned: [
        'Advanced React patterns',
        'System Design',
        'Behavioral interview strategies',
      ],
      highlights: [
        'Improved ATS score by 15 points',
        'Got callback from top 3 target companies',
        'Completed 2 online certifications',
      ],
      generatedDate: now,
    };

    set((state) => ({
      reports: [report, ...state.reports],
    }));

    return report;
  },

  getReports: () => get().reports,

  getMetricsTrend: (days) => get().metrics,
}));
