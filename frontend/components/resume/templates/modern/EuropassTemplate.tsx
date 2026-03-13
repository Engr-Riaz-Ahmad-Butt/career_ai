'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function EuropassTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const primary = styling?.colors?.primary || '#003399';
  const allSkills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

  const Row = ({ label, value }: { label: string; value?: string }) =>
    value ? (
      <tr>
        <td style={{ fontSize: '10px', color: '#555', fontWeight: 600, width: '140px', padding: '3px 12px 3px 0', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{label}</td>
        <td style={{ fontSize: '10px', color: '#222', padding: '3px 0', verticalAlign: 'top' }}>{value}</td>
      </tr>
    ) : null;

  const SectionHeader = ({ title }: { title: string }) => (
    <tr>
      <td colSpan={2} style={{ paddingTop: '18px', paddingBottom: '4px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: primary, borderBottom: `2px solid ${primary}`, paddingBottom: '4px' }}>{title}</div>
      </td>
    </tr>
  );

  return (
    <ResumeContainer styling={styling}>
      <div style={{ fontFamily: "'Arial','Helvetica',sans-serif", background: '#fff', minHeight: '100%' }}>
        {/* Top banner */}
        <div style={{ background: primary, padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '4px', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {(data.personalInfo?.fullName || 'AB').split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              {data.personalInfo?.fullName || 'Your Name'}
            </h1>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
              {data.experience?.[0]?.position || 'Professional Title'}
            </p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Curriculum Vitae</div>
          </div>
        </div>

        <div style={{ padding: '20px 32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {/* Personal info */}
              <SectionHeader title="Personal Information" />
              <Row label="Email" value={data.personalInfo?.email} />
              <Row label="Phone" value={data.personalInfo?.phone} />
              <Row label="Address" value={data.personalInfo?.location} />
              <Row label="LinkedIn" value={data.personalInfo?.linkedin?.replace('https://', '').replace('www.', '')} />

              {/* Work Experience */}
              {data.experience?.length > 0 && (
                <>
                  <SectionHeader title="Work Experience" />
                  {data.experience.map(job => (
                    <React.Fragment key={job.id}>
                      <Row label={`${job.startDate} – ${job.endDate}`} value={job.position} />
                      <tr>
                        <td />
                        <td style={{ fontSize: '10px', color: '#555', paddingBottom: '2px', fontStyle: 'italic' }}>{job.company}{job.location ? `, ${job.location}` : ''}</td>
                      </tr>
                      {job.description && (
                        <tr><td /><td style={{ fontSize: '10px', color: '#444', lineHeight: 1.6, paddingBottom: '6px' }}>{job.description}</td></tr>
                      )}
                    </React.Fragment>
                  ))}
                </>
              )}

              {/* Education */}
              {data.education?.length > 0 && (
                <>
                  <SectionHeader title="Education and Training" />
                  {data.education.map(ed => (
                    <React.Fragment key={ed.id}>
                      <Row label={`${ed.startDate} – ${ed.endDate}`} value={`${ed.degree}${ed.field ? ', ' + ed.field : ''}`} />
                      <tr><td /><td style={{ fontSize: '10px', color: '#555', fontStyle: 'italic', paddingBottom: '6px' }}>{ed.school}</td></tr>
                    </React.Fragment>
                  ))}
                </>
              )}

              {/* Skills */}
              {allSkills.length > 0 && (
                <>
                  <SectionHeader title="Skills" />
                  <tr>
                    <td style={{ fontSize: '10px', color: '#555', fontWeight: 600, padding: '3px 12px 3px 0', verticalAlign: 'top' }}>Digital skills</td>
                    <td style={{ fontSize: '10px', color: '#222', padding: '3px 0' }}>{allSkills.join(' · ')}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ResumeContainer>
  );
}
