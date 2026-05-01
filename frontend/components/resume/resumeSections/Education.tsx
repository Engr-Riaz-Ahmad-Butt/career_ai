import React from 'react';

import { ResumeEducation } from '@/types/resume';

interface EducationProps {
  education: ResumeEducation[];
  primaryColor?: string;
  className?: string;
}

export const Education: React.FC<EducationProps> = ({ 
  education, 
  primaryColor = '#1e293b',
  className = ''
}) => {
  if (!education || education.length === 0) return null;

  return (
    <section className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
        Education
      </h3>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={edu.id || `edu-${index}`} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <h4 className="text-base font-bold text-slate-800">{edu.degree}</h4>
              <span className="text-sm font-medium text-slate-500">{edu.startDate} - {edu.endDate}</span>
            </div>
            <div className="text-slate-600 text-sm">{edu.school} {edu.location ? `- ${edu.location}` : ''}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
