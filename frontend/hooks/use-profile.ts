import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api/endpoints/user.api';
import { useAuthStore } from '@/store/authStore';
import { queryKeys } from '@/lib/queryKeys';
import { STALE_TIMES, GC_TIMES } from '@/lib/queryConfig';

export const useProfile = () => {
    const queryClient = useQueryClient();
    const { setUser, isAuthenticated } = useAuthStore();

    const meQuery = useQuery({
        queryKey: queryKeys.user.me(),
        queryFn: async () => {
            const profile = await userApi.getProfile();
            setUser(profile);
            return profile;
        },
        enabled: typeof window !== 'undefined' && isAuthenticated,
        staleTime: STALE_TIMES.USER_PROFILE,
        gcTime: GC_TIMES.USER_PROFILE,
    });

    const updateProfileMutation = useMutation({
        mutationFn: userApi.updateProfile,
        onSuccess: (profile) => {
            setUser(profile);
            queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });
        },
    });

    return {
        me: meQuery,
        updateProfile: updateProfileMutation,
    };
};
