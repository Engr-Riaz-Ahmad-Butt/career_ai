export interface ApplicationMetrics {
  date: string;
  applications: number;
  interviews: number;
  offers: number;
}

export interface CareerMetrics {
  totalApplications: number;
  successRate: number;
  interviewRate: number;
  resumeScore: number;
  skillsImproved: number;
  lastUpdated: Date;
}

export interface MonthlyReport {
  month: string;
  applications: number;
  interviews: number;
  offers: number;
  rejections: number;
  skillsAdded: string[];
  topTemplate: string;
}

export const applicationTrend: ApplicationMetrics[] = [
  { date: 'Jan 1', applications: 5, interviews: 1, offers: 0 },
  { date: 'Jan 5', applications: 12, interviews: 2, offers: 0 },
  { date: 'Jan 10', applications: 18, interviews: 3, offers: 1 },
  { date: 'Jan 15', applications: 25, interviews: 5, offers: 1 },
  { date: 'Jan 20', applications: 32, interviews: 7, offers: 2 },
  { date: 'Jan 25', applications: 38, interviews: 9, offers: 2 },
  { date: 'Feb 1', applications: 45, interviews: 11, offers: 3 },
  { date: 'Feb 5', applications: 52, interviews: 13, offers: 3 },
  { date: 'Feb 10', applications: 58, interviews: 15, offers: 4 },
  { date: 'Feb 15', applications: 65, interviews: 18, offers: 5 },
];

export const resumeScoreTrend = [
  { date: 'Week 1', score: 62, keywords: 34 },
  { date: 'Week 2', score: 68, keywords: 42 },
  { date: 'Week 3', score: 74, keywords: 51 },
  { date: 'Week 4', score: 78, keywords: 58 },
  { date: 'Week 5', score: 82, keywords: 65 },
  { date: 'Week 6', score: 85, keywords: 72 },
  { date: 'Week 7', score: 88, keywords: 78 },
  { date: 'Week 8', score: 91, keywords: 85 },
];

export const skillDistribution = [
  { name: 'JavaScript', value: 95 },
  { name: 'React', value: 88 },
  { name: 'TypeScript', value: 82 },
  { name: 'Node.js', value: 79 },
  { name: 'Python', value: 65 },
  { name: 'AWS', value: 58 },
  { name: 'SQL', value: 76 },
];

export const applicationsByStatus = [
  { name: 'Applied', value: 65, color: '#6366f1' },
  { name: 'Interview', value: 18, color: '#3b82f6' },
  { name: 'Rejected', value: 12, color: '#ef4444' },
  { name: 'Offer', value: 5, color: '#10b981' },
];

export const monthlyReports: MonthlyReport[] = [
  {
    month: 'January',
    applications: 38,
    interviews: 9,
    offers: 2,
    rejections: 8,
    skillsAdded: ['Advanced React', 'TypeScript Generics'],
    topTemplate: 'Modern Tech',
  },
  {
    month: 'February',
    applications: 27,
    interviews: 9,
    offers: 3,
    rejections: 5,
    skillsAdded: ['Node.js Best Practices', 'System Design'],
    topTemplate: 'Executive Elegant',
  },
];

export const currentMetrics: CareerMetrics = {
  totalApplications: 65,
  successRate: 27.7, // 18 interviews / 65 applications
  interviewRate: 27.8, // 5 offers / 18 interviews
  resumeScore: 91,
  skillsImproved: 7,
  lastUpdated: new Date(),
};
