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

export * from './resume';

export interface Document {
  id: string;
  title: string;
  category: string;
  lastModified: Date;
}

// ResumeData and related types are exported from ./resume

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

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}
