'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: scrolled ? '14px 60px' : '20px 60px',
        background: 'rgba(6,8,16,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.3s ease',
      }}
      className="max-md:px-5"
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 22,
            background: 'linear-gradient(135deg, #3b82f6, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          CareerForge<span style={{ WebkitTextFillColor: '#fff', opacity: 0.4 }}> AI</span>
        </span>
      </Link>

      {/* Nav Links — desktop */}
      <div className="hidden md:flex" style={{ gap: 36, alignItems: 'center' }}>
        {[
          { label: 'Features', href: '/#features' },
          { label: 'How It Works', href: '/#how-it-works' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'About', href: '/about' },
        ].map((link) => (
          <Link
            key={link.label}
            href={link.href}
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: '#9ca3af',
              textDecoration: 'none',
              transition: 'color 0.2s',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* CTA Buttons — desktop */}
      <div className="hidden md:flex" style={{ gap: 12, alignItems: 'center' }}>
        <Link href="/auth/login" className="btn-ghost">Sign In</Link>
        <Link href="/auth/signup" className="btn-primary">Get Started Free</Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 24,
        }}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(13,17,23,0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {[
            { label: 'Features', href: '/#features' },
            { label: 'How It Works', href: '/#how-it-works' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'About', href: '/about' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 15 }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Link href="/auth/login" className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Sign In</Link>
            <Link href="/auth/signup" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Get Started</Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
