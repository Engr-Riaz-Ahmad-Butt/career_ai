export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'tool';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Course {
  id: string;
  title: string;
  platform: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  price: number;
  rating: number;
  url: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  skills: string[];
  timeToComplete: string;
  cost: number;
  credibility: 'high' | 'medium' | 'low';
}

export interface SkillRoadmap {
  skillName: string;
  currentLevel: string;
  targetLevel: string;
  courses: Course[];
  certifications: Certification[];
  timeline: number; // in weeks
  estimatedCost: number;
}

export const popularCourses: Course[] = [
  {
    id: 'c1',
    title: 'Advanced React Patterns',
    platform: 'Udemy',
    duration: '15 hours',
    level: 'advanced',
    skills: ['React', 'JavaScript', 'Web Development'],
    price: 14.99,
    rating: 4.8,
    url: 'https://www.udemy.com',
  },
  {
    id: 'c2',
    title: 'The Complete TypeScript Course',
    platform: 'Udemy',
    duration: '40 hours',
    level: 'intermediate',
    skills: ['TypeScript', 'JavaScript'],
    price: 14.99,
    rating: 4.7,
    url: 'https://www.udemy.com',
  },
  {
    id: 'c3',
    title: 'AWS Solutions Architect Associate',
    platform: 'Coursera',
    duration: '8 weeks',
    level: 'intermediate',
    skills: ['AWS', 'Cloud Architecture', 'DevOps'],
    price: 49,
    rating: 4.6,
    url: 'https://www.coursera.org',
  },
  {
    id: 'c4',
    title: 'System Design Interview',
    platform: 'Educative',
    duration: '20 hours',
    level: 'advanced',
    skills: ['System Design', 'Problem Solving', 'Architecture'],
    price: 39,
    rating: 4.9,
    url: 'https://www.educative.io',
  },
  {
    id: 'c5',
    title: 'Python for Data Science',
    platform: 'Coursera',
    duration: '6 weeks',
    level: 'beginner',
    skills: ['Python', 'Data Science', 'Machine Learning'],
    price: 29,
    rating: 4.5,
    url: 'https://www.coursera.org',
  },
  {
    id: 'c6',
    title: 'Docker & Kubernetes Complete Guide',
    platform: 'Udemy',
    duration: '22 hours',
    level: 'intermediate',
    skills: ['Docker', 'Kubernetes', 'DevOps', 'Containerization'],
    price: 14.99,
    rating: 4.7,
    url: 'https://www.udemy.com',
  },
];

export const certifications: Certification[] = [
  {
    id: 'cert1',
    name: 'AWS Certified Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    difficulty: 'medium',
    skills: ['AWS', 'Cloud Architecture', 'Infrastructure'],
    timeToComplete: '8-10 weeks',
    cost: 150,
    credibility: 'high',
  },
  {
    id: 'cert2',
    name: 'Google Cloud Associate Cloud Engineer',
    issuer: 'Google Cloud',
    difficulty: 'medium',
    skills: ['Google Cloud', 'Cloud Infrastructure', 'DevOps'],
    timeToComplete: '6-8 weeks',
    cost: 200,
    credibility: 'high',
  },
  {
    id: 'cert3',
    name: 'Microsoft Certified: Azure Fundamentals',
    issuer: 'Microsoft',
    difficulty: 'easy',
    skills: ['Azure', 'Cloud Services', 'Microsoft Stack'],
    timeToComplete: '3-4 weeks',
    cost: 99,
    credibility: 'high',
  },
  {
    id: 'cert4',
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    difficulty: 'hard',
    skills: ['Kubernetes', 'DevOps', 'Container Orchestration'],
    timeToComplete: '12-16 weeks',
    cost: 395,
    credibility: 'high',
  },
];

export const userSkills: Skill[] = [
  { id: 's1', name: 'JavaScript', category: 'technical', proficiency: 'expert' },
  { id: 's2', name: 'React', category: 'technical', proficiency: 'advanced' },
  { id: 's3', name: 'TypeScript', category: 'technical', proficiency: 'advanced' },
  { id: 's4', name: 'Node.js', category: 'technical', proficiency: 'advanced' },
  { id: 's5', name: 'Python', category: 'technical', proficiency: 'intermediate' },
  { id: 's6', name: 'AWS', category: 'tool', proficiency: 'intermediate' },
  { id: 's7', name: 'Leadership', category: 'soft', proficiency: 'advanced' },
  { id: 's8', name: 'Communication', category: 'soft', proficiency: 'advanced' },
];

export const jobRequiredSkills = [
  'JavaScript',
  'React',
  'TypeScript',
  'Node.js',
  'AWS',
  'Docker',
  'System Design',
  'Leadership',
  'Communication',
  'Kubernetes',
];

export function getSkillGaps(): { missing: string[]; present: string[] } {
  const userSkillNames = userSkills.map(s => s.name);
  const missing = jobRequiredSkills.filter(skill => !userSkillNames.includes(skill));
  const present = jobRequiredSkills.filter(skill => userSkillNames.includes(skill));

  return { missing, present };
}

export function generateRoadmap(skillName: string): SkillRoadmap {
  const userSkill = userSkills.find(s => s.name === skillName);
  const currentLevel = userSkill?.proficiency || 'beginner';
  
  const relevantCourses = popularCourses.filter(c =>
    c.skills.some(s => s.toLowerCase().includes(skillName.toLowerCase()))
  );
  
  const relevantCerts = certifications.filter(c =>
    c.skills.some(s => s.toLowerCase().includes(skillName.toLowerCase()))
  );

  return {
    skillName,
    currentLevel,
    targetLevel: 'expert',
    courses: relevantCourses,
    certifications: relevantCerts,
    timeline: relevantCourses.length * 4 + (relevantCerts.length ? 8 : 0),
    estimatedCost: (relevantCourses.reduce((sum, c) => sum + c.price, 0) + 
                    (relevantCerts[0]?.cost || 0)),
  };
}
