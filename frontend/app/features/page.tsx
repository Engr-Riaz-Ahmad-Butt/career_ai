'use client';

import React from "react";
import { motion } from "framer-motion";
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
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FEATURES = [
  {
    icon: FileText,
    title: "AI Resume Builder",
    description: "Generate ATS-friendly resumes tailored to your specific job goals using our advanced AI technology.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: PenTool,
    title: "Cover Letter Generator",
    description: "Create personalized, compelling cover letters that instantly grab employers' attention.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Search,
    title: "ATS Optimization",
    description: "Real-time analysis to ensure your resume passes through Applicant Tracking Systems effortlessly.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Skill Gap Analysis",
    description: "Identify missing skills for your target roles and get personalized learning recommendations.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Briefcase,
    title: "Job Tracker",
    description: "Organize your job search with a centralized dashboard for applications, interviews, and offers.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: Users,
    title: "Interview Prep",
    description: "Practice with AI-simulated interviews and get instant feedback to improve your performance.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Layout,
    title: "Modern Templates",
    description: "Choose from a gallery of professionally designed, customizable templates for every industry.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Globe,
    title: "Visa Guidance",
    description: "Expert advice and resources for international job seekers navigating visa requirements.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    icon: TrendingUp,
    title: "Career Analytics",
    description: "Visualize your career progress with actionable insights and data-driven growth strategies.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2" />
              Powering Your Career Journey
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Everything You Need to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Land Your Dream Job
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
              A complete toolkit designed to accelerate your career growth. From resume building to interview prep, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/resume-builder">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5 }}
                className="group relative p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              { label: "Resumes Created", value: "10,000+" },
              { label: "Interviews Secured", value: "5,000+" },
              { label: "Success Rate", value: "98%" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-16 text-center text-white shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Accelerate Your Career?</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
                Join thousands of professionals who have successfully landed their dream jobs using our AI-powered platform.
              </p>
              <Link href="/resume-builder">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0">
                  Build Your Resume Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
