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
  const { setAccessToken, setUser, setIsLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { accessToken, user } = await authApi.refresh();
        setAccessToken(accessToken);
        setUser(user);
      } catch (error) {
        // Refresh failed — this is expected when user is not authenticated.
        // Authentication guards on protected routes will handle the redirect.
        // We clear state but DON'T redirect here (let the 401 interceptor handle it).
        clearAuth();
        
        // Uncomment for debugging auth initialization:
        // console.debug('[AuthProvider] Refresh failed or user not authenticated', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
