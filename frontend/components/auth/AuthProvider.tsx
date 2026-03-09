'use client';

import { useEffect } from 'react';
import { useAuthRefresh } from '@/hooks/useAuthRefresh';

/**
 * AuthProvider
 *
 * Mounted at the root layout. On every page load it silently calls
 * POST /auth/refresh — the browser automatically sends the HttpOnly
 * refreshToken cookie. If valid, the user is logged in without any
 * localStorage access. If not, they stay logged out (silently).
 * 
 * Does NOT redirect on refresh failure — that's handled by the 401
 * interceptor in api/client.ts, which checks the current pathname first.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refreshAuthSession } = useAuthRefresh();

  useEffect(() => {
    void refreshAuthSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
