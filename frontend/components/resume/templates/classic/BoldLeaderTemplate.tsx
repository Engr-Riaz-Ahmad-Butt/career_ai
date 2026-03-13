'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function BoldLeaderTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const accent = styling?.colors?.accent || '#dc2626';
  const allSkills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

  return (
    <ResumeContainer styling={styling}>
      <div style={{ fontFamily: "'Helvetica Neue','Arial',sans-serif", background: '#fff', minHeight: '100%' }}>
        {/* Bold header bar */}
        <div style={{ background: '#111827', padding: '32px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: '4px', textTransform: 'uppercase' }}>
                {data.personalInfo?.fullName || 'Your Name'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '3px', background: accent, borderRadius: '2px' }} />
                <p style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  {data.experience?.[0]?.position || 'Executive Professional'}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {data.personalInfo?.email && <span style={{ fontSize: '10px', color: '#9ca3af' }}>{data.personalInfo.email}</span>}
              {data.personalInfo?.phone && <span style={{ fontSize: '10px', color: '#9ca3af' }}>{data.personalInfo.phone}</span>}
              {data.personalInfo?.location && <span style={{ fontSize: '10px', color: '#9ca3af' }}>{data.personalInfo.location}</span>}
            </div>
          </div>
        </div>

        {/* Accent strip */}
        <div style={{ height: '4px', background: `linear-gradient(90deg, ${accent}, #f97316, #eab308)` }} />

        <div style={{ padding: '28px 40px' }}>
          {/* Summary */}
          {data.summary && (
            <div style={{ marginBottom: '24px', borderLeft: `4px solid ${accent}`, paddingLeft: '16px' }}>
              <p style={{ fontSize: '12px', lineHeight: 1.8, color: '#374151' }}>{data.summary}</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '28px' }}>
            <div>
              {/* Experience */}
              {data.experience?.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '20px', height: '3px', background: accent }} />
                    <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#111827' }}>Experience</span>
                  </div>
                  {data.experience.map(job => (
                    <div key={job.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>{job.position}</span>
                        <span style={{ fontSize: '10px', color: '#9ca3af', background: '#f9fafb', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>{job.startDate} – {job.endDate}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: accent, fontWeight: 700, marginBottom: '6px' }}>{job.company}</div>
                      {(job.achievements || []).map((b, i) => (
                        <div key={i} style={{ fontSize: '11px', color: '#6b7280', paddingLeft: '14px', position: 'relative', marginBottom: '3px', lineHeight: 1.6 }}>
                          <span style={{ position: 'absolute', left: 0, color: accent, fontWeight: 900 }}>›</span>{b}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {data.education?.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '20px', height: '3px', background: accent }} />
                    <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#111827' }}>Education</span>
                  </div>
                  {data.education.map(ed => (
                    <div key={ed.id} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{ed.degree}</span>
                        <span style={{ fontSize: '10px', color: '#9ca3af' }}>{ed.endDate}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>{ed.school}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column */}
            <div>
              {allSkills.length > 0 && (
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#111827', marginBottom: '10px' }}>Core Skills</div>
                  {allSkills.slice(0, 8).map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                      <div style={{ width: '5px', height: '5px', background: accent, borderRadius: '50%', flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', color: '#374151', fontWeight: 500 }}>{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {data.certifications?.length > 0 && (
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#111827', marginBottom: '10px' }}>Certifications</div>
                  {data.certifications.map((c, i) => (
                    <div key={i} style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#111827' }}>{c.name}</div>
                      <div style={{ fontSize: '10px', color: '#9ca3af' }}>{c.issuer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}
