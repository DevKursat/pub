'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';

const footerLinks = {
    Product: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Integrations', href: '#' },
        { label: 'Changelog', href: '#' },
    ],
    Resources: [
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Tutorials', href: '#' },
    ],
    Company: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Partners', href: '#' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
    ],
};

const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/getpub', label: 'Twitter' },
    { icon: Github, href: 'https://github.com/getpub', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/company/getpub', label: 'LinkedIn' },
];

export function Footer() {
    return (
        <footer className="relative border-t border-border bg-background-secondary">
            {/* Newsletter Section */}
            <div className="border-b border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                                Stay in the loop
                            </h3>
                            <p className="text-foreground-muted">
                                Get product updates, tips, and news delivered to your inbox.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full sm:w-72"
                            />
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    {/* Logo & Description */}
                    <div className="col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <span className="text-lg font-bold text-white font-display">P</span>
                            </div>
                            <span className="text-xl font-display font-bold text-foreground">Pub</span>
                        </Link>
                        <p className="text-foreground-muted text-sm leading-relaxed mb-6 max-w-xs">
                            The ultimate social media distribution platform. Publish everywhere, instantly.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 rounded-lg bg-glass border border-border text-foreground-muted hover:text-foreground hover:border-border-hover transition-colors"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-semibold text-foreground mb-4">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-foreground-subtle">
                            © {new Date().getFullYear()} Pub. All rights reserved.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-foreground-subtle">
                            <span>Built with</span>
                            <span className="text-error">❤</span>
                            <span>for creators worldwide</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
