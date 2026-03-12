'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function MinimalTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const skills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

  const MinSection = ({ label }: { label: string }) => (
    <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#aaa", marginBottom: "10px", marginTop: "16px" }}>{label}</div>
  );

  return (
    <ResumeContainer styling={styling}>
      <div style={{ fontFamily: "'Source Sans 3',sans-serif", background: "#fafaf8", color: "#111", width: "100%", minHeight: "100%", padding: "40px 44px", textAlign: "left" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap');`}</style>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: "20px", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>{data.personalInfo.fullName}</h1>
          <p style={{ fontSize: "13px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 300, marginBottom: "12px" }}>{data.experience?.[0]?.position || "Professional Title"}</p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", lineHeight: 1.5 }}>
            {[
              data.personalInfo.email, 
              data.personalInfo.phone, 
              data.personalInfo.location, 
              data.personalInfo.linkedin?.replace('https://', ''),
              data.personalInfo.portfolio?.replace('https://', '')
            ].filter(Boolean).map(v => (
              <span key={v} style={{ fontSize: "11px", color: "#888" }}>{v}</span>
            ))}
          </div>
        </div>

        {data.summary && <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.8, marginBottom: "24px", maxWidth: "580px" }}>{data.summary}</p>}

        {data.experience?.length > 0 && (
          <>
            <MinSection label="Experience" />
            {data.experience.map(job => (
              <div key={job.id} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "0 20px", marginBottom: "18px" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "#999", lineHeight: 1.5 }}>{job.startDate} — {job.endDate}</div>
                  <div style={{ fontSize: "10px", color: "#bbb" }}>{job.location}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "14px", fontWeight: 600 }}>{job.company}</div>
                  <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px", fontStyle: "italic" }}>{job.position}</div>
                  {job.achievements?.map((b, i) => (
                    <div key={i} style={{ fontSize: "11px", color: "#555", paddingLeft: "10px", position: "relative", marginBottom: "4px", lineHeight: 1.6 }}>
                      <span style={{ position: "absolute", left: 0 }}>–</span>{b}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", marginTop: "8px" }}>
          <div>
            {data.education?.length > 0 && (
              <>
                <MinSection label="Education" />
                {data.education.map(ed => (
                  <div key={ed.id} style={{ marginBottom: "12px" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "13px", fontWeight: 600 }}>{ed.degree}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{ed.school}  ·  {ed.startDate} — {ed.endDate}</div>
                  </div>
                ))}
              </>
            )}

            {data.certifications?.length > 0 && (
              <>
                <MinSection label="Awards" />
                {data.certifications.map((a, i) => (
                  <div key={i} style={{ marginBottom: "12px" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "13px", fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{a.issuer} {a.date ? `· ${a.date}` : ''}</div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div>
            {skills.length > 0 && (
              <>
                <MinSection label="Skills" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {skills.map(s => (
                    <span key={s} style={{ fontSize: "10px", border: "1px solid #ddd", borderRadius: "3px", padding: "3px 10px", color: "#555" }}>{s}</span>
                  ))}
                </div>
              </>
            )}
            
            {data.languages?.length > 0 && (
              <>
                <MinSection label="Languages" />
                {data.languages.map(l => (
                  <div key={l.id} style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>{l.name} — <span style={{ color: "#999" }}>{l.level}</span></div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}
