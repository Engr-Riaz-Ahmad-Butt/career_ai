"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { FEATURES } from "@/constants";
import type { Feature } from "@/types";

const colorClasses: Record<string, string> = {
  blue: "bg-[rgba(59,130,246,0.15)] shadow-[0_4px_12px_rgba(59,130,246,0.2)]",
  green: "bg-[rgba(16,185,129,0.15)] shadow-[0_4px_12px_rgba(16,185,129,0.2)]",
  purple: "bg-[rgba(167,139,250,0.15)] shadow-[0_4px_12px_rgba(167,139,250,0.2)]",
  orange: "bg-[rgba(245,158,11,0.15)] shadow-[0_4px_12px_rgba(245,158,11,0.2)]",
  cyan: "bg-[rgba(34,211,238,0.12)] shadow-[0_4px_12px_rgba(34,211,238,0.2)]",
  red: "bg-[rgba(248,113,113,0.12)] shadow-[0_4px_12px_rgba(248,113,113,0.2)]",
};

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -30px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={cn(
        "relative p-9 rounded-2xl border border-[var(--border)] cursor-pointer group",
        "bg-[var(--dark)] transition-all duration-[400ms]",
        "hover:bg-[rgba(59,130,246,0.06)] hover:border-[rgba(59,130,246,0.3)]",
        "hover:translate-y-[-8px] hover:scale-[1.02]",
        "hover:shadow-[0_20px_60px_rgba(59,130,246,0.2),0_0_0_1px_rgba(59,130,246,0.1)]"
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-0 transition-opacity duration-[400ms] pointer-events-none group-hover:opacity-100 rounded-2xl" />

      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--blue)] to-transparent opacity-0 transition-opacity duration-[400ms] rounded-t-2xl group-hover:opacity-100" />

      {feature.badge && (
        <div className="absolute top-4 right-4 bg-[rgba(16,185,129,0.15)] text-[var(--green)] text-[10px] font-bold px-2 py-[2px] rounded-[3px] border border-[rgba(16,185,129,0.2)]">
          {feature.badge}
        </div>
      )}

      <div
        className={cn(
          "w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl mb-5",
          "transition-all duration-[400ms] relative",
          "group-hover:translate-y-[-4px] group-hover:rotate-[5deg] group-hover:scale-110",
          colorClasses[feature.color]
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        {feature.icon}
      </div>

      <h3 className="font-[var(--font-d)] text-[15px] text-[var(--white)] mb-2">
        {feature.title}
      </h3>
      <p className="text-[13px] text-[var(--g3)] leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-[60px] sm:py-[90px] w-full">
      <div className="container mx-auto w-full max-w-6xl px-4 sm:px-8">
        <div className="inline-block text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--blue)] mb-[14px]">
          Everything You Need
        </div>
        <h2 className="font-[var(--font-d)] text-[clamp(24px,3.5vw,48px)] tracking-[-0.03em] text-[var(--white)] leading-tight max-w-[600px]">
          One platform.
          <br />
          Every career document.
        </h2>
        <p className="mt-[14px] text-[15px] font-light text-[var(--g3)] max-w-[500px] leading-relaxed">
          From ATS-optimized resumes to scholarship SOPs — build, tailor, and
          perfect every document with AI guidance.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
