import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';

export const settingsApi = {
    getSettings: () => api.get('/settings').then((res) => res.data),
    updateSettings: (data: any) => api.put('/settings', data).then((res) => res.data),
};

export const useSettings = () => {
    const queryClient = useQueryClient();

    const settingsQuery = useQuery({
        queryKey: ['settings'],
        queryFn: settingsApi.getSettings,
    });

    const updateSettingsMutation = useMutation({
        mutationFn: settingsApi.updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
    });

    return {
        settings: settingsQuery,
        updateSettings: updateSettingsMutation,
    };
};
