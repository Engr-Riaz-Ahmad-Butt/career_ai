'use client';

import React from 'react';
import { ResumeData, ResumeExperience, ResumeEducation, ResumeCertification, ResumeLanguage, ResumeProject } from '@/types/resume';

export interface TemplatePreviewProps {
  template: any; // ResumeTemplate
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
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    location: 'New York, USA',
  },
  summary: 'Experienced professional with a strong track record of success in various roles. Skilled in leadership, communication, and problem-solving.',
  experience: [
    {
      id: 'exp1',
      company: 'Tech Solutions Inc.',
      position: 'Senior Software Engineer',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: 'Leading a team of developers to build scalable web applications.',
    },
  ],
  education: [
    {
      id: 'edu1',
      school: 'University of Technology',
      degree: 'Bachelor of Science in Computer Science',
      startDate: 'Sep 2012',
      endDate: 'May 2016',
    },
  ],
  skills: {
    technical: ['React', 'TypeScript', 'Node.js'],
    soft: ['Leadership', 'Communication'],
  },
  projects: [],
  certifications: [],
  languages: [],
  interests: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  styling: {
    spacing: { fontSize: 10, lineHeight: 1.2, sideMargin: 15, topBottomMargin: 15, entrySpacing: 5 },
    colors: { primary: '#1e293b', secondary: '#f3f4f6', accent: '#3b82f6', applyToName: true, applyToTitle: true, applyToIcons: true, applyToBubbles: true },
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
