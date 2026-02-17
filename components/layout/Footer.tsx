import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <footer
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 48,
          padding: '80px 60px 40px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}
        className="max-md:grid-cols-2 max-sm:grid-cols-1 max-md:px-6"
      >
        <div>
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 20,
              background: 'linear-gradient(135deg, #3b82f6, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 14,
            }}
          >
            CareerForge AI
          </div>
          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, maxWidth: 280 }}>
            AI-powered career document platform for students and job seekers worldwide. Build, tailor, and perfect every document.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
              <a key={s} href="#" style={{ color: '#4b5563', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}>
                {s}
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Product" links={[
          { label: 'Resume Builder', href: '/#features' },
          { label: 'ATS Tailoring', href: '/#features' },
          { label: 'Cover Letters', href: '/#features' },
          { label: 'Scholarship Suite', href: '/#features' },
          { label: 'Interview Prep', href: '/#features' },
          { label: 'Pricing', href: '/pricing' },
        ]} />

        <FooterCol title="Resources" links={[
          { label: 'Blog', href: '#' },
          { label: 'ATS Guide', href: '#' },
          { label: 'Resume Tips', href: '#' },
          { label: 'Scholarship Tips', href: '#' },
          { label: 'Changelog', href: '#' },
        ]} />

        <FooterCol title="Company" links={[
          { label: 'About', href: '/about' },
          { label: 'Careers', href: '#' },
          { label: 'Privacy Policy', href: '#' },
          { label: 'Terms of Service', href: '#' },
          { label: 'Contact', href: '#' },
        ]} />
      </footer>

      <div
        style={{
          padding: '20px 60px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: '#4b5563',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}
        className="max-md:flex-col max-md:gap-4 max-md:text-center max-md:px-6"
      >
        <div>© 2025 CareerForge AI. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>Cookies</a>
        </div>
      </div>
    </>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 16, letterSpacing: 0.02 }}>
        {title}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(l => (
          <Link
            key={l.label}
            href={l.href}
            style={{ fontSize: 13, color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
