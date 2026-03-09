'use client';

import React from 'react';
import { ErrorFallback } from './ErrorFallback';
import * as Sentry from '@sentry/nextjs';
import { useAuthStore } from '@/store/authStore';

interface FeatureErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface FeatureErrorBoundaryProps {
    children: React.ReactNode;
    /** Human-readable feature name shown in the error card (e.g. "Resume Builder") */
    featureName?: string;
}

/**
 * LEVEL 2 — Feature Error Boundary
 *
 * Wraps each major feature page (Resume Builder, Cover Letter, Dashboard, etc.).
 * If one feature crashes, the rest of the app (sidebar, navigation) keeps working.
 * Shows a feature-specific error card with a retry button.
 *
 * Usage:
 *   <FeatureErrorBoundary featureName="Resume Builder">
 *     <ResumeBuilderPage />
 *   </FeatureErrorBoundary>
 */
export class FeatureErrorBoundary extends React.Component<
    FeatureErrorBoundaryProps,
    FeatureErrorBoundaryState
> {
    state: FeatureErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): FeatureErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        const user = useAuthStore.getState().user;
        Sentry.withScope((scope) => {
            scope.setTag('error_boundary', 'feature');
            if (this.props.featureName) scope.setTag('feature', this.props.featureName);
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
                    level="feature"
                    featureName={this.props.featureName}
                    error={this.state.error}
                    onReset={this.handleReset}
                />
            );
        }

        return this.props.children;
    }
}
