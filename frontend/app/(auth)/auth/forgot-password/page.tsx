'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { forgotPasswordSchema } from '@/lib/validation';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [serverError, setServerError] = useState('');
    const [submittedEmail, setSubmittedEmail] = useState('');

    const { forgotPassword } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setServerError('');
        setIsLoading(true);
        setSubmittedEmail(data.email);

        try {
            await forgotPassword.mutateAsync(data.email);
            setIsSubmitted(true);
        } catch (error) {
            setServerError(error instanceof Error ? error.message : 'Failed to send reset email.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-lg backdrop-blur-xl text-center">
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        Check your email
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        We've sent a password reset link to <span className="font-semibold text-slate-900 dark:text-white">{submittedEmail}</span>.
                    </p>
                    <Link href="/auth/login">
                        <Button variant="outline" className="w-full h-11 rounded-xl">
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </motion.div>
        );
    }

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
                    Forgot Password?
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-8">
                    Enter your email and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {serverError && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2"
                        >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {serverError}
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                            Email
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail className="h-4 w-4" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                className={`pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${errors.email ? 'border-rose-500' : ''}`}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-11 rounded-xl shadow-lg shadow-indigo-500/20"
                    >
                        {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                    </Button>

                    <Link
                        href="/auth/login"
                        className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors pt-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </form>
            </div>
        </motion.div>
    );
}
