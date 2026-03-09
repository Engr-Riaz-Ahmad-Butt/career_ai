// Navigation
export interface NavLink {
  name: string;
  href: string;
}

// Landing feature sections
export type FeatureColor = 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'red';

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: FeatureColor;
  badge?: string;
}

export interface HowItWorksStep {
  num: string;
  title: string;
  desc: string;
  gradient: string;
  border: string;
  color: string;
}

export interface Testimonial {
  stars: string;
  quote: string;
  avatar: string;
  name: string;
  role: string;
  badge: string;
  gradient: string;
}

// Cross-feature shared data types
export interface Document {
  id: string;
  title: string;
  category: string;
  lastModified: Date;
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

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}
