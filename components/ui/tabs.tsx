'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabsProps {
    tabs: {
        id: string;
        label: string;
        icon?: ReactNode;
        content: ReactNode;
    }[];
    defaultTab?: string;
    className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);

    return (
        <div className={cn('w-full', className)}>
            {/* Tab List */}
            <div className="flex items-center gap-1 p-1 bg-background-secondary rounded-xl border border-border">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                            activeTab === tab.id
                                ? 'text-foreground'
                                : 'text-foreground-muted hover:text-foreground'
                        )}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-background-tertiary rounded-lg"
                                style={{ zIndex: -1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={cn(activeTab === tab.id ? 'block' : 'hidden')}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tabs;
