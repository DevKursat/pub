'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ToastProvider } from '@/components/ui/toast';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <ToastProvider>
            <div className="min-h-screen bg-background">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
                <motion.main
                    initial={false}
                    animate={{ marginLeft: isCollapsed ? 72 : 240 }}
                    transition={{ duration: 0.2 }}
                    className="min-h-screen"
                >
                    {children}
                </motion.main>
            </div>
        </ToastProvider>
    );
}
