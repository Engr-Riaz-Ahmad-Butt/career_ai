import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // Check for auth token in cookies or Authorization header
  // The Zustand store persists auth state in localStorage, which is not
  // accessible in edge middleware. We use a lightweight cookie-based check
  // as a first line of defense; the actual JWT validation happens server-side.
  const token =
    request.cookies.get('access_token')?.value ||
    request.headers.get('Authorization')?.replace('Bearer ', '');

  // If no token is found, this is likely a non-authenticated user
  // trying to access a protected route — redirect to login.
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Protect these routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/resume-builder/:path*',
    '/tailor/:path*',
    '/jobs/:path*',
    '/settings/:path*',
    '/interview-prep/:path*',
    '/documents/:path*',
    '/skill-gap/:path*',
    '/career-growth/:path*',
    '/visa-scholarship/:path*',
    '/ab-testing/:path*',
    '/analyze/:path*',
  ],
};

