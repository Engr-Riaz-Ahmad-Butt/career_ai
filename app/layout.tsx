import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'CareerForge AI — Build Resumes That Get You Hired',
  description: 'AI-powered career document platform for students and job seekers worldwide. Build, tailor, and perfect every document with CareerForge AI.',
  keywords: 'resume builder, AI resume, ATS optimized, cover letter, career documents',
  openGraph: {
    title: 'CareerForge AI — Build Resumes That Get You Hired',
    description: 'AI-powered career document platform. ATS-optimized resumes in minutes.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
