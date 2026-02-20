import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import { useAuthStore } from '@/store/authStore';

export const useProfile = () => {
    const queryClient = useQueryClient();
    const { setUser } = useAuthStore();

    const meQuery = useQuery({
        queryKey: ['profile', 'me'],
        queryFn: async () => {
            const data = await profileApi.getMe();
            if (data?.data?.user) {
                setUser(data.data.user);
            }
            return data;
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });

    const updateProfileMutation = useMutation({
        mutationFn: profileApi.updateProfile,
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
