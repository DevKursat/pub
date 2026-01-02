'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        trend: 'up' | 'down';
    };
    icon: LucideIcon;
    color: string;
}

export function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-background-secondary border border-border hover:border-border-hover transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div
                    className="p-2.5 rounded-xl"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
                {change && (
                    <span
                        className={cn(
                            'text-xs font-medium px-2 py-1 rounded-full',
                            change.trend === 'up'
                                ? 'text-success bg-success/10'
                                : 'text-error bg-error/10'
                        )}
                    >
                        {change.trend === 'up' ? '+' : ''}{change.value}%
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
            <div className="text-sm text-foreground-muted">{title}</div>
        </motion.div>
    );
}

export default StatsCard;
