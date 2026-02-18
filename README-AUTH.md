# CareerForge AI - Next.js with Protected Routes 🔐

Complete Next.js 14 application with **NextAuth.js authentication** and **protected routes**.

## ✨ What's New - Protected Routes

✅ **NextAuth.js Integration** - Google OAuth + Email/Password
✅ **Middleware Protection** - `/dashboard` requires authentication  
✅ **Session Management** - JWT-based sessions
✅ **Protected Dashboard** - Full dashboard UI with sidebar
✅ **Auto Redirect** - Unauthenticated users → login page
✅ **Sign Out** - Working logout functionality

## 🚀 Quick Start

```bash
# 1. Extract
tar -xzf careerforge-nextjs-protected.tar.gz
cd careerforge

# 2. Install
npm install

# 3. Setup Environment Variables
cp .env.example .env.local

# 4. Generate NextAuth Secret
openssl rand -base64 32
# Copy output to NEXTAUTH_SECRET in .env.local

# 5. Setup Google OAuth (see below)

# 6. Run
npm run dev
```

Open http://localhost:3000

## 🔑 Setting Up Google OAuth

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create/Select Project
- Create new project or select existing
- Enable Google+ API

### 3. Create OAuth Credentials
- Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
- Application type: **Web application**
- Authorized JavaScript origins: `http://localhost:3000`
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### 4. Copy Credentials
Add to `.env.local`:
```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

## 📁 New Files Added

```
app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts          ✅ NextAuth API handler
├── dashboard/
│   └── page.tsx                   ✅ Protected dashboard
components/
└── auth/
    └── AuthProvider.tsx           ✅ Session provider
middleware.ts                      ✅ Route protection
.env.example                       ✅ Environment template
```

## 🛡️ How Authentication Works

### 1. **Login Flow**
```
User → /auth/login → Enter credentials → NextAuth → /dashboard
```

### 2. **Protected Routes**
Defined in `middleware.ts`:
```typescript
export const config = {
  matcher: [
    "/dashboard/:path*",    // ✅ Protected
    "/resume/:path*",       // ✅ Protected
    "/settings/:path*",     // ✅ Protected
  ],
};
```

### 3. **Session Check**
```typescript
const { data: session, status } = useSession();
// status: "loading" | "authenticated" | "unauthenticated"
```

### 4. **Sign Out**
```typescript
import { signOut } from "next-auth/react";

signOut({ callbackUrl: "/" });
```

## 🎯 Features

### Authentication Pages
- ✅ Login with Google OAuth
- ✅ Login with Email/Password
- ✅ Signup with Google OAuth
- ✅ Signup with Email/Password
- ✅ Error handling
- ✅ Loading states

### Protected Dashboard
- ✅ Full sidebar navigation
- ✅ User profile display
- ✅ Credits tracking bar
- ✅ Stats cards with animations
- ✅ Welcome banner
- ✅ Sign out button
- ✅ Responsive design

### Security
- ✅ Middleware protection
- ✅ JWT sessions
- ✅ Auto redirect for unauthenticated users
- ✅ Secure credential handling

## 📋 Environment Variables

Required in `.env.local`:

```env
# NextAuth (Required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Google OAuth (Required for Google login)
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>

# Optional (for future features)
MONGODB_URI=mongodb://localhost:27017/careerforge
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
```

## 🧪 Testing Authentication

### Test Email/Password Login (Demo Mode)
```
Email: any@email.com
Password: any-password
```

**⚠️ Note:** The demo accepts any email/password. In production, you need to:
1. Add database (MongoDB/PostgreSQL)
2. Hash passwords (bcrypt)
3. Implement proper user registration
4. Add email verification

### Test Google OAuth
1. Set up Google OAuth credentials
2. Click "Continue with Google"  
3. Authenticate with Google
4. Redirects to dashboard

## 🔨 Customization

### Add More Protected Routes

Edit `middleware.ts`:
```typescript
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resume/:path*",
    "/my-new-route/:path*",  // Add here
  ],
};
```

### Customize Session Duration

Edit `app/api/auth/[...nextauth]/route.ts`:
```typescript
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // ...
};
```

### Add Database Authentication

Replace the placeholder in `route.ts`:
```typescript
async authorize(credentials) {
  // Your database logic here
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  });
  
  // Verify password with bcrypt
  const isValid = await bcrypt.compare(
    credentials.password,
    user.password
  );
  
  if (isValid) return user;
  return null;
}
```

## 🚢 Production Deployment

### Vercel
```bash
# Set environment variables in Vercel dashboard
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET

# Deploy
vercel --prod
```

### Update Google OAuth
Add production URL to authorized redirect URIs:
```
https://your-domain.com/api/auth/callback/google
```

## 📚 Pages Overview

| Route | Protected | Description |
|-------|-----------|-------------|
| `/` | ❌ | Landing page |
| `/pricing` | ❌ | Pricing page |
| `/about` | ❌ | About page |
| `/auth/login` | ❌ | Login page |
| `/auth/signup` | ❌ | Signup page |
| `/dashboard` | ✅ | Protected dashboard |

## 🔗 Useful Links

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Google OAuth Setup](https://console.cloud.google.com/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT Sessions](https://next-auth.js.org/configuration/options#session)

## 🆘 Troubleshooting

### "NEXTAUTH_SECRET not set"
Generate one:
```bash
openssl rand -base64 32
```
Add to `.env.local`

### "Google OAuth not working"
1. Check redirect URI matches exactly
2. Verify credentials in Google Console
3. Check `.env.local` has correct CLIENT_ID/SECRET

### "Middleware not protecting routes"
1. Check `middleware.ts` matcher config
2. Restart dev server after middleware changes
3. Clear browser cookies/cache

### "Session not persisting"
1. Verify NEXTAUTH_SECRET is set
2. Check cookies are enabled
3. Verify NEXTAUTH_URL matches your domain

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js v4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Fonts**: Space Grotesk + Inter

## ✅ Production Checklist

Before deploying:

- [ ] Add database (MongoDB/PostgreSQL)
- [ ] Implement password hashing (bcrypt)
- [ ] Add email verification
- [ ] Set up proper user registration
- [ ] Configure production OAuth URLs
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Set up logging/monitoring
- [ ] Add error boundaries
- [ ] Test all auth flows

---

Built with ❤️ using Next.js 14 + NextAuth.js
