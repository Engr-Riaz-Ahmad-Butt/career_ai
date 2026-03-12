/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function ExecutiveTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
  const styling = data?.styling || SAMPLE_DATA.styling;
  const skills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

  return (
    <ResumeContainer styling={styling}>
      <div className="w-full h-full" style={{ fontFamily: "'Georgia', serif", background: "#f0ece4", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "0" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap');
          .cv-exec-wrap { font-family: 'Source Sans 3', sans-serif; }
          .cv-exec-wrap h1, .cv-exec-wrap h2, .cv-exec-wrap h3 { font-family: 'Playfair Display', serif; }
          .exec-section-header {
            display: flex; align-items: center; gap: 10px;
            background: #1a2b3c; color: #fff;
            padding: 8px 16px; border-radius: 4px;
            font-family: 'Source Sans 3', sans-serif;
            font-size: 13px; font-weight: 600; letter-spacing: 1.5px;
            text-transform: uppercase; margin-bottom: 18px;
          }
          .exec-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
          .exec-dot-filled { background: #1a2b3c; }
          .exec-dot-empty { background: #ccc; }
          .exec-job-title-co { font-size: 13px; font-weight: 600; color: #1a2b3c; margin-bottom: 2px; font-family: 'Playfair Display', serif; }
          .exec-job-meta { font-size: 12px; color: #666; margin-bottom: 10px; }
          .exec-job-bullet { font-size: 12.5px; color: #333; line-height: 1.6; padding-left: 14px; position: relative; margin-bottom: 6px; }
          .exec-job-bullet::before { content: "•"; position: absolute; left: 0; color: #1a2b3c; }
          .exec-contact-item { display: flex; align-items: flex-start; gap: 10px; font-size: 12.5px; color: #333; margin-bottom: 10px; line-height: 1.4; word-break: break-all; }
          .exec-contact-icon { color: #1a2b3c; font-size: 14px; min-width: 16px; margin-top: 1px; }
          .exec-skill-item { font-size: 12.5px; color: #333; margin-bottom: 10px; padding-left: 14px; position: relative; }
          .exec-skill-item::before { content: "•"; position: absolute; left: 0; color: #1a2b3c; }
          .exec-award-title { font-size: 13px; font-weight: 600; color: #1a2b3c; font-family: 'Playfair Display', serif; }
          .exec-award-org { font-size: 12px; color: #555; margin-bottom: 14px; }
          .exec-edu-title { font-size: 13px; font-weight: 600; color: #1a2b3c; font-family: 'Playfair Display', serif; }
          .exec-edu-meta { font-size: 12px; color: #555; margin-bottom: 16px; }
          .exec-divider { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
        `}</style>

        <div className="cv-exec-wrap w-full h-full flex overflow-hidden bg-white text-left shadow-2xl">
          
          {/* LEFT SIDEBAR */}
          <div style={{ width: "35%", background: "#fff", borderRight: "1px solid #eee", padding: "40px 28px", display: "flex", flexDirection: "column" }}>
            
            {/* Name & Title */}
            <div style={{ marginBottom: "28px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a2b3c", lineHeight: "1.2", marginBottom: "6px" }}>
                {data.personalInfo.fullName || "Jane Doe"}
              </h1>
              <p style={{ fontSize: "15px", color: "#555", fontFamily: "'Playfair Display', serif", lineHeight: "1.4" }}>
                {data.experience?.[0]?.position || "Professional Title"}
              </p>
            </div>

            {/* Photo Placeholder if needed */}
            {data.personalInfo.photoUrl && (
              <div style={{ marginBottom: "28px", display: "flex", justifyContent: "flex-start" }}>
                <div style={{ width: "110px", height: "110px", borderRadius: "50%", overflow: "hidden", border: "3px solid #1a2b3c", background: "#c8a97e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={data.personalInfo.photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            )}

            {/* Contact */}
            <div style={{ marginBottom: "28px" }}>
              {data.personalInfo.email && <div className="exec-contact-item"><span className="exec-contact-icon">✉</span> {data.personalInfo.email}</div>}
              {data.personalInfo.phone && <div className="exec-contact-item"><span className="exec-contact-icon">📞</span> {data.personalInfo.phone}</div>}
              {data.personalInfo.location && <div className="exec-contact-item"><span className="exec-contact-icon">📍</span> <span>{data.personalInfo.location}</span></div>}
              {data.personalInfo.linkedin && <div className="exec-contact-item"><span className="exec-contact-icon">in</span> {data.personalInfo.linkedin.replace('https://', '')}</div>}
              {data.personalInfo.portfolio && <div className="exec-contact-item"><span className="exec-contact-icon">🌐</span> {data.personalInfo.portfolio.replace('https://', '')}</div>}
            </div>

            <hr className="exec-divider" />

            {/* Profile */}
            {data.summary && (
              <>
                <div style={{ marginBottom: "28px" }}>
                  <div className="exec-section-header"><span>👤</span> Profile</div>
                  <p style={{ fontSize: "12.5px", color: "#444", lineHeight: "1.7", textAlign: "justify" }}>
                    {data.summary}
                  </p>
                </div>
                <hr className="exec-divider" />
              </>
            )}

            {/* Languages */}
            {data.languages?.length > 0 && (
              <>
                <div style={{ marginBottom: "28px" }}>
                  <div className="exec-section-header"><span>🌍</span> Languages</div>
                  {data.languages.map((lang, idx) => {
                    let levelNum = parseInt(lang.level) || 4;
                    if (levelNum > 5) levelNum = 5;
                    return (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <span style={{ fontSize: "13px", color: "#333" }}>{lang.name}</span>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {[1,2,3,4,5].map(i => <span key={i} className={`exec-dot ${i <= levelNum ? "exec-dot-filled" : "exec-dot-empty"}`}></span>)}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <hr className="exec-divider" />
              </>
            )}

            {/* Awards */}
            {data.certifications?.length > 0 && (
              <div style={{ paddingBottom: "20px" }}>
                <div className="exec-section-header"><span>🏆</span> Awards</div>
                {data.certifications.map(cert => (
                  <div key={cert.id} style={{ marginBottom: "10px" }}>
                    <div className="exec-award-title">{cert.name}</div>
                    <div className="exec-award-org">{cert.issuer} {cert.date ? `, ${cert.date}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT MAIN */}
          <div style={{ width: "65%", padding: "40px 36px", display: "flex", flexDirection: "column" }}>

            {/* Professional Experience */}
            {data.experience?.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <div className="exec-section-header"><span>💼</span> Professional Experience</div>
                {data.experience.map((exp, idx) => (
                  <div key={exp.id}>
                    <div className="exec-job-title-co">{exp.company}</div>
                    <div style={{ fontSize: "13px", color: "#444", marginBottom: "2px" }}>{exp.position}</div>
                    <div className="exec-job-meta">{exp.startDate} – {exp.endDate} | {exp.location || 'Remote'}</div>
                    {exp.description && <div className="exec-job-bullet">{exp.description}</div>}
                    {exp.achievements?.map((ach, i) => (
                      <div key={i} className="exec-job-bullet">{ach}</div>
                    ))}
                    {idx < data.experience.length - 1 && <hr className="exec-divider" />}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {data.education?.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <div className="exec-section-header"><span>🎓</span> Education</div>
                {data.education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: "12px" }}>
                    <div className="exec-edu-title">{edu.degree}</div>
                    <div className="exec-edu-meta">{edu.school}<br />{edu.startDate} – {edu.endDate} {edu.location ? `| ${edu.location}` : ''}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <div className="exec-section-header"><span>⚙️</span> Skills</div>
                {skills.map((skill, i) => (
                  <div key={i} className="exec-skill-item">{skill}</div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </ResumeContainer>
  );
}
