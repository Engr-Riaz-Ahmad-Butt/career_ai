'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Zap, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { resetPasswordSchema } from '@/lib/validation';

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [serverError, setServerError] = useState('');

    const { resetPassword } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange',
    });

    const onSubmit = async (values: ResetPasswordData) => {
        if (!token) {
            setServerError('Invalid or missing reset token.');
            return;
        }

        setIsLoading(true);
        setServerError('');

        try {
            await resetPassword.mutateAsync({ token, newPassword: values.password });
            setIsSubmitted(true);
            window.setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (error) {
            setServerError(error instanceof Error ? error.message : 'Something went wrong.');
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm"
                >
                    {serverError}
                </motion.div>
            )}

            <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
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
                        {...register('password')}
                        className={`pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${errors.password ? 'border-rose-500' : ''}`}
                    />
                </div>
                {errors.password && (
                    <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300">
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
                        {...register('confirmPassword')}
                        className={`pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${errors.confirmPassword ? 'border-rose-500' : ''}`}
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
                )}
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
