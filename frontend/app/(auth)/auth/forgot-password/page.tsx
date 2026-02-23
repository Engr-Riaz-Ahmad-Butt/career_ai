'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Something went wrong. Please try again.');
            }

            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email.');
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
                        We've sent a password reset link to <span className="font-semibold text-slate-900 dark:text-white">{email}</span>.
                    </p>
                    <Link href="/auth/login">
                        <Button variant="outline" className="w-full">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
