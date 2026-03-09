export interface InterviewNote {
  id: string;
  date: Date;
  round: number;
  notes: string;
  interviewer?: string;
  feedback?: string;
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  jobLink: string;
  status: 'applied' | 'interview' | 'rejected' | 'offer';
  appliedDate: Date;
  interviewDates: Date[];
  interviewNotes: InterviewNote[];
  tailoredResumeId?: string;
  salary?: {
    expected: number;
    offered?: number;
  };
  keywordMatch?: number;
  atsScore?: number;
}

export const mockJobApplications: JobApplication[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Google',
    jobLink: 'https://careers.google.com/jobs/results/',
    status: 'interview',
    appliedDate: new Date('2024-01-15'),
    interviewDates: [new Date('2024-02-01'), new Date('2024-02-10')],
    interviewNotes: [
      {
        id: 'n1',
        date: new Date('2024-02-01'),
        round: 1,
        notes: 'Phone screen went well. Discussed React patterns and system design.',
        interviewer: 'Sarah Chen',
        feedback: 'Strong technical knowledge. Move to next round.',
      },
    ],
    tailoredResumeId: 'resume-1',
    salary: { expected: 180000, offered: 190000 },
    keywordMatch: 89,
    atsScore: 92,
  },
  {
    id: '2',
    jobTitle: 'Full Stack Developer',
    company: 'Stripe',
    jobLink: 'https://stripe.com/jobs',
    status: 'applied',
    appliedDate: new Date('2024-02-05'),
    interviewDates: [],
    interviewNotes: [],
    tailoredResumeId: 'resume-2',
    salary: { expected: 160000 },
    keywordMatch: 78,
    atsScore: 85,
  },
  {
    id: '3',
    jobTitle: 'React Developer',
    company: 'Meta',
    jobLink: 'https://www.metacareers.com/',
    status: 'interview',
    appliedDate: new Date('2024-01-28'),
    interviewDates: [new Date('2024-02-08')],
    interviewNotes: [
      {
        id: 'n2',
        date: new Date('2024-02-08'),
        round: 1,
        notes: 'Technical interview covering React hooks, state management.',
        interviewer: 'Mike Johnson',
        feedback: 'Solid performance. Prepare for final round.',
      },
    ],
    tailoredResumeId: 'resume-3',
    salary: { expected: 175000 },
    keywordMatch: 92,
    atsScore: 96,
  },
  {
    id: '4',
    jobTitle: 'Software Engineer',
    company: 'Microsoft',
    jobLink: 'https://careers.microsoft.com/',
    status: 'rejected',
    appliedDate: new Date('2024-01-10'),
    interviewDates: [new Date('2024-01-25')],
    interviewNotes: [
      {
        id: 'n3',
        date: new Date('2024-01-25'),
        round: 1,
        notes: 'Discussed experience with cloud services and distributed systems.',
        interviewer: 'Lisa Wong',
        feedback: 'Good technical skills but looking for more DevOps experience.',
      },
    ],
    tailoredResumeId: 'resume-4',
    salary: { expected: 155000 },
    keywordMatch: 72,
    atsScore: 78,
  },
  {
    id: '5',
    jobTitle: 'Lead Frontend Engineer',
    company: 'Airbnb',
    jobLink: 'https://careers.airbnb.com/',
    status: 'offer',
    appliedDate: new Date('2024-01-20'),
    interviewDates: [
      new Date('2024-02-02'),
      new Date('2024-02-09'),
      new Date('2024-02-16'),
    ],
    interviewNotes: [
      {
        id: 'n4',
        date: new Date('2024-02-02'),
        round: 1,
        notes: 'Phone screen - Portfolio and project experience discussed.',
        interviewer: 'Tom Davis',
        feedback: 'Impressive portfolio. Advance to technical round.',
      },
      {
        id: 'n5',
        date: new Date('2024-02-09'),
        round: 2,
        notes: 'Technical round - Built a booking component with React.',
        interviewer: 'Emily Rodriguez',
        feedback: 'Excellent coding skills and problem solving.',
      },
      {
        id: 'n6',
        date: new Date('2024-02-16'),
        round: 3,
        notes: 'Final round with engineering manager and director.',
        interviewer: 'Alex Martinez',
        feedback: 'Unanimous yes. Moving to offer stage.',
      },
    ],
    tailoredResumeId: 'resume-5',
    salary: { expected: 200000, offered: 215000 },
    keywordMatch: 95,
    atsScore: 98,
  },
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'applied':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'interview':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'offer':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'applied':
      return '📤';
    case 'interview':
      return '🎤';
    case 'rejected':
      return '❌';
    case 'offer':
      return '✅';
    default:
      return '📋';
  }
};
