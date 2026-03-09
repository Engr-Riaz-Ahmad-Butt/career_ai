'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import React from 'react';

interface ErrorFallbackProps {
    level: 'root' | 'feature' | 'component';
    featureName?: string;
    error?: Error | null;
    onReset?: () => void;
}

export function ErrorFallback({ level, featureName, onReset }: ErrorFallbackProps) {
    if (level === 'root') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                            <AlertTriangle className="w-12 h-12 text-destructive" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            An unexpected error occurred. Our team has been notified. Please reload the page to continue.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload page
                    </button>
                </div>
            </div>
        );
    }

    if (level === 'feature') {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="max-w-sm w-full text-center space-y-4 p-6 rounded-xl border border-border bg-card">
                    <div className="flex justify-center">
                        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                            <AlertTriangle className="w-7 h-7 text-destructive" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-base">
                            {featureName ? `${featureName} is unavailable` : 'Feature unavailable'}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            This section encountered an error. The rest of the app is still working.
                        </p>
                    </div>
                    {onReset && (
                        <button
                            onClick={onReset}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Try again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // component level — compact inline
    return (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/40 text-sm text-muted-foreground">
            <AlertTriangle className="w-4 h-4 shrink-0 text-destructive" />
            <span className="flex-1">This component failed to load.</span>
            {onReset && (
                <button
                    onClick={onReset}
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary transition-colors"
                >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                </button>
            )}
        </div>
    );
}
