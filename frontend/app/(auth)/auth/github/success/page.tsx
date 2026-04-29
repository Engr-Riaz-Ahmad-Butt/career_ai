'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// This page receives the JWT from the GitHub OAuth callback redirect.
// It stores the token and sends the user to the dashboard.
function GitHubSuccessContent() {
  const router      = useRouter();
  const params      = useSearchParams();
  const setToken    = useAuthStore((s) => s.setToken);

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      setToken(token);         // Store in Zustand (and localStorage via persist)
      router.replace('/dashboard');
    } else {
      router.replace('/auth/login?error=github_failed');
    }
  }, [params, router, setToken]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-muted-foreground text-sm font-medium">Signing you in with GitHub…</p>
      </div>
    </div>
  );
}

export default function GitHubSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    }>
      <GitHubSuccessContent />
    </Suspense>
  );
}
