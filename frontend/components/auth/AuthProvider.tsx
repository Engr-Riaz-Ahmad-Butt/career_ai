'use client';

import { useEffect } from 'react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

/**
 * AuthProvider
 *
 * Mounted at the root layout. On every page load it silently calls
 * POST /auth/refresh — the browser automatically sends the HttpOnly
 * refreshToken cookie. If valid, the user is logged in without any
 * localStorage access. If not, they stay logged out.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setAccessToken, setUser, setIsLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { accessToken, user } = await authApi.refresh();
        setAccessToken(accessToken);
        setUser(user);
      } catch {
        // No valid session — user is logged out; clear any stale state
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
