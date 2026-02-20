import api from '../api-client';

export const authApi = {
    signup: (data: any) => api.post('/auth/signup', data).then((res) => res.data),
    login: (data: any) => api.post('/auth/login', data).then((res) => res.data),
    googleAuth: (token: string) => api.post('/auth/google', { token }).then((res) => res.data),
    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }).then((res) => res.data),
    resetPassword: (data: any) => api.post('/auth/reset-password', data).then((res) => res.data),
    logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }).then((res) => res.data),
};
