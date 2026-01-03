'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

interface HeaderProps {
    title: string;
    description?: string;
}

export function Header({ title, description }: HeaderProps) {
    const { t, locale } = useTranslation();

    return (
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="flex items-center justify-between h-full px-6">
                {/* Title */}
                <div>
                    <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                    {description && (
                        <p className="text-sm text-foreground-muted">{description}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                        <input
                            type="text"
                            placeholder={locale === 'tr' ? 'Ara...' : 'Search...'}
                            className={cn(
                                'w-64 h-9 pl-9 pr-4 rounded-lg',
                                'bg-background-secondary border border-border',
                                'text-sm text-foreground placeholder:text-foreground-subtle',
                                'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20',
                                'transition-colors'
                            )}
                        />
                    </div>

                    {/* Notifications */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            'relative p-2 rounded-lg',
                            'text-foreground-muted hover:text-foreground',
                            'hover:bg-glass transition-colors'
                        )}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                    </motion.button>

                    {/* New Post */}
                    <Link href="/dashboard/publish">
                        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                            {t.dashboard.newPost}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
