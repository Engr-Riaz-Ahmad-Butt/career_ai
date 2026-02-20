'use client';

import { ResumeTemplate } from '@/lib/resume-templates';
import React from 'react';

interface TemplatePreviewProps {
  template: ResumeTemplate;
  isSelected: boolean;
}

const ResumeContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[800px] min-h-[1132px] bg-white shadow-md mx-auto origin-top transition-transform">
    {children}
  </div>
);

export function ClassicProfessionalPreview({ template }: TemplatePreviewProps) {
  return (
    <ResumeContainer>
      <div className="w-full h-full p-12 text-slate-900 space-y-8 text-left">
        <div className="pb-6 border-b-4" style={{ borderColor: template.colors.accent }}>
          <h2 className="text-4xl font-bold" style={{ color: template.colors.primary }}>
            John Doe
          </h2>
          <p className="text-lg text-slate-600 mt-2">john@example.com | (555) 123-4567 | San Francisco, CA</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-xl uppercase tracking-wider" style={{ color: template.colors.primary }}>
            Professional Summary
          </h3>
          <p className="text-lg text-slate-700 leading-relaxed">
            Experienced Senior Software Engineer with a proven track record of developing innovative solutions and leading high-performing teams. Expert in React, Node.js, and cloud architecture.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-xl uppercase tracking-wider" style={{ color: template.colors.primary }}>
            Experience
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">Senior Software Engineer</p>
                <p className="text-slate-600 italic">Google | Mountain View, CA</p>
              </div>
              <p className="text-slate-600 font-medium">2020 - Present</p>
            </div>
            <ul className="list-disc list-inside text-lg text-slate-700 space-y-2">
              <li>Led the design and implementation of a next-generation microservices architecture</li>
              <li>Mentored a team of 10+ junior and mid-level developers</li>
              <li>Reduced application load time by 45% through advanced optimization techniques</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-xl uppercase tracking-wider" style={{ color: template.colors.primary }}>
            Education
          </h3>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-lg">M.S. in Computer Science</p>
              <p className="text-slate-600">Stanford University</p>
            </div>
            <p className="text-slate-600 font-medium">2018 - 2020</p>
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}

export function ModernTechPreview({ template }: TemplatePreviewProps) {
  return (
    <ResumeContainer>
      <div className="w-full h-full p-10 text-slate-900 space-y-8 text-left">
        <div
          className="p-10 rounded-xl text-white shadow-lg"
          style={{ backgroundColor: template.colors.primary }}
        >
          <h2 className="text-4xl font-bold">John Doe</h2>
          <p className="text-xl opacity-90 mt-2 font-medium">Senior Software Engineer</p>
          <div className="flex gap-4 mt-4 text-sm opacity-80">
            <span>john@example.com</span>
            <span>•</span>
            <span>(555) 123-4567</span>
            <span>•</span>
            <span>San Francisco, CA</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-10">
          <div className="col-span-2 space-y-8">
            <section className="space-y-4">
              <h3 className="font-bold text-xl uppercase tracking-widest flex items-center gap-2" style={{ color: template.colors.primary }}>
                <span className="w-8 h-1" style={{ backgroundColor: template.colors.accent }} />
                Experience
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-lg">Senior Software Engineer</h4>
                    <span className="text-sm font-semibold text-slate-500">2020 - PRESENT</span>
                  </div>
                  <p className="text-indigo-600 font-medium">Google</p>
                  <p className="text-slate-700 text-lg">Led the core platform team in developing low-latency streaming services used by millions of users daily.</p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="font-bold text-xl uppercase tracking-widest" style={{ color: template.colors.primary }}>Skills</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                {['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Kubernetes'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-100 rounded-full font-medium">{skill}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}

export function MinimalistCleanPreview({ template }: TemplatePreviewProps) {
  return (
    <ResumeContainer>
      <div className="w-full h-full p-16 text-slate-900 space-y-12 text-left">
        <header className="space-y-2">
          <h2 className="text-5xl font-light tracking-widest uppercase">John Doe</h2>
          <p className="text-slate-500 tracking-wide">john@example.com | (555) 123-4567 | San Francisco, CA</p>
        </header>

        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] border-b pb-2">Experience</h3>
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="font-bold">Senior Software Engineer</p>
                <p className="text-slate-500">2020 – Present</p>
              </div>
              <p className="text-slate-600">Google</p>
              <p className="text-slate-800 leading-relaxed">Developing enterprise-scale applications for global users.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] border-b pb-2">Education</h3>
          <div className="flex justify-between">
            <p className="font-bold">Stanford University</p>
            <p className="text-slate-500">M.S. Computer Science</p>
          </div>
        </section>
      </div>
    </ResumeContainer>
  );
}

export function CreativeDesignerPreview({ template }: TemplatePreviewProps) {
  return (
    <ResumeContainer>
      <div className="w-full h-full p-0 flex text-left">
        <div className="w-1/3 p-10 text-white flex flex-col justify-between" style={{ backgroundColor: template.colors.primary }}>
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase leading-tight">John<br />Doe</h2>
              <div className="w-12 h-2" style={{ backgroundColor: template.colors.accent }}></div>
            </div>

            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-70">Contact</h3>
              <div className="space-y-2 text-sm opacity-90">
                <p>john@example.com</p>
                <p>(555) 123-4567</p>
                <p>johndoe.design</p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-70">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {['UI Design', 'Branding', 'Motion', 'Strategy'].map(skill => (
                  <span key={skill} className="px-2 py-1 bg-white/10 rounded text-xs">{skill}</span>
                ))}
              </div>
            </section>
          </div>

          <p className="text-xs opacity-50 font-medium">© 2024 Portfolio</p>
        </div>

        <div className="flex-1 p-12 bg-white space-y-10">
          <section className="space-y-4">
            <h3 className="text-xl font-bold italic" style={{ color: template.colors.primary }}>About Me</h3>
            <p className="text-slate-600 leading-relaxed">Passionate designer focused on building meaningful digital experiences through human-centered design principles.</p>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-bold italic" style={{ color: template.colors.primary }}>Experience</h3>
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2" style={{ borderColor: template.colors.secondary }}>
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: template.colors.primary }}></div>
                <h4 className="font-bold text-lg">Senior Product Designer</h4>
                <p className="text-sm font-medium" style={{ color: template.colors.accent }}>Apple | 2021 - Present</p>
                <p className="mt-2 text-slate-600">Leading the design language system for next-gen consumer products.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ResumeContainer>
  );
}

export function ExecutiveElegantPreview({ template }: TemplatePreviewProps) {
  return (
    <ResumeContainer>
      <div className="w-full h-full p-12 bg-white border-[20px]" style={{ borderColor: template.colors.secondary }}>
        <div className="text-center space-y-4 border-b-2 pb-8" style={{ borderColor: template.colors.primary }}>
          <h2 className="text-4xl font-serif font-bold tracking-widest uppercase" style={{ color: template.colors.primary }}>Johnathan Doe</h2>
          <p className="text-slate-500 font-serif italic text-lg">Senior Vice President of Engineering</p>
          <div className="flex justify-center gap-6 text-sm text-slate-600">
            <span>john.doe@executive.com</span>
            <span>•</span>
            <span>(555) 987-6543</span>
            <span>•</span>
            <span>Manhattan, NY</span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-4 gap-12 text-left">
          <div className="col-span-3 space-y-10">
            <section className="space-y-4">
              <h3 className="font-serif font-bold text-lg uppercase border-b" style={{ color: template.colors.primary, borderColor: template.colors.secondary }}>Executive Experience</h3>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline font-serif">
                    <h4 className="font-bold text-xl">VP of Engineering</h4>
                    <span className="text-sm italic">2018 - Present</span>
                  </div>
                  <p className="font-bold text-indigo-900">Microsoft | Redmond, WA</p>
                  <p className="text-slate-700 leading-relaxed">Directing a cross-functional organization of 500+ engineers across three continents.</p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="font-serif font-bold text-sm uppercase tracking-tighter" style={{ color: template.colors.primary }}>Core Competencies</h3>
              <ul className="text-sm space-y-2 text-slate-700 font-medium">
                {['Strategic Leadership', 'Global Operations', 'P&L Management', 'M&A Strategy'].map(c => (
                  <li key={c} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: template.colors.accent }}></span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}

export function StartupVibrantPreview({ template }: TemplatePreviewProps) {
  return (
    <ResumeContainer>
      <div className="w-full h-full p-8 bg-slate-50 text-left">
        <div className="bg-white rounded-3xl shadow-xl p-12 flex flex-col h-full min-h-[1050px]">
          <div className="flex justify-between items-center bg-gradient-to-br p-10 rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.accent})` }}>
            <div>
              <h2 className="text-5xl font-black italic tracking-tighter">JOHN DOE</h2>
              <p className="text-xl font-bold mt-2 opacity-90 uppercase tracking-widest">Growth Engineer</p>
            </div>
            <div className="text-right text-sm space-y-1 font-bold opacity-80">
              <p>john@startup.ly</p>
              <p>@johndoe_dev</p>
              <p>SF / REMOTE</p>
            </div>
          </div>

          <div className="mt-12 flex-1 grid grid-cols-2 gap-12">
            <section className="space-y-6">
              <h3 className="text-2xl font-black italic uppercase" style={{ color: template.colors.primary }}>The Hustle</h3>
              <div className="space-y-8">
                <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
                  <h4 className="font-bold text-xl">Lead Developer @ Revolut</h4>
                  <p className="text-slate-500 font-bold text-sm mt-1">2021 - PRESENT</p>
                  <p className="mt-4 text-slate-700">Scaling financial infrastructure to millions of users.</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-black italic uppercase" style={{ color: template.colors.primary }}>Stack</h3>
              <div className="flex flex-wrap gap-3">
                {['Rust', 'Go', 'Next.js', 'Postgres', 'Redis', 'K8s'].map(s => (
                  <span key={s} className="px-6 py-2 rounded-full border-4 font-black transition-transform hover:scale-105" style={{ borderColor: template.colors.secondary, color: template.colors.primary }}>{s}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </ResumeContainer>
  );
}

export function AcademicStructuredPreview({ template }: TemplatePreviewProps) {
  return (
    <ResumeContainer>
      <div className="w-full h-full p-16 text-slate-900 space-y-10 text-left">
        <div className="text-center space-y-2 border-b-2 pb-6">
          <h2 className="text-3xl font-serif font-bold tracking-tight">Johnathan Q. Doe, Ph.D.</h2>
          <p className="text-slate-600 font-serif">Curriculum Vitae</p>
          <p className="text-sm font-serif">Department of Computer Science | Stanford University | Stanford, CA 94305</p>
          <p className="text-sm font-serif italic text-indigo-700">jdoe@stanford.edu | (555) 123-0000</p>
        </div>

        <section className="space-y-4">
          <h3 className="font-serif font-bold border-b border-slate-300 uppercase tracking-widest text-sm" style={{ color: template.colors.primary }}>Education</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-bold">Stanford University</p>
              <p>2020</p>
            </div>
            <p className="text-slate-700">Ph.D. in Computer Science. Dissertation: "Large-scale Distributed Systems"</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-serif font-bold border-b border-slate-300 uppercase tracking-widest text-sm" style={{ color: template.colors.primary }}>Publications</h3>
          <ol className="list-decimal list-outside space-y-3 font-serif pl-4 text-slate-800">
            <li><span className="font-bold">Doe, J.</span>, et al. "Optimization of Query Planning in Distributed Environments." <span className="italic">ACM Transactions on Database Systems</span>. 2023.</li>
            <li>Smith, A., <span className="font-bold">Doe, J.</span> "Adaptive Resource Allocation." <span className="italic">Nature Computational Science</span>. 2022.</li>
          </ol>
        </section>
      </div>
    </ResumeContainer>
  );
}

export function GradientModernPreview({ template }: TemplatePreviewProps) {
  return (
    <ResumeContainer>
      <div className="w-full h-full p-0 flex text-left">
        <div className="w-[300px] bg-slate-900 text-white p-12 space-y-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl font-bold" style={{ background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.accent})` }}>JD</div>

          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold opacity-60">Info</h3>
            <div className="space-y-2 text-sm">
              <p>SF, California</p>
              <p>john@modern.io</p>
              <p>github.com/jdoe</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold opacity-60">Skills</h3>
            <div className="space-y-1">
              {['React', 'Node', 'AWS', 'Flutter'].map(s => (
                <p key={s} className="text-lg font-bold">{s}</p>
              ))}
            </div>
          </section>
        </div>

        <div className="flex-1 p-16 bg-white space-y-12">
          <header className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter" style={{ color: template.colors.primary }}>John Doe</h2>
            <div className="text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${template.colors.primary}, ${template.colors.accent})` }}>Lead System Architect</div>
          </header>

          <section className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Experience</h3>
            <div className="space-y-10">
              <div className="group relative">
                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b opacity-20" style={{ backgroundImage: `linear-gradient(to bottom, ${template.colors.primary}, transparent)` }}></div>
                <h4 className="text-2xl font-bold">Netflix</h4>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">2019 - Present</p>
                <p className="mt-4 text-slate-700 text-lg leading-relaxed">Pioneering content delivery networks for global streaming infrastructure.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ResumeContainer>
  );
}
