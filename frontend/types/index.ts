// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavLink {
    name: string;
    href: string;
}

// ─── Features Section ─────────────────────────────────────────────────────────

export type FeatureColor = "blue" | "green" | "purple" | "orange" | "cyan" | "red";

export interface Feature {
    icon: string;
    title: string;
    description: string;
    color: FeatureColor;
    badge?: string;
}

// ─── How It Works Section ─────────────────────────────────────────────────────

export interface HowItWorksStep {
    num: string;
    title: string;
    desc: string;
    gradient: string;
    border: string;
    color: string;
}

// ─── Testimonials Section ─────────────────────────────────────────────────────

export interface Testimonial {
    stars: string;
    quote: string;
    avatar: string;
    name: string;
    role: string;
    badge: string;
    gradient: string;
}

export interface Resume {
  id: string;
  title: string;
  lastModified: Date;
  atsScore: number;
  keywordMatch: number;
}

export interface Document {
  id: string;
  title: string;
  category: string;
  lastModified: Date;
}

export interface ResumeData {
  contact: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    dateIssued: string;
    expirationDate?: string;
  }>;
}

export interface TailorResult {
  atsScore: number;
  keywordMatch: number;
  missingKeywords: string[];
  foundKeywords: string[];
  suggestions: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: Date;
  image: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}
