'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Chrome, Github, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

export default function LoginPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Dynamic import to avoid build-time errors
            const { signIn } = await import('@/lib/supabase');
            await signIn(email, password);
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { signInWithGoogle } = await import('@/lib/supabase');
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGithubLogin = async () => {
        try {
            const { signInWithGithub } = await import('@/lib/supabase');
            await signInWithGithub();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t.nav.features}
                    </Link>

                    <div className="flex items-center gap-3 mb-8">
                        <Image src="/logo.png" alt="Pub" width={48} height={48} className="rounded-xl" />
                        <span className="text-2xl font-display font-bold text-foreground">Pub</span>
                    </div>

                    <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                        {t.auth.login.title}
                    </h1>
                    <p className="text-foreground-muted mb-8">{t.auth.login.subtitle}</p>

                    {error && (
                        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 mb-6">
                        <Button variant="secondary" className="flex-1" leftIcon={<Chrome className="w-5 h-5" />} onClick={handleGoogleLogin}>
                            Google
                        </Button>
                        <Button variant="secondary" className="flex-1" leftIcon={<Github className="w-5 h-5" />} onClick={handleGithubLogin}>
                            GitHub
                        </Button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 text-sm text-foreground-muted bg-background">
                                {t.auth.login.orEmail}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label={t.auth.login.email}
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label={t.auth.login.password}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-border bg-background-secondary text-primary focus:ring-primary/50"
                                />
                                <span className="text-sm text-foreground-muted">{t.auth.login.rememberMe}</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-primary hover:text-primary-hover transition-colors">
                                {t.auth.login.forgotPassword}
                            </Link>
                        </div>

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            {t.auth.login.signIn}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-foreground-muted">
                        {t.auth.login.noAccount}{' '}
                        <Link href="/register" className="text-primary hover:text-primary-hover transition-colors font-medium">
                            {t.auth.login.signUpFree}
                        </Link>
                    </p>
                </motion.div>
            </div>

            <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-background-secondary to-accent/10 border-l border-border">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center max-w-md"
                >
                    <div className="relative mb-8">
                        <div className="w-64 h-64 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Image src="/logo.png" alt="Pub" width={128} height={128} className="rounded-2xl shadow-2xl" />
                            </motion.div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                        {t.auth.decorative.title}
                    </h2>
                    <p className="text-foreground-muted">{t.auth.decorative.description}</p>
                </motion.div>
            </div>
        </div>
    );
}
