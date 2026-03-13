'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function TechTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const accent = styling?.colors?.accent || '#0ea5e9';
  const allSkills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

  const Tag = ({ text }: { text: string }) => (
    <span style={{ fontSize: '10px', padding: '2px 10px', borderRadius: '999px', background: `${accent}18`, color: accent, border: `1px solid ${accent}40`, marginRight: '5px', marginBottom: '5px', display: 'inline-block', fontWeight: 600 }}>
      {text}
    </span>
  );

  return (
    <ResumeContainer styling={styling}>
      <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: '#f8fafc', minHeight: '100%', display: 'flex' }}>
        {/* Left sidebar */}
        <div style={{ width: '220px', background: '#0f172a', padding: '28px 20px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Avatar */}
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>
            {(data.personalInfo?.fullName || 'AB').split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '4px' }}>
              {data.personalInfo?.fullName || 'Your Name'}
            </h1>
            <p style={{ fontSize: '11px', color: accent, fontWeight: 600 }}>
              {data.experience?.[0]?.position || 'Software Engineer'}
            </p>
          </div>

          {/* Contact */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>Contact</div>
            {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean).map((v, i) => (
              <div key={i} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', marginBottom: '7px', wordBreak: 'break-word' }}>{v}</div>
            ))}
            {data.personalInfo?.linkedin && <div style={{ fontSize: '10px', color: accent, wordBreak: 'break-word' }}>{data.personalInfo.linkedin.replace('https://', '').replace('www.', '')}</div>}
          </div>

          {/* Skills */}
          {allSkills.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>Tech Stack</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {allSkills.slice(0, 10).map((s, i) => (
                  <span key={i} style={{ fontSize: '10px', padding: '3px 8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.8)' }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right content */}
        <div style={{ flex: 1, padding: '28px 28px', overflow: 'hidden' }}>
          {data.summary && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginBottom: '8px' }}>About</div>
              <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.7 }}>{data.summary}</p>
            </div>
          )}

          {data.experience?.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginBottom: '10px' }}>Experience</div>
              {data.experience.map(job => (
                <div key={job.id} style={{ marginBottom: '16px', paddingLeft: '12px', borderLeft: `2px solid ${accent}50` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{job.position}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>{job.startDate} – {job.endDate}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: accent, fontWeight: 600, marginBottom: '5px' }}>{job.company}</div>
                  {job.description && <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6, marginBottom: '5px' }}>{job.description}</p>}
                  {(job.achievements || []).slice(0, 2).map((b, i) => (
                    <div key={i} style={{ fontSize: '10px', color: '#64748b', paddingLeft: '10px', position: 'relative', marginBottom: '3px' }}>
                      <span style={{ position: 'absolute', left: 0, color: accent }}>▸</span>{b}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {data.education?.length > 0 && (
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginBottom: '10px' }}>Education</div>
              {data.education.map(ed => (
                <div key={ed.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `2px solid ${accent}50` }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{ed.degree}</span>
                  {ed.field && <span style={{ fontSize: '11px', color: '#64748b' }}> · {ed.field}</span>}
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{ed.school} · {ed.startDate} – {ed.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ResumeContainer>
  );
}
