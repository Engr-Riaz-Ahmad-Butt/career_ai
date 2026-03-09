import api from '../apiClient';
import { z } from 'zod';
import { updateProfileSchema, changePasswordSchema } from '../validation';

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const userApi = {
    getMe: () => api.get('/users/me').then((res) => res.data),
    updateMe: (data: UpdateProfileInput) => api.put('/users/me', data).then((res) => res.data),
    deleteMe: () => api.delete('/users/me').then((res) => res.data),
    changePassword: (data: ChangePasswordInput) => api.put('/users/me/password', data).then((res) => res.data),
    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/users/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => res.data);
    },
    getCredits: () => api.get('/users/me/credits').then((res) => res.data),
    getUsage: () => api.get('/users/me/usage').then((res) => res.data),
    getReferrals: () => api.get('/users/me/referrals').then((res) => res.data),
};
