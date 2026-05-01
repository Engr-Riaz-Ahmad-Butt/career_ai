import React from 'react';

import { ResumeCertification } from '@/types/resume';

interface AwardsProps {
  awards: ResumeCertification[];
  primaryColor?: string;
  className?: string;
}

export const Awards: React.FC<AwardsProps> = ({ 
  awards, 
  primaryColor = '#1e293b',
  className = ''
}) => {
  if (!awards || awards.length === 0) return null;

  return (
    <section className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
        Awards
      </h3>
      <div className="space-y-2">
        {awards.map((cert, index) => (
          <div key={cert.id || `cert-${index}`} className="flex justify-between text-sm">
            <span className="font-medium text-slate-700">{cert.name}</span>
            <span className="text-slate-500">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
