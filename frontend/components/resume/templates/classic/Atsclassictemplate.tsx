'use client';

import React from 'react';

import { TemplatePreviewProps, SAMPLE_DATA, ResumeContainer } from '@/components/resume/templates/shared';

export function AtsClassicTemplatePreview({ template, data = SAMPLE_DATA }: TemplatePreviewProps) {
    const styling = data?.styling || SAMPLE_DATA.styling;
    const primaryColor = styling?.colors?.primary || '#111827';
    const accentColor = styling?.colors?.accent || '#1d4ed8';
    const allSkills = [...(data.skills?.technical || []), ...(data.skills?.soft || [])];

    // ── Section heading: bold label + full-width underline ──────────
    const SectionHead = ({ label }: { label: string }) => (
        <div style={{ marginTop: '18px', marginBottom: '8px' }}>
            <div style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: primaryColor,
                paddingBottom: '4px',
                borderBottom: `2px solid ${primaryColor}`,
            }}>
                {label}
            </div>
        </div>
    );

    // ── Entry row: title left, date right ──────────────────────────
    const EntryHeader = ({
        left, subleft, right, subright,
    }: { left: string; subleft?: string; right?: string; subright?: string }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
            <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: primaryColor }}>{left}</div>
                {subleft && <div style={{ fontSize: '11.5px', color: '#4b5563', fontStyle: 'italic' }}>{subleft}</div>}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                {right && <div style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>{right}</div>}
                {subright && <div style={{ fontSize: '10.5px', color: '#9ca3af' }}>{subright}</div>}
            </div>
        </div>
    );

    // ── Bullet point ───────────────────────────────────────────────
    const Bullet = ({ text }: { text: string }) => (
        <div style={{
            display: 'flex',
            gap: '7px',
            fontSize: '11.5px',
            color: '#374151',
            lineHeight: 1.65,
            marginBottom: '3px',
            paddingLeft: '2px',
        }}>
            <span style={{ color: primaryColor, fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>●</span>
            <span>{text}</span>
        </div>
    );

    return (
        <ResumeContainer styling={styling}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
      `}</style>

            <div style={{
                fontFamily: "'Source Sans 3', sans-serif",
                background: '#ffffff',
                width: '100%',
                minHeight: '100%',
                padding: '36px 44px',
                color: '#111827',
                textAlign: 'left',
                boxSizing: 'border-box',
            }}>

                {/* ══ HEADER ══════════════════════════════════════════════ */}
                <div style={{ textAlign: 'center', marginBottom: '14px', paddingBottom: '14px', borderBottom: `2px solid ${primaryColor}` }}>
                    <h1 style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: '28px',
                        fontWeight: 700,
                        color: primaryColor,
                        letterSpacing: '0.3px',
                        marginBottom: '6px',
                        lineHeight: 1.1,
                    }}>
                        {data.personalInfo.fullName}
                    </h1>

                    {/* Contact bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: '4px 0px',
                        fontSize: '11px',
                        color: '#4b5563',
                    }}>
                        {[
                            data.personalInfo.location,
                            data.personalInfo.email,
                            data.personalInfo.phone,
                            data.personalInfo.linkedin?.replace('https://', ''),
                            data.personalInfo.portfolio?.replace('https://', ''),
                        ].filter(Boolean).map((val, i, arr) => (
                            <span key={val} style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: accentColor }}>{val}</span>
                                {i < arr.length - 1 && (
                                    <span style={{ margin: '0 8px', color: '#d1d5db' }}>|</span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ══ SUMMARY ═════════════════════════════════════════════ */}
                {data.summary && (
                    <>
                        <SectionHead label="Professional Summary" />
                        <p style={{ fontSize: '11.5px', color: '#374151', lineHeight: 1.75, marginBottom: '2px' }}>
                            {data.summary}
                        </p>
                    </>
                )}

                {/* ══ WORK EXPERIENCE ═════════════════════════════════════ */}
                {data.experience?.length > 0 && (
                    <>
                        <SectionHead label="Work Experience" />
                        {data.experience.map((job, idx) => (
                            <div key={job.id} style={{ marginBottom: idx < data.experience.length - 1 ? '14px' : '2px' }}>
                                <EntryHeader
                                    left={job.company}
                                    subleft={job.position}
                                    right={`${job.startDate} — ${job.endDate}`}
                                    subright={job.location}
                                />
                                {job.description && (
                                    <Bullet text={job.description} />
                                )}
                                {job.achievements?.map((ach: string, i: number) => (
                                    <Bullet key={i} text={ach} />
                                ))}
                            </div>
                        ))}
                    </>
                )}

                {/* ══ PROJECT EXPERIENCE ══════════════════════════════════ */}
                {data.projects?.length > 0 && (
                    <>
                        <SectionHead label="Project Experience" />
                        {data.projects.map((proj: any, idx: number) => (
                            <div key={proj.id} style={{ marginBottom: idx < data.projects.length - 1 ? '12px' : '2px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: primaryColor }}>{proj.name}</span>
                                        {proj.techStack && (
                                            <span style={{ fontSize: '10.5px', color: '#6b7280', fontStyle: 'italic' }}>
                                                {Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack}
                                            </span>
                                        )}
                                    </div>
                                    {proj.url && (
                                        <span style={{ fontSize: '10.5px', color: accentColor, flexShrink: 0, marginLeft: '8px' }}>
                                            [{proj.url.replace('https://', '')}]
                                        </span>
                                    )}
                                </div>
                                {proj.description && <Bullet text={proj.description} />}
                                {proj.achievements?.map((ach: string, i: number) => (
                                    <Bullet key={i} text={ach} />
                                ))}
                            </div>
                        ))}
                    </>
                )}

                {/* ══ TECHNICAL SKILLS ════════════════════════════════════ */}
                {allSkills.length > 0 && (
                    <>
                        <SectionHead label="Technical Skills" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {/* Technical skills */}
                            {data.skills?.technical && data.skills.technical.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px', fontSize: '11.5px', color: '#374151', lineHeight: 1.65 }}>
                                    <span style={{ fontWeight: 700, color: primaryColor, flexShrink: 0 }}>Core Stack:</span>
                                    <span>{data.skills.technical.join(', ')}</span>
                                </div>
                            )}
                            {/* Soft skills as Tools/Other if present */}
                            {data.skills?.soft && data.skills.soft.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px', fontSize: '11.5px', color: '#374151', lineHeight: 1.65 }}>
                                    <span style={{ fontWeight: 700, color: primaryColor, flexShrink: 0 }}>Other Skills:</span>
                                    <span>{data.skills.soft.join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ══ CERTIFICATIONS ══════════════════════════════════════ */}
                {data.certifications?.length > 0 && (
                    <>
                        <SectionHead label="Certifications" />
                        {data.certifications.map((cert: any) => (
                            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#374151' }}>{cert.name}</span>
                                    {cert.issuer && (
                                        <span style={{ fontSize: '11px', color: '#6b7280' }}>| {cert.issuer}</span>
                                    )}
                                </div>
                                {cert.date && (
                                    <span style={{ fontSize: '10.5px', color: '#9ca3af', flexShrink: 0, marginLeft: '8px' }}>{cert.date}</span>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {/* ══ EDUCATION ═══════════════════════════════════════════ */}
                {data.education?.length > 0 && (
                    <>
                        <SectionHead label="Education" />
                        {data.education.map((ed) => (
                            <div key={ed.id} style={{ marginBottom: '8px' }}>
                                <EntryHeader
                                    left={ed.school}
                                    subleft={ed.degree}
                                    right={`${ed.startDate} — ${ed.endDate}`}
                                    subright={ed.location}
                                />
                                {(ed as any).gpa && (
                                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px', paddingLeft: '2px' }}>
                                        GPA: {(ed as any).gpa}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {/* ══ LANGUAGES ═══════════════════════════════════════════ */}
                {data.languages?.length > 0 && (
                    <>
                        <SectionHead label="Languages" />
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            {data.languages.map((l: any) => (
                                <div key={l.id} style={{ fontSize: '11.5px', color: '#374151' }}>
                                    <span style={{ fontWeight: 600 }}>{l.name}</span>
                                    {l.level && <span style={{ color: '#6b7280' }}> — {l.level}</span>}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ══ INTERESTS ═══════════════════════════════════════════ */}
                {data.interests?.length > 0 && (
                    <>
                        <SectionHead label="Interests" />
                        <div style={{ fontSize: '11.5px', color: '#374151', lineHeight: 1.65 }}>
                            {data.interests.join(' · ')}
                        </div>
                    </>
                )}

            </div>
        </ResumeContainer>
    );
}
