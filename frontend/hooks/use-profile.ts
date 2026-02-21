import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api/user';
import { useAuthStore } from '@/store/authStore';

export const useProfile = () => {
    const queryClient = useQueryClient();
    const { setUser } = useAuthStore();

    const meQuery = useQuery({
        queryKey: ['profile', 'me'],
        queryFn: async () => {
            const data = await userApi.getMe();
            if (data?.data?.user) {
                setUser(data.data.user);
            }
            return data;
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });

    const updateProfileMutation = useMutation({
        mutationFn: userApi.updateMe,
        onSuccess: (data) => {
            setUser(data.data.user);
            queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
        },
    });

    return {
        me: meQuery,
        updateProfile: updateProfileMutation,
    };
};
