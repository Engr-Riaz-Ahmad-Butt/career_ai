import api from '../api-client';

export const userApi = {
    getMe: () => api.get('/users/me').then((res) => res.data),
    updateMe: (data: any) => api.put('/users/me', data).then((res) => res.data),
    deleteMe: () => api.delete('/users/me').then((res) => res.data),
    changePassword: (data: any) => api.put('/users/me/password', data).then((res) => res.data),
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
