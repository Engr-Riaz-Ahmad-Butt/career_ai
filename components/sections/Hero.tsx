"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Typewriter from "../ui/Typewriter";
import { HERO_AVATARS, SITE_CONFIG } from "@/constants";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 pt-[100px] pb-10 relative overflow-hidden text-center w-full">
      {/* Background gradients (static for faster paint) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[900px] h-[60vw] max-h-[600px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.12)_0%,transparent_70%)] pointer-events-none will-change-auto" />
      <div className="absolute bottom-0 left-[5vw] w-[50vw] max-w-[500px] h-[40vw] max-h-[400px] bg-[radial-gradient(ellipse,rgba(34,211,238,0.06)_0%,transparent_70%)] pointer-events-none will-change-auto" />
      <div className="container mx-auto w-full max-w-6xl flex flex-col items-center">

      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)] text-xs font-medium text-[var(--cyan)] mb-6"
      >
        <div className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)] animate-pulse" />
        Powered by Gemini AI & Claude Sonnet
      </motion.div> */}

      <h1
        className="font-[var(--font-d)] text-[clamp(28px,6vw,48px)] leading-[1.1] tracking-[-0.04em] max-w-full sm:max-w-[700px] md:max-w-[900px] mx-auto px-2 sm:px-0"
        style={{ transition: 'none' }}
      >
        <span className="block text-[var(--white)] mb-2">Build AI-Powered</span>
        <span className="block text-[var(--white)] mb-3 min-h-[1.2em]">
          <Typewriter
            words={[
              "Resumes",
              "Cover Letters",
              "CVs",
              "SOPs",
              "Scholarships",
              "LinkedIn Bios",
              "Portfolios",
            ]}
            typingSpeed={120}
            deletingSpeed={80}
            delayBetweenWords={2000}
          />
        </span>
        <span className="block text-[var(--white)] relative">
          That Get You Hired
          <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-[120px] sm:w-[180px] h-1 bg-gradient-to-r from-[#60a5fa] via-[#22d3ee] to-[#10b981] rounded-[2px]" />
        </span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-6 sm:mt-8 text-[clamp(15px,3vw,19px)] font-normal text-[rgba(156,163,175,0.9)] max-w-full sm:max-w-[580px] leading-relaxed tracking-[-0.01em] mx-auto px-2 sm:px-0"
      >
        {SITE_CONFIG.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-8 sm:mt-10 flex gap-3 sm:gap-[14px] items-center flex-wrap justify-center w-full"
      >
        <Link
          href="/auth/signup"
          className="px-6 sm:px-[30px] py-3 sm:py-[13px] rounded-[10px] font-[var(--font-d)] text-sm text-white bg-gradient-to-br from-[var(--blue)] to-[var(--blue-dim)] border-none cursor-pointer transition-all duration-[250ms] shadow-[0_0_40px_rgba(59,130,246,0.4)] inline-block hover:translate-y-[-2px] hover:shadow-[0_6px_50px_rgba(59,130,246,0.6)]"
        >
          Start for Free — No Credit Card
        </Link>
        <button className="px-6 sm:px-[30px] py-3 sm:py-[13px] rounded-[10px] font-[var(--font-b)] text-sm text-[var(--g2)] bg-[rgba(255,255,255,0.05)] border border-[var(--border2)] cursor-pointer transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-white">
          Watch 2-min Demo →
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-10 flex items-center gap-3 sm:gap-5 flex-wrap justify-center w-full"
      >
        <div className="flex">
          {HERO_AVATARS.map((avatar, i) => (
            <div
              key={i}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[var(--dark)] -ml-2 first:ml-0 flex items-center justify-center text-[10px] font-bold"
              style={{ background: avatar.gradient }}
            >
              {avatar.initial}
            </div>
          ))}
        </div>
        <div className="text-xs text-[var(--g3)]">
          <strong className="text-white">{SITE_CONFIG.stats.resumesThisMonth}</strong> resumes this month
        </div>
        <div className="w-[1px] h-5 bg-[var(--border2)] hidden sm:block" />
        <div className="text-[var(--orange)] text-xs">★★★★★</div>
        <div className="text-xs text-[var(--g3)]">
          <strong className="text-white">{SITE_CONFIG.stats.rating}</strong> / 5.0
        </div>
      </motion.div>

      {/* Product Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-12 w-full max-w-full sm:max-w-3xl md:max-w-5xl relative px-2 sm:px-0 mx-auto"
        style={{
          animation: "float 4s ease-in-out 1.2s infinite",
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="relative z-[1] bg-[var(--panel)] border border-[var(--border2)] rounded-[14px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]">
          {/* Browser bar */}
          <div className="bg-[rgba(255,255,255,0.03)] border-b border-[var(--border)] px-3 sm:px-[18px] py-2 sm:py-[10px] flex items-center gap-2 sm:gap-[7px]">
            <div className="w-2.5 h-2.5 sm:w-[10px] sm:h-[10px] rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 sm:w-[10px] sm:h-[10px] rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 sm:w-[10px] sm:h-[10px] rounded-full bg-[#28c840]" />
            <div className="flex-1 ml-2 sm:ml-[10px] bg-[rgba(255,255,255,0.05)] border border-[var(--border)] rounded-[5px] px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] text-[var(--g3)] max-w-[180px] sm:max-w-[280px] text-center truncate">
              app.careerforge.ai/dashboard
            </div>
          </div>

          {/* Dashboard preview content */}
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] h-[220px] sm:h-[380px]">
            {/* Sidebar */}
            <div className="bg-[rgba(0,0,0,0.3)] border-r border-[var(--border)] p-2 sm:p-4 flex flex-col gap-[3px] min-w-0">
              <div className="font-[var(--font-d)] text-[11px] sm:text-[13px] text-[var(--blue)] px-2 pb-2 sm:pb-[14px] mb-[3px] border-b border-[var(--border)]">
                CareerForge
              </div>
              <div className="px-2 sm:px-[10px] py-1.5 sm:py-[7px] rounded-[5px] text-[10px] sm:text-[11px] flex items-center gap-1.5 sm:gap-[7px] text-[var(--blue)] bg-[rgba(59,130,246,0.15)]">
                <span>⊞</span> Dashboard
              </div>
              <div className="px-2 sm:px-[10px] py-1.5 sm:py-[7px] rounded-[5px] text-[10px] sm:text-[11px] flex items-center gap-1.5 sm:gap-[7px] text-[var(--g3)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--g2)] transition-all cursor-pointer">
                <span>📄</span> Resume Builder
              </div>
              <div className="px-2 sm:px-[10px] py-1.5 sm:py-[7px] rounded-[5px] text-[10px] sm:text-[11px] flex items-center gap-1.5 sm:gap-[7px] text-[var(--g3)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--g2)] transition-all cursor-pointer">
                <span>🎯</span> AI Tailor
              </div>
            </div>

            {/* Main content */}
            <div className="p-2 sm:p-[18px] flex flex-col gap-2 sm:gap-3 overflow-hidden min-w-0">
              <div>
                <div className="font-[var(--font-d)] text-xs sm:text-sm text-white">
                  Welcome back, Alex 👋
                </div>
                <div className="text-[9px] sm:text-[10px] text-[var(--g3)] mt-1 sm:mt-[2px]">
                  Your resume score improved by 18 points this week
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                {[
                  { label: "ATS Score", value: "87", change: "↑ +18 this week", color: "var(--green)" },
                  { label: "Resumes", value: "4", change: "2 tailored", color: "var(--blue)" },
                  { label: "Docs Made", value: "11", change: "3 cover letters", color: "var(--purple)" },
                  { label: "Credits Left", value: "142", change: "Pro plan", color: "var(--orange)" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-[rgba(255,255,255,0.03)] border border-[var(--border)] rounded-[9px] p-2 sm:p-[10px] min-w-0"
                  >
                    <div className="text-[8px] sm:text-[9px] text-[var(--g3)] uppercase tracking-[0.08em]">
                      {stat.label}
                    </div>
                    <div
                      className="font-[var(--font-d)] text-base sm:text-xl mt-1 sm:mt-[3px]"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[8px] sm:text-[9px] text-[var(--green)] mt-1 sm:mt-[2px]">
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
