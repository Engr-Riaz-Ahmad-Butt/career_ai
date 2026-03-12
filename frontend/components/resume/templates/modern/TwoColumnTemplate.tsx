/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function TwoColumnTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
    const styling = data?.styling || SAMPLE_DATA.styling;
    const primaryColor = styling?.colors?.primary || '#1e293b';
    const accentColor = styling?.colors?.accent || '#0ea5e9';
    const skills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

    const initials = (data.personalInfo?.fullName || 'A B')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    // Convert language level string to numeric for dot display
    const langToNum = (level: string): number => {
        const map: Record<string, number> = {
            native: 5, fluent: 4, advanced: 4,
            intermediate: 3, basic: 2, beginner: 1,
        };
        return map[level?.toLowerCase()] ?? 3;
    };

    return (
        <ResumeContainer styling={styling}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');`}</style>

            <div style={{
                fontFamily: "'Outfit', sans-serif",
                background: '#ffffff',
                width: '100%',
                minHeight: '100%',
                textAlign: 'left',
            }}>

                {/* ── TOP HEADER BAND ── */}
                <div style={{
                    background: primaryColor,
                    padding: '30px 36px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '22px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* geometric accent */}
                    <div style={{
                        position: 'absolute', right: '-30px', bottom: '-40px',
                        width: '160px', height: '160px',
                        background: accentColor,
                        opacity: 0.15,
                        transform: 'rotate(30deg)',
                        borderRadius: '20px',
                    }} />
                    <div style={{
                        position: 'absolute', right: '80px', top: '-30px',
                        width: '100px', height: '100px',
                        background: accentColor,
                        opacity: 0.1,
                        transform: 'rotate(15deg)',
                        borderRadius: '14px',
                    }} />

                    {/* Avatar */}
                    <div style={{
                        width: '80px', height: '80px',
                        borderRadius: '50%',
                        border: `3px solid ${accentColor}`,
                        background: `linear-gradient(135deg, ${accentColor}88, ${accentColor}44)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', fontWeight: 700, color: '#fff',
                        flexShrink: 0, overflow: 'hidden', zIndex: 1,
                    }}>
                        {data.personalInfo?.photoUrl
                            ? <img src={data.personalInfo.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : initials
                        }
                    </div>

                    <div style={{ flex: 1, zIndex: 1 }}>
                        <h1 style={{
                            fontSize: '26px', fontWeight: 800, color: '#fff',
                            marginBottom: '3px', letterSpacing: '-0.2px',
                        }}>
                            {data.personalInfo.fullName}
                        </h1>
                        <p style={{ fontSize: '13px', color: accentColor, fontWeight: 500, marginBottom: '12px' }}>
                            {data.experience?.[0]?.position || 'Professional Title'}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {[
                                data.personalInfo.email && ['✉', data.personalInfo.email],
                                data.personalInfo.phone && ['☎', data.personalInfo.phone],
                                data.personalInfo.location && ['⊙', data.personalInfo.location],
                                data.personalInfo.linkedin && ['in', data.personalInfo.linkedin.replace('https://', '')],
                            ].filter(Boolean).map((c: any) => (
                                <span key={c[1]} style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.65)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    <span style={{ color: accentColor }}>{c[0]}</span>
                                    <span style={{ wordBreak: 'break-all' }}>{c[1]}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── ACCENT STRIPE ── */}
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${accentColor}, ${primaryColor})` }} />

                {/* ── BODY ── */}
                <div style={{ display: 'flex' }}>

                    {/* LEFT MAIN */}
                    <div style={{ flex: 1, padding: '24px 28px' }}>

                        {data.summary && (
                            <div style={{ marginBottom: '22px' }}>
                                <SectionTitle label="Profile" accent={accentColor} primary={primaryColor} />
                                <p style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.75 }}>{data.summary}</p>
                            </div>
                        )}

                        {data.experience?.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <SectionTitle label="Experience" accent={accentColor} primary={primaryColor} />
                                {data.experience.map((job, idx) => (
                                    <div key={job.id} style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: primaryColor }}>{job.company}</div>
                                                <div style={{ fontSize: '11.5px', color: accentColor, fontWeight: 500 }}>{job.position}</div>
                                            </div>
                                            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                                                <div style={{
                                                    fontSize: '10px', color: primaryColor,
                                                    background: `${accentColor}18`, border: `1px solid ${accentColor}33`,
                                                    padding: '2px 8px', borderRadius: '4px',
                                                }}>
                                                    {job.startDate} – {job.endDate}
                                                </div>
                                                {job.location && <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{job.location}</div>}
                                            </div>
                                        </div>
                                        {job.description && (
                                            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.65, marginTop: '4px' }}>{job.description}</p>
                                        )}
                                        {job.achievements?.map((b: string, i: number) => (
                                            <div key={i} style={{
                                                fontSize: '11px', color: '#475569',
                                                paddingLeft: '14px', position: 'relative',
                                                marginTop: '4px', lineHeight: 1.6,
                                            }}>
                                                <span style={{ position: 'absolute', left: 0, color: accentColor, fontWeight: 700 }}>·</span>
                                                {b}
                                            </div>
                                        ))}
                                        {idx < data.experience.length - 1 && (
                                            <div style={{ borderBottom: '1px dashed #e2e8f0', marginTop: '14px' }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.projects?.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <SectionTitle label="Projects" accent={accentColor} primary={primaryColor} />
                                {data.projects.map((proj: any) => (
                                    <div key={proj.id} style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: primaryColor }}>{proj.name}</div>
                                            {proj.url && <span style={{ fontSize: '10px', color: accentColor }}>{proj.url.replace('https://', '')}</span>}
                                        </div>
                                        {proj.description && <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6, marginTop: '3px' }}>{proj.description}</p>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.education?.length > 0 && (
                            <div>
                                <SectionTitle label="Education" accent={accentColor} primary={primaryColor} />
                                {data.education.map((ed) => (
                                    <div key={ed.id} style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ fontSize: '12.5px', fontWeight: 700, color: primaryColor }}>{ed.degree}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>{ed.school}</div>
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                                                <div>{ed.startDate} – {ed.endDate}</div>
                                                {ed.location && <div>{ed.location}</div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div style={{
                        width: '220px', minWidth: '220px',
                        background: '#f8fafc',
                        borderLeft: '1px solid #e2e8f0',
                        padding: '24px 18px',
                    }}>

                        {/* Skills */}
                        {skills.length > 0 && (
                            <div style={{ marginBottom: '22px' }}>
                                <SidebarTitle label="Skills" accent={accentColor} primary={primaryColor} />
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {skills.map((s) => (
                                        <span key={s} style={{
                                            fontSize: '10.5px', color: primaryColor,
                                            background: '#fff',
                                            border: `1px solid ${accentColor}44`,
                                            borderRadius: '4px', padding: '3px 9px',
                                            fontWeight: 500,
                                        }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {data.languages?.length > 0 && (
                            <div style={{ marginBottom: '22px' }}>
                                <SidebarTitle label="Languages" accent={accentColor} primary={primaryColor} />
                                {data.languages.map((l: any) => {
                                    const num = langToNum(l.level);
                                    return (
                                        <div key={l.id} style={{ marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontSize: '11.5px', color: primaryColor, fontWeight: 500 }}>{l.name}</span>
                                                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{l.level}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '3px' }}>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} style={{
                                                        flex: 1, height: '4px', borderRadius: '2px',
                                                        background: i <= num ? accentColor : '#e2e8f0',
                                                    }} />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Certifications */}
                        {data.certifications?.length > 0 && (
                            <div style={{ marginBottom: '22px' }}>
                                <SidebarTitle label="Certifications" accent={accentColor} primary={primaryColor} />
                                {data.certifications.map((cert: any) => (
                                    <div key={cert.id} style={{ marginBottom: '10px' }}>
                                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: primaryColor }}>{cert.name}</div>
                                        {cert.issuer && <div style={{ fontSize: '10px', color: '#94a3b8' }}>{cert.issuer}</div>}
                                        {cert.date && <div style={{ fontSize: '10px', color: '#94a3b8' }}>{cert.date}</div>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Interests */}
                        {data.interests?.length > 0 && (
                            <div>
                                <SidebarTitle label="Interests" accent={accentColor} primary={primaryColor} />
                                {data.interests.map((interest: string, i: number) => (
                                    <div key={i} style={{
                                        fontSize: '11px', color: '#64748b',
                                        paddingLeft: '10px', position: 'relative',
                                        marginBottom: '5px',
                                    }}>
                                        <span style={{ position: 'absolute', left: 0, color: accentColor }}>•</span>
                                        {interest}
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

// ── Small helpers ──────────────────────────────────────────────────

const SectionTitle = ({
    label, accent, primary,
}: { label: string; accent: string; primary: string }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '12px',
    }}>
        <div style={{ width: '18px', height: '3px', borderRadius: '2px', background: accent }} />
        <span style={{
            fontSize: '10.5px', fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase',
            color: primary,
        }}>
            {label}
        </span>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
    </div>
);

const SidebarTitle = ({
    label, accent, primary,
}: { label: string; accent: string; primary: string }) => (
    <div style={{
        fontSize: '9.5px', fontWeight: 700,
        letterSpacing: '2px', textTransform: 'uppercase',
        color: primary,
        borderBottom: `2px solid ${accent}`,
        paddingBottom: '4px',
        marginBottom: '12px',
        display: 'inline-block',
    }}>
        {label}
    </div>
);