import api from '../api-client';

export const profileApi = {
    getMe: () => api.get('/profile/me').then((res) => res.data),
    updateProfile: (data: any) => api.put('/profile', data).then((res) => res.data),
};
