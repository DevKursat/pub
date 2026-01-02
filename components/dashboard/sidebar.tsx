'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Send,
    Calendar,
    BarChart3,
    Users,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, Button } from '@/components/ui';

const mainNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Send, label: 'Publish', href: '/dashboard/publish' },
    { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Users, label: 'Accounts', href: '/dashboard/accounts' },
];

const bottomNavItems = [
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    { icon: HelpCircle, label: 'Help', href: '/dashboard/help' },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

        return (
            <Link href={item.href}>
                <motion.div
                    className={cn(
                        'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                        isActive
                            ? 'text-foreground bg-glass'
                            : 'text-foreground-muted hover:text-foreground hover:bg-glass',
                        isCollapsed && 'justify-center'
                    )}
                    whileHover={{ x: isCollapsed ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isActive && (
                        <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                    )}
                    <Icon className={cn('relative w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="relative text-sm font-medium whitespace-nowrap overflow-hidden"
                            >
                                {item.label}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </Link>
        );
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 72 : 240 }}
            transition={{ duration: 0.2 }}
            className={cn(
                'fixed left-0 top-0 bottom-0 z-40',
                'flex flex-col',
                'bg-background-secondary border-r border-border'
            )}
        >
            {/* Logo */}
            <div className={cn('flex items-center h-16 px-4', isCollapsed && 'justify-center')}>
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Pub"
                        width={36}
                        height={36}
                        className="rounded-lg flex-shrink-0"
                    />
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="text-lg font-display font-bold text-foreground overflow-hidden"
                            >
                                Pub
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* New Post Button */}
            <div className={cn('px-3 mb-4', isCollapsed && 'px-2')}>
                <Button
                    size={isCollapsed ? 'md' : 'lg'}
                    className={cn('w-full', isCollapsed && 'px-0')}
                    leftIcon={<Plus className="w-5 h-5" />}
                >
                    {!isCollapsed && 'New Post'}
                </Button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {mainNavItems.map((item) => (
                    <NavItem key={item.href} item={item} />
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="px-3 py-4 space-y-1 border-t border-border">
                {bottomNavItems.map((item) => (
                    <NavItem key={item.href} item={item} />
                ))}

                {/* User Profile */}
                <div
                    className={cn(
                        'flex items-center gap-3 p-2 mt-4 rounded-xl bg-glass border border-border',
                        isCollapsed && 'justify-center'
                    )}
                >
                    <Avatar size="sm" fallback="JD" status="online" />
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="flex-1 overflow-hidden"
                            >
                                <div className="text-sm font-medium text-foreground truncate">John Doe</div>
                                <div className="text-xs text-foreground-subtle truncate">Pro Plan</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={onToggle}
                className={cn(
                    'absolute -right-3 top-20',
                    'w-6 h-6 rounded-full',
                    'bg-background-secondary border border-border',
                    'flex items-center justify-center',
                    'text-foreground-muted hover:text-foreground',
                    'transition-colors shadow-sm'
                )}
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                ) : (
                    <ChevronLeft className="w-4 h-4" />
                )}
            </button>
        </motion.aside>
    );
}

export default Sidebar;
