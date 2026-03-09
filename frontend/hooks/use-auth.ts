import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { setUser, setAccessToken, clearAuth } = useAuthStore();

    const signupMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: ({ accessToken, user }) => {
            setAccessToken(accessToken);
            setUser(user);
        },
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: ({ accessToken, user }) => {
            setAccessToken(accessToken);
            setUser(user);
        },
    });

    const googleAuthMutation = useMutation({
        mutationFn: authApi.googleAuth,
        onSuccess: ({ accessToken, user }) => {
            setAccessToken(accessToken);
            setUser(user);
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: authApi.forgotPassword,
    });

    const resetPasswordMutation = useMutation({
        mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
            authApi.resetPassword(token, newPassword),
    });

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
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
