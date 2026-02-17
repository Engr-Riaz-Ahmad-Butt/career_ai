'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// ── Scroll Reveal Hook ─────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function RevealDiv({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className ?? ''}`} style={style}>{children}</div>
}

// ── Feature Card ───────────────────────────────────────────────
function FeatureCard({ icon, title, desc, badge, iconBg }: { icon: string; title: string; desc: string; badge?: string; iconBg: string }) {
  return (
    <div
      style={{
        background: '#0d1117',
        padding: '36px 32px',
        position: 'relative',
        transition: 'background 0.3s',
        cursor: 'default',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.04)')}
      onMouseLeave={e => (e.currentTarget.style.background = '#0d1117')}
    >
      {badge && (
        <div style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(16,185,129,0.15)', color: '#10b981',
          fontSize: 11, fontWeight: 700, padding: '3px 10px',
          borderRadius: 4, border: '1px solid rgba(16,185,129,0.2)',
        }}>{badge}</div>
      )}
      <div style={{
        before: {},
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
        opacity: 0,
      }} />
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: iconBg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 22, marginBottom: 20,
      }}>{icon}</div>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7 }}>{desc}</p>
    </div>
  )
}

// ── Testimonial Card ───────────────────────────────────────────
function TCard({ quote, name, role, initials, gradient, badge }: { quote: string; name: string; role: string; initials: string; gradient: string; badge: string }) {
  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: 28,
        transition: 'border-color 0.3s, transform 0.3s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ color: '#f59e0b', fontSize: 11, letterSpacing: 1, marginBottom: 12 }}>★★★★★</div>
      <p style={{ fontSize: 14, color: '#e5e7eb', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>"{quote}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{name}</div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>{role}</div>
        </div>
      </div>
      <div style={{ marginTop: 10, display: 'inline-block', padding: '3px 10px', background: 'rgba(16,185,129,0.12)', color: '#10b981', borderRadius: 4, fontSize: 11, fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)' }}>
        {badge}
      </div>
    </div>
  )
}

// ── Pricing Card ───────────────────────────────────────────────
function PricingCard({ plan, desc, price, period, features, cta, featured }: {
  plan: string; desc: string; price: string; period: string;
  features: { text: string; included: boolean }[]; cta: string; featured?: boolean;
}) {
  return (
    <div style={{
      background: featured ? 'rgba(59,130,246,0.05)' : '#111827',
      border: `1px solid ${featured ? '#3b82f6' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 16,
      padding: 32,
      position: 'relative',
      transition: 'all 0.3s',
      boxShadow: featured ? '0 0 60px rgba(59,130,246,0.12)' : 'none',
    }}>
      {featured && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #3b82f6, #22d3ee)',
          color: '#fff', fontSize: 11, fontWeight: 700,
          padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap',
        }}>⭐ Most Popular</div>
      )}
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{plan}</div>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>{desc}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 44, fontWeight: 800, color: '#fff' }}>{price}</span>
        {price !== '$0' && <span style={{ fontSize: 14, color: '#9ca3af' }}>/month</span>}
      </div>
      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 28 }}>{period}</div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 0 20px' }} />
      {features.map((f, i) => (
        <div key={i} style={{ fontSize: 13, color: f.included ? '#e5e7eb' : '#4b5563', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ color: f.included ? '#10b981' : '#4b5563', flexShrink: 0 }}>{f.included ? '✓' : '✗'}</span>
          {f.text}
        </div>
      ))}
      <Link
        href="/auth/signup"
        style={{
          display: 'block', width: '100%', padding: '12px',
          borderRadius: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
          textAlign: 'center', cursor: 'pointer', border: 'none', transition: 'all 0.2s',
          textDecoration: 'none', marginTop: 28,
          background: featured ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(255,255,255,0.05)',
          color: featured ? '#fff' : '#e5e7eb',
          boxShadow: featured ? '0 4px 20px rgba(59,130,246,0.35)' : 'none',
          borderWidth: featured ? 0 : 1,
          borderStyle: 'solid',
          borderColor: 'rgba(255,255,255,0.12)',
        }}
      >{cta}</Link>
    </div>
  )
}

// ── FAQ Item ───────────────────────────────────────────────────
function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '22px 0' }} className={open ? 'faq-item open' : 'faq-item'}>
      <div
        style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: open ? '#3b82f6' : '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none', transition: 'color 0.2s' }}
        onClick={() => setOpen(!open)}
      >
        {q}
        <span style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none', fontSize: 18, color: '#9ca3af' }}>▾</span>
      </div>
      <div className="faq-a" style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7, maxHeight: open ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease, padding 0.3s', paddingTop: open ? 14 : 0 }}>
        {a}
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function HomePage() {
  const [annual, setAnnual] = useState(true)

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '140px 24px 80px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        {/* Glow backgrounds */}
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '10%', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', fontSize: 13, fontWeight: 500, color: '#22d3ee', marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', animation: 'pulse 2s infinite', display: 'inline-block' }} />
          Powered by Gemini AI & Claude Sonnet
        </motion.div>

        {/* H1 */}
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(46px, 7vw, 88px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em', maxWidth: 900 }}>
          <span style={{ display: 'block', color: '#fff' }}>Land Your Dream Job</span>
          <span style={{ display: 'block', background: 'linear-gradient(135deg, #3b82f6 0%, #22d3ee 60%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            With AI-Crafted Documents
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ marginTop: 24, fontSize: 'clamp(16px, 2vw, 19px)', fontWeight: 300, color: '#9ca3af', maxWidth: 560, lineHeight: 1.7 }}>
          Build ATS-optimized resumes, tailor them to any job in seconds, generate cover letters and scholarship documents — all in one platform.
        </motion.p>

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ marginTop: 44, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/auth/signup" className="btn-hero">Start for Free — No Credit Card</Link>
          <a href="#how-it-works" className="btn-hero-ghost">Watch 2-min Demo →</a>
        </motion.div>

        {/* Social proof */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ marginTop: 60, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex' }}>
            {[['AK', 'linear-gradient(135deg,#3b82f6,#1d4ed8)'], ['MR', 'linear-gradient(135deg,#10b981,#059669)'], ['JS', 'linear-gradient(135deg,#a78bfa,#7c3aed)'], ['LT', 'linear-gradient(135deg,#f59e0b,#d97706)'], ['DP', 'linear-gradient(135deg,#22d3ee,#0891b2)']].map(([i, g], idx) => (
              <div key={idx} style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid #0d1117', marginLeft: idx === 0 ? 0 : -10, background: g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i}</div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: '#9ca3af' }}><strong style={{ color: '#fff' }}>12,400+</strong> resumes created this month</div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ color: '#f59e0b', fontSize: 13 }}>★★★★★</div>
          <div style={{ fontSize: 13, color: '#9ca3af' }}><strong style={{ color: '#fff' }}>4.9</strong> / 5.0 rating</div>
        </motion.div>

        {/* Product Preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ marginTop: 72, width: '100%', maxWidth: 1000, position: 'relative', animation: 'float 4s ease-in-out infinite' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '80%', height: '60%', background: 'radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}>
            {/* Browser bar */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
              <div style={{ flex: 1, marginLeft: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '5px 14px', fontSize: 12, color: '#9ca3af', maxWidth: 300, textAlign: 'center' }}>
                app.careerforge.ai/dashboard
              </div>
            </div>
            {/* Dashboard preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', height: 420 }} className="max-sm:grid-cols-1">
              {/* Sidebar */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }} className="hidden sm:flex">
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 14, color: '#3b82f6', padding: '0 8px 16px', marginBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>CareerForge</div>
                {[['⊞', 'Dashboard', true], ['📄', 'Resume Builder', false], ['🎯', 'AI Tailor', false], ['✉️', 'Cover Letters', false], ['🎓', 'Scholarship', false], ['💬', 'Interview Prep', false]].map(([icon, label, active], i) => (
                  <div key={i} style={{ padding: '8px 12px', borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, background: active ? 'rgba(59,130,246,0.15)' : 'transparent', color: active ? '#3b82f6' : '#9ca3af' }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>{label}
                  </div>
                ))}
              </div>
              {/* Main content */}
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>Welcome back, Alex 👋</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Your resume score improved by 18 points this week</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }} className="max-sm:grid-cols-2">
                  {[['ATS Score', '87', '#10b981', '↑ +18 this week'], ['Resumes', '4', '#3b82f6', '2 tailored'], ['Docs Made', '11', '#a78bfa', '3 cover letters'], ['Credits Left', '142', '#f59e0b', 'Pro plan']].map(([label, val, color, sub]) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, marginTop: 4, color }}>{val}</div>
                      <div style={{ fontSize: 10, color: '#10b981', marginTop: 2 }}>{sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }} className="max-sm:grid-cols-1">
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 14, overflow: 'hidden' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>ATS Score Breakdown</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ position: 'relative', width: 70, height: 70, flexShrink: 0 }}>
                        <svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                          <circle cx="35" cy="35" r="28" fill="none" stroke="#10b981" strokeWidth="7" strokeDasharray="175.9" strokeDashoffset="22.9" strokeLinecap="round" />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800, color: '#10b981' }}>87<div style={{ fontSize: 8, color: '#9ca3af', marginTop: -2, fontWeight: 400 }}>/ 100</div></div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[['Keywords', '38/40', '#10b981', '95%'], ['Format', '25/30', '#3b82f6', '83%'], ['Impact', '14/20', '#f59e0b', '70%']].map(([l, v, c, w]) => (
                          <div key={l}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9ca3af', marginBottom: 2 }}><span>{l}</span><span style={{ color: c }}>{v}</span></div>
                            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginBottom: 6, overflow: 'hidden' }}>
                              <div style={{ height: '100%', borderRadius: 99, background: c, width: w }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 14, overflow: 'hidden' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Keyword Match</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {[['Python', true], ['React', true], ['CI/CD', true], ['AWS', true], ['REST API', true], ['Kubernetes', false], ['Go', false], ['SQL', true], ['Agile', true], ['gRPC', false]].map(([kw, matched]) => (
                        <span key={kw} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 500, background: matched ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)', color: matched ? '#10b981' : '#f87171', border: `1px solid ${matched ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── TRUSTED BY ── */}
      <RevealDiv style={{ padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 12, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>Students from</div>
        <div style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['MIT', 'Stanford', 'Oxford', 'Harvard', 'ETH Zurich', 'IIT Delhi', 'NUS'].map(u => (
            <div key={u} style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#4b5563', letterSpacing: '-0.02em' }}>{u}</div>
          ))}
        </div>
      </RevealDiv>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 60px' }} className="max-md:px-6">
        <RevealDiv>
          <div className="section-tag">Everything You Need</div>
          <h2 className="section-h2">One platform.<br />Every career document.</h2>
          <p style={{ marginTop: 16, fontSize: 16, fontWeight: 300, color: '#9ca3af', maxWidth: 520, lineHeight: 1.7 }}>
            From ATS-optimized resumes to scholarship SOPs — build, tailor, and perfect every document with AI guidance.
          </p>
        </RevealDiv>
        <RevealDiv style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }} className="max-md:!grid-cols-1">
          <FeatureCard icon="📄" title="Resume Builder" desc="Step-by-step AI-guided resume builder with live ATS scoring. AI enhances every bullet point for impact and keyword density." badge="Free" iconBg="rgba(59,130,246,0.15)" />
          <FeatureCard icon="🎯" title="Job Tailoring Engine" desc="Paste any job description. Our NLP engine extracts keywords and AI rewrites your resume to match. See ATS score jump in real time." iconBg="rgba(16,185,129,0.15)" />
          <FeatureCard icon="⬆️" title="Resume Upload & Improve" desc="Upload your existing PDF or DOCX. AI analyzes grammar, weak verbs, missing metrics, and suggests targeted improvements." iconBg="rgba(167,139,250,0.15)" />
          <FeatureCard icon="✉️" title="12 Document Types" desc="Cover letters, resignation letters, recommendation drafts, acceptance letters, SOPs, study plans, financial explanation letters and more." iconBg="rgba(245,158,11,0.15)" />
          <FeatureCard icon="🎓" title="Scholarship Suite" desc="Dedicated templates for Fulbright, Chevening, DAAD, and more. AI writes your SOP, motivation letter, and study plan with context." iconBg="rgba(34,211,238,0.12)" />
          <FeatureCard icon="💬" title="Interview Prep" desc="AI generates behavioral and technical interview questions based on your resume and the specific job description you're targeting." iconBg="rgba(248,113,113,0.12)" />
        </RevealDiv>

        {/* Additional features from product doc */}
        <RevealDiv style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }} className="max-md:!grid-cols-1">
          <FeatureCard icon="🗂️" title="Application Tracker" desc="Kanban-style job tracking board to manage every application, follow-up, and interview in one place." iconBg="rgba(59,130,246,0.1)" />
          <FeatureCard icon="🔗" title="LinkedIn Bio Generator" desc="AI-powered LinkedIn summary, elevator pitch, and headline generator tailored to your target role and industry." iconBg="rgba(34,211,238,0.1)" />
          <FeatureCard icon="🌐" title="Portfolio Website" desc="Generate a stunning portfolio website in minutes. React-based, fully deployable, and personalized to your career story." iconBg="rgba(167,139,250,0.1)" />
        </RevealDiv>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '100px 60px' }} className="max-md:px-6">
        <RevealDiv style={{ textAlign: 'center', maxWidth: '100%' }}>
          <div className="section-tag">Simple Process</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1, margin: '0 auto', textAlign: 'center' }}>
            From signup to hired — in 4 steps
          </h2>
        </RevealDiv>
        <RevealDiv style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40, position: 'relative' }} className="max-md:!grid-cols-2">
          {[
            { n: '1', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', title: 'Create Your Profile', desc: 'Sign up in 30 seconds. Add your experience, skills, and education once — CareerForge remembers everything.' },
            { n: '2', color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.25)', title: 'Build or Upload', desc: 'Build a polished ATS resume from scratch with AI assistance, or upload your existing resume for instant improvements.' },
            { n: '3', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', title: 'Tailor to Any Job', desc: 'Paste a job description. AI extracts keywords and tailors your resume in 30 seconds. Watch your ATS score climb.' },
            { n: '4', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', title: 'Download & Apply', desc: 'Download a pixel-perfect PDF. Generate a matching cover letter. Apply with confidence — fully optimized.' },
          ].map((step) => (
            <div key={step.n} style={{ padding: '0 20px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, background: step.bg, border: `1px solid ${step.border}`, color: step.color, margin: '0 auto 24px', position: 'relative', zIndex: 1 }}>
                {step.n}
              </div>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{step.title}</h4>
              <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </RevealDiv>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: '100px 60px' }} className="max-md:px-6">
        <RevealDiv>
          <div className="section-tag">Real Results</div>
          <h2 className="section-h2">Thousands hired.<br />Real stories.</h2>
        </RevealDiv>
        <RevealDiv style={{ marginTop: 60, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="max-md:!grid-cols-1">
          <TCard quote='My ATS score went from 41 to 89 after tailoring. I got 3 callbacks the same week. CareerForge is genuinely the best $12 I have spent in my job search.' name="Alex Kim" role="Software Engineer at Stripe" initials="AK" gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)" badge="ATS: 41 → 89" />
          <TCard quote="I used CareerForge's scholarship SOP generator for my Chevening application. Got accepted. The AI understood the tone and format perfectly for UK scholarship boards." name="Maria Rodriguez" role="Chevening Scholar, MSc UCL" initials="MR" gradient="linear-gradient(135deg,#10b981,#059669)" badge="Scholarship Won ✓" />
          <TCard quote="As an international student switching careers into data science, the resume tailoring was a game changer. I was applying to 20 jobs a day with perfectly optimized resumes." name="Jae-won Shin" role="Data Scientist at Amazon" initials="JS" gradient="linear-gradient(135deg,#a78bfa,#7c3aed)" badge="3 Offers in 6 weeks" />
        </RevealDiv>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '100px 60px', textAlign: 'center', position: 'relative' }} className="max-md:px-6">
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <RevealDiv>
          <div className="section-tag">Simple Pricing</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1, margin: '0 auto', textAlign: 'center' }}>
            Start free.<br />Upgrade when you're ready.
          </h2>
          <p style={{ marginTop: 12, fontSize: 16, color: '#9ca3af', textAlign: 'center' }}>No credit card required. Cancel anytime.</p>
        </RevealDiv>

        {/* Billing toggle */}
        <RevealDiv style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 56px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, padding: '6px 6px 6px 18px', fontSize: 14, color: '#9ca3af' }}>
            Monthly
            <div onClick={() => setAnnual(!annual)} style={{ background: '#3b82f6', color: '#fff', padding: '6px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>
              {annual ? 'Annual' : 'Monthly'}
            </div>
            <div style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>Save 33%</div>
          </div>
        </RevealDiv>

        <RevealDiv style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 960, margin: '0 auto', textAlign: 'left' }} className="max-md:!grid-cols-1">
          <PricingCard plan="Free" desc="For trying it out" price="$0" period="forever"
            features={[
              { text: '10 credits / month', included: true },
              { text: '3 resumes', included: true },
              { text: '2 templates', included: true },
              { text: '2 cover letters / month', included: true },
              { text: 'ATS scoring', included: true },
              { text: 'Scholarship suite', included: false },
              { text: 'Interview prep', included: false },
            ]}
            cta="Get Started Free"
          />
          <PricingCard plan="Pro" desc="For serious job seekers" price={annual ? '$8' : '$12'} period={annual ? 'billed annually — $96/year' : 'billed monthly'}
            features={[
              { text: '200 credits / month', included: true },
              { text: 'Unlimited resumes', included: true },
              { text: 'All 6+ templates', included: true },
              { text: 'All 12 document types', included: true },
              { text: 'Scholarship suite', included: true },
              { text: 'Interview prep AI', included: true },
              { text: 'Version history', included: true },
            ]}
            cta="Start 7-Day Free Trial"
            featured
          />
          <PricingCard plan="Team" desc="For career centers & bootcamps" price="$39" period={annual ? '5 seats · billed annually' : '5 seats · billed monthly'}
            features={[
              { text: '500 shared credits', included: true },
              { text: 'Everything in Pro', included: true },
              { text: 'Admin dashboard', included: true },
              { text: 'Usage analytics', included: true },
              { text: 'Priority support', included: true },
              { text: 'University branding', included: true },
            ]}
            cta="Contact Sales"
          />
        </RevealDiv>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '80px 60px', maxWidth: 860, margin: '0 auto', width: '100%' }} className="max-md:px-6">
        <RevealDiv>
          <div className="section-tag">FAQ</div>
          <h2 className="section-h2">Common questions</h2>
        </RevealDiv>
        <RevealDiv style={{ marginTop: 48 }}>
          <FAQItem q="Will ATS systems actually read CareerForge resumes?" a="Our resumes use clean single-column layouts with no tables, no images, and standard section headers — exactly what ATS parsers require. We test against top ATS platforms including Greenhouse, Lever, Workday, and Taleo. Our average ATS score for CareerForge-generated resumes is 84/100." defaultOpen />
          <FAQItem q="Can I use this for scholarship applications?" a="Yes — the Scholarship Suite (Pro feature) includes dedicated generators for Fulbright, Chevening, DAAD, Erasmus, and more. Each generator understands the specific tone, structure, and evaluation criteria of major scholarship programs. It generates your SOP, motivation letter, study plan, and financial explanation letter." />
          <FAQItem q="Does the AI make up experience I don't have?" a="Never. Our AI is explicitly instructed to only use information you provide. It enhances how your experience is expressed (stronger verbs, better metrics, cleaner phrasing) but never invents roles, skills, or achievements you didn't include. We treat hallucination as a critical bug, not a feature." />
          <FAQItem q="What happens to my data?" a="Your documents are encrypted at rest and in transit. We never train AI models on your personal resume data. You can delete all your data at any time from settings. We do not sell personal data to third parties. See our full Privacy Policy for details." />
          <FAQItem q="Can I cancel my subscription anytime?" a="Yes. Cancel anytime from your billing settings. You keep Pro access until the end of your billing period. No questions asked. We also offer a 7-day free trial on Pro so you can test everything before being charged." />
          <FAQItem q="What languages are supported?" a="CareerForge currently supports English for all AI-generated content. Multi-language support (Arabic, Spanish, French, Hindi, Urdu) is on our roadmap and targeted for Q3 2026." />
        </RevealDiv>
      </section>

      {/* ── CTA SECTION ── */}
      <RevealDiv style={{ margin: '0 60px 100px' }} className="max-md:mx-6">
        <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(34,211,238,0.08) 100%)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 24, padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>Your next job starts today.</h2>
          <p style={{ fontSize: 16, color: '#9ca3af', marginBottom: 36, position: 'relative', zIndex: 1 }}>Join 12,000+ job seekers and students who've upgraded their career documents with AI.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
            <Link href="/auth/signup" className="btn-hero">Create Your Free Resume →</Link>
            <Link href="/#features" className="btn-hero-ghost">See All Features</Link>
          </div>
        </div>
      </RevealDiv>

      <Footer />
    </>
  )
}
