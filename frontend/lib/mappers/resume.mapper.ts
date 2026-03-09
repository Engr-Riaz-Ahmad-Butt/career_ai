import type { Resume as BackendResume } from '@/lib/api/endpoints/resume.api';
import type { ResumeData } from '@/types';

// Helper function to safely extract typed values
function extractPersonalInfo(data: unknown): Record<string, unknown> {
  if (typeof data === 'object' && data !== null) {
    return data as Record<string, unknown>;
  }
  return {};
}

function extractArray<T>(data: unknown, fallback: T[] = []): T[] {
  return Array.isArray(data) ? data : fallback;
}

export function toResumeData(resume: BackendResume, userId: string | undefined): ResumeData {
  const personalData = extractPersonalInfo(resume.personalInfo);
  const experienceData = extractArray(resume.experience);
  const educationData = extractArray(resume.education);
  const skillsData = typeof resume.skills === 'object' && resume.skills !== null ? resume.skills : { technical: [], soft: [] };
  const certificationsData = extractArray(resume.certifications);
  const projectsData = extractArray(resume.projects);
  const languagesData = extractArray(resume.languages);

  return {
    id: resume.id,
    userId: userId ?? '',
    title: resume.title,
    template: resume.template,
    status: (resume.status as string | undefined) ?? 'DRAFT',
    personalInfo: {
      fullName: String(personalData.fullName ?? ''),
      email: String(personalData.email ?? ''),
      phone: String(personalData.phone ?? ''),
      location: String(personalData.location ?? ''),
      linkedin: personalData.linkedin as string | undefined,
      portfolio: personalData.portfolio as string | undefined,
      photoUrl: personalData.photoUrl as string | undefined,
    },
    summary: resume.summary ?? '',
    experience: experienceData,
    education: educationData,
    skills: skillsData as { technical: string[]; soft: string[] },
    certifications: certificationsData,
    projects: projectsData,
    languages: languagesData,
    interests: [],
    styling: (resume.styling as Record<string, unknown>) ?? {
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

