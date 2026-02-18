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
