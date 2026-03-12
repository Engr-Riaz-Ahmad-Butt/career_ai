import React from 'react';

import { ResumeExperience } from '@/types/resume';

interface ExperienceProps {
  experience: ResumeExperience[];
  primaryColor?: string;
  className?: string;
}

export const Experience: React.FC<ExperienceProps> = ({ 
  experience, 
  primaryColor = '#1e293b',
  className = ''
}) => {
  if (!experience || experience.length === 0) return null;

  return (
    <section className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
        Experience
      </h3>
      <div className="space-y-6">
        {experience.map((exp) => (
          <div key={exp.id} className="space-y-2">
            <div className="flex justify-between items-baseline">
              <h4 className="text-base font-bold text-slate-800">{exp.position}</h4>
              <span className="text-sm font-medium text-slate-500">{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="text-slate-600 font-medium text-sm">
              {exp.company} {exp.location ? `- ${exp.location}` : ''}
            </div>
            {exp.description && <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>}
            {exp.achievements && exp.achievements.length > 0 && (
              <ul className="list-disc ml-5 space-y-1">
                {exp.achievements.map((ach: string, i: number) => (
                  <li key={i} className="text-slate-700 text-sm">{ach}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
