import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { setUser, clearAuth } = useAuthStore();

    const signupMutation = useMutation({
        mutationFn: authApi.signup,
        onSuccess: (data) => {
            const { user, accessToken, refreshToken } = data.data;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            setUser(user);
        },
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            const { user, accessToken, refreshToken } = data.data;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            setUser(user);
        },
    });

    const googleAuthMutation = useMutation({
        mutationFn: authApi.googleAuth,
        onSuccess: (data) => {
            const { user, accessToken, refreshToken } = data.data;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            setUser(user);
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: authApi.forgotPassword,
    });

    const resetPasswordMutation = useMutation({
        mutationFn: authApi.resetPassword,
    });

    const logoutMutation = useMutation({
        mutationFn: () => {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) return Promise.resolve();
            return authApi.logout(refreshToken);
        },
        onSuccess: () => {
            clearAuth();
            queryClient.clear();
        },
    });

    return {
        signup: signupMutation,
        login: loginMutation,
        googleAuth: googleAuthMutation,
        forgotPassword: forgotPasswordMutation,
        resetPassword: resetPasswordMutation,
        logout: logoutMutation,
        isLoading:
            signupMutation.isPending ||
            loginMutation.isPending ||
            googleAuthMutation.isPending ||
            logoutMutation.isPending,
    };
};
