'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const teamMembers = [
  { initials: 'AK', name: 'Alex Kim', role: 'Co-founder & CEO', bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', bio: 'Former Google SWE. Spent years watching talented people lose out on jobs because of bad resumes. Built CareerForge to fix that.' },
  { initials: 'MR', name: 'Maria Rodriguez', role: 'Co-founder & CTO', bg: 'linear-gradient(135deg, #10b981, #059669)', bio: 'AI researcher turned builder. Spent 4 years working on LLM fine-tuning at Anthropic before co-founding CareerForge.' },
  { initials: 'JS', name: 'Jae-won Shin', role: 'Head of Product', bg: 'linear-gradient(135deg, #a78bfa, #7c3aed)', bio: 'Ex-Stripe PM. Obsessed with reducing friction. Designed every user flow in CareerForge to feel effortless.' },
  { initials: 'LT', name: 'Layla Thompson', role: 'Head of Growth', bg: 'linear-gradient(135deg, #f59e0b, #d97706)', bio: 'Built 0-to-100K growth engines at two previous startups. Leads all marketing, partnerships, and community at CareerForge.' },
]

const values = [
  { icon: '🎯', title: 'Honesty first', desc: 'Our AI never invents experience you don\'t have. Every enhancement is authentic — stronger words, not fabricated facts. We treat hallucination as a critical bug.' },
  { icon: '🔒', title: 'Privacy by design', desc: 'Your career data is yours. We never train on your personal documents. You can delete everything instantly. No ads, no data selling, ever.' },
  { icon: '⚡', title: 'Speed that respects your time', desc: 'A tailored resume in 30 seconds. A cover letter in 2 minutes. Every interaction is optimized to be faster than you expect.' },
  { icon: '🌍', title: 'Globally inclusive', desc: 'Built for students in Lagos and engineers in Seoul equally. Supporting scholarship applications for Fulbright, Chevening, DAAD, and regional programs worldwide.' },
  { icon: '🔬', title: 'Evidence-driven', desc: 'We test every template against real ATS systems. Our ATS scoring isn\'t guesswork — it\'s validated against Greenhouse, Lever, Workday, and Taleo.' },
  { icon: '💡', title: 'Always improving', desc: 'Your feedback drives our roadmap. We ship weekly. Every thumbs-down on an AI output teaches us something. The product gets better with every resume created.' },
]

const stats = [
  { n: '12,400+', label: 'Resumes created' },
  { n: '84/100', label: 'Avg ATS score' },
  { n: '4.9/5', label: 'User rating' },
  { n: '$1.2B', label: 'Market opportunity' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 100 }}>

        {/* Hero */}
        <section style={{ padding: '80px 60px', maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 16 }}>About CareerForge AI</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(40px,6vw,72px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', maxWidth: 800, marginBottom: 24 }}>
              We're on a mission to make talent visible.
            </h1>
            <p style={{ fontSize: 18, color: '#9ca3af', maxWidth: 600, lineHeight: 1.8, marginBottom: 48 }}>
              CareerForge was born from a simple frustration: talented people losing opportunities not because of their abilities, but because of how their experience was presented on paper. We built the AI platform we wished existed.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              {stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Origin story */}
        <section style={{ padding: '80px 60px', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 16 }}>Our Story</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 24, lineHeight: 1.2 }}>Built by job seekers, for job seekers</h2>
              <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.8, marginBottom: 20 }}>
                In 2024, our co-founders spent weeks reviewing resumes for a team at Google. They saw a pattern: brilliant candidates with legitimate experience being filtered out by ATS systems because of poor formatting, wrong keywords, or weak bullet phrasing.
              </p>
              <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.8, marginBottom: 20 }}>
                At the same time, they watched international students — writing scholarship SOPs in their second or third language — lose out on transformative opportunities because they didn't have access to expert writing help.
              </p>
              <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.8 }}>
                CareerForge AI was built to level that playing field. We combine the best of large language models with domain-specific knowledge of what employers, ATS systems, and scholarship committees actually look for.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 36 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 20 }}>The problem we're solving</div>
                {[
                  { icon: '❌', text: '75% of resumes never reach a human — rejected by ATS systems before a recruiter sees them.' },
                  { icon: '❌', text: 'Average job seeker spends 6-12 hours tailoring a single resume to a specific role.' },
                  { icon: '❌', text: 'International students writing scholarship applications in a second language are at a systematic disadvantage.' },
                  { icon: '❌', text: 'Career document expertise is expensive — resume writers charge $200-500+ per document.' },
                ].map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
                    <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7 }}>{p.text}</p>
                  </div>
                ))}
                <div style={{ marginTop: 28, padding: '16px 20px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#10b981', marginBottom: 6 }}>✓ CareerForge's solution</div>
                  <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>AI that helps anyone create ATS-optimized, professionally written career documents in minutes — for a fraction of the cost.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What we build */}
        <section style={{ padding: '80px 60px', maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 16 }}>Platform</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16 }}>One platform. Every career document.</h2>
            <p style={{ fontSize: 16, color: '#9ca3af', maxWidth: 540, margin: '0 auto' }}>CareerForge handles the full career document lifecycle — from first resume to scholarship acceptance to job offer.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { icon: '📄', title: 'Resume Builder', desc: 'AI-guided resume builder with live ATS scoring, keyword optimization, and professional templates.', color: 'rgba(59,130,246,0.15)' },
              { icon: '🎯', title: 'Job Tailoring Engine', desc: 'Paste any JD, get a tailored resume in 30 seconds. ATS score updated in real time.', color: 'rgba(16,185,129,0.15)' },
              { icon: '✉️', title: '12 Document Types', desc: 'Cover letters, resignation letters, reference letters, SOPs, study plans, and more.', color: 'rgba(245,158,11,0.12)' },
              { icon: '🎓', title: 'Scholarship Suite', desc: 'Fulbright, Chevening, DAAD, Erasmus, and regional scholarships — AI writes every required document.', color: 'rgba(167,139,250,0.15)' },
              { icon: '💬', title: 'Interview Prep', desc: 'AI generates role-specific behavioral and technical questions based on your resume and JD.', color: 'rgba(34,211,238,0.12)' },
              { icon: '🗂️', title: 'Application Tracker', desc: 'Kanban-style application tracker with deadline reminders and status updates.', color: 'rgba(248,113,113,0.1)' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 28, transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section style={{ padding: '80px 60px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 16 }}>Our Values</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>How we think about building</h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
              {values.map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{v.icon}</div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7 }}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section style={{ padding: '80px 60px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 60 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 16 }}>The Team</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', maxWidth: 640, lineHeight: 1.2 }}>Built by people who've been there</h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
              {teamMembers.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 16 }}>{m.initials}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, marginBottom: 12 }}>{m.role}</div>
                  <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>{m.bio}</p>
                </motion.div>
              ))}
            </div>

            {/* Hiring */}
            <div style={{ marginTop: 40, padding: 32, background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>We're hiring 🚀</div>
                <p style={{ fontSize: 14, color: '#9ca3af' }}>Looking for engineers, designers, and growth hackers who care about career equity.</p>
              </div>
              <a href="mailto:careers@careerforge.ai" style={{ padding: '11px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                See Open Roles →
              </a>
            </div>
          </div>
        </section>

        {/* Market context */}
        <section style={{ padding: '0 60px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 48 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 16 }}>Market Context</div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.2 }}>A $1.2B market with no dominant player</h2>
                <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.8, marginBottom: 16 }}>
                  The career tools market is valued at approximately $1.2B globally and growing at 8.5% CAGR. Yet no single platform owns the full career document lifecycle.
                </p>
                <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.8 }}>
                  Existing players like Resume.io focus only on formatting. LinkedIn lacks document generation. Grammarly doesn't understand career context. CareerForge is the first platform to combine all these capabilities into a unified, AI-native experience.
                </p>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 20 }}>Target Segments</div>
                {[
                  { label: 'University students & recent grads', sub: 'Ages 18-28, internship & entry-level job seekers', color: '#3b82f6', pct: '60%' },
                  { label: 'Mid-career professionals', sub: 'Ages 28-45, switching roles or industries', color: '#10b981', pct: '25%' },
                  { label: 'International students', sub: 'Scholarship & visa applicants globally', color: '#a78bfa', pct: '15%' },
                ].map(s => (
                  <div key={s.label} style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.sub}</div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.pct}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 99, background: s.color, width: s.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div style={{ padding: '0 60px 100px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(34,211,238,0.08) 100%)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 24, padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden', maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 16 }}>Your story deserves to be heard.</h2>
            <p style={{ fontSize: 16, color: '#9ca3af', marginBottom: 36 }}>Let AI help you tell it — in a way that gets through every filter and lands the right job.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" className="btn-hero">Build Your Resume Free →</Link>
              <Link href="/pricing" className="btn-hero-ghost">View Pricing</Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
