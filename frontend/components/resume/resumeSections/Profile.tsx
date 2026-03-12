import React from 'react';

interface ProfileProps {
  summary?: string;
  primaryColor?: string;
  className?: string;
}

export const Profile: React.FC<ProfileProps> = ({ 
  summary, 
  primaryColor = '#1e293b',
  className = '' 
}) => {
  if (!summary) return null;

  return (
    <section className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
        Profile
      </h3>
      <p className="text-slate-700 leading-relaxed text-sm">
        {summary}
      </p>
    </section>
  );
};
