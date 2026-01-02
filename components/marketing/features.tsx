'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Calendar, BarChart3, Layers, Clock, Shield, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

const featureIcons = [Zap, Calendar, BarChart3, Layers, Clock, Shield];
const featureColors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
const featureKeys = ['multiPlatform', 'scheduler', 'analytics', 'queue', 'formatting', 'collaboration'] as const;

export function Features() {
    const { t } = useTranslation();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const features = featureKeys.map((key, i) => ({
        icon: featureIcons[i],
        title: t.features.items[key].title,
        description: t.features.items[key].description,
        color: featureColors[i],
    }));

    return (
        <section id="features" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/10 border border-accent/20"
                    >
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-accent">{t.features.title}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6"
                    >
                        {t.features.title}{' '}
                        <span className="gradient-text">{t.features.titleHighlight}</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-foreground-muted"
                    >
                        {t.features.subtitle}
                    </motion.p>
                </div>

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
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle at 50% 0%, ${feature.color}10 0%, transparent 70%)`,
                                    }}
                                />

                                <div
                                    className="relative inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: `${feature.color}15` }}
                                >
                                    <Icon
                                        className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                                        style={{ color: feature.color }}
                                    />
                                </div>

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
            </div>
        </section>
    );
}

export default Features;
