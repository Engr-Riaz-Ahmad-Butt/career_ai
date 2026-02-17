'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const sidebarSections = [
  {
    label: 'Main',
    items: [
      { icon: '⊞', label: 'Dashboard', active: true },
      { icon: '📄', label: 'Resume Builder' },
      { icon: '🎯', label: 'AI Tailor', badge: '3' },
    ],
  },
  {
    label: 'Documents',
    items: [
      { icon: '✉️', label: 'Cover Letters' },
      { icon: '🎓', label: 'Scholarship Suite' },
      { icon: '📋', label: 'All Documents' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { icon: '💬', label: 'Interview Prep' },
      { icon: '🧠', label: 'Comm Analyzer' },
      { icon: '👤', label: 'Bio Generator' },
      { icon: '🗂️', label: 'Job Tracker' },
    ],
  },
  {
    label: 'Account',
    items: [
      { icon: '⚙️', label: 'Settings' },
      { icon: '💳', label: 'Billing' },
    ],
  },
]

function Sidebar({ activeItem, setActiveItem }: { activeItem: string; setActiveItem: (s: string) => void }) {
  return (
    <aside style={{ width: 240, background: '#0f1117', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, overflowY: 'auto' }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CareerForge
          </span>
          <span style={{ display: 'inline-block', marginLeft: 6, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.05em', verticalAlign: 'middle' }}>PRO</span>
        </Link>
      </div>

      {/* Nav sections */}
      <div style={{ flex: 1 }}>
        {sidebarSections.map(section => (
          <div key={section.label} style={{ padding: '14px 12px 4px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 4 }}>{section.label}</div>
            {section.items.map(item => (
              <div
                key={item.label}
                onClick={() => setActiveItem(item.label)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: item.label === activeItem ? '#3b82f6' : '#9ca3af', cursor: 'pointer', transition: 'all 0.15s', marginBottom: 1, background: item.label === activeItem ? 'rgba(59,130,246,0.14)' : 'transparent' }}
                onMouseEnter={e => { if (item.label !== activeItem) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#f9fafb' } }}
                onMouseLeave={e => { if (item.label !== activeItem) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af' } }}
              >
                <span style={{ fontSize: 16, opacity: 0.9 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && <span style={{ marginLeft: 'auto', background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ marginTop: 'auto', padding: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Credits bar */}
        <div style={{ padding: '10px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, marginBottom: 6 }}>
            <span style={{ color: '#9ca3af' }}>Credits remaining</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>142 / 200</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #3b82f6, #22d3ee)', width: '71%' }} />
          </div>
        </div>
        {/* User card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>AK</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f9fafb' }}>Alex Kim</div>
            <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 600 }}>Pro Plan</div>
          </div>
          <span style={{ marginLeft: 'auto', color: '#4b5563', fontSize: 11 }}>▾</span>
        </div>
      </div>
    </aside>
  )
}

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [searchVal, setSearchVal] = useState('')

  const statCards = [
    { label: 'ATS Score', value: '87', icon: '📊', iconBg: 'rgba(59,130,246,0.15)', color: '#3b82f6', change: '+18 pts', changeUp: true },
    { label: 'Resumes Created', value: '4', icon: '📄', iconBg: 'rgba(16,185,129,0.15)', color: '#10b981', change: '+2 this week', changeUp: true },
    { label: 'Applications Sent', value: '23', icon: '📨', iconBg: 'rgba(167,139,250,0.15)', color: '#a78bfa', change: '+6 this week', changeUp: true },
    { label: 'Credits Left', value: '142', icon: '⚡', iconBg: 'rgba(245,158,11,0.15)', color: '#f59e0b', change: '58 used', changeUp: false },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07090f', fontFamily: 'DM Sans, sans-serif', color: '#fff' }}>
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main content */}
      <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Topbar */}
        <div style={{ height: 60, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f1117', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4b5563' }}>
              <span>CareerForge</span>
              <span style={{ color: '#1f2937' }}>›</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{activeItem}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '6px 14px', width: 220 }}>
              <span style={{ color: '#4b5563', fontSize: 13 }}>🔍</span>
              <input
                type="text"
                placeholder="Search documents, resumes..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#9ca3af', width: '100%' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, position: 'relative' }}>
              🔔
              <div style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', border: '2px solid #0f1117' }} />
            </div>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15 }}>❓</div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, boxShadow: '0 0 16px rgba(59,130,246,0.3)', transition: 'all 0.2s' }}>
              + New Resume
            </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Welcome Banner */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(34,211,238,0.06) 100%)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 14, padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>Welcome back, Alex 👋</h2>
              <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Your ATS score improved <strong style={{ color: '#10b981' }}>+18 points</strong> this week. You're on track!</p>
            </div>
            <div style={{ display: 'flex', gap: 28 }}>
              {[['87', 'ATS Score'], ['4', 'Resumes'], ['23', 'Applied']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#10b981' }}>{n}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#3b82f6', color: '#fff', boxShadow: '0 0 14px rgba(59,130,246,0.35)' }}>+ New Resume</button>
              <button style={{ padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'rgba(255,255,255,0.06)', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.12)' }}>Upgrade Plan</button>
            </div>
          </motion.div>

          {/* Stat cards */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {statCards.map(s => (
              <div key={s.label} style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: s.changeUp ? 'rgba(16,185,129,0.12)' : 'rgba(248,113,113,0.12)', color: s.changeUp ? '#10b981' : '#f87171' }}>{s.change}</span>
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, lineHeight: 1, color: '#fff' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Main grid */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

            {/* ATS Score Card */}
            <div style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>ATS Score Analysis</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Google SWE L4 — tailored resume</div>
                </div>
                <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>View Full Report</span>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'start' }}>
                  {/* Big ring */}
                  <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                    <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
                      <circle cx="70" cy="70" r="56" fill="none" stroke="#10b981" strokeWidth="14" strokeDasharray="351.9" strokeDashoffset="45.7" strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 38, fontWeight: 800, color: '#10b981', lineHeight: 1 }}>87</div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>/ 100</div>
                      <div style={{ fontSize: 10, color: '#10b981', marginTop: 1, fontWeight: 600 }}>Excellent</div>
                    </div>
                  </div>
                  {/* Score dimensions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { name: 'Keyword Match', score: '38/40', color: '#10b981', pct: '95%' },
                      { name: 'Format & Structure', score: '25/30', color: '#3b82f6', pct: '83%' },
                      { name: 'Impact & Metrics', score: '14/20', color: '#f59e0b', pct: '70%' },
                      { name: 'Section Completeness', score: '10/10', color: '#10b981', pct: '100%' },
                    ].map(d => (
                      <div key={d.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: '#e5e7eb', fontWeight: 500 }}>{d.name}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.score}</span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 99, background: d.color, width: d.pct, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keyword tags */}
                <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#10b981', marginBottom: 10 }}>✓ Matched Keywords</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {['Python', 'React', 'CI/CD', 'AWS', 'REST API', 'SQL', 'Agile', 'TypeScript'].map(k => (
                        <span key={k} style={{ padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 600, background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>{k}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f87171', marginBottom: 10 }}>✗ Missing Keywords</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {['Kubernetes', 'Go', 'gRPC', 'Terraform'].map(k => (
                        <span key={k} style={{ padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 600, background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.18)' }}>{k}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Quick actions */}
              <div style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>Quick Actions</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 16 }}>
                  {[['📄', 'New Resume', 'From scratch'], ['🎯', 'Tailor Resume', 'Paste JD'], ['✉️', 'Cover Letter', '2 min'], ['🎓', 'Scholarship', 'SOP & more']].map(([icon, label, sub]) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none' }}>
                      <span style={{ fontSize: 22 }}>{icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb' }}>{label}</span>
                      <span style={{ fontSize: 10, color: '#4b5563' }}>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent documents */}
              <div style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>Recent Documents</div>
                  <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>View all</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
                  {[
                    { badge: 'CL', badgeBg: 'rgba(59,130,246,0.15)', badgeColor: '#3b82f6', name: 'Cover Letter — Google', date: '2h ago' },
                    { badge: 'SOP', badgeBg: 'rgba(167,139,250,0.15)', badgeColor: '#a78bfa', name: 'SOP — Oxford MSc', date: 'Yesterday' },
                    { badge: 'SCH', badgeBg: 'rgba(245,158,11,0.12)', badgeColor: '#f59e0b', name: 'Chevening Letter', date: '3 days ago' },
                    { badge: 'BIO', badgeBg: 'rgba(34,211,238,0.1)', badgeColor: '#22d3ee', name: 'LinkedIn Bio', date: '5 days ago' },
                  ].map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', transition: 'all 0.15s', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: d.badgeBg, color: d.badgeColor }}>{d.badge}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#f9fafb', flex: 1 }}>{d.name}</span>
                      <span style={{ fontSize: 10, color: '#4b5563', flexShrink: 0 }}>{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Resume list */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>My Resumes</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>4 resumes · 2 tailored versions</div>
                </div>
                <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>+ Create New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20 }}>
                {[
                  { icon: '📄', name: 'Software Engineer — Google (Tailored)', meta: 'Updated 2h ago · ATS: 87', ats: 87, atsClass: '#10b981', template: 'Modern' },
                  { icon: '📄', name: 'Full Stack Developer — General', meta: 'Updated 3 days ago · ATS: 72', ats: 72, atsClass: '#fbbf24', template: 'Classic' },
                  { icon: '📄', name: 'Backend Engineer — Stripe (Tailored)', meta: 'Updated 1 week ago · ATS: 81', ats: 81, atsClass: '#10b981', template: 'Minimal' },
                  { icon: '📄', name: 'SDE II — Amazon', meta: 'Updated 2 weeks ago · ATS: 65', ats: 65, atsClass: '#f87171', template: 'Executive' },
                ].map(r => (
                  <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{r.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f9fafb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{r.meta}</div>
                    </div>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: '#9ca3af', flexShrink: 0 }}>{r.template}</span>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, color: r.atsClass, flexShrink: 0 }}>{r.ats}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Second row: Job tracker + AI Tips + Deadlines */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

            {/* Job tracker */}
            <div style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>Application Tracker</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>5 active applications</div>
                </div>
                <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>+ Add Job</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
                {[
                  { co: 'G', gradient: 'linear-gradient(135deg,#4285f4,#0f9d58)', role: 'Software Engineer L4', company: 'Google · Mountain View', status: 'Interview', statusBg: 'rgba(245,158,11,0.12)', statusColor: '#f59e0b' },
                  { co: 'S', gradient: 'linear-gradient(135deg,#6772e5,#3ecf8e)', role: 'Senior Engineer', company: 'Stripe · Remote', status: 'Applied', statusBg: 'rgba(59,130,246,0.12)', statusColor: '#3b82f6' },
                  { co: 'A', gradient: 'linear-gradient(135deg,#ff9900,#232f3e)', role: 'SDE II', company: 'Amazon · Seattle', status: 'Applied', statusBg: 'rgba(59,130,246,0.12)', statusColor: '#3b82f6' },
                  { co: 'M', gradient: 'linear-gradient(135deg,#0078d4,#1b1b1b)', role: 'Full Stack Engineer', company: 'Microsoft · Redmond', status: 'Offer 🎉', statusBg: 'rgba(16,185,129,0.12)', statusColor: '#10b981' },
                  { co: 'N', gradient: 'linear-gradient(135deg,#e03c31,#1a1a1a)', role: 'Backend Engineer', company: 'Netflix · Los Gatos', status: 'Rejected', statusBg: 'rgba(248,113,113,0.1)', statusColor: '#f87171' },
                ].map(j => (
                  <div key={j.role} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: j.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{j.co}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f9fafb' }}>{j.role}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af' }}>{j.company}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: j.statusBg, color: j.statusColor }}>{j.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tips */}
            <div style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>AI Improvement Tips</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Based on your Google SWE resume</div>
              </div>
              <div>
                {[
                  { n: '1', text: <>Add <span style={{ color: '#f59e0b', fontWeight: 600 }}>Kubernetes</span> to your skills. 67% of SWE L4+ roles at Google require it. Even basic familiarity increases match score significantly.</> },
                  { n: '2', text: <>Your bullet "worked on backend systems" is weak. Rewrite as <span style={{ color: '#10b981', fontWeight: 600 }}>"Architected REST microservices handling 50K req/s, reducing p99 latency by 40%."</span></> },
                  { n: '3', text: <>Only <strong>3 of 8 bullets</strong> have quantified outcomes. Adding metrics could push impact score from <span style={{ color: '#f59e0b', fontWeight: 600 }}>14/20</span> to <span style={{ color: '#10b981', fontWeight: 600 }}>19/20</span>.</> },
                  { n: '4', text: <><span style={{ color: '#10b981', fontWeight: 600 }}>Section completeness is perfect</span> — all required sections present. Format is clean and ATS-parseable. ✓</> },
                ].map(tip => (
                  <div key={tip.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{tip.n}</div>
                    <div style={{ fontSize: 12, color: '#e5e7eb', lineHeight: 1.55 }}>{tip.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadlines */}
            <div style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>Upcoming Deadlines</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Scholarship & job applications</div>
                </div>
                <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>+ Add</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { day: '18', mo: 'Feb', title: 'Chevening Application', sub: 'Motivation letter due', badge: 'Tomorrow', badgeBg: 'rgba(248,113,113,0.12)', badgeColor: '#f87171' },
                  { day: '24', mo: 'Feb', title: 'Google Onsite Interview', sub: 'System design + coding', badge: '7 days', badgeBg: 'rgba(245,158,11,0.12)', badgeColor: '#f59e0b' },
                  { day: '03', mo: 'Mar', title: 'Oxford MSc Deadline', sub: 'SOP + recommendation', badge: '2 weeks', badgeBg: 'rgba(59,130,246,0.12)', badgeColor: '#3b82f6' },
                  { day: '15', mo: 'Mar', title: 'Stripe Take-home Test', sub: '48h coding challenge', badge: '4 weeks', badgeBg: 'rgba(59,130,246,0.08)', badgeColor: '#60a5fa' },
                ].map((d, i) => (
                  <div key={d.title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 32 }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{d.day}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d.mo}</div>
                    </div>
                    <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f9fafb' }}>{d.title}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{d.sub}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: d.badgeBg, color: d.badgeColor, flexShrink: 0 }}>{d.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
