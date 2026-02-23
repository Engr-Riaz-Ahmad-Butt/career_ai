'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to reset password.');
            }

            setIsSubmitted(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Password Reset Successful
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    Your password has been successfully reset. Redirecting you to login...
                </p>
                <Link href="/auth/login">
                    <Button className="w-full">
                        Go to Login
                    </Button>
                </Link>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-rose-100 dark:bg-rose-900/20 p-3">
                        <AlertCircle className="h-10 w-10 text-rose-600 dark:text-rose-400" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Invalid Link
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link href="/auth/forgot-password">
                    <Button className="w-full">
                        Request New Link
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm"
                >
                    {error}
                </motion.div>
            )}

            <div className="space-y-2">
                <Label htmlFor="password text-slate-700 dark:text-slate-300">
                    New Password
                </Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword text-slate-700 dark:text-slate-300">
                    Confirm New Password
                </Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                    </div>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
                {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-lg backdrop-blur-xl">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 p-2">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">CareerAI</span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
                    Reset Password
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-8">
                    Please enter your new password below.
                </p>

                <Suspense fallback={<div className="text-center text-slate-600 dark:text-slate-400">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </motion.div>
    );
}
