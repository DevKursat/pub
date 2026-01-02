'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Chrome, Github, ArrowLeft, Check } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

export default function RegisterPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Dynamic import to avoid build-time errors
            const { signUp } = await import('@/lib/supabase');
            await signUp(formData.email, formData.password, formData.name);
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.message || 'Registration failed');
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
            <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-background-secondary to-accent/10 border-r border-border">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md"
                >
                    <div className="flex items-center gap-3 mb-12">
                        <Image src="/logo.png" alt="Pub" width={48} height={48} className="rounded-xl" />
                        <span className="text-2xl font-display font-bold text-foreground">Pub</span>
                    </div>

                    <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                        {t.auth.decorative.title}
                    </h2>
                    <p className="text-foreground-muted mb-8">{t.auth.decorative.description}</p>

                    <ul className="space-y-4">
                        {t.auth.features.map((feature, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                                className="flex items-center gap-3"
                            >
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-success" />
                                </div>
                                <span className="text-foreground-muted">{feature}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
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

                    <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                        {t.auth.register.title}
                    </h1>
                    <p className="text-foreground-muted mb-8">{t.auth.register.subtitle}</p>

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
                                {t.auth.register.orEmail}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label={t.auth.register.fullName}
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label={t.auth.register.email}
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label={t.auth.register.password}
                            type="password"
                            placeholder="••••••••"
                            hint={t.auth.register.passwordHint}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            {t.auth.register.createAccount}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-foreground-subtle">
                        {t.auth.register.terms}{' '}
                        <Link href="/terms" className="text-primary hover:text-primary-hover">
                            {t.auth.register.termsLink}
                        </Link>{' '}
                        {t.auth.register.and}{' '}
                        <Link href="/privacy" className="text-primary hover:text-primary-hover">
                            {t.auth.register.privacyLink}
                        </Link>
                    </p>

                    <p className="mt-8 text-center text-foreground-muted">
                        {t.auth.register.hasAccount}{' '}
                        <Link href="/login" className="text-primary hover:text-primary-hover transition-colors font-medium">
                            {t.auth.register.signIn}
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
