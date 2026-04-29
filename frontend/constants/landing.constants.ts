import type { Feature, HowItWorksStep, NavLink, Testimonial } from '@/types/site.types';

// ─── Site Config ──────────────────────────────────────────────────────────────

export const SITE_CONFIG = {
    name: "CareerForge AI",
    tagline: "AI-Powered Career Documents",
    description:
        "Build ATS-optimized resumes, tailor them to any job in seconds, generate cover letters and scholarship documents — all in one AI-powered platform.",
    url: "https://careerforge.ai",
    stats: {
        resumesThisMonth: "Beta Phase",
        rating: "New Release",
        totalUsers: "Join us",
    },
} as const;

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
];

// ─── Trusted By ───────────────────────────────────────────────────────────────

export const TRUSTED_UNIVERSITIES = [
    "MIT",
    "Stanford",
    "Oxford",
    "Harvard",
    "ETH Zurich",
    "IIT Delhi",
    "NUS",
];

// ─── Features ─────────────────────────────────────────────────────────────────

export const FEATURES: Feature[] = [
    {
        icon: "📄",
        title: "Resume Builder",
        description:
            "Step-by-step AI-guided resume builder with live ATS scoring. AI enhances every bullet point for impact and keyword density.",
        color: "blue",
        badge: "Free",
    },
    {
        icon: "🎯",
        title: "Job Tailoring Engine",
        description:
            "Paste any job description. Our NLP engine extracts keywords and AI rewrites your resume to match. See ATS score jump in real time.",
        color: "green",
    },
    {
        icon: "⬆️",
        title: "Resume Upload & Improve",
        description:
            "Upload your existing PDF or DOCX. AI analyzes grammar, weak verbs, missing metrics, and suggests targeted improvements.",
        color: "teal",
    },
    {
        icon: "✉️",
        title: "12 Document Types",
        description:
            "Cover letters, resignation letters, SOPs, study plans, financial explanation letters, and more — fully AI-generated.",
        color: "orange",
    },
    {
        icon: "🎓",
        title: "Scholarship Suite",
        description:
            "Dedicated templates for Fulbright, Chevening, DAAD, and more. AI writes your SOP, motivation letter, and study plan with context.",
        color: "cyan",
    },
    {
        icon: "💬",
        title: "Interview Prep",
        description:
            "AI generates behavioral and technical interview questions based on your resume and the specific job description you're targeting.",
        color: "red",
    },
    {
        icon: "🗂️",
        title: "Application Tracker",
        description:
            "Kanban-style job tracking board to manage every application, follow-up, and interview in one place.",
        color: "blue",
    },
    {
        icon: "🔗",
        title: "LinkedIn Bio Generator",
        description:
            "AI-powered LinkedIn summary, elevator pitch, and headline generator tailored to your target role and industry.",
        color: "cyan",
    },
    {
        icon: "🌐",
        title: "Portfolio Website",
        description:
            "Generate a stunning portfolio website in minutes. React-based, fully deployable, and personalized to your career story.",
        color: "teal",
    },
];

// ─── How It Works ─────────────────────────────────────────────────────────────

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
    {
        num: "1",
        title: "Create Your Profile",
        desc: "Sign up in 30 seconds. Add your experience, skills, and education once — CareerForge remembers everything.",
        gradient: "from-[rgba(59,130,246,0.15)] to-[rgba(59,130,246,0.15)]",
        border: "border-[rgba(59,130,246,0.3)]",
        color: "text-[var(--blue)]",
    },
    {
        num: "2",
        title: "Build or Upload",
        desc: "Build a polished ATS resume from scratch with AI assistance, or upload your existing resume for instant improvements.",
        gradient: "from-[rgba(34,211,238,0.1)] to-[rgba(34,211,238,0.1)]",
        border: "border-[rgba(34,211,238,0.25)]",
        color: "text-[var(--cyan)]",
    },
    {
        num: "3",
        title: "Tailor to Any Job",
        desc: "Paste a job description. AI extracts keywords and tailors your resume in 30 seconds. Watch your ATS score climb.",
        gradient: "from-[rgba(16,185,129,0.1)] to-[rgba(16,185,129,0.1)]",
        border: "border-[rgba(16,185,129,0.25)]",
        color: "text-[var(--green)]",
    },
    {
        num: "4",
        title: "Download & Apply",
        desc: "Download a pixel-perfect PDF. Generate a matching cover letter. Apply with confidence — fully optimized.",
        gradient: "from-[rgba(20,184,166,0.1)] to-[rgba(20,184,166,0.1)]",
        border: "border-[rgba(20,184,166,0.25)]",
        color: "text-[var(--teal)]",
    },
];

export const HERO_AVATARS = [
    { initial: "AK", gradient: "linear-gradient(135deg,#3b82f6,#1d4ed8)" },
    { initial: "MR", gradient: "linear-gradient(135deg,#10b981,#059669)" },
    { initial: "JS", gradient: "linear-gradient(135deg,#2dd4bf,#0d9488)" },
    { initial: "LT", gradient: "linear-gradient(135deg,#f59e0b,#d97706)" },
    { initial: "DP", gradient: "linear-gradient(135deg,#22d3ee,#0891b2)" },
];

