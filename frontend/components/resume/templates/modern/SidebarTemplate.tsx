'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

import { 
  Header, Profile, Experience, Education, Skills, Languages, Awards 
} from '@/components/resume/resumeSections';

export function SidebarTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const primaryColor = styling?.colors?.primary || '#1f2937';
  const sidebarBg = styling?.colors?.secondary || '#f3f4f6';
  const sidebarText = '#374151'; // darker gray for better contrast on light sidebar

  return (
    <ResumeContainer styling={styling}>
      <div className="flex w-full h-full font-sans shadow-xl">
        
        {/* LEFT SIDEBAR (1/3 width) */}
        <div className="w-[35%] p-8 space-y-10" style={{ backgroundColor: sidebarBg, color: sidebarText }}>
          
          <div className="space-y-4">
             <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: primaryColor }}>
              {data.personalInfo.fullName || "Jane Doe"}
            </h1>
            <h2 className="text-lg font-bold text-slate-600">
              {data.experience[0]?.position || "Your Title"}
            </h2>
          </div>

          <div className="space-y-3 text-sm font-medium">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Contact</h3>
            {data.personalInfo.email && <div className="break-words">{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            {data.personalInfo.linkedin && <div className="break-words">{data.personalInfo.linkedin.replace('https://', '')}</div>}
          </div>

          <div className="space-y-6">
            <Skills skills={data.skills} primaryColor={primaryColor} className="text-sm" />
            <Languages languages={data.languages} primaryColor={primaryColor} className="text-sm" />
          </div>

        </div>

        {/* RIGHT MAIN CONTENT (2/3 width) */}
        <div className="w-[65%] p-10 bg-white text-slate-800 space-y-8">
          
          {data.summary && (
             <section className="space-y-3">
               <h3 className="text-xl font-bold uppercase tracking-wider border-b-2 pb-2" style={{ color: primaryColor, borderColor: '#e5e7eb' }}>
                  Profile
               </h3>
               <p className="text-slate-600 leading-relaxed text-sm">
                  {data.summary}
               </p>
             </section>
          )}

          {data.experience?.length > 0 && (
            <section className="space-y-4">
               <h3 className="text-xl font-bold uppercase tracking-wider border-b-2 pb-2" style={{ color: primaryColor, borderColor: '#e5e7eb' }}>
                 Experience
               </h3>
               <div className="space-y-6">
                 {data.experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-slate-800">{exp.position}</h4>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="text-slate-600 font-medium text-sm">{exp.company}</div>
                       <ul className="list-disc ml-4 mt-2 space-y-1">
                          {exp.achievements?.map((ach: string, i: number) => (
                            <li key={i} className="text-slate-600 text-sm">{ach}</li>
                          ))}
                        </ul>
                    </div>
                 ))}
               </div>
            </section>
          )}

           {data.education?.length > 0 && (
            <section className="space-y-4">
               <h3 className="text-xl font-bold uppercase tracking-wider border-b-2 pb-2" style={{ color: primaryColor, borderColor: '#e5e7eb' }}>
                 Education
               </h3>
               <div className="space-y-4">
                 {data.education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{edu.startDate} - {edu.endDate}</span>
                      </div>
                      <div className="text-slate-600 text-sm">{edu.school}</div>
                    </div>
                 ))}
               </div>
            </section>
          )}
          
          <Awards awards={data.certifications} primaryColor={primaryColor} />

        </div>
      </div>
    </ResumeContainer>
  );
}
