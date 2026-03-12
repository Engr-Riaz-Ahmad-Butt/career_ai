/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function ClassicTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const skills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

  const SectionHead = ({ label }: { label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", marginTop: "4px" }}>
      <div style={{ fontSize: "10px", fontFamily: "'Source Sans 3',sans-serif", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#1a2b3c" }}>{label}</div>
      <div style={{ flex: 1, height: "1px", background: "#1a2b3c" }} />
    </div>
  );

  return (
    <ResumeContainer styling={styling}>
      <div style={{ fontFamily: "'Playfair Display', serif", background: "#fff", width: "100%", minHeight: "100%", color: "#1a2b3c", textAlign: "left" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap');`}</style>
        <div style={{ display: "flex", height: "100%", minHeight: "100vh" }}>
          {/* Sidebar */}
          <div style={{ width: "240px", minWidth: "240px", background: "#1a2b3c", color: "#fff", padding: "32px 22px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#c8a97e,#8b6340)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "16px", border: "3px solid rgba(255,255,255,0.2)", overflow: "hidden" }}>
              {data.personalInfo?.photoUrl ? (
                <img src={data.personalInfo.photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                (data.personalInfo?.fullName || "A B").split(" ").map(n => n[0]).join("").slice(0, 2)
              )}
            </div>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px", lineHeight: 1.2 }}>{data.personalInfo.fullName}</div>
            <div style={{ fontSize: "11px", color: "#a89fff", marginBottom: "24px", fontFamily: "'Source Sans 3',sans-serif", letterSpacing: "0.5px" }}>{data.experience?.[0]?.position || "Professional Title"}</div>

            <div style={{ fontSize: "10px", fontFamily: "'Source Sans 3',sans-serif", fontWeight: 600, letterSpacing: "2px", color: "#a89fff", textTransform: "uppercase", marginBottom: "10px" }}>Contact</div>
            {[
              ["✉", data.personalInfo.email], 
              ["📞", data.personalInfo.phone], 
              ["📍", data.personalInfo.location], 
              ["🔗", data.personalInfo.linkedin?.replace('https://', '')], 
              ["◈", data.personalInfo.portfolio?.replace('https://', '')]
            ].map(([ic, val]) => (
              val && <div key={val} style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#ccc", marginBottom: "7px", fontFamily: "'Source Sans 3',sans-serif", alignItems: "flex-start", lineHeight: 1.4 }}><span style={{ minWidth: "12px" }}>{ic}</span><span style={{ wordBreak: "break-all" }}>{val}</span></div>
            ))}

            {skills.length > 0 && (
              <>
                <div style={{ marginTop: "22px", fontSize: "10px", fontFamily: "'Source Sans 3',sans-serif", fontWeight: 600, letterSpacing: "2px", color: "#a89fff", textTransform: "uppercase", marginBottom: "10px" }}>Skills</div>
                {skills.map(s => (
                  <div key={s} style={{ fontSize: "11px", fontFamily: "'Source Sans 3',sans-serif", color: "#ddd", marginBottom: "6px", paddingLeft: "10px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#a89fff" }}>›</span>{s}
                  </div>
                ))}
              </>
            )}

            {data.languages?.length > 0 && (
              <>
                <div style={{ marginTop: "22px", fontSize: "10px", fontFamily: "'Source Sans 3',sans-serif", fontWeight: 600, letterSpacing: "2px", color: "#a89fff", textTransform: "uppercase", marginBottom: "10px" }}>Languages</div>
                {data.languages.map(l => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "'Source Sans 3',sans-serif", color: "#ccc", marginBottom: "6px" }}>
                    <span>{l.name}</span><span style={{ color: "#a89fff" }}>{l.level}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Main */}
          <div style={{ flex: 1, padding: "32px 28px" }}>
            {data.summary && (
              <div style={{ marginBottom: "22px", padding: "14px 18px", background: "#f8f6f2", borderLeft: "3px solid #1a2b3c", borderRadius: "0 6px 6px 0" }}>
                <p style={{ fontSize: "12px", fontFamily: "'Source Sans 3',sans-serif", color: "#555", lineHeight: 1.7 }}>{data.summary}</p>
              </div>
            )}

            {data.experience?.length > 0 && (
              <>
                <SectionHead label="Experience" />
                {data.experience.map(job => (
                  <div key={job.id} style={{ marginBottom: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2b3c" }}>{job.company}</div>
                        <div style={{ fontSize: "11px", fontFamily: "'Source Sans 3',sans-serif", color: "#666" }}>{job.position}</div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: "100px" }}>
                        <div style={{ fontSize: "10px", fontFamily: "'Source Sans 3',sans-serif", color: "#999" }}>{job.startDate} — {job.endDate}</div>
                        <div style={{ fontSize: "10px", fontFamily: "'Source Sans 3',sans-serif", color: "#bbb" }}>{job.location}</div>
                      </div>
                    </div>
                    {job.achievements?.map((b, i) => (
                      <div key={i} style={{ fontSize: "11px", fontFamily: "'Source Sans 3',sans-serif", color: "#444", paddingLeft: "12px", position: "relative", marginTop: "5px", lineHeight: 1.6 }}>
                        <span style={{ position: "absolute", left: 0, color: "#1a2b3c" }}>•</span>{b}
                      </div>
                    ))}
                    <div style={{ borderBottom: "1px solid #eee", marginTop: "14px" }} />
                  </div>
                ))}
              </>
            )}

            {data.education?.length > 0 && (
              <>
                <SectionHead label="Education" />
                {data.education.map(ed => (
                  <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a2b3c" }}>{ed.degree}</div>
                      <div style={{ fontSize: "11px", fontFamily: "'Source Sans 3',sans-serif", color: "#777" }}>{ed.school}</div>
                    </div>
                    <div style={{ fontSize: "10px", fontFamily: "'Source Sans 3',sans-serif", color: "#999", textAlign: "right" }}>{ed.startDate} — {ed.endDate}<br/>{ed.location}</div>
                  </div>
                ))}
              </>
            )}

            {data.certifications?.length > 0 && (
              <>
                <SectionHead label="Awards" />
                {data.certifications.map((a, i) => (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#1a2b3c" }}>{a.name}</div>
                    <div style={{ fontSize: "10px", fontFamily: "'Source Sans 3',sans-serif", color: "#999" }}>{a.issuer} {a.date ? `· ${a.date}` : ''}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}
