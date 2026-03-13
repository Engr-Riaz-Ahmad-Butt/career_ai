'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function CleanProTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const accent = styling?.colors?.accent || '#6366f1';
  const allSkills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

  return (
    <ResumeContainer styling={styling}>
      <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", padding: '44px 52px', color: '#1e293b', background: '#fff' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', color: '#0f172a', marginBottom: '4px' }}>
            {data.personalInfo?.fullName || 'Your Name'}
          </h1>
          <p style={{ fontSize: '14px', color: accent, fontWeight: 600, marginBottom: '12px' }}>
            {data.experience?.[0]?.position || 'Professional Title'}
          </p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '11px', color: '#64748b', flexWrap: 'wrap' }}>
            {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo?.location && <span>{data.personalInfo.location}</span>}
            {data.personalInfo?.linkedin && (
              <span style={{ color: accent }}>{data.personalInfo.linkedin.replace('https://', '').replace('www.', '')}</span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '2px', background: `linear-gradient(90deg, ${accent}, transparent)`, marginBottom: '24px' }} />

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '32px' }}>
          <div>
            {data.summary && (
              <div style={{ marginBottom: '22px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginBottom: '8px' }}>Profile</h3>
                <p style={{ fontSize: '11px', lineHeight: 1.8, color: '#475569' }}>{data.summary}</p>
              </div>
            )}

            {data.experience?.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginBottom: '12px' }}>Experience</h3>
                {data.experience.map(job => (
                  <div key={job.id} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{job.position}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{job.startDate} – {job.endDate}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>{job.company}{job.location ? ` · ${job.location}` : ''}</div>
                    {(job.achievements || []).map((b, i) => (
                      <div key={i} style={{ fontSize: '11px', color: '#475569', paddingLeft: '12px', position: 'relative', marginBottom: '3px', lineHeight: 1.6 }}>
                        <span style={{ position: 'absolute', left: 0, color: accent, fontWeight: 700 }}>–</span>{b}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {data.education?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginBottom: '12px' }}>Education</h3>
                {data.education.map(ed => (
                  <div key={ed.id} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{ed.degree}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{ed.endDate}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{ed.school}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div>
            {allSkills.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginBottom: '10px' }}>Skills</h3>
                {allSkills.slice(0, 10).map((s, i) => (
                  <div key={i} style={{ fontSize: '11px', color: '#475569', marginBottom: '6px', paddingLeft: '10px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: accent }}>·</span>{s}
                  </div>
                ))}
              </div>
            )}

            {data.certifications?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginBottom: '10px' }}>Certifications</h3>
                {data.certifications.map((c, i) => (
                  <div key={i} style={{ fontSize: '11px', color: '#475569', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '10px' }}>{c.issuer} {c.date ? `· ${c.date}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}
