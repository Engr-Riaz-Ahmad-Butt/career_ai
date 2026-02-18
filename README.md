# CareerForge AI - Next.js Application

AI-powered career document platform. Build ATS-optimized resumes, cover letters, and scholarship documents with AI.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- Next.js 14 + TypeScript + Tailwind CSS
- Framer Motion for animations
- Space Grotesk + Inter fonts
- NextAuth.js for authentication

## 🎨 Pages Included

- **Landing Page** - Hero, features, testimonials, pricing
- **Login/Signup** - Google OAuth + email/password
- **Pricing** - 4-tier pricing (Free/Pro/Team/Enterprise)  
- **About** - Team profiles and company story

## 🔐 Setup Environment Variables

Create `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
MONGODB_URI=mongodb://localhost:27017/careerforge
```

## 🚢 Deploy

### Vercel
```bash
vercel
```

### Docker
```bash
docker build -t careerforge .
docker run -p 3000:3000 careerforge
```

## 📁 Structure

```
app/
  page.tsx              - Landing
  auth/login/           - Login page
  auth/signup/          - Signup page
  pricing/              - Pricing
  about/                - About
components/
  layout/               - Navbar, Footer
  sections/             - Hero, Features
styles/
  globals.css           - Animations & theme
```

## ✨ Features

- Smooth animations with Framer Motion
- Card hover effects with lift + scale
- Responsive design
- Dark theme with gradients
- Staggered scroll reveals

Built with ❤️ using Next.js 14
