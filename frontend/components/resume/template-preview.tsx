'use client';

import { ResumeTemplate } from '@/lib/resume-templates';
import { ResumeData } from '@/store/documentStore';
import React from 'react';

interface TemplatePreviewProps {
  template: ResumeTemplate;
  data: ResumeData;
  isSelected: boolean;
}

const ResumeContainer = ({ children, styling }: { children: React.ReactNode; styling?: any }) => {
  const customStyles = {
    fontFamily: styling?.typography?.fontFamily ? `${styling.typography.fontFamily}, sans-serif` : 'inherit',
    fontSize: styling?.spacing?.fontSize ? `${styling.spacing.fontSize}px` : '16px',
    lineHeight: styling?.spacing?.lineHeight || 1.5,
    '--resume-primary': styling?.colors?.primary || '#000000',
    '--resume-accent': styling?.colors?.accent || '#6366f1',
    '--resume-font-size': styling?.spacing?.fontSize ? `${styling.spacing.fontSize}px` : '16px',
    '--resume-line-height': styling?.spacing?.lineHeight || 1.5,
  } as React.CSSProperties;

  return (
    <div
      className="w-[800px] min-h-[1132px] bg-white shadow-md mx-auto origin-top transition-all duration-300"
      style={customStyles}
    >
      {children}
    </div>
  );
};

export function ClassicProfessionalPreview({ template, data }: TemplatePreviewProps) {
  const styling = data.styling;
  const primaryColor = styling?.colors?.primary || template.colors.primary;
  const accentColor = styling?.colors?.accent || template.colors.accent;

  return (
    <ResumeContainer styling={styling}>
      <div className="w-full h-full p-12 text-slate-900 space-y-8 text-left">
        <div className="pb-6 border-b-4" style={{ borderColor: accentColor }}>
          <h2 className="text-4xl font-bold" style={{ color: primaryColor, fontFamily: styling?.typography?.fontFamily }}>
            {data.contact.fullName || 'John Doe'}
          </h2>
          <p className="text-slate-600 mt-2">
            {[data.contact.email, data.contact.phone, data.contact.location].filter(Boolean).join(' | ')}
          </p>
        </div>

        {data.summary && (
          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, fontSize: '1.1em', fontFamily: styling?.typography?.fontFamily }}>
              Professional Summary
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {data.summary}
            </p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, fontSize: '1.1em', fontFamily: styling?.typography?.fontFamily }}>
              Experience
            </h3>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{exp.position}</p>
                      <p className="text-slate-600 italic">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                    </div>
                    <p className="text-slate-600 font-medium">{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1 list-disc ml-5">
                      {exp.achievements.map((ach, j) => (
                        <li key={j} className="text-slate-700 text-sm">{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, fontSize: '1.1em', fontFamily: styling?.typography?.fontFamily }}>
              Education
            </h3>
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{edu.degree}</p>
                  <p className="text-slate-600">{edu.school}</p>
                </div>
                <p className="text-slate-600 font-medium">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, fontSize: '1.1em', fontFamily: styling?.typography?.fontFamily }}>
              Certifications
            </h3>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <p className="font-bold">{cert.name}</p>
                  <p className="text-slate-600">{cert.issuer} | {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.languages && data.languages.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, fontSize: '1.1em', fontFamily: styling?.typography?.fontFamily }}>
              Languages
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-2">
                  <span className="font-bold">{lang.name}:</span>
                  <span className="text-slate-600">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ResumeContainer>
  );
}

export function ModernTechPreview({ template, data }: TemplatePreviewProps) {
  const styling = data.styling;
  const primaryColor = styling?.colors?.primary || template.colors.primary;
  const accentColor = styling?.colors?.accent || template.colors.accent;

  return (
    <ResumeContainer styling={styling}>
      <div className="w-full h-full p-10 text-slate-900 space-y-8 text-left">
        <div
          className="p-10 rounded-xl text-white shadow-lg"
          style={{ backgroundColor: primaryColor }}
        >
          <h2 className="text-4xl font-bold">{data.contact.fullName || 'John Doe'}</h2>
          <p className="text-xl opacity-90 mt-2 font-medium">{data.experience[0]?.position || 'Professional'}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-80">
            {data.contact.email && <span>{data.contact.email}</span>}
            {data.contact.phone && (
              <>
                <span>•</span>
                <span>{data.contact.phone}</span>
              </>
            )}
            {data.contact.location && (
              <>
                <span>•</span>
                <span>{data.contact.location}</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-10">
          <div className="col-span-2 space-y-8">
            {data.summary && (
              <section className="space-y-3">
                <h3 className="font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: primaryColor }}>
                  <span className="w-8 h-1" style={{ backgroundColor: accentColor }} />
                  Summary
                </h3>
                <p className="text-slate-700">{data.summary}</p>
              </section>
            )}

            {data.experience.length > 0 && (
              <section className="space-y-4">
                <h3 className="font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: primaryColor }}>
                  <span className="w-8 h-1" style={{ backgroundColor: accentColor }} />
                  Experience
                </h3>
                <div className="space-y-8">
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-lg">{exp.position}</h4>
                        <span className="text-xs font-semibold text-slate-500 uppercase">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <p className="font-medium" style={{ color: primaryColor }}>{exp.company}</p>
                      <p className="text-slate-700">{exp.description}</p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.achievements.map((ach, j) => (
                            <li key={j} className="text-slate-700 text-sm flex gap-2">
                              <span className="text-indigo-400">•</span> {ach}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {data.skills.technical.length > 0 && (
              <section className="space-y-4">
                <h3 className="font-bold uppercase tracking-widest" style={{ color: primaryColor }}>Skills</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {data.skills.technical.concat(data.skills.soft).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 rounded-full font-medium">{skill}</span>
                  ))}
                </div>
              </section>
            )}

            {data.education.length > 0 && (
              <section className="space-y-4">
                <h3 className="font-bold uppercase tracking-widest" style={{ color: primaryColor }}>Education</h3>
                <div className="space-y-4 text-sm">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <p className="font-bold">{edu.degree}</p>
                      <p className="text-slate-600">{edu.school}</p>
                      <p className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}

export function MinimalistCleanPreview({ template, data }: TemplatePreviewProps) {
  const styling = data.styling;
  const primaryColor = styling?.colors?.primary || template.colors.primary;

  return (
    <ResumeContainer styling={styling}>
      <div className="w-full h-full p-16 text-slate-900 space-y-12 text-left">
        <header className="space-y-2">
          <h2 className="text-5xl font-light tracking-widest uppercase" style={{ color: primaryColor }}>{data.contact.fullName || 'John Doe'}</h2>
          <p className="text-slate-500 tracking-wide">
            {[data.contact.email, data.contact.phone, data.contact.location].filter(Boolean).join(' | ')}
          </p>
        </header>

        {data.experience.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] border-b pb-2">Experience</h3>
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between">
                    <p className="font-bold">{exp.position}</p>
                    <p className="text-slate-500 text-sm">{exp.startDate} – {exp.endDate}</p>
                  </div>
                  <p className="text-slate-600 text-sm">{exp.company}</p>
                  <p className="text-slate-800 leading-relaxed">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1 list-disc ml-4">
                      {exp.achievements.map((ach, j) => (
                        <li key={j} className="text-slate-700 text-sm">{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] border-b pb-2">Education</h3>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <p className="font-bold">{edu.school}</p>
                  <p className="text-slate-500">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </ResumeContainer>
  );
}

export function CreativeDesignerPreview({ template, data }: TemplatePreviewProps) {
  const styling = data.styling;
  const primaryColor = styling?.colors?.primary || template.colors.primary;
  const accentColor = styling?.colors?.accent || template.colors.accent;

  return (
    <ResumeContainer styling={styling}>
      <div className="w-full h-full p-0 flex text-left">
        <div className="w-1/3 p-10 text-white flex flex-col justify-between" style={{ backgroundColor: primaryColor }}>
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase leading-tight">
                {data.contact.fullName.split(' ').map((n, i) => (
                  <React.Fragment key={i}>{n}<br /></React.Fragment>
                )) || 'John Doe'}
              </h2>
              <div className="w-12 h-2" style={{ backgroundColor: accentColor }}></div>
            </div>

            <section className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70">Contact</h3>
              <div className="space-y-2 text-xs opacity-90">
                {data.contact.email && <p>{data.contact.email}</p>}
                {data.contact.phone && <p>{data.contact.phone}</p>}
                {data.contact.location && <p>{data.contact.location}</p>}
              </div>
            </section>

            {data.skills.technical.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.technical.concat(data.skills.soft).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 rounded text-[10px]">{skill}</span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="flex-1 p-12 bg-white space-y-10">
          {data.summary && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold italic" style={{ color: primaryColor }}>About Me</h3>
              <p className="text-slate-600 leading-relaxed">{data.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-xl font-bold italic" style={{ color: primaryColor }}>Experience</h3>
              <div className="space-y-8">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2" style={{ borderColor: accentColor }}>
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: primaryColor }}></div>
                    <h4 className="font-bold text-lg">{exp.position}</h4>
                    <p className="text-sm font-medium opacity-80" style={{ color: primaryColor }}>{exp.company} | {exp.startDate} - {exp.endDate}</p>
                    <p className="mt-2 text-slate-600">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.achievements.map((ach, j) => (
                          <li key={j} className="text-slate-600 text-sm flex gap-2 italic">
                            <span>—</span> {ach}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </ResumeContainer>
  );
}

export function ExecutiveElegantPreview({ template, data }: TemplatePreviewProps) {
  const styling = data.styling;
  const primaryColor = styling?.colors?.primary || template.colors.primary;
  const accentColor = styling?.colors?.accent || template.colors.accent;

  return (
    <ResumeContainer styling={styling}>
      <div className="w-full h-full p-12 bg-white border-[20px]" style={{ borderColor: accentColor }}>
        <div className="text-center space-y-4 border-b-2 pb-8" style={{ borderColor: primaryColor }}>
          <h2 className="text-4xl font-serif font-bold tracking-widest uppercase" style={{ color: primaryColor }}>
            {data.contact.fullName || 'John Doe'}
          </h2>
          <p className="text-slate-500 font-serif italic text-lg">{data.experience[0]?.position || 'Professional'}</p>
          <div className="flex justify-center gap-6 text-sm text-slate-600 font-serif">
            {data.contact.email && <span>{data.contact.email}</span>}
            {data.contact.phone && <span>{data.contact.phone}</span>}
            {data.contact.location && <span>{data.contact.location}</span>}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-4 gap-12 text-left">
          <div className="col-span-3 space-y-10">
            {data.experience.length > 0 && (
              <section className="space-y-4">
                <h3 className="font-serif font-bold text-sm uppercase border-b pb-1" style={{ color: primaryColor, borderColor: accentColor }}>Executive Experience</h3>
                <div className="space-y-8">
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="space-y-2">
                      <div className="flex justify-between items-baseline font-serif">
                        <h4 className="font-bold text-xl">{exp.position}</h4>
                        <span className="text-xs italic">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <p className="font-bold text-slate-800">{exp.company}</p>
                      <p className="text-slate-700 leading-relaxed text-sm">{exp.description}</p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.achievements.map((ach, j) => (
                            <li key={j} className="text-slate-700 text-xs flex gap-2">
                              <span className="text-slate-400">⋄</span> {ach}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {data.skills.technical.length > 0 && (
              <section className="space-y-4">
                <h3 className="font-serif font-bold text-xs uppercase tracking-tight" style={{ color: primaryColor }}>Competencies</h3>
                <ul className="text-xs space-y-2 text-slate-700 font-medium">
                  {data.skills.technical.concat(data.skills.soft).map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {data.certifications && data.certifications.length > 0 && (
              <section className="space-y-4">
                <h3 className="font-serif font-bold text-xs uppercase tracking-tight" style={{ color: primaryColor }}>Certifications</h3>
                <div className="space-y-2 text-[10px] text-slate-600 font-serif italic">
                  {data.certifications.map((cert) => (
                    <div key={cert.id}>
                      <span className="font-bold">{cert.name}</span> — {cert.issuer}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.languages && data.languages.length > 0 && (
              <section className="space-y-4">
                <h3 className="font-serif font-bold text-xs uppercase tracking-tight" style={{ color: primaryColor }}>Languages</h3>
                <div className="space-y-1 text-[10px] text-slate-600 font-serif italic">
                  {data.languages.map((lang) => (
                    <div key={lang.id}>
                      <span className="font-bold">{lang.name}</span> ({lang.level})
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}

export function StartupVibrantPreview({ template, data }: TemplatePreviewProps) {
  const styling = data.styling;
  const primaryColor = styling?.colors?.primary || template.colors.primary;
  const accentColor = styling?.colors?.accent || template.colors.accent;

  return (
    <ResumeContainer styling={styling}>
      <div className="w-full h-full p-8 bg-slate-50 text-left">
        <div className="bg-white rounded-3xl shadow-xl p-12 flex flex-col h-full min-h-[1050px]">
          <div className="flex justify-between items-center p-10 rounded-2xl text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
            <div>
              <h2 className="text-5xl font-black italic tracking-tighter">{data.contact.fullName.toUpperCase() || 'JOHN DOE'}</h2>
              <p className="text-xl font-bold mt-2 opacity-90 uppercase tracking-widest">{data.experience[0]?.position || 'Hustler'}</p>
            </div>
            <div className="text-right text-xs space-y-1 font-bold opacity-80">
              {data.contact.email && <p>{data.contact.email}</p>}
              {data.contact.location && <p>{data.contact.location}</p>}
            </div>
          </div>

          <div className="mt-12 flex-1 grid grid-cols-2 gap-12">
            <section className="space-y-6">
              <h3 className="text-2xl font-black italic uppercase" style={{ color: primaryColor }}>The Experience</h3>
              <div className="space-y-8">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
                    <h4 className="font-bold text-xl">{exp.position}</h4>
                    <p className="font-bold opacity-70" style={{ color: primaryColor }}>{exp.company} | {exp.startDate} - {exp.endDate}</p>
                    <p className="mt-4 text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.achievements.map((ach, j) => (
                          <span key={j} className="text-[10px] px-2 py-0.5 bg-white rounded-lg shadow-sm font-medium text-slate-500 border border-slate-100 italic">
                            # {ach}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="space-y-12">
              <section className="space-y-6">
                <h3 className="text-2xl font-black italic uppercase" style={{ color: primaryColor }}>Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.technical.map(s => (
                    <span key={s} className="px-4 py-1 rounded-full border-2 font-black text-xs" style={{ borderColor: primaryColor, color: primaryColor }}>{s}</span>
                  ))}
                </div>
              </section>

              {data.certifications && data.certifications.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-2xl font-black italic uppercase" style={{ color: primaryColor }}>Badges</h3>
                  <div className="space-y-4">
                    {data.certifications.map((cert) => (
                      <div key={cert.id} className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-inner">🏆</div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">{cert.name}</p>
                          <p className="text-[10px] font-bold opacity-50">{cert.issuer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.languages && data.languages.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-2xl font-black italic uppercase" style={{ color: primaryColor }}>Vibes</h3>
                  <div className="flex flex-wrap gap-3">
                    {data.languages.map((lang) => (
                      <div key={lang.id} className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-black italic shadow-lg">
                        {lang.name.toUpperCase()} / {lang.level.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}

export function AcademicStructuredPreview({ template, data }: TemplatePreviewProps) {
  const styling = data.styling;
  const primaryColor = styling?.colors?.primary || template.colors.primary;

  return (
    <ResumeContainer styling={styling}>
      <div className="w-full h-full p-16 text-slate-900 space-y-10 text-left">
        <div className="text-center space-y-2 border-b-2 pb-6">
          <h2 className="text-3xl font-serif font-bold tracking-tight" style={{ color: primaryColor }}>{data.contact.fullName || 'Johnathan Q. Doe, Ph.D.'}</h2>
          <p className="text-slate-600 font-serif">Curriculum Vitae</p>
          <div className="text-xs font-serif text-slate-500 space-y-1">
            <p>{data.contact.location}</p>
            <p className="italic">{data.contact.email} | {data.contact.phone}</p>
          </div>
        </div>

        {data.education.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-serif font-bold border-b border-slate-300 uppercase tracking-widest text-[10px]" style={{ color: primaryColor }}>Education</h3>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <div className="flex justify-between">
                    <p className="font-bold">{edu.school}</p>
                    <p>{edu.endDate}</p>
                  </div>
                  <p className="text-slate-700 italic">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-serif font-bold border-b border-slate-300 uppercase tracking-widest text-[10px]" style={{ color: primaryColor }}>Professional Experience</h3>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="text-sm">
                  <div className="flex justify-between">
                    <p className="font-bold">{exp.company}</p>
                    <p>{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <p className="text-slate-700 italic font-medium">{exp.position}</p>
                  <p className="text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1 list-disc ml-5 text-slate-600">
                      {exp.achievements.map((ach, j) => (
                        <li key={j}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-serif font-bold border-b border-slate-300 uppercase tracking-widest text-[10px]" style={{ color: primaryColor }}>Certifications & Awards</h3>
            <div className="space-y-2 text-sm italic">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <p>{cert.name}, {cert.issuer}</p>
                  <p>{cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.languages && data.languages.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-serif font-bold border-b border-slate-300 uppercase tracking-widest text-[10px]" style={{ color: primaryColor }}>Languages</h3>
            <div className="flex gap-8 text-sm">
              {data.languages.map((lang) => (
                <p key={lang.id}><span className="font-bold">{lang.name}</span>: {lang.level}</p>
              ))}
            </div>
          </section>
        )}
      </div>
    </ResumeContainer>
  );
}

export function GradientModernPreview({ template, data }: TemplatePreviewProps) {
  const styling = data.styling;
  const primaryColor = styling?.colors?.primary || template.colors.primary;
  const accentColor = styling?.colors?.accent || template.colors.accent;

  return (
    <ResumeContainer styling={styling}>
      <div className="w-full h-full p-0 flex text-left">
        <div className="w-[280px] bg-slate-900 text-white p-12 space-y-10">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-2xl" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
            {data.contact.fullName ? data.contact.fullName.split(' ').map(n => n[0]).join('') : 'JD'}
          </div>

          <section className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-40">Contact</h3>
            <div className="space-y-2 text-xs opacity-90 leading-relaxed font-medium">
              <p>{data.contact.location}</p>
              <p>{data.contact.email}</p>
              <p>{data.contact.phone}</p>
            </div>
          </section>

          {data.skills.technical.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-40">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.technical.map(s => (
                  <span key={s} className="px-2 py-1 bg-white/10 rounded text-[10px] whitespace-nowrap">{s}</span>
                ))}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-40">Certs</h3>
              <div className="space-y-3">
                {data.certifications.map(c => (
                  <div key={c.id} className="text-[10px] opacity-80 border-l-2 pl-3" style={{ borderColor: accentColor }}>
                    <p className="font-bold">{c.name}</p>
                    <p className="opacity-50">{c.issuer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.languages && data.languages.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-40">Langs</h3>
              <div className="space-y-2 text-[10px] opacity-80">
                {data.languages.map(l => (
                  <p key={l.id} className="flex justify-between font-bold">
                    <span>{l.name}</span>
                    <span className="opacity-50">{l.level}</span>
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex-1 p-16 bg-white space-y-12">
          <header className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter" style={{ color: primaryColor }}>{data.contact.fullName || 'John Doe'}</h2>
            <div className="text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}>
              {data.experience[0]?.position || 'Professional'}
            </div>
          </header>

          {data.experience.length > 0 && (
            <section className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Experience</h3>
              <div className="space-y-10">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="group relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b opacity-20" style={{ backgroundImage: `linear-gradient(to bottom, ${primaryColor}, transparent)` }}></div>
                    <h4 className="text-2xl font-bold text-slate-800">{exp.company}</h4>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">{exp.startDate} - {exp.endDate}</p>
                    <p className="mt-4 text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {exp.achievements.map((ach, j) => (
                          <li key={j} className="text-slate-600 text-xs flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accentColor }}></span>
                            {ach}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Projects</h3>
              <div className="grid grid-cols-1 gap-8">
                {data.projects.map(proj => (
                  <div key={proj.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-xl font-bold text-slate-800">{proj.name}</h4>
                    <p className="mt-2 text-slate-600 text-sm">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {proj.technologies?.map(t => (
                        <span key={t} className="text-[10px] font-bold px-2 py-1 bg-white rounded border shadow-sm">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </ResumeContainer>
  );
}
