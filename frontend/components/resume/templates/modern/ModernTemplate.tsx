/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function ModernTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const skills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

  const MDarkSection = ({ label }: { label: string }) => (
    <div style={{ fontSize: "9px", fontFamily: "'Syne',sans-serif", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#635bff", marginBottom: "10px", marginTop: "6px" }}>{label}</div>
  );

  return (
    <ResumeContainer styling={styling}>
      <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#0a0a0f", color: "#fff", width: "100%", minHeight: "100%", padding: "28px", textAlign: "left" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#13131f,#1a1a2e)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "28px 32px", marginBottom: "14px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,91,255,0.18) 0%,transparent 70%)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#635bff,#a89fff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 0 0 3px rgba(99,91,255,0.3)", overflow: "hidden" }}>
                {data.personalInfo?.photoUrl ? (
                  <img src={data.personalInfo.photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  (data.personalInfo?.fullName || "A B").split(" ").map(n => n[0]).join("").slice(0, 2)
                )}
              </div>
              <div>
                <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>{data.personalInfo.fullName}</h1>
                <p style={{ fontSize: "13px", color: "#a89fff" }}>{data.experience?.[0]?.position || "Professional Title"}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", zIndex: 1 }}>
              {[
                [" ✉", data.personalInfo.email], 
                ["📍", data.personalInfo.location], 
                ["🔗", data.personalInfo.linkedin?.replace('https://', '')]
              ].map(([ic, val]) => val && (
                <div key={val} style={{ display: "flex", gap: "7px", fontSize: "11px", color: "#888", alignItems: "center" }}><span style={{ minWidth: "12px" }}>{ic}</span><span>{val}</span></div>
              ))}
            </div>
          </div>
          {data.summary && <p style={{ marginTop: "18px", fontSize: "12px", color: "#777", lineHeight: 1.7, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", position: "relative", zIndex: 1 }}>{data.summary}</p>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "14px" }}>
          <div>
            {data.experience?.length > 0 && (
              <>
                <MDarkSection label="Experience" />
                {data.experience.map(job => (
                  <div key={job.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px 18px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "13px", fontWeight: 700 }}>{job.company}</div>
                        <div style={{ fontSize: "11px", color: "#a89fff" }}>{job.position}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "10px", color: "#555" }}>{job.startDate} — {job.endDate}</div>
                        <div style={{ fontSize: "10px", color: "#444" }}>{job.location}</div>
                      </div>
                    </div>
                    {job.achievements?.map((b, i) => (
                      <div key={i} style={{ fontSize: "11px", color: "#888", paddingLeft: "14px", position: "relative", marginBottom: "5px", lineHeight: 1.6 }}>
                        <span style={{ position: "absolute", left: 0, color: "#635bff" }}>→</span>{b}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}

            {data.education?.length > 0 && (
              <>
                <MDarkSection label="Education" />
                {data.education.map(ed => (
                  <div key={ed.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "14px 18px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "12px", fontWeight: 700 }}>{ed.degree}</div>
                        <div style={{ fontSize: "11px", color: "#888" }}>{ed.school}</div>
                      </div>
                      <div style={{ fontSize: "10px", color: "#555", textAlign: "right" }}>
                        <div>{ed.startDate} — {ed.endDate}</div>
                        <div>{ed.location}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div>
            {skills.length > 0 && (
              <>
                <MDarkSection label="Skills" />
                {skills.map(s => (
                  <div key={s} style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "4px" }}>{s}</div>
                    <div style={{ height: "3px", background: "rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                      <div style={{ height: "100%", width: `${70 + Math.floor(Math.random() * 25)}%`, background: "linear-gradient(90deg,#635bff,#a89fff)", borderRadius: "2px" }} />
                    </div>
                  </div>
                ))}
              </>
            )}

            {data.languages?.length > 0 && (
              <>
                <MDarkSection label="Languages" />
                {data.languages.map(l => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#888", marginBottom: "8px" }}>
                    <span>{l.name}</span>
                    <span style={{ color: "#635bff", background: "rgba(99,91,255,0.1)", padding: "1px 8px", borderRadius: "10px", border: "1px solid rgba(99,91,255,0.2)" }}>{l.level}</span>
                  </div>
                ))}
              </>
            )}

            {data.certifications?.length > 0 && <>
              <MDarkSection label="Awards" />
              {data.certifications.map((a, i) => (
                <div key={i} style={{ marginBottom: "10px", display: "flex", gap: "8px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#635bff", boxShadow: "0 0 6px #635bff", marginTop: "4px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "11px", color: "#ddd" }}>{a.name}</div>
                    <div style={{ fontSize: "10px", color: "#555" }}>{a.issuer} {a.date ? `· ${a.date}` : ''}</div>
                  </div>
                </div>
              ))}
            </>}
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}
