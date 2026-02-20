export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'minimal' | 'creative';
  icon?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: 'single-column' | 'two-column' | 'sidebar';
  features: string[];
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional resume with clean sections and professional styling. Perfect for corporate roles.',
    category: 'classic',
    colors: {
      primary: '#1e293b',
      secondary: '#f1f5f9',
      accent: '#0f766e',
    },
    layout: 'single-column',
    features: [
      'ATS-Optimized',
      'Traditional Format',
      'Serif Typography',
      'Conservative Design',
    ],
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Contemporary design with accent colors and modern typography. Great for tech roles.',
    category: 'modern',
    colors: {
      primary: '#4f46e5',
      secondary: '#f0f9ff',
      accent: '#6366f1',
    },
    layout: 'two-column',
    features: [
      'Eye-Catching Header',
      'Colored Sections',
      'Modern Fonts',
      'Visual Hierarchy',
    ],
  },
  {
    id: 'minimalist-clean',
    name: 'Minimalist Clean',
    description: 'Ultra-clean minimal design with plenty of whitespace. Emphasizes content clarity.',
    category: 'minimal',
    colors: {
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#666666',
    },
    layout: 'single-column',
    features: [
      'Minimal Design',
      'Whitespace Focus',
      'High Readability',
      'Professional Look',
    ],
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Vibrant and creative design perfect for designers, artists, and creative professionals.',
    category: 'creative',
    colors: {
      primary: '#d946ef',
      secondary: '#fce7f3',
      accent: '#f97316',
    },
    layout: 'two-column',
    features: [
      'Colorful Design',
      'Accent Highlights',
      'Portfolio Links',
      'Creative Flair',
    ],
  },
  {
    id: 'executive-elegant',
    name: 'Executive Elegant',
    description: 'Sophisticated design with elegant borders and structured layout for senior roles.',
    category: 'classic',
    colors: {
      primary: '#1e3a8a',
      secondary: '#eff6ff',
      accent: '#7c3aed',
    },
    layout: 'sidebar',
    features: [
      'Sidebar Design',
      'Elegant Borders',
      'Executive Style',
      'Strong Hierarchy',
    ],
  },
  {
    id: 'startup-vibrant',
    name: 'Startup Vibrant',
    description: 'Energetic and bold design perfect for startup culture and creative industries.',
    category: 'modern',
    colors: {
      primary: '#0891b2',
      secondary: '#ecf0f1',
      accent: '#06b6d4',
    },
    layout: 'two-column',
    features: [
      'Bold Typography',
      'Vibrant Colors',
      'Modern Layout',
      'Attention-Grabbing',
    ],
  },
  {
    id: 'academic-structured',
    name: 'Academic Structured',
    description: 'Structured layout with clear sections, ideal for academic and research positions.',
    category: 'classic',
    colors: {
      primary: '#7c2d12',
      secondary: '#fef3c7',
      accent: '#92400e',
    },
    layout: 'single-column',
    features: [
      'Research-Focused',
      'Publication Section',
      'Academic Style',
      'Citation Format',
    ],
  },
  {
    id: 'gradient-modern',
    name: 'Gradient Modern',
    description: 'Modern design with subtle gradient accents and contemporary styling.',
    category: 'modern',
    colors: {
      primary: '#2563eb',
      secondary: '#f8fafc',
      accent: '#f97316',
    },
    layout: 'two-column',
    features: [
      'Gradient Accents',
      'Modern Design',
      'Visual Interest',
      'Professional Feel',
    ],
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
