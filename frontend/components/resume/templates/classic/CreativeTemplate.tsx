/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function CreativeTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
    const styling = data?.styling || SAMPLE_DATA.styling;
    const primaryColor = styling?.colors?.primary || '#0f172a';
    const accentColor = styling?.colors?.accent || '#6366f1';
    const skills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

    const initials = (data.personalInfo?.fullName || 'A B')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const SectionLabel = ({ label }: { label: string }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
            marginTop: '22px',
        }}>
            <div style={{
                width: '4px',
                height: '18px',
                borderRadius: '2px',
                background: accentColor,
                flexShrink: 0,
            }} />
            <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: primaryColor,
            }}>
                {label}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>
    );

    return (
        <ResumeContainer styling={styling}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');`}</style>

            <div style={{
                fontFamily: "'DM Sans', sans-serif",
                background: '#ffffff',
                width: '100%',
                minHeight: '100%',
                display: 'flex',
                textAlign: 'left',
            }}>
                {/* LEFT ACCENT SIDEBAR */}
                <div style={{
                    width: '6px',
                    minWidth: '6px',
                    background: `linear-gradient(180deg, ${accentColor} 0%, ${primaryColor} 100%)`,
                    flexShrink: 0,
                }} />

                {/* MAIN CONTENT */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                    {/* ── HEADER ── */}
                    <div style={{
                        background: primaryColor,
                        padding: '36px 40px 30px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* decorative circle */}
                        <div style={{
                            position: 'absolute', top: '-50px', right: '-50px',
                            width: '180px', height: '180px', borderRadius: '50%',
                            background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
                            pointerEvents: 'none',
                        }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 1 }}>
                            {/* Avatar */}
                            <div style={{
                                width: '76px', height: '76px', borderRadius: '16px',
                                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '24px', fontFamily: "'Syne', sans-serif", fontWeight: 800,
                                color: '#fff', flexShrink: 0, overflow: 'hidden',
                                boxShadow: `0 0 0 3px ${accentColor}55`,
                            }}>
                                {data.personalInfo?.photoUrl
                                    ? <img src={data.personalInfo.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : initials
                                }
                            </div>

                            <div style={{ flex: 1 }}>
                                <h1 style={{
                                    fontFamily: "'Syne', sans-serif",
                                    fontSize: '28px', fontWeight: 800,
                                    color: '#fff', marginBottom: '4px',
                                    letterSpacing: '-0.3px', lineHeight: 1.1,
                                }}>
                                    {data.personalInfo.fullName}
                                </h1>
                                <p style={{
                                    fontSize: '13px', color: accentColor,
                                    fontWeight: 500, marginBottom: '14px', letterSpacing: '0.3px',
                                }}>
                                    {data.experience?.[0]?.position || 'Professional Title'}
                                </p>
                                {/* Contact row */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
                                    {[
                                        data.personalInfo.email && { icon: '✉', val: data.personalInfo.email },
                                        data.personalInfo.phone && { icon: '☎', val: data.personalInfo.phone },
                                        data.personalInfo.location && { icon: '⊙', val: data.personalInfo.location },
                                        data.personalInfo.linkedin && { icon: 'in', val: data.personalInfo.linkedin.replace('https://', '') },
                                        data.personalInfo.portfolio && { icon: '◈', val: data.personalInfo.portfolio.replace('https://', '') },
                                    ].filter(Boolean).map((c: any) => (
                                        <div key={c.val} style={{
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            fontSize: '10.5px', color: 'rgba(255,255,255,0.6)',
                                        }}>
                                            <span style={{ color: accentColor, fontSize: '11px' }}>{c.icon}</span>
                                            <span style={{ wordBreak: 'break-all' }}>{c.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary inside header */}
                        {data.summary && (
                            <div style={{
                                marginTop: '20px',
                                paddingTop: '18px',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative', zIndex: 1,
                            }}>
                                <p style={{
                                    fontSize: '11.5px', color: 'rgba(255,255,255,0.65)',
                                    lineHeight: 1.75, maxWidth: '600px',
                                }}>
                                    {data.summary}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── BODY: 2 columns ── */}
                    <div style={{ display: 'flex', flex: 1 }}>

                        {/* LEFT COLUMN */}
                        <div style={{ flex: 1, padding: '10px 28px 32px' }}>

                            {/* Experience */}
                            {data.experience?.length > 0 && (
                                <>
                                    <SectionLabel label="Experience" />
                                    {data.experience.map((job, idx) => (
                                        <div key={job.id} style={{ marginBottom: '18px', position: 'relative', paddingLeft: '16px' }}>
                                            {/* timeline dot */}
                                            <div style={{
                                                position: 'absolute', left: 0, top: '5px',
                                                width: '8px', height: '8px', borderRadius: '50%',
                                                background: accentColor, boxShadow: `0 0 0 2px ${accentColor}33`,
                                            }} />
                                            {idx < data.experience.length - 1 && (
                                                <div style={{
                                                    position: 'absolute', left: '3px', top: '14px',
                                                    width: '2px', bottom: '-12px',
                                                    background: '#e2e8f0',
                                                }} />
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                                <div>
                                                    <div style={{
                                                        fontFamily: "'Syne', sans-serif",
                                                        fontSize: '13px', fontWeight: 700, color: primaryColor,
                                                    }}>{job.company}</div>
                                                    <div style={{ fontSize: '11.5px', color: accentColor, fontStyle: 'italic', marginBottom: '4px' }}>
                                                        {job.position}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                                                    <div style={{
                                                        fontSize: '10px', color: '#fff', background: primaryColor,
                                                        padding: '2px 8px', borderRadius: '20px', display: 'inline-block', marginBottom: '2px',
                                                    }}>
                                                        {job.startDate} – {job.endDate}
                                                    </div>
                                                    {job.location && (
                                                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>{job.location}</div>
                                                    )}
                                                </div>
                                            </div>
                                            {job.description && (
                                                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.65, marginBottom: '5px' }}>
                                                    {job.description}
                                                </p>
                                            )}
                                            {job.achievements?.map((b: string, i: number) => (
                                                <div key={i} style={{
                                                    fontSize: '11px', color: '#475569',
                                                    paddingLeft: '12px', position: 'relative',
                                                    marginBottom: '4px', lineHeight: 1.6,
                                                }}>
                                                    <span style={{ position: 'absolute', left: 0, color: accentColor, fontWeight: 700 }}>›</span>
                                                    {b}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Education */}
                            {data.education?.length > 0 && (
                                <>
                                    <SectionLabel label="Education" />
                                    {data.education.map((ed) => (
                                        <div key={ed.id} style={{ marginBottom: '14px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{
                                                        fontFamily: "'Syne', sans-serif",
                                                        fontSize: '12.5px', fontWeight: 700, color: primaryColor,
                                                    }}>{ed.degree}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{ed.school}</div>
                                                    {ed.location && <div style={{ fontSize: '10px', color: '#94a3b8' }}>{ed.location}</div>}
                                                </div>
                                                <div style={{
                                                    fontSize: '10px', color: accentColor,
                                                    background: `${accentColor}15`,
                                                    border: `1px solid ${accentColor}33`,
                                                    padding: '2px 10px', borderRadius: '20px',
                                                    flexShrink: 0, marginLeft: '8px',
                                                }}>
                                                    {ed.startDate} – {ed.endDate}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Projects */}
                            {data.projects?.length > 0 && (
                                <>
                                    <SectionLabel label="Projects" />
                                    {data.projects.map((proj: any) => (
                                        <div key={proj.id} style={{ marginBottom: '14px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                                <div style={{
                                                    fontFamily: "'Syne', sans-serif",
                                                    fontSize: '12.5px', fontWeight: 700, color: primaryColor,
                                                }}>{proj.name}</div>
                                                {proj.url && (
                                                    <span style={{ fontSize: '10px', color: accentColor }}>{proj.url.replace('https://', '')}</span>
                                                )}
                                            </div>
                                            {proj.description && (
                                                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6 }}>{proj.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div style={{
                            width: '210px', minWidth: '210px',
                            borderLeft: '1px solid #f1f5f9',
                            padding: '10px 20px 32px',
                            background: '#fafbff',
                        }}>

                            {/* Skills */}
                            {skills.length > 0 && (
                                <>
                                    <SectionLabel label="Skills" />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                        {skills.map((s, i) => (
                                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    width: '6px', height: '6px', borderRadius: '50%',
                                                    background: i % 2 === 0 ? accentColor : primaryColor,
                                                    flexShrink: 0,
                                                }} />
                                                <span style={{ fontSize: '11.5px', color: '#374151' }}>{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Languages */}
                            {data.languages?.length > 0 && (
                                <>
                                    <SectionLabel label="Languages" />
                                    {data.languages.map((l: any) => (
                                        <div key={l.id} style={{ marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '11.5px', color: '#374151', fontWeight: 500 }}>{l.name}</span>
                                                <span style={{ fontSize: '10px', color: accentColor }}>{l.level}</span>
                                            </div>
                                            <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '2px' }}>
                                                <div style={{
                                                    height: '100%', borderRadius: '2px',
                                                    background: `linear-gradient(90deg, ${accentColor}, ${primaryColor})`,
                                                    width: l.level === 'Native' ? '100%' : l.level === 'Fluent' ? '85%' : l.level === 'Intermediate' ? '60%' : '40%',
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Certifications / Awards */}
                            {data.certifications?.length > 0 && (
                                <>
                                    <SectionLabel label="Certifications" />
                                    {data.certifications.map((cert: any) => (
                                        <div key={cert.id} style={{
                                            marginBottom: '10px',
                                            padding: '9px 11px',
                                            background: '#fff',
                                            border: `1px solid ${accentColor}22`,
                                            borderLeft: `3px solid ${accentColor}`,
                                            borderRadius: '0 6px 6px 0',
                                        }}>
                                            <div style={{ fontSize: '11.5px', fontWeight: 600, color: primaryColor }}>{cert.name}</div>
                                            {cert.issuer && <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{cert.issuer}</div>}
                                            {cert.date && <div style={{ fontSize: '10px', color: '#94a3b8' }}>{cert.date}</div>}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Interests */}
                            {data.interests?.length > 0 && (
                                <>
                                    <SectionLabel label="Interests" />
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {data.interests.map((interest: string, i: number) => (
                                            <span key={i} style={{
                                                fontSize: '10px', color: accentColor,
                                                background: `${accentColor}12`,
                                                border: `1px solid ${accentColor}25`,
                                                borderRadius: '20px', padding: '3px 10px',
                                            }}>
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ResumeContainer>
    );
}