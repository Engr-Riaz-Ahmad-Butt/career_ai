'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function PricingCard({ plan, desc, price, period, features, cta, featured, note }: {
  plan: string; desc: string; price: string; period: string;
  features: { text: string; included: boolean; bold?: boolean }[]; cta: string;
  featured?: boolean; note?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        background: featured ? 'rgba(59,130,246,0.05)' : '#111827',
        border: `1px solid ${featured ? '#3b82f6' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16,
        padding: 36,
        position: 'relative',
        boxShadow: featured ? '0 0 60px rgba(59,130,246,0.12)' : 'none',
      }}
    >
      {featured && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 18px', borderRadius: 100, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(59,130,246,0.4)' }}>
          ⭐ Most Popular
        </div>
      )}
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{plan}</div>
      <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 28 }}>{desc}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 52, fontWeight: 800, color: '#fff' }}>{price}</span>
        {price !== '$0' && price !== 'Custom' && <span style={{ fontSize: 15, color: '#9ca3af' }}>/month</span>}
      </div>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 32 }}>{period}</div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 0 24px' }} />
      {features.map((f, i) => (
        <div key={i} style={{ fontSize: 14, color: f.included ? '#e5e7eb' : '#4b5563', marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ color: f.included ? '#10b981' : '#4b5563', flexShrink: 0, marginTop: 1 }}>{f.included ? '✓' : '✗'}</span>
          <span style={f.bold ? { color: '#fff', fontWeight: 600 } : {}}>{f.text}</span>
        </div>
      ))}
      <Link href="/auth/signup" style={{
        display: 'block', width: '100%', padding: '14px',
        borderRadius: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15,
        textAlign: 'center', cursor: 'pointer', border: 'none', transition: 'all 0.2s',
        textDecoration: 'none', marginTop: 32,
        background: featured ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(255,255,255,0.05)',
        color: featured ? '#fff' : '#e5e7eb',
        boxShadow: featured ? '0 4px 20px rgba(59,130,246,0.35)' : 'none',
        borderWidth: featured ? 0 : 1,
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.12)',
      }}>{cta}</Link>
      {note && <p style={{ fontSize: 12, color: '#4b5563', textAlign: 'center', marginTop: 12 }}>{note}</p>}
    </motion.div>
  )
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  const comparisonFeatures = [
    { name: 'AI Credits / month', free: '10', pro: '200', team: '500 shared' },
    { name: 'Resumes', free: '3', pro: 'Unlimited', team: 'Unlimited' },
    { name: 'Resume templates', free: '2', pro: '6+', team: '6+' },
    { name: 'Cover letter generator', free: '2/mo', pro: 'Unlimited', team: 'Unlimited' },
    { name: 'ATS scoring', free: '✓', pro: '✓', team: '✓' },
    { name: 'Job tailoring engine', free: '✓ (limited)', pro: '✓ Full', team: '✓ Full' },
    { name: 'Scholarship suite', free: '✗', pro: '✓', team: '✓' },
    { name: 'Interview prep AI', free: '✗', pro: '✓', team: '✓' },
    { name: 'LinkedIn bio generator', free: '✗', pro: '✓', team: '✓' },
    { name: 'Version history', free: '✗', pro: '✓', team: '✓' },
    { name: 'Admin dashboard', free: '✗', pro: '✗', team: '✓' },
    { name: 'Usage analytics', free: '✗', pro: '✗', team: '✓' },
    { name: 'University branding', free: '✗', pro: '✗', team: '✓' },
    { name: 'Priority support', free: '✗', pro: '✗', team: '✓' },
  ]

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 100 }}>

        {/* Hero */}
        <section style={{ padding: '80px 60px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 16 }}>Simple Pricing</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(40px,6vw,72px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', marginBottom: 16 }}>
              Start free.<br />
              <span style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Scale when you're ready.</span>
            </h1>
            <p style={{ fontSize: 18, color: '#9ca3af', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              No credit card required. Cancel anytime. 7-day free trial on Pro.
            </p>
          </motion.div>

          {/* Billing toggle */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: 'flex', justifyContent: 'center', margin: '36px 0 60px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, padding: '8px 8px 8px 20px', fontSize: 14, color: '#9ca3af' }}>
              <span>Monthly</span>
              <div onClick={() => setAnnual(!annual)} style={{ background: '#3b82f6', color: '#fff', padding: '7px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}>
                {annual ? 'Annual' : 'Monthly'}
              </div>
              <div style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>Save 33%</div>
            </div>
          </motion.div>

          {/* Pricing cards */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, maxWidth: 1200, margin: '0 auto', textAlign: 'left' }}>
            <PricingCard
              plan="Free"
              desc="Try CareerForge at no cost"
              price="$0"
              period="Forever, no card needed"
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
              note="No credit card required"
            />
            <PricingCard
              plan="Pro"
              desc="For serious job seekers"
              price={annual ? '$8' : '$12'}
              period={annual ? 'billed annually — $96/year' : 'billed monthly'}
              features={[
                { text: '200 credits / month', included: true, bold: true },
                { text: 'Unlimited resumes', included: true },
                { text: 'All 6+ templates', included: true },
                { text: 'All 12 document types', included: true },
                { text: 'Scholarship suite', included: true, bold: true },
                { text: 'Interview prep AI', included: true },
                { text: 'Version history', included: true },
                { text: 'LinkedIn bio generator', included: true },
              ]}
              cta="Start 7-Day Free Trial"
              featured
              note="Cancel anytime"
            />
            <PricingCard
              plan="Team"
              desc="For career centers & bootcamps"
              price="$39"
              period={`5 seats · ${annual ? 'billed annually' : 'billed monthly'}`}
              features={[
                { text: '500 shared credits', included: true, bold: true },
                { text: 'Everything in Pro', included: true },
                { text: 'Admin dashboard', included: true },
                { text: 'Usage analytics', included: true },
                { text: 'Priority support', included: true },
                { text: 'University branding', included: true },
                { text: 'Additional seats $8/seat', included: true },
              ]}
              cta="Contact Sales"
              note="Volume discounts available"
            />
            <PricingCard
              plan="Enterprise"
              desc="For universities & large orgs"
              price="Custom"
              period="Custom contract"
              features={[
                { text: 'Unlimited credits', included: true, bold: true },
                { text: 'Everything in Team', included: true },
                { text: 'Dedicated account manager', included: true },
                { text: 'SSO / SAML', included: true },
                { text: 'Custom integrations', included: true },
                { text: 'SLA guarantee', included: true },
                { text: 'White-label option', included: true },
              ]}
              cta="Talk to Sales"
              note="For 50+ seats"
            />
          </motion.div>
        </section>

        {/* Feature comparison table */}
        <section style={{ padding: '80px 60px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 12 }}>Compare Plans</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Everything side by side</h2>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ padding: '16px 20px', fontSize: 12, color: '#4b5563', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Feature</div>
              {['Free', 'Pro', 'Team'].map(p => (
                <div key={p} style={{ padding: '16px 20px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color: p === 'Pro' ? '#3b82f6' : '#fff' }}>{p}</div>
                </div>
              ))}
            </div>
            {comparisonFeatures.map((f, i) => (
              <div key={f.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < comparisonFeatures.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <div style={{ padding: '13px 20px', fontSize: 13, color: '#e5e7eb' }}>{f.name}</div>
                {[f.free, f.pro, f.team].map((v, j) => (
                  <div key={j} style={{ padding: '13px 20px', textAlign: 'center', fontSize: 13, fontWeight: 500, color: v === '✓' || v?.startsWith('✓') ? '#10b981' : v === '✗' ? '#4b5563' : '#e5e7eb' }}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ section */}
        <section style={{ padding: '0 60px 80px', maxWidth: 780, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 40, textAlign: 'center', letterSpacing: '-0.02em' }}>Pricing FAQ</h2>
          {[
            { q: 'What is a credit?', a: 'One credit equals one AI generation action — creating a resume section, tailoring a resume, generating a cover letter paragraph, or running an ATS analysis. Credits reset monthly on your billing date.' },
            { q: 'Can I switch plans anytime?', a: 'Yes. Upgrade or downgrade anytime. If you upgrade mid-cycle, you\'re charged pro-rata. If you downgrade, you keep Pro features until your billing period ends.' },
            { q: 'Do unused credits roll over?', a: 'No, credits reset each billing cycle. This helps us keep the pricing predictable and affordable.' },
            { q: 'Is there a student discount?', a: 'Yes — students with a valid .edu email can apply for a 50% discount on the Pro plan. Contact support@careerforge.ai with your student email.' },
            { q: 'How does the Team plan work?', a: 'The Team plan gives 5 seats with a shared credit pool. An admin can monitor usage, assign roles, and brand the platform. Additional seats can be added at $8/seat/month.' },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '22px 0' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{item.q}</h3>
              <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7 }}>{item.a}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div style={{ padding: '0 60px 100px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(34,211,238,0.08) 100%)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 24, padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden', maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 16 }}>Ready to get hired?</h2>
            <p style={{ fontSize: 16, color: '#9ca3af', marginBottom: 36 }}>Start with our free plan. No credit card, no risk.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" className="btn-hero">Start for Free →</Link>
              <Link href="/about" className="btn-hero-ghost">Learn about us</Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
