import React from 'react';

import { ResumeData } from '@/types/resume';

interface HeaderProps {
  data: ResumeData;
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  data, 
  primaryColor = '#1e293b', 
  accentColor = '#3b82f6',
  className = ''
}) => {
  return (
    <header className={`space-y-2 ${className}`} style={{ borderColor: accentColor }}>
      <h1 className="text-4xl font-black uppercase tracking-wide" style={{ color: primaryColor }}>
        {data.personalInfo.fullName || "Jane Doe"}
      </h1>
      <h2 className="text-xl font-medium text-slate-700">
        {data.experience?.[0]?.position || "Your Title"}
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 mt-2">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin.replace('https://', '').replace('www.', '')}</span>}
        {data.personalInfo.portfolio && <span>• {data.personalInfo.portfolio.replace('https://', '').replace('www.', '')}</span>}
      </div>
    </header>
  );
};
