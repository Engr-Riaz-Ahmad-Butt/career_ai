'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

import { 
  Header, Profile, Experience, Education, Skills, Languages, Awards 
} from '@/components/resume/resumeSections';

export function SimpleProfessionalPreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const primaryColor = styling?.colors?.primary || '#1e293b';
  const accentColor = styling?.colors?.accent || '#3b82f6';

  return (
    <ResumeContainer styling={styling}>
      <div className="w-full h-full p-12 text-slate-900 space-y-6 text-left font-sans bg-white">
        
        <Header 
          data={data} 
          primaryColor={primaryColor} 
          accentColor={accentColor} 
          className="pb-6 border-b-2" 
        />

        <Profile summary={data.summary} primaryColor={primaryColor} />
        <Experience experience={data.experience} primaryColor={primaryColor} />
        <Education education={data.education} primaryColor={primaryColor} />

        <div className="grid grid-cols-2 gap-8">
          <Skills skills={data.skills} primaryColor={primaryColor} />
          <Languages languages={data.languages} primaryColor={primaryColor} />
        </div>

        <Awards awards={data.certifications} primaryColor={primaryColor} />
        
      </div>
    </ResumeContainer>
  );
}
