'use client';

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { message } from 'antd';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import {
    captureClientError,
    getErrorMessage,
    getRetryDelay,
    shouldRetryRequest,
} from '@/lib/errorHandling';

const ReactQueryDevtools = dynamic(
    () => import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools),
    { ssr: false }
);

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [toastApi, contextHolder] = message.useMessage();

    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error, query) => {
                        captureClientError(error, {
                            source: 'react_query',
                            action: 'query_failed',
                            extras: {
                                queryKey: JSON.stringify(query.queryKey),
                            },
                        });

                        // Show recoverable fetch failures without interrupting the whole UI.
                        if (query.state.data !== undefined) {
                            toastApi.error(
                                getErrorMessage(error, 'Could not refresh data. Please try again.')
                            );
                        }
                    },
                }),
                mutationCache: new MutationCache({
                    onError: (error, _variables, _context, mutation) => {
                        captureClientError(error, {
                            source: 'react_query',
                            action: 'mutation_failed',
                            extras: {
                                mutationKey: JSON.stringify(mutation.options.mutationKey ?? []),
                            },
                        });

                        // Avoid duplicate toasts when feature hooks already define onError handlers.
                        if (!mutation.options.onError) {
                            toastApi.error(
                                getErrorMessage(error, 'Request failed. Please try again.')
                            );
                        }
                    },
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: (failureCount, error) => shouldRetryRequest(error, failureCount, 3),
                        retryDelay: (attemptIndex) => getRetryDelay(attemptIndex),
                        refetchOnWindowFocus: false,
                    },
                    mutations: {
                        retry: (failureCount, error) => shouldRetryRequest(error, failureCount, 2),
                        retryDelay: (attemptIndex) => getRetryDelay(attemptIndex),
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {contextHolder}
            {children}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
