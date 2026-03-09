'use client';

import React from 'react';
import { ErrorFallback } from './ErrorFallback';
import * as Sentry from '@sentry/nextjs';
import { useAuthStore } from '@/store/authStore';

interface ComponentErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface ComponentErrorBoundaryProps {
    children: React.ReactNode;
    /** Optional label for logging context (e.g. "AIEnhanceButton") */
    componentName?: string;
}

/**
 * LEVEL 3 — Component Error Boundary
 *
 * Wraps individual AI widgets and interactive components
 * (AIEnhanceButton, ATSPanel, CoverLetterGenerator, etc.).
 * If an AI component crashes, the rest of the form/page still works.
 * Shows a compact inline retry button.
 *
 * Usage:
 *   <ComponentErrorBoundary componentName="ATSPanel">
 *     <ATSPanel resumeId={id} />
 *   </ComponentErrorBoundary>
 */
export class ComponentErrorBoundary extends React.Component<
    ComponentErrorBoundaryProps,
    ComponentErrorBoundaryState
> {
    state: ComponentErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): ComponentErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        const user = useAuthStore.getState().user;
        Sentry.withScope((scope) => {
            scope.setTag('error_boundary', 'component');
            if (this.props.componentName) scope.setTag('component', this.props.componentName);
            if (user?.id) scope.setUser({ id: user.id, email: user.email });
            if (typeof window !== 'undefined') {
                scope.setContext('route', { path: window.location.pathname });
            }
            scope.setContext('react', { componentStack: info.componentStack });
            Sentry.captureException(error);
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback
                    level="component"
                    error={this.state.error}
                    onReset={this.handleReset}
                />
            );
        }

        return this.props.children;
    }
}
