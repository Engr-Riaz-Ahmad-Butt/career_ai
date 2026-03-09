/**
 * lib/api/client.ts
 *
 * Single Axios instance for the entire frontend.
 * - Reads access token from Zustand memory store (NOT localStorage)
 * - Sends cookies automatically via withCredentials: true (required for HttpOnly cookie refresh)
 * - On 401: silently attempts token refresh then retries the original request
 * - On refresh failure: clears auth state and redirects to login
 */

import axios, { AxiosRequestConfig } from 'axios';

import { captureClientError } from '@/lib/errorHandling';
import { useAuthStore } from '@/store/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Sends HttpOnly refreshToken cookie automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request Interceptor ────────────────────────────────────────────────────
// Reads access token from Zustand memory (never localStorage)

apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────────
// On 401: POST /auth/refresh (cookie is sent automatically), retry original request.
// On refresh failure: clear auth and redirect to login.

let isRefreshing = false;
let refreshQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

function processQueue(token: string | null, error?: unknown) {
    refreshQueue.forEach((entry) => {
        if (token) {
            entry.resolve(token);
            return;
        }
        entry.reject(error ?? new Error('Token refresh failed'));
    });
    refreshQueue = [];
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: (AxiosRequestConfig & { _retry?: boolean }) | undefined = error.config;

        if (!originalRequest) {
            captureClientError(error, {
                source: 'api_client',
                action: 'response_without_request_config',
            });
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue this request until the ongoing refresh completes
                return new Promise((resolve, reject) => {
                    refreshQueue.push({
                        resolve: (newToken: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            }
                            resolve(apiClient(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Cookie is sent automatically — no token in body needed
                const { data } = await axios.post(
                    `${BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = data?.data?.accessToken;
                const user = data?.data?.user;

                if (!newAccessToken) {
                    throw new Error('Refresh response missing access token');
                }

                useAuthStore.getState().setAccessToken(newAccessToken);
                if (user) useAuthStore.getState().setUser(user);

                processQueue(newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(null, refreshError);

                captureClientError(refreshError, {
                    source: 'api_client',
                    action: 'token_refresh_failed',
                    extras: {
                        requestUrl: originalRequest.url,
                        requestMethod: originalRequest.method,
                    },
                });

                // Refresh failed — clear state and redirect (but not from auth pages)
                useAuthStore.getState().clearAuth();
                if (typeof window !== 'undefined') {
                    const currentPath = window.location.pathname;
                    const isAuthPage = currentPath.startsWith('/auth');
                    if (!isAuthPage) {
                        window.location.href = '/auth/login';
                    }
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        captureClientError(error, {
            source: 'api_client',
            action: 'request_failed',
            extras: {
                requestUrl: originalRequest.url,
                requestMethod: originalRequest.method,
                statusCode: error.response?.status,
            },
        });

        return Promise.reject(error);
    }
);

export default apiClient;
