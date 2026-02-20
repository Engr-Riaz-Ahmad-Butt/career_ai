import React from "react";

const FEATURES = [
  {
    title: "AI Resume Builder",
    description: "Generate professional resumes tailored to your job goals using advanced AI.",
  },
  {
    title: "Cover Letter Generator",
    description: "Create personalized cover letters that stand out to employers.",
  },
  {
    title: "ATS Optimization",
    description: "Analyze and optimize your resume for Applicant Tracking Systems.",
  },
  {
    title: "Skill Gap Analysis",
    description: "Identify and bridge skill gaps for your target roles.",
  },
  {
    title: "Job Tracker",
    description: "Track your job applications, interviews, and offers in one place.",
  },
  {
    title: "Interview Preparation",
    description: "Practice with AI-powered interview questions and feedback.",
  },
  {
    title: "Document Templates",
    description: "Browse and use modern templates for resumes, cover letters, and more.",
  },
  {
    title: "Visa & Scholarship Guidance",
    description: "Get tailored advice for international job seekers and students.",
  },
  {
    title: "Career Growth Analytics",
    description: "Visualize your progress and receive actionable career insights.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">All Features</h1>
      <div className="grid gap-8 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-6 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-400">{feature.title}</h2>
            <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
