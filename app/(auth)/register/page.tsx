'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Chrome, Github, ArrowLeft, Check } from 'lucide-react';
import { Button, Input } from '@/components/ui';

const features = [
    'Publish to 7+ platforms with one click',
    'AI-powered optimal scheduling',
    'Unified analytics dashboard',
    'No credit card required',
];

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Implement Supabase auth
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-background-secondary to-accent/10 border-r border-border">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <Image
                            src="/logo.png"
                            alt="Pub"
                            width={48}
                            height={48}
                            className="rounded-xl"
                        />
                        <span className="text-2xl font-display font-bold text-foreground">Pub</span>
                    </div>

                    <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                        Start publishing smarter, not harder
                    </h2>
                    <p className="text-foreground-muted mb-8">
                        Join the platform that's helping creators and businesses dominate social media.
                    </p>

                    {/* Feature List */}
                    <ul className="space-y-4">
                        {features.map((feature, index) => (
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

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
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

                    {/* Header */}
                    <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                        Create your account
                    </h1>
                    <p className="text-foreground-muted mb-8">
                        Start your free trial today. No credit card required.
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
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            hint="Must be at least 8 characters"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Create account
                        </Button>
                    </form>

                    {/* Terms */}
                    <p className="mt-6 text-center text-sm text-foreground-subtle">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="text-primary hover:text-primary-hover">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:text-primary-hover">
                            Privacy Policy
                        </Link>
                    </p>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-foreground-muted">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-primary hover:text-primary-hover transition-colors font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
