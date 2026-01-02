'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, Linkedin } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/getpub', label: 'Twitter' },
    { icon: Github, href: 'https://github.com/getpub', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/company/getpub', label: 'LinkedIn' },
];

export function Footer() {
    const { t, locale } = useTranslation();

    const footerLinks = {
        [t.footer.links.product]: [
            { label: locale === 'tr' ? 'Özellikler' : 'Features', href: '#features' },
            { label: locale === 'tr' ? 'Fiyatlar' : 'Pricing', href: '#pricing' },
            { label: locale === 'tr' ? 'Entegrasyonlar' : 'Integrations', href: '#' },
            { label: locale === 'tr' ? 'Değişiklik Günlüğü' : 'Changelog', href: '#' },
        ],
        [t.footer.links.resources]: [
            { label: locale === 'tr' ? 'Dökümanlar' : 'Documentation', href: '#' },
            { label: 'API', href: '#' },
            { label: 'Blog', href: '#' },
            { label: locale === 'tr' ? 'Eğitimler' : 'Tutorials', href: '#' },
        ],
        [t.footer.links.company]: [
            { label: locale === 'tr' ? 'Hakkımızda' : 'About', href: '#' },
            { label: locale === 'tr' ? 'Kariyer' : 'Careers', href: '#' },
            { label: locale === 'tr' ? 'İletişim' : 'Contact', href: '#' },
            { label: locale === 'tr' ? 'Ortaklar' : 'Partners', href: '#' },
        ],
        [t.footer.links.legal]: [
            { label: locale === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy', href: '#' },
            { label: locale === 'tr' ? 'Kullanım Şartları' : 'Terms of Service', href: '#' },
            { label: locale === 'tr' ? 'Çerez Politikası' : 'Cookie Policy', href: '#' },
        ],
    };

    return (
        <footer className="relative border-t border-border bg-background-secondary">
            <div className="border-b border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                                {t.footer.newsletter.title}
                            </h3>
                            <p className="text-foreground-muted">
                                {t.footer.newsletter.description}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <Input
                                type="email"
                                placeholder={t.footer.newsletter.placeholder}
                                className="w-full sm:w-72"
                            />
                            <Button>{t.footer.newsletter.subscribe}</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    <div className="col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Pub"
                                width={40}
                                height={40}
                                className="rounded-xl"
                            />
                            <span className="text-xl font-display font-bold text-foreground">Pub</span>
                        </Link>
                        <p className="text-foreground-muted text-sm leading-relaxed mb-6 max-w-xs">
                            {locale === 'tr'
                                ? 'Nihai sosyal medya dağıtım platformu. Her yerde anında yayınla.'
                                : 'The ultimate social media distribution platform. Publish everywhere, instantly.'}
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

            <div className="border-t border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-foreground-subtle">
                            © {new Date().getFullYear()} Pub. {t.footer.copyright}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-foreground-subtle">
                            <span>{t.footer.builtWith}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
