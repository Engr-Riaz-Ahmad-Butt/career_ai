"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Search,
    ArrowRight,
    Layout,
    Zap,
    CheckCircle2,
    FileText,
    Award,
    Filter
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = ["Popular", "Simple", "Modern", "Creative"];

const TEMPLATES = [
    {
        id: "atlantic-blue",
        name: "Atlantic Blue",
        category: "Modern",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop",
        description: "Executive-ready with a professional sidebar and high impact layout.",
        tags: ["Executive", "Corporate"]
    },
    {
        id: "classic",
        name: "Classic",
        category: "Simple",
        image: "https://images.unsplash.com/photo-1544716124-05152f9f8266?q=80&w=1000&auto=format&fit=crop",
        description: "The timeless standard. Minimalist, clean, and highly readable for all roles.",
        tags: ["Minimalist", "Universal"]
    },
    {
        id: "mercury",
        name: "Mercury",
        category: "Popular",
        image: "https://images.unsplash.com/photo-1626197031507-c17099753214?q=80&w=1000&auto=format&fit=crop",
        description: "Dynamic design with a focused header area to highlight your profile.",
        tags: ["Tech", "Leadership"]
    },
    {
        id: "executive",
        name: "Executive",
        category: "Creative",
        image: "https://images.unsplash.com/photo-1633526543814-9718c8922b7c?q=80&w=1000&auto=format&fit=crop",
        description: "Sophisticated data-driven layout for senior management and C-suite.",
        tags: ["Senior", "Impact"]
    },
    {
        id: "harvard",
        name: "Harvard",
        category: "Simple",
        image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=1000&auto=format&fit=crop",
        description: "Academic excellence in paper form. Perfect for researchers and educators.",
        tags: ["Academic", "Traditional"]
    },
    {
        id: "leaves",
        name: "Leaves",
        category: "Creative",
        image: "https://images.unsplash.com/photo-1603201667141-5a2d4c673378?q=80&w=1000&auto=format&fit=crop",
        description: "Artistic and organic elements for designers and creative thinkers.",
        tags: ["Art", "Portfolio"]
    }
];

export default function TemplatesPage() {
    const [activeCategory, setActiveCategory] = useState("Popular");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTemplates = TEMPLATES.filter(template => {
        const matchesCategory = activeCategory === "Popular" || template.category === activeCategory;
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[var(--black)] relative overflow-hidden">
            {/* Background Polish */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 px-6 md:px-[60px] mx-auto max-w-7xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8 text-[11px] font-bold tracking-widest uppercase text-[var(--g4)]">
                    <Link href="/" className="hover:text-[var(--blue)] transition-colors">Home</Link>
                    <span className="opacity-30">/</span>
                    <span className="text-[var(--blue)]">Resume Templates</span>
                </div>

                {/* Header Section */}
                <div className="max-w-4xl mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-[-0.04em] leading-[1.1] text-[var(--white)] mb-6"
                    >
                        Free Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)]">Templates</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-[var(--g3)] leading-relaxed max-w-2xl"
                    >
                        Choose an ATS-ready resume template in your preferred style and format.
                        Try our <span className="text-[var(--white)] font-semibold">free online resume builder</span> and enjoy unlimited PDF downloads.
                        <br />
                        No paywall. No watermarks. No hidden fees. Yes, really 🚀
                    </motion.p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                    <div className="flex flex-wrap items-center gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${activeCategory === cat
                                        ? "bg-[var(--white)] text-[var(--black)] border-[var(--white)] shadow-lg shadow-white/5"
                                        : "bg-[rgb(var(--white-rgb)/0.03)] text-[var(--g3)] border-[var(--border)] hover:border-[var(--border2)] hover:bg-[rgb(var(--white-rgb)/0.06)]"
                                    }`}
                            >
                                {cat === activeCategory && <Sparkles className="inline-block h-3.5 w-3.5 mr-2 mb-0.5" />}
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--g4)] transition-colors group-focus-within:text-[var(--blue)]" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[rgb(var(--white-rgb)/0.03)] border border-[var(--border)] text-[var(--white)] placeholder:text-[var(--g4)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20 focus:border-[var(--blue)] transition-all"
                        />
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    <AnimatePresence mode="popLayout">
                        {filteredTemplates.map((template, index) => (
                            <motion.div
                                layout
                                key={template.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="group flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[1/1.4] rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:border-[var(--blue)]/30 transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--black)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                                    <img
                                        src={template.image}
                                        alt={template.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Actions Overlay */}
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <Link
                                            href={`/templates/${template.id}`}
                                            className="px-8 py-3 rounded-xl bg-[var(--blue)] text-white font-bold text-sm flex items-center gap-2 hover:bg-blue-500 transition-colors shadow-2xl"
                                        >
                                            Use Template
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <button className="px-8 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-colors">
                                            Quick Preview
                                        </button>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[var(--black)]/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                                        {template.category}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="mt-6">
                                    <h3 className="text-xl font-bold text-[var(--white)] mb-2 transition-colors group-hover:text-[var(--blue)]">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-[var(--g3)] leading-relaxed mb-4">
                                        {template.description}
                                    </p>
                                    <div className="flex gap-2">
                                        {template.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold text-[var(--g4)] px-2 py-1 rounded bg-[rgb(var(--white-rgb)/0.03)] border border-[var(--border)] uppercase tracking-tight">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="py-32 text-center">
                        <Layout className="h-12 w-12 text-[var(--g4)] mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-[var(--white)] mb-2">No templates found</h3>
                        <p className="text-[var(--g3)]">Try adjusting your search or category filter.</p>
                    </div>
                )}

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 text-center relative overflow-hidden"
                >
                    <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-[var(--white)] mb-6">Need more than a template?</h2>
                        <p className="text-[var(--g3)] mb-10 text-lg">
                            Our AI engine can build your entire resume from scratch, optimizing it for every specific job description you target.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/register" className="px-8 py-4 rounded-xl bg-[var(--blue)] text-white font-bold shadow-xl hover:translate-y-[-2px] transition-all">
                                Try AI Builder Free
                            </Link>
                            <button className="px-8 py-4 rounded-xl bg-[rgb(var(--white-rgb)/0.03)] text-[var(--white)] font-bold border border-[var(--border2)] hover:bg-[rgb(var(--white-rgb)/0.06)] transition-all">
                                See How it Works
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
