import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import type { AuthResponse } from '@/lib/api/endpoints/auth.api';

interface ResetPasswordInput {
    readonly token: string;
    readonly newPassword: string;
}

function applyAuthSuccess(
    payload: AuthResponse,
    setAccessToken: (token: string) => void,
    setUser: (user: AuthResponse['user']) => void
): void {
    setAccessToken(payload.accessToken);
    setUser(payload.user);
}

function applyLogoutSuccess(clearAuth: () => void, queryClient: QueryClient): void {
    clearAuth();
    queryClient.clear();
}

function isPendingMutations(states: readonly boolean[]): boolean {
    return states.some(Boolean);
}

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { setUser, setAccessToken, clearAuth } = useAuthStore();

    const signup = useMutation({
        mutationFn: authApi.register,
        onSuccess: (payload) => applyAuthSuccess(payload, setAccessToken, setUser),
    });
    const login = useMutation({
        mutationFn: authApi.login,
        onSuccess: (payload) => applyAuthSuccess(payload, setAccessToken, setUser),
    });
    const googleAuth = useMutation({
        mutationFn: authApi.googleAuth,
        onSuccess: (payload) => applyAuthSuccess(payload, setAccessToken, setUser),
    });
    const forgotPassword = useMutation({ mutationFn: authApi.forgotPassword });
    const resetPassword = useMutation({
        mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input.token, input.newPassword),
    });
    const logout = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => applyLogoutSuccess(clearAuth, queryClient),
    });

    return {
        signup,
        login,
        googleAuth,
        forgotPassword,
        resetPassword,
        logout,
        isLoading: isPendingMutations([signup.isPending, login.isPending, googleAuth.isPending, logout.isPending]),
    };
};
