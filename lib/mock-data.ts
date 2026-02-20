export const mockUser = {
  id: '1',
  email: 'user@careerAI.com',
  name: 'Alex Johnson',
  credits: 10,
  plan: 'free' as const,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
};

export const mockResumes = [
  {
    id: '1',
    title: 'Senior Software Engineer Resume',
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    atsScore: 92,
    keywordMatch: 87,
  },
  {
    id: '2',
    title: 'Product Manager Resume',
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    atsScore: 78,
    keywordMatch: 72,
  },
  {
    id: '3',
    title: 'Data Scientist Resume',
    lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    atsScore: 85,
    keywordMatch: 81,
  },
];

export const mockStats = {
  totalResumes: 3,
  atsScoreAverage: 85,
  creditsLeft: 10,
  applicationsSent: 24,
};

export const mockDocuments = [
  { id: '1', title: 'Resume', category: 'Resume', lastModified: new Date() },
  { id: '2', title: 'Cover Letter', category: 'Cover Letter', lastModified: new Date(Date.now() - 86400000) },
  { id: '3', title: 'Statement of Purpose (SOP)', category: 'SOP', lastModified: new Date(Date.now() - 172800000) },
  { id: '4', title: 'Motivation Letter', category: 'Motivation Letter', lastModified: new Date(Date.now() - 259200000) },
];

export const pricingTiers = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 Resume',
      '5 AI Tailors/month',
      'Basic ATS Check',
      'Interview Q&A',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro Monthly',
    price: 9.99,
    period: 'month',
    description: 'For active job seekers',
    features: [
      'Unlimited Resumes',
      'Unlimited AI Tailors',
      'Advanced ATS Analysis',
      'Cover Letter Generator',
      'Interview Video Practice',
      'Priority Support',
    ],
    cta: 'Upgrade Now',
    highlighted: true,
  },
  {
    name: 'Pro Annual',
    price: 99,
    period: 'year',
    description: 'Save 2 months with annual plan',
    features: [
      'Everything in Pro Monthly',
      '2 months free',
      'Custom Resume Templates',
      'Team Collaboration',
      'Advanced Analytics',
      '24/7 Support',
    ],
    cta: 'Upgrade Now',
    highlighted: false,
  },
  {
    name: 'Team',
    price: 0,
    period: '',
    description: 'For organizations',
    features: [
      'Everything in Pro Annual',
      'Unlimited Users',
      'Team Dashboard',
      'Compliance Reports',
      'Dedicated Account Manager',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export const blogPosts = [
  {
    id: '1',
    title: 'How to Write an ATS-Optimized Resume',
    category: 'Resume Tips',
    excerpt: 'Learn the best practices for creating a resume that passes ATS systems...',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Top Interview Questions in Tech',
    category: 'Interview Prep',
    excerpt: 'Prepare for your next tech interview with these commonly asked questions...',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Cover Letter Best Practices',
    category: 'Resume Tips',
    excerpt: 'Master the art of writing a compelling cover letter that stands out...',
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
  },
];

export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    quote: 'CareerAI helped me land my dream job at Google. The ATS optimization was a game changer!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager at Stripe',
    quote: 'The AI tailor feature saved me hours of manual resume editing. Highly recommended!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Data Scientist at Meta',
    quote: 'Best investment I made for my job search. Got 3 offers in 2 months!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
];

export const interviewQuestions = {
  Behavioral: [
    {
      question: 'Tell me about a time you overcame a difficult challenge at work.',
      answer: 'I once faced a project deadline that was moved up by two weeks. I organized the team, broke down tasks into smaller chunks, and we delivered on time with quality intact.',
    },
    {
      question: 'How do you handle working with difficult team members?',
      answer: 'I focus on understanding their perspective, communicate clearly about expectations, and find common ground. Open dialogue and empathy are key.',
    },
  ],
  Technical: [
    {
      question: 'Explain the concept of database normalization.',
      answer: 'Database normalization is the process of organizing data to reduce redundancy. It involves breaking down tables into smaller, related tables to maintain data integrity.',
    },
    {
      question: 'What is the difference between SQL and NoSQL databases?',
      answer: 'SQL databases are relational and use structured schemas, while NoSQL databases are non-relational and flexible. Choose based on your data structure needs.',
    },
  ],
  'Role-Specific': [
    {
      question: 'What interests you about this role?',
      answer: 'Customize this answer based on the specific role and company. Highlight how your skills align with their needs.',
    },
    {
      question: 'Where do you see yourself in 5 years?',
      answer: 'Focus on growth within the company, developing new skills, and taking on increasing responsibilities.',
    },
  ],
};

export const resumeAnalysis = {
  communicationScore: 82,
  clarityScore: 78,
  keywordDensityScore: 91,
  readabilityScore: 85,
  suggestions: [
    'Add more action verbs to your bullet points',
    'Consider including more quantifiable achievements',
    'Improve keyword density in the Professional Summary section',
  ],
};
