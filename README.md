# CareerForge AI — Next.js Application

AI-powered career document platform. Converted from HTML to Next.js 14 with TypeScript, Tailwind CSS, and Framer Motion.

## 🗂 Project Structure

```
careerforge/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Landing page (home)
│   ├── auth/
│   │   ├── login/page.tsx      # Login page (Google + email)
│   │   └── signup/page.tsx     # Signup page (Google + email)
│   ├── dashboard/page.tsx      # Full dashboard UI
│   ├── pricing/page.tsx        # Pricing page with comparison table
│   └── about/page.tsx          # About Us page
├── components/
│   └── layout/
│       ├── Navbar.tsx          # Fixed navbar with mobile menu
│       └── Footer.tsx          # Footer with all links
├── styles/
│   └── globals.css             # Global styles + CSS variables + animations
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (optional for MVP)
MONGODB_URI=your-mongodb-uri

# Stripe (optional for billing)
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔐 Adding Authentication

This project uses placeholder auth — ready to connect to **NextAuth.js**.

### Install NextAuth

```bash
npm install next-auth
```

### Create auth API route

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Add your own auth logic here
        // e.g., query your database
        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async session({ session, token }) {
      return session
    },
  },
})

export { handler as GET, handler as POST }
```

### Wire up login/signup pages

In `app/auth/login/page.tsx`, replace the placeholders:

```typescript
import { signIn } from 'next-auth/react'

// Google login:
const handleGoogleLogin = () => signIn('google', { callbackUrl: '/dashboard' })

// Email login:
const handleEmailLogin = async (e) => {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  })
  if (result?.ok) router.push('/dashboard')
}
```

## 🎨 Design System

The design preserves the original HTML design exactly:

- **Fonts**: Syne (display/headings) + DM Sans (body)
- **Colors**: Blue (`#3b82f6`) + Cyan (`#22d3ee`) + Green (`#10b981`) on dark (`#060810`)
- **Noise overlay**: Subtle grain texture via SVG filter
- **Animations**: Framer Motion for page loads + CSS for scroll reveals + ATS score counting

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with Hero, Features, How It Works, Testimonials, Pricing, FAQ |
| `/auth/login` | Login with Google OAuth + email/password |
| `/auth/signup` | Signup with Google OAuth + email |
| `/dashboard` | Full dashboard with ATS scores, resumes, job tracker, deadlines |
| `/pricing` | Detailed pricing with comparison table |
| `/about` | About page with team, values, market context |

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — page animations and micro-interactions
- **NextAuth.js** (ready to connect)

## 📦 Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔮 Roadmap (from Product Strategy)

Based on the CareerForge AI Product Strategy document:

- **Phase 1 (MVP)**: Resume builder, ATS scoring, cover letter generator ✅
- **Phase 2**: Resume upload + PDF extraction, scholarship suite, LinkedIn bio
- **Phase 3**: Portfolio website generator, interview prep, job tracker
- **Phase 4**: Chrome extension, AI career coach chatbot, multi-language support

---

Built with ❤️ by the CareerForge team.
