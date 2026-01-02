'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Chrome, Github, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Implement Supabase auth
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <Image
                            src="/logo.png"
                            alt="Pub"
                            width={48}
                            height={48}
                            className="rounded-xl"
                        />
                        <span className="text-2xl font-display font-bold text-foreground">Pub</span>
                    </div>

                    {/* Header */}
                    <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                        Welcome back
                    </h1>
                    <p className="text-foreground-muted mb-8">
                        Sign in to your account to continue
                    </p>

                    {/* Social Login */}
                    <div className="flex gap-3 mb-6">
                        <Button variant="secondary" className="flex-1" leftIcon={<Chrome className="w-5 h-5" />}>
                            Google
                        </Button>
                        <Button variant="secondary" className="flex-1" leftIcon={<Github className="w-5 h-5" />}>
                            GitHub
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 text-sm text-foreground-muted bg-background">
                                or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
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
                                <span className="text-sm text-foreground-muted">Remember me</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:text-primary-hover transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Sign in
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-foreground-muted">
                        Don't have an account?{' '}
                        <Link
                            href="/register"
                            className="text-primary hover:text-primary-hover transition-colors font-medium"
                        >
                            Sign up for free
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-background-secondary to-accent/10 border-l border-border">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center max-w-md"
                >
                    {/* Logo Illustration */}
                    <div className="relative mb-8">
                        <div className="w-64 h-64 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            >
                                <Image
                                    src="/logo.png"
                                    alt="Pub"
                                    width={128}
                                    height={128}
                                    className="rounded-2xl shadow-2xl"
                                />
                            </motion.div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                        Publish everywhere, instantly
                    </h2>
                    <p className="text-foreground-muted">
                        Join thousands of creators who save hours every week with Pub's intelligent social media distribution.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
