import type { Resume as BackendResume } from '@/lib/api/endpoints/resume.api';
import type { ResumeData } from '@/types';

export function toResumeData(resume: BackendResume, userId: string | undefined): ResumeData {
  return {
    id: resume.id,
    userId: userId ?? '',
    title: resume.title,
    template: resume.template,
    status: (resume.status as any) ?? 'DRAFT',
    personalInfo: {
      fullName: (resume.personalInfo as any)?.fullName ?? '',
      email: (resume.personalInfo as any)?.email ?? '',
      phone: (resume.personalInfo as any)?.phone ?? '',
      location: (resume.personalInfo as any)?.location ?? '',
      linkedin: (resume.personalInfo as any)?.linkedin,
      portfolio: (resume.personalInfo as any)?.portfolio,
      photoUrl: (resume.personalInfo as any)?.photoUrl,
    },
    summary: resume.summary ?? '',
    experience: (resume.experience as any) ?? [],
    education: (resume.education as any) ?? [],
    skills: (resume.skills as any) ?? { technical: [], soft: [] },
    certifications: (resume.certifications as any) ?? [],
    projects: (resume.projects as any) ?? [],
    languages: (resume.languages as any) ?? [],
    interests: [],
    styling: (resume.styling as any) ?? {
      spacing: { fontSize: 12, lineHeight: 1.4, sideMargin: 24, topBottomMargin: 24, entrySpacing: 10 },
      colors: { primary: '#111827', accent: '#4f46e5', applyToName: true, applyToTitle: false, applyToIcons: true, applyToBubbles: true },
      typography: { fontFamily: 'Inter', category: 'Sans' },
      headingStyle: { style: 'underline', capitalization: 'uppercase', size: 'M', icons: 'none' },
      personalDetails: { align: 'left', arrangement: 'horizontal', iconStyle: 'outline' },
      entryLayout: { style: 'default' },
    },
    atsScore: resume.atsScore,
    keywordMatch: resume.keywordMatch,
    formatScore: resume.formatScore,
    impactScore: resume.impactScore,
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt,
  };
}

