import { ResumeTemplate } from '@/types/resume';

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'simple-professional',
    name: 'Professional',
    description: 'A clean, single-column design suitable for corporate and traditional roles.',
    category: 'classic',
    colors: {
      primary: '#1e293b',
      secondary: '#ffffff',
      accent: '#3b82f6',
    },
    layout: 'single-column',
    features: ['Simple & Clean', 'High Readability', 'ATS-Optimized'],
  },
  {
    id: 'modern',
    name: 'Modern Template',
    description: 'Contemporary design with accent colors and modern typography.',
    category: 'modern',
    colors: {
      primary: '#2563eb',
      secondary: '#ffffff',
      accent: '#f97316',
    },
    layout: 'two-column',
    features: ['Bold Design', 'Accent Colors', 'Side by Side Content'],
  },
  {
    id: 'classic',
    name: 'Classic Template',
    description: 'Traditional resume with clean sections and serif professional styling.',
    category: 'classic',
    colors: {
      primary: '#1e293b',
      secondary: '#ffffff',
      accent: '#64748b',
    },
    layout: 'single-column',
    features: ['Traditional Format', 'Serif Typography', 'Conservative Design'],
  },
  {
    id: 'minimal',
    name: 'Minimal Template',
    description: 'Ultra-clean minimal design with plenty of whitespace.',
    category: 'minimal',
    colors: {
      primary: '#111827',
      secondary: '#ffffff',
      accent: '#374151',
    },
    layout: 'single-column',
    features: ['Whitespace Focus', 'Monochrome', 'High Readability'],
  },
  {
    id: 'sidebar',
    name: 'Sidebar Template',
    description: 'Two-column layout splitting contact info into a convenient sidebar.',
    category: 'modern',
    colors: {
      primary: '#1f2937',
      secondary: '#f3f4f6', // sidebar background
      accent: '#4b5563',
    },
    layout: 'sidebar',
    features: ['Dedicated Sidebar', 'Space Efficient', 'Easy to Read'],
  },
  {
    id: 'executive',
    name: 'Executive template',
    description: 'Premium looking template with stylized headers, dots for languages, and elegant fonts (Playfair Display).',
    category: 'classic',
    colors: {
      primary: '#1a2b3c',
      secondary: '#ffffff', 
      accent: '#c8a97e',
    },
    layout: 'sidebar',
    features: ['Elegant Typography', 'Dot Rating System', 'Professional Look'],
  },
  {
    id: 'two-column',
    name: 'Organized Two-Column',
    description: 'A structured two-column layout separating primary experience from sidebar details.',
    category: 'modern',
    colors: {
      primary: '#0f172a',
      secondary: '#f8fafc',
      accent: '#2563eb',
    },
    layout: 'sidebar',
    features: ['Well-Organized', 'Distinct Content Areas', 'Clear Hierarchy'],
  },
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    description: 'A highly structured, single-column traditional resume optimized for applicant tracking systems.',
    category: 'classic',
    colors: {
      primary: '#111827',
      secondary: '#ffffff',
      accent: '#1d4ed8',
    },
    layout: 'single-column',
    features: ['ATS Optimized', 'Standard Formatting', 'High Readability'],
  },
  {
    id: 'creative',
    name: 'Creative Designer',
    description: 'A vibrant, asymmetric layout for creative professionals and designers.',
    category: 'creative',
    colors: {
      primary: '#0f172a',
      secondary: '#ffffff',
      accent: '#6366f1',
    },
    layout: 'sidebar',
    features: ['Portfolio-ready', 'Unique Layout', 'Strong Visuals'],
  },
];

export const getTemplateById = (id: string): ResumeTemplate | undefined => {
  return resumeTemplates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (
  category: ResumeTemplate['category']
): ResumeTemplate[] => {
  return resumeTemplates.filter((template) => template.category === category);
};

