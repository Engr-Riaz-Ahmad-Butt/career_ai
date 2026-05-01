'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';

export interface TemplatePreviewProps {
  template: any;
  data?: ResumeData;
  isSelected?: boolean;
}

export const SAMPLE_DATA: ResumeData = {
  id: 'sample',
  userId: 'sample-user',
  title: 'Sample Resume',
  status: 'COMPLETE',
  template: 'simple-professional',
  personalInfo: {
    fullName: 'Alexandra Chen',
    email: 'alex.chen@gmail.com',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    website: 'alexchen.dev',
  },
  summary:
    'Senior Software Engineer with 7+ years building scalable systems at high-growth companies. Led cross-functional teams of 8+ engineers delivering products used by 10M+ users globally.',
  experience: [
    {
      id: 'exp1',
      company: 'Stripe',
      position: 'Senior Software Engineer',
      startDate: 'Jan 2021',
      endDate: 'Present',
      location: 'San Francisco, CA',
      achievements: [
        'Architected payment processing system handling $2B+ in annual transactions with 99.99% uptime',
        'Led team of 6 engineers to deliver Checkout redesign, increasing conversion by 23%',
        'Reduced API latency by 40% through strategic caching and query optimization',
      ],
    },
    {
      id: 'exp2',
      company: 'Airbnb',
      position: 'Software Engineer',
      startDate: 'Jun 2018',
      endDate: 'Dec 2020',
      location: 'San Francisco, CA',
      achievements: [
        'Built real-time messaging system serving 5M+ daily active users',
        'Improved search ranking algorithm, increasing booking conversion by 18%',
      ],
    },
  ],
  education: [
    {
      id: 'edu1',
      school: 'Stanford University',
      degree: 'B.S. Computer Science',
      field: 'Computer Science',
      startDate: '2014',
      endDate: '2018',
      gpa: '3.8 / 4.0',
    },
  ],
  skills: {
    technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes'],
    soft: ['Technical Leadership', 'System Design', 'Agile / Scrum'],
  },
  projects: [
    {
      id: 'proj1',
      name: 'OpenMetrics',
      description: 'Open-source observability platform with 2k+ GitHub stars',
      technologies: ['Go', 'Prometheus', 'Grafana'],
      url: 'github.com/alexchen/openmetrics',
    },
  ],
  certifications: [
    { id: 'cert1', name: 'AWS Solutions Architect – Professional', issuer: 'Amazon Web Services', date: '2023' },
  ],
  languages: [
    { id: 'lang1', name: 'English', level: 'Native' },
    { id: 'lang2', name: 'Mandarin', level: 'Professional' },
  ],
  interests: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  styling: {
    spacing: { fontSize: 10, lineHeight: 1.4, sideMargin: 15, topBottomMargin: 15, entrySpacing: 5 },
    colors: {
      primary: '#1e293b',
      secondary: '#f3f4f6',
      accent: '#3b82f6',
      applyToName: true,
      applyToTitle: true,
      applyToIcons: true,
      applyToBubbles: true,
    },
    typography: { fontFamily: 'Inter', category: 'Sans' },
    headingStyle: { style: 'line-under', capitalization: 'uppercase', size: 'L', icons: 'filled' },
    personalDetails: { align: 'left', arrangement: 'horizontal', iconStyle: 'classic' },
    entryLayout: { style: 'default' },
  },
};

export const ResumeContainer = ({ children, styling }: { children: React.ReactNode; styling?: any }) => {
  const customStyles = {
    fontFamily: styling?.typography?.fontFamily ? `${styling.typography.fontFamily}, sans-serif` : 'inherit',
    fontSize: styling?.spacing?.fontSize ? `${styling.spacing.fontSize}px` : '16px',
    lineHeight: styling?.spacing?.lineHeight || 1.5,
    '--resume-primary': styling?.colors?.primary || '#000000',
    '--resume-accent': styling?.colors?.accent || '#6366f1',
    '--resume-font-size': styling?.spacing?.fontSize ? `${styling.spacing.fontSize}px` : '16px',
    '--resume-line-height': styling?.spacing?.lineHeight || 1.5,
  } as React.CSSProperties;

  return (
    <div
      className="w-[800px] min-h-[1132px] bg-white shadow-md mx-auto origin-top transition-all duration-300"
      style={customStyles}
    >
      {children}
    </div>
  );
};
