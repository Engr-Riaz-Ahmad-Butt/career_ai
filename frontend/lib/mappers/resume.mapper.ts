import type { Resume as BackendResume } from '@/lib/api/endpoints/resume.api';
import type { CreateResumeRequest } from '@/lib/api/endpoints/resume.api';
import type { ResumeData } from '@/types/resume';

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
  const rawSkills = resume.skills;
  const skillsData = Array.isArray(rawSkills)
    ? (rawSkills as { category: string; items: string[] }[]).reduce(
        (acc, { category, items }) => {
          acc[category as keyof typeof acc] = items ?? [];
          return acc;
        },
        { technical: [] as string[], soft: [] as string[], tools: [] as string[], languages: [] as string[] }
      )
    : typeof rawSkills === 'object' && rawSkills !== null
      ? (rawSkills as Record<string, string[]>)
      : { technical: [], soft: [] };
  const certificationsData = extractArray(resume.certifications);
  const projectsData = extractArray(resume.projects);
  const languagesData = extractArray(resume.languages);

  const experienceWithPosition = experienceData.map((e: any) => ({
    ...e,
    id: e.id ?? '',
    position: e.position ?? e.title ?? '',
    company: e.company ?? '',
    startDate: e.startDate ?? '',
    endDate: e.endDate ?? '',
    location: e.location,
    description: e.description ?? '',
    achievements: e.achievements ?? [],
  }));

  return {
    id: resume.id,
    userId: userId ?? '',
    title: resume.title,
    template: resume.template,
    status: (resume.status as any) ?? 'DRAFT',
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
    experience: experienceWithPosition,
    education: educationData as any[],
    skills: skillsData as any,
    certifications: certificationsData as any[],
    projects: projectsData as any[],
    languages: languagesData as any[],
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

/** Convert frontend resume payload to API shape: experience with `title`, skills as array. */
export function toApiResumePayload(
  data: Partial<ResumeData> | (CreateResumeRequest & { experience?: any[]; skills?: any })
): CreateResumeRequest {
  const experience = data.experience as any[] | undefined;
  const skills = data.skills as Record<string, string[]> | { category: string; items: string[] }[] | undefined;

  const apiExperience = (experience ?? [])
    .map((e) => ({
      title: (e.title ?? e.position ?? '').trim(),
      company: (e.company ?? '').trim(),
      location: e.location,
      startDate: (e.startDate ?? '').trim(),
      endDate: e.endDate,
      current: e.current ?? e.currentlyWorking,
      description: e.description,
      achievements: e.achievements,
    }))
    .filter((e) => e.title !== '');

  const apiSkills = Array.isArray(skills)
    ? skills
    : skills && typeof skills === 'object' && !Array.isArray(skills)
      ? Object.entries(skills)
          .filter(([, items]) => Array.isArray(items))
          .map(([category, items]) => ({ category, items: items as string[] }))
      : undefined;

  // Strip undefined/empty values from personalInfo so URL fields don't fail backend validation
  const rawInfo = (data as any).personalInfo as Record<string, unknown> | undefined;
  const apiPersonalInfo = rawInfo
    ? Object.fromEntries(Object.entries(rawInfo).filter(([, v]) => v !== undefined && v !== ''))
    : undefined;

  return {
    ...data,
    personalInfo: apiPersonalInfo,
    experience: apiExperience.length ? apiExperience : undefined,
    skills: apiSkills,
  } as CreateResumeRequest;
}


