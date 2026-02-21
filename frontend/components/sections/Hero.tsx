"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Play, FileText, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import Typewriter from "../ui/Typewriter";
import { SITE_CONFIG } from "@/constants";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = 1; // Keep fully clear
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1]); // Remove scale reduction

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden bg-[var(--black)]"
    >
      {/* ─── Modern Background Layer ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated Mesh Gradients */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[140px] opacity-60"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[120px] opacity-50"
        />
        <div className="absolute top-[20%] left-[30%] w-[30%] h-[30%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] opacity-40" />

        {/* Noise Overlay & Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] dark:opacity-[0.15] brightness-75 contrast-125" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container relative z-10 px-6 md:px-[60px] mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-center text-center">

          {/* ─── Premium Badge ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgb(var(--black-rgb)/0.04)] border border-[var(--border2)] backdrop-blur-xl transition-all duration-300 hover:bg-[rgb(var(--black-rgb)/0.08)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--blue)]">
                Next-Gen Career Intelligence
              </span>
              <ArrowRight className="h-3 w-3 text-blue-400 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>

          {/* ─── Headline Architecture ─── */}
          <motion.h1
            style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -50]) }}
            className="text-[clamp(2.5rem,8vw,6rem)] font-bold tracking-[-0.04em] leading-[0.95] mb-10 max-w-5xl mx-auto"
          >
            <span className="block text-[var(--white)]">Your Career,</span>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-br from-[var(--white)] via-[var(--g2)] to-[var(--g4)]">
              Redefined by AI.
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1, ease: "circOut" }}
                className="absolute -bottom-2 left-0 h-[6px] bg-gradient-to-r from-blue-600 via-cyan-400 to-transparent rounded-full opacity-60"
              />
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-[var(--font-d)] text-xl md:text-2xl text-[var(--g3)] mb-12 max-w-2xl mx-auto leading-tight"
          >
            The industry standard for building <br className="hidden md:block" />
            <span className="text-[var(--white)] font-medium">
              <Typewriter
                words={["ATS-Proof Resumes", "Impactful SOPs", "Viral Portfolios", "Winning Scholarships"]}
                typingSpeed={100}
                deletingSpeed={50}
                delayBetweenWords={2500}
              />
            </span>
          </motion.div>

          {/* ─── Action Center ─── */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-20 w-full sm:w-auto">
            <Link href="/auth/register" className="w-full sm:w-auto overflow-hidden rounded-2xl group relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 px-10 py-5 bg-[var(--blue)] text-white font-bold text-lg flex items-center justify-center gap-2 transition-transform hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)]"
              >
                Launch Your Future
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.div>
              <div className="absolute inset-0 z-0 bg-blue-500 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            </Link>

            <button className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-[rgb(var(--white-rgb)/0.03)] border border-[var(--border2)] text-[var(--white)] font-semibold transition-all hover:bg-[rgb(var(--white-rgb)/0.06)] hover:translate-y-[-2px] backdrop-blur-md">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Play className="h-4 w-4 fill-white ml-0.5" />
              </div>
              See the Forge in Action
            </button>
          </div>

          {/* ─── Social Proof / Metrics ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16 py-8 px-12 rounded-[2rem] bg-[rgb(var(--white-rgb)/0.02)] border border-[var(--border)] backdrop-blur-3xl"
          >
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2 text-[var(--white)] font-bold text-xl uppercase tracking-tighter">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                92% Success
              </div>
              <span className="text-[10px] text-[var(--g4)] font-bold uppercase tracking-widest">ATS Pass Rate</span>
            </div>

            <div className="w-[1px] h-10 bg-[var(--border2)] hidden md:block" />

            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2 text-[var(--white)] font-bold text-xl uppercase tracking-tighter">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                12k+ Hired
              </div>
              <span className="text-[10px] text-[var(--g4)] font-bold uppercase tracking-widest">Professionals Global</span>
            </div>

            <div className="w-[1px] h-10 bg-[var(--border2)] hidden md:block" />

            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2 text-[var(--white)] font-bold text-xl uppercase tracking-tighter">
                <ShieldCheck className="h-5 w-5 text-purple-500" />
                AES-256
              </div>
              <span className="text-[10px] text-[var(--g4)] font-bold uppercase tracking-widest">Encrypted Data</span>
            </div>
          </motion.div>

          {/* ─── Document in Motion (Interactive Visual) ─── */}
          <motion.div
            style={{ opacity, scale, y }}
            className="mt-24 w-full relative"
          >
            {/* Main Preview Container */}
            <div className="relative mx-auto w-full max-w-5xl rounded-[2.5rem] border border-[var(--border2)] bg-[var(--panel)]/50 backdrop-blur-md overflow-hidden shadow-2xl">
              {/* Animated Floating Assets inside visual */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 z-20 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">ATS Score</div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">98 / 100</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-10 z-20 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Sync Active</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Real-time Optimization</div>
                  </div>
                </div>
              </motion.div>

              {/* Browser Header */}
              <div className="h-12 bg-[rgb(var(--black-rgb)/0.05)] border-b border-[var(--border)] flex items-center px-6 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-800" />
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-800" />
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-800" />
                </div>
                <div className="ml-4 h-6 px-4 rounded-md bg-[rgb(var(--black-rgb)/0.05)] text-[10px] text-[var(--g4)] flex items-center">
                  app.careerforge.ai/builder/editor-mode
                </div>
              </div>

              {/* Visual Content (Skeleton UI representation of 'Forge') */}
              <div className="p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="h-4 w-24 bg-blue-500/20 rounded-full" />
                  <div className="h-12 w-full bg-[rgb(var(--black-rgb)/0.03)] border border-[var(--border)] rounded-xl" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-[rgb(var(--black-rgb)/0.02)] rounded-md" />
                    <div className="h-4 w-[90%] bg-[rgb(var(--black-rgb)/0.02)] rounded-md" />
                    <div className="h-4 w-[95%] bg-[rgb(var(--black-rgb)/0.02)] rounded-md" />
                  </div>
                  <div className="pt-6 grid grid-cols-2 gap-4">
                    <div className="h-20 bg-[rgb(var(--black-rgb)/0.02)] rounded-2xl border border-[var(--border)]" />
                    <div className="h-20 bg-[rgb(var(--black-rgb)/0.02)] rounded-2xl border border-[var(--border)]" />
                  </div>
                </div>

                <div className="hidden md:block relative bg-[rgb(var(--black-rgb)/0.01)] rounded-2xl border border-[var(--border)] p-8 min-h-[300px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
                  <div className="flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-32 bg-[var(--g5)] rounded-full" />
                      <Sparkles className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border-4 border-dashed border-blue-600/30 flex items-center justify-center mb-4"
                      >
                        <Sparkles className="h-8 w-8 text-blue-600" />
                      </motion.div>
                      <div className="text-[var(--white)] font-bold mb-1">AI Recommendation Engine</div>
                      <div className="text-[11px] text-[var(--g4)]">Injecting 14 keywords for Google Cloud Architect role</div>
                    </div>
                    <div className="mt-auto h-10 w-full bg-blue-600 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Background Glow for visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-blue-600/10 blur-[160px] pointer-events-none -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
