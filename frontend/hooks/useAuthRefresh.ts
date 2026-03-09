import { useCallback } from 'react';
import { authApi } from '@/lib/api/endpoints/auth.api';
import { useAuthStore } from '@/store/authStore';

export function useAuthRefresh(): {
  readonly refreshAuthSession: () => Promise<void>;
} {
  const { setAccessToken, setUser, setIsLoading, clearAuth } = useAuthStore();

  const refreshAuthSession = useCallback(async () => {
    try {
      const { accessToken, user } = await authApi.refresh();
      setAccessToken(accessToken);
      setUser(user);
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth, setAccessToken, setIsLoading, setUser]);

  return {
    refreshAuthSession,
  };
}
