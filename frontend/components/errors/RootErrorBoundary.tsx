'use client';

import * as Sentry from '@sentry/nextjs';
import React from 'react';

import { useAuthStore } from '@/store/authStore';

import { ErrorFallback } from './ErrorFallback';

interface RootErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface RootErrorBoundaryProps {
    children: React.ReactNode;
}

/**
 * LEVEL 1 — Root Error Boundary
 *
 * Placed at the top of app/layout.tsx.
 * Catches catastrophic failures that break the entire page.
 * Shows a full-page friendly error with a page reload button.
 * Never shows raw error stacks to the user.
 */
export class RootErrorBoundary extends React.Component<
    RootErrorBoundaryProps,
    RootErrorBoundaryState
> {
    state: RootErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        const user = useAuthStore.getState().user;
        Sentry.withScope((scope) => {
            scope.setTag('error_boundary', 'root');
            if (user?.id) scope.setUser({ id: user.id, email: user.email });
            if (typeof window !== 'undefined') {
                scope.setContext('route', { path: window.location.pathname });
            }
            scope.setContext('react', { componentStack: info.componentStack });
            Sentry.captureException(error);
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback
                    level="root"
                    error={this.state.error}
                />
            );
        }

        return this.props.children;
    }
}
