export type ResumeStatus = 'DRAFT' | 'COMPLETE';
export type CVMode = 'manual' | 'ai-generate' | 'improve-cv' | 'prompt-to-cv';

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    category: 'classic' | 'modern' | 'minimal' | 'creative';
    icon?: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    layout: 'single-column' | 'two-column' | 'sidebar';
    features: string[];
}

export interface ResumeExperience {
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements?: string[];
    currentlyWorking?: boolean;
}

export interface ResumeEducation {
    id: string;
    school: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    graduationDate?: string;
    location?: string;
    gpa?: string;
}

export interface ResumeSkills {
    technical: string[];
    soft: string[];
    tools?: string[];
    languages?: string[];
}

export interface ResumeProject {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
}

export interface ResumeCertification {
    id: string;
    name: string;
    issuer: string;
    date?: string;
    dateIssued?: string;
    expirationDate?: string;
}

export interface ResumeLanguage {
    id: string;
    name: string;
    level: string;
}

export interface ResumeStyling {
    spacing: {
        fontSize: number;
        lineHeight: number;
        sideMargin: number;
        topBottomMargin: number;
        entrySpacing: number;
    };
    colors: {
        primary: string;
        accent: string;
        applyToName: boolean;
        applyToTitle: boolean;
        applyToIcons: boolean;
        applyToBubbles: boolean;
    };
    typography: {
        fontFamily: string;
        category: 'Serif' | 'Sans' | 'Mono';
    };
    headingStyle: {
        style: string;
        capitalization: 'capitalize' | 'uppercase';
        size: 'S' | 'M' | 'L' | 'XL';
        icons: 'none' | 'outline' | 'filled';
    };
    personalDetails: {
        align: 'left' | 'center' | 'right';
        arrangement: 'horizontal' | 'vertical';
        iconStyle: string;
    };
    entryLayout: {
        style: string;
    };
}

export interface ResumeData {
    id: string;
    userId: string;
    title: string;
    template: string;
    status: ResumeStatus;
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        linkedin?: string;
        portfolio?: string;
        photoUrl?: string;
    };
    summary: string;
    experience: ResumeExperience[];
    education: ResumeEducation[];
    skills: ResumeSkills;
    certifications: ResumeCertification[];
    projects: ResumeProject[];
    languages: ResumeLanguage[];
    interests: string[];
    styling: ResumeStyling;
    atsScore?: number;
    keywordMatch?: number;
    formatScore?: number;
    impactScore?: number;
    createdAt: string | Date;
    updatedAt: string | Date;
}
