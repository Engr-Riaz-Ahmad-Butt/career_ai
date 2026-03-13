'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function HarvardTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const primary = styling?.colors?.primary || '#000000';

  const Section = ({ title }: { title: string }) => (
    <div style={{ borderBottom: `2px solid ${primary}`, paddingBottom: '3px', marginBottom: '10px', marginTop: '18px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: primary }}>
        {title}
      </span>
    </div>
  );

  return (
    <ResumeContainer styling={styling}>
      <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', padding: '48px 52px', color: '#111', background: '#fff', textAlign: 'left' }}>
        {/* Header — centered */}
        <div style={{ textAlign: 'center', borderBottom: `2px solid ${primary}`, paddingBottom: '16px', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: primary, marginBottom: '6px' }}>
            {data.personalInfo?.fullName || 'Your Name'}
          </h1>
          <div style={{ fontSize: '11px', color: '#444', display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
            {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo?.phone && <span>• {data.personalInfo.phone}</span>}
            {data.personalInfo?.location && <span>• {data.personalInfo.location}</span>}
            {data.personalInfo?.linkedin && <span>• {data.personalInfo.linkedin.replace('https://', '').replace('www.', '')}</span>}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <>
            <Section title="Summary" />
            <p style={{ fontSize: '11px', lineHeight: 1.7, color: '#333' }}>{data.summary}</p>
          </>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <>
            <Section title="Professional Experience" />
            {data.experience.map(job => (
              <div key={job.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{job.position}</span>
                  <span style={{ fontSize: '10px', color: '#555', fontStyle: 'italic' }}>{job.startDate} – {job.endDate}</span>
                </div>
                <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#555', marginBottom: '5px' }}>
                  {job.company}{job.location ? `, ${job.location}` : ''}
                </div>
                {(job.achievements || []).map((b, i) => (
                  <div key={i} style={{ fontSize: '11px', paddingLeft: '14px', position: 'relative', marginBottom: '3px', lineHeight: 1.6, color: '#333' }}>
                    <span style={{ position: 'absolute', left: 0 }}>•</span>{b}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <>
            <Section title="Education" />
            {data.education.map(ed => (
              <div key={ed.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{ed.degree}{ed.field ? `, ${ed.field}` : ''}</span>
                  <span style={{ fontSize: '10px', color: '#555', fontStyle: 'italic' }}>{ed.startDate} – {ed.endDate}</span>
                </div>
                <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#555' }}>{ed.school}</div>
                {ed.gpa && <div style={{ fontSize: '10px', color: '#666' }}>GPA: {ed.gpa}</div>}
              </div>
            ))}
          </>
        )}

        {/* Skills */}
        {(data.skills?.technical?.length || data.skills?.soft?.length) ? (
          <>
            <Section title="Skills" />
            <div style={{ fontSize: '11px', color: '#333', lineHeight: 1.7 }}>
              {data.skills?.technical?.length > 0 && (
                <div><strong>Technical:</strong> {data.skills.technical.join(' · ')}</div>
              )}
              {data.skills?.soft?.length > 0 && (
                <div><strong>Other:</strong> {data.skills.soft.join(' · ')}</div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </ResumeContainer>
  );
}
