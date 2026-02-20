export interface MonthlyMetric {
  date: string;
  applications: number;
  interviews: number;
  offers: number;
  skillsLearned: number;
  networkConnections: number;
}

export interface CareerMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'promotion' | 'certification' | 'project' | 'skill' | 'achievement';
  impact: 'high' | 'medium' | 'low';
}

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  category: 'salary' | 'title' | 'skills' | 'network' | 'leadership';
  progress: number; // 0-100
  priority: 'high' | 'medium' | 'low';
}

export interface MonthlyReport {
  month: string;
  year: number;
  metrics: MonthlyMetric;
  milestones: CareerMilestone[];
  goals: CareerGoal[];
  summary: string;
}

// Mock data
export const monthlyMetrics: MonthlyMetric[] = [
  {
    date: '2024-01',
    applications: 15,
    interviews: 3,
    offers: 1,
    skillsLearned: 2,
    networkConnections: 5,
  },
  {
    date: '2024-02',
    applications: 22,
    interviews: 5,
    offers: 2,
    skillsLearned: 3,
    networkConnections: 8,
  },
  {
    date: '2024-03',
    applications: 18,
    interviews: 4,
    offers: 1,
    skillsLearned: 2,
    networkConnections: 6,
  },
  {
    date: '2024-04',
    applications: 25,
    interviews: 6,
    offers: 2,
    skillsLearned: 4,
    networkConnections: 10,
  },
  {
    date: '2024-05',
    applications: 20,
    interviews: 5,
    offers: 1,
    skillsLearned: 3,
    networkConnections: 7,
  },
  {
    date: '2024-06',
    applications: 28,
    interviews: 7,
    offers: 2,
    skillsLearned: 5,
    networkConnections: 12,
  },
];

export const careerMilestones: CareerMilestone[] = [
  {
    id: 'm1',
    title: 'Completed AWS Certification',
    description: 'Successfully completed AWS Solutions Architect certification',
    date: '2024-02-15',
    type: 'certification',
    impact: 'high',
  },
  {
    id: 'm2',
    title: 'Led Major Project',
    description: 'Led microservices migration project for 3 months',
    date: '2024-03-20',
    type: 'project',
    impact: 'high',
  },
  {
    id: 'm3',
    title: 'Promoted to Senior Developer',
    description: 'Promoted to Senior Software Developer',
    date: '2024-04-01',
    type: 'promotion',
    impact: 'high',
  },
  {
    id: 'm4',
    title: 'Learned Kubernetes',
    description: 'Mastered Kubernetes for container orchestration',
    date: '2024-05-10',
    type: 'skill',
    impact: 'medium',
  },
  {
    id: 'm5',
    title: 'Received Job Offer',
    description: 'Received offer from FAANG company with 35% salary increase',
    date: '2024-06-25',
    type: 'achievement',
    impact: 'high',
  },
];

export const careerGoals: CareerGoal[] = [
  {
    id: 'g1',
    title: 'Become Tech Lead',
    description: 'Transition to technical leadership role',
    targetDate: '2024-12-31',
    category: 'title',
    progress: 65,
    priority: 'high',
  },
  {
    id: 'g2',
    title: 'Reach $200K Salary',
    description: 'Achieve $200K annual compensation',
    targetDate: '2025-12-31',
    category: 'salary',
    progress: 45,
    priority: 'high',
  },
  {
    id: 'g3',
    title: 'Master System Design',
    description: 'Deep expertise in distributed systems and system design',
    targetDate: '2024-09-30',
    category: 'skills',
    progress: 70,
    priority: 'medium',
  },
  {
    id: 'g4',
    title: 'Build 500-Person Network',
    description: 'Expand professional network to 500+ connections',
    targetDate: '2025-12-31',
    category: 'network',
    progress: 35,
    priority: 'medium',
  },
  {
    id: 'g5',
    title: 'Mentor 5 Juniors',
    description: 'Actively mentor 5 junior developers',
    targetDate: '2024-12-31',
    category: 'leadership',
    progress: 40,
    priority: 'medium',
  },
];

export function getMonthlyReport(month: number, year: number): MonthlyReport {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const metric = monthlyMetrics[month - 1] || monthlyMetrics[0];
  const relevantMilestones = careerMilestones.filter((m) => {
    const [y, m_str] = m.date.split('-');
    return parseInt(y) === year && parseInt(m_str) === month;
  });

  return {
    month: monthNames[month - 1],
    year,
    metrics: metric,
    milestones: relevantMilestones,
    goals: careerGoals,
    summary: `This month you applied to ${metric.applications} positions, had ${metric.interviews} interviews, and received ${metric.offers} offers. You also learned ${metric.skillsLearned} new skills and expanded your network by ${metric.networkConnections} connections.`,
  };
}

export function getCareerProgress(): {
  overallProgress: number;
  goalsCompleted: number;
  milestonesAchieved: number;
  nextMilestone: CareerMilestone | null;
} {
  const completedGoals = careerGoals.filter((g) => g.progress === 100).length;
  const nextMilestone = careerMilestones[careerMilestones.length - 1] || null;
  const overallProgress = Math.round(
    careerGoals.reduce((sum, g) => sum + g.progress, 0) / careerGoals.length
  );

  return {
    overallProgress,
    goalsCompleted: completedGoals,
    milestonesAchieved: careerMilestones.length,
    nextMilestone,
  };
}
