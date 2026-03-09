import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/apiClient';

export interface UserSettings {
    theme?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    language?: string;
    timezone?: string;
    [key: string]: string | boolean | undefined;
}

export const settingsApi = {
    getSettings: () => api.get('/settings').then((res) => res.data as UserSettings),
    updateSettings: (data: Partial<UserSettings>) => api.put('/settings', data).then((res) => res.data as UserSettings),
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
