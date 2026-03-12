import React from 'react';

interface SkillsProps {
  skills: { technical: string[]; soft: string[] };
  primaryColor?: string;
  className?: string;
}

export const Skills: React.FC<SkillsProps> = ({ 
  skills, 
  primaryColor = '#1e293b',
  className = ''
}) => {
  const allSkills = [...(skills?.technical || []), ...(skills?.soft || [])];
  
  if (!allSkills || allSkills.length === 0) return null;

  return (
    <section className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
        Skills
      </h3>
      <ul className="list-disc ml-5 space-y-1">
        {allSkills.map((skill: string, i: number) => (
          <li key={i} className="text-slate-700 text-sm">{skill}</li>
        ))}
      </ul>
    </section>
  );
};
