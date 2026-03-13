import apiClient from '@/lib/api/client';

// ── Types ──────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  credits: number;
  plan: 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';
  avatar?: string;
  emailVerified?: boolean;
  onboardingComplete?: boolean;
  currentRole?: string;
  targetRole?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

// ── API Module ──────────────────────────────────────────────────────────────

let refreshPromise: Promise<AuthResponse> | null = null;

export const authApi = {
  /** POST /auth/register — sets HttpOnly refreshToken cookie */
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/register', data).then((r) => r.data.data),

  /** POST /auth/login — sets HttpOnly refreshToken cookie */
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/login', data).then((r) => r.data.data),

  /** POST /auth/logout — clears HttpOnly cookie on server */
  logout: (): Promise<void> => apiClient.post('/auth/logout').then(() => undefined),

  /**
   * POST /auth/refresh
   * Browser sends HttpOnly cookie automatically (withCredentials: true).
   * Returns new accessToken + refreshed user profile.
   * Uses Promise deduplication to prevent race conditions (e.g. React Strict Mode double-invocations).
   */
  refresh: (): Promise<AuthResponse> => {
    if (!refreshPromise) {
      refreshPromise = apiClient
        .post('/auth/refresh', {})
        .then((r) => r.data.data)
        .finally(() => {
          refreshPromise = null;
        });
    }
    return refreshPromise;
  },

  /** POST /auth/forgot-password */
  forgotPassword: (email: string): Promise<void> =>
    apiClient.post('/auth/forgot-password', { email }).then(() => undefined),

  /** POST /auth/reset-password */
  resetPassword: (token: string, newPassword: string): Promise<void> =>
    apiClient.post('/auth/reset-password', { token, newPassword }).then(() => undefined),

  /** POST /auth/verify-email */
  verifyEmail: (token: string): Promise<void> =>
    apiClient.post('/auth/verify-email', { token }).then(() => undefined),

  /** POST /auth/resend-verification */
  resendVerification: (email: string): Promise<void> =>
    apiClient.post('/auth/resend-verification', { email }).then(() => undefined),

  /** POST /auth/google — sets HttpOnly refreshToken cookie */
  googleAuth: (googleToken: string): Promise<AuthResponse> =>
    apiClient.post('/auth/google', { googleToken }).then((r) => r.data.data),
};

