'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Google SVG icon
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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // TODO: implement with NextAuth or your auth provider
    setTimeout(() => {
      setLoading(false)
      // Redirect to dashboard on success
      window.location.href = '/dashboard'
    }, 1200)
  }

  const handleGoogleLogin = () => {
    // TODO: implement with NextAuth signIn('google')
    // signIn('google', { callbackUrl: '/dashboard' })
    alert('Connect NextAuth Google provider to enable this.')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

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
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 32 }}>Sign in to continue building your career</p>

          {/* Google */}
          <button onClick={handleGoogleLogin} className="google-btn" style={{ marginBottom: 24 }}>
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 12, color: '#4b5563' }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#f87171' }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#e5e7eb', marginBottom: 8 }}>Email address</label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#e5e7eb' }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '12px', borderRadius: 10, background: loading ? '#1d4ed8' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: 4, boxShadow: '0 0 30px rgba(59,130,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </>
              ) : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginTop: 24 }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>Create one free</Link>
          </p>
        </div>

        {/* Trust signals */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {['🔒 Encrypted', '✓ No spam', '⭐ 4.9/5 rating'].map(t => (
            <span key={t} style={{ fontSize: 12, color: '#4b5563' }}>{t}</span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
