'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1 = form, 2 = success

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: implement with your auth provider
    setTimeout(() => {
      setLoading(false)
      setStep(2)
    }, 1200)
  }

  const handleGoogleSignup = () => {
    // TODO: signIn('google', { callbackUrl: '/dashboard' })
    alert('Connect NextAuth Google provider to enable this.')
  }

  if (step === 2) {
    return (
      <div style={{ minHeight: '100vh', background: '#060810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px' }}>🎉</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>You're in!</h2>
          <p style={{ fontSize: 15, color: '#9ca3af', marginBottom: 32 }}>Your CareerForge account has been created. Start building your first AI-powered resume.</p>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}>
            Go to Dashboard →
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CareerForge AI
            </span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 48 }}>
          {/* Free badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 12, fontWeight: 600, color: '#10b981', marginBottom: 16 }}>
            ✓ Free forever — no credit card needed
          </div>

          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>Create your account</h1>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 32 }}>Join 12,400+ job seekers & students</p>

          {/* Google */}
          <button onClick={handleGoogleSignup} className="google-btn" style={{ marginBottom: 24 }}>
            <GoogleIcon />
            Sign up with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 12, color: '#4b5563' }}>or sign up with email</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#e5e7eb', marginBottom: 8 }}>Full name</label>
              <input className="input-field" type="text" placeholder="Alex Johnson" value={formData.name} onChange={update('name')} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#e5e7eb', marginBottom: 8 }}>Email address</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={formData.email} onChange={update('email')} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#e5e7eb', marginBottom: 8 }}>Password</label>
              <input className="input-field" type="password" placeholder="Min. 8 characters" value={formData.password} onChange={update('password')} minLength={8} required />
            </div>

            {/* What you get */}
            <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free plan includes</div>
              {['10 AI credits / month', '3 ATS-optimized resumes', '2 cover letters', 'Live ATS score feedback'].map(item => (
                <div key={item} style={{ fontSize: 13, color: '#e5e7eb', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#10b981' }}>✓</span> {item}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 0 30px rgba(59,130,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Creating account...
                </>
              ) : 'Create Free Account →'}
            </button>

            <p style={{ fontSize: 11, color: '#4b5563', textAlign: 'center', lineHeight: 1.5 }}>
              By signing up you agree to our{' '}
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a> and{' '}
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a>.
            </p>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginTop: 24 }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {['🔒 SSL encrypted', '✓ GDPR compliant', '⭐ 4.9/5 rating'].map(t => (
            <span key={t} style={{ fontSize: 12, color: '#4b5563' }}>{t}</span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
