'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    private handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/dashboard';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mx-auto">
                            <AlertCircle className="w-10 h-10" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Something went wrong</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                We've encountered an unexpected error. Don't worry, your data is likely safe.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-left overflow-auto max-h-40">
                                <p className="text-xs font-mono text-red-500">{this.state.error.toString()}</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={this.handleReset}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-bold"
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={this.handleGoHome}
                                className="w-full rounded-xl h-11 font-bold"
                            >
                                <Home className="w-4 h-4 mr-2" /> Back to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
