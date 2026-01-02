'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    Zap,
    Calendar,
    BarChart3,
    Layers,
    Clock,
    Shield,
    Sparkles,
    Globe,
} from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'One-Click Publishing',
        description: 'Upload once, publish everywhere. Your content reaches all platforms in seconds.',
        color: '#8b5cf6',
    },
    {
        icon: Calendar,
        title: 'Smart Scheduling',
        description: 'AI-powered scheduling finds the optimal posting times for maximum engagement.',
        color: '#06b6d4',
    },
    {
        icon: BarChart3,
        title: 'Unified Analytics',
        description: 'Track performance across all platforms in one beautiful dashboard.',
        color: '#10b981',
    },
    {
        icon: Layers,
        title: 'Format Adaptation',
        description: 'Automatically resize and optimize content for each platform\'s requirements.',
        color: '#f59e0b',
    },
    {
        icon: Clock,
        title: 'Queue Management',
        description: 'Build content queues and let Pub handle the rest. Set it and forget it.',
        color: '#ec4899',
    },
    {
        icon: Shield,
        title: 'Account Safety',
        description: 'Smart rate limiting and human-like behavior patterns keep your accounts safe.',
        color: '#6366f1',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

export function Features() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/10 border border-accent/20"
                    >
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-accent">Powerful Features</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-display-md font-display font-bold text-foreground mb-6"
                    >
                        Everything You Need to{' '}
                        <span className="gradient-text">Dominate</span>
                        <br />
                        Social Media
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-foreground-muted"
                    >
                        Built for creators, agencies, and businesses who want to scale their
                        social presence without scaling their workload.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group relative p-6 rounded-2xl bg-background-secondary border border-border transition-all duration-300 hover:border-border-hover hover:shadow-card-hover"
                            >
                                {/* Glow Effect on Hover */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle at 50% 0%, ${feature.color}10 0%, transparent 70%)`,
                                    }}
                                />

                                {/* Icon */}
                                <div
                                    className="relative inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl transition-transform duration-300 group-hover:scale-110"
                                    style={{
                                        backgroundColor: `${feature.color}15`,
                                    }}
                                >
                                    <Icon
                                        className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                                        style={{ color: feature.color }}
                                    />
                                </div>

                                {/* Content */}
                                <h3 className="relative text-lg font-semibold text-foreground mb-2">
                                    {feature.title}
                                </h3>
                                <p className="relative text-foreground-muted leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <p className="text-foreground-muted">
                        And many more features coming soon...
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

export default Features;
