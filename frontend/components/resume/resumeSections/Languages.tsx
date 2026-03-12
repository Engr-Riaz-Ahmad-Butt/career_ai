import React from 'react';

import { ResumeLanguage } from '@/types/resume';

interface LanguagesProps {
  languages: ResumeLanguage[];
  primaryColor?: string;
  className?: string;
}

export const Languages: React.FC<LanguagesProps> = ({ 
  languages, 
  primaryColor = '#1e293b',
  className = ''
}) => {
  if (!languages || languages.length === 0) return null;

  return (
    <section className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
        Languages
      </h3>
      <div className="space-y-2">
        {languages.map((lang) => (
          <div key={lang.id} className="flex justify-between text-sm">
            <span className="font-medium text-slate-700">{lang.name}</span>
            <span className="text-slate-500">{lang.level}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
