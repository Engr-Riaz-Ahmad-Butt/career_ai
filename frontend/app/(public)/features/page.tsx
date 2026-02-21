'use client';

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FileText,
  PenTool,
  Search,
  Zap,
  Briefcase,
  Users,
  Layout,
  Globe,
  TrendingUp,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  MousePointer2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FEATURES = [
  {
    icon: FileText,
    title: "AI Resume Intelligence",
    description: "Our neural network analyzes thousands of successful resumes to generate the perfect structure and content for your specific niche.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "Instant Tailoring",
    description: "Upload a job description and watch our AI rewrite your experience in seconds to highlight exactly what that employer is looking for.",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "ATS Ghost Mode",
    description: "We use proprietary formatting techniques that ensure your resume is indexed perfectly by every major tracking system on the market.",
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Real-time Scoring",
    description: "Get an instant score on your resume's strength, relevance, and impact with actionable tips to increase your interview chances.",
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Users,
    title: "AI Interview Coaching",
    description: "Experience hyper-realistic interview simulations with an AI that adapts its questions based on your specific job role and experience.",
    color: "from-rose-500 to-red-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Layout,
    title: "Designer Templates",
    description: "Crafted by recruitment experts, our templates aren't just pretty—they're designed to be readable, professional, and high-converting.",
    color: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-500/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function FeaturesPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-purple-600/10 rounded-full blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150" />
      </div>

      {/* Navigation Padding */}
      <div className="h-24" />

      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-6 md:px-[60px]">
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium tracking-wide text-slate-300">NEXT-GEN CAREER TECHNOLOGY</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
              The unfair advantage <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 px-2">
                for your career.
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              We've automated the science of getting hired. High-fidelity tools designed to save you weeks of effort and land you at the top of the stack.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 text-lg font-semibold">
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="ghost" className="h-14 px-8 text-white hover:bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm text-lg font-medium">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Bento Showcase */}
      <section className="px-6 md:px-[60px] py-24 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for results.</h2>
              <p className="text-slate-400 text-lg">Every feature is engineered to solve a specific blocker in the modern recruitment funnel.</p>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
          >
            {/* Main Feature - Large */}
            <motion.div
              variants={item}
              className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-12 flex flex-col justify-end"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                <FileText className="w-80 h-80 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-8 border border-blue-500/20">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-bold mb-4">Centralized Job Command Center</h3>
                <p className="text-slate-400 text-xl max-w-md">The only dashboard you'll ever need. Track applications, interviews, and progress with real-time analytics.</p>
              </div>
            </motion.div>

            {/* AI Analyzer */}
            <motion.div
              variants={item}
              className="group relative overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <MousePointer2 className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-purple-400">92% PASS RATE</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Instant Analysis</h3>
                <p className="text-slate-400">Point, click, and optimize your keywords.</p>
              </div>
            </motion.div>

            {/* Templates */}
            <motion.div
              variants={item}
              className="group relative overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                  <Layout className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Designer Presets</h3>
                <p className="text-slate-400">Zero-configuration professional layouts.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Features Grid */}
      <section className="px-6 md:px-[60px] py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col gap-6 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-[1px] group-hover:scale-110 transition-transform duration-500`}>
                  <div className="w-full h-full bg-[#020617] rounded-[calc(1rem-1px)] flex items-center justify-center relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${feature.color}`} />
                    <feature.icon className="w-6 h-6 text-white relative z-10" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Performance */}
      <section className="py-24 px-6 md:px-[60px] text-center">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60"
          >
            {[
              { label: "Uptime", value: "99.9%" },
              { label: "Data Encrypted", value: "AES-256" },
              { label: "API Latency", value: "<50ms" },
              { label: "Support", value: "24/7" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Massive CTA Section */}
      <section className="py-32 px-6 md:px-[60px]">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 p-8 md:p-24 text-center group"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
            <div className="absolute -top-1/2 -right-1/4 w-[80%] h-[150%] bg-white/10 rounded-full blur-[120px] group-hover:bg-white/20 transition-colors duration-1000" />

            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-7xl font-bold text-white mb-8">Ready to outclass the competition?</h2>
              <p className="text-xl md:text-3xl text-blue-100 mb-12 font-light leading-relaxed">
                Join 10,000+ professionals using AI to build their future. No credit card required to start.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button size="lg" className="h-16 px-12 bg-white text-blue-600 hover:bg-slate-100 rounded-2xl text-xl font-bold shadow-2xl hover:translate-y-[-4px] transition-all w-full border-none">
                    Create Free Account
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-blue-100">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">10 Free Credits included</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer-like Spacer */}
      <div className="h-24 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
