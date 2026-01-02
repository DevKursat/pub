'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const plans = [
    {
        name: 'Free',
        description: 'Perfect for getting started',
        price: { monthly: 0, yearly: 0 },
        icon: Sparkles,
        color: '#71717a',
        features: [
            '3 social accounts',
            '10 posts per month',
            'Basic scheduling',
            'Standard support',
        ],
        cta: 'Get Started',
        popular: false,
    },
    {
        name: 'Pro',
        description: 'For growing creators',
        price: { monthly: 19, yearly: 190 },
        icon: Zap,
        color: '#8b5cf6',
        features: [
            'Unlimited accounts',
            '100 posts per month',
            'AI-powered scheduling',
            'Advanced analytics',
            'Priority support',
            'Custom branding',
        ],
        cta: 'Start Pro Trial',
        popular: true,
    },
    {
        name: 'Agency',
        description: 'For teams and agencies',
        price: { monthly: 49, yearly: 490 },
        icon: Building2,
        color: '#06b6d4',
        features: [
            'Everything in Pro',
            'Unlimited posts',
            'Team collaboration',
            'White-label reports',
            'API access',
            'Dedicated support',
            'Custom integrations',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

export function Pricing() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section id="pricing" className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-0 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-display-md font-display font-bold text-foreground mb-6"
                    >
                        Simple, Transparent{' '}
                        <span className="gradient-text">Pricing</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-2xl mx-auto text-lg text-foreground-muted mb-8"
                    >
                        Start free, upgrade when you're ready. No hidden fees, cancel anytime.
                    </motion.p>

                    {/* Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-4 p-1 rounded-xl bg-background-secondary border border-border"
                    >
                        <button
                            onClick={() => setIsYearly(false)}
                            className={cn(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                !isYearly
                                    ? 'bg-primary text-white'
                                    : 'text-foreground-muted hover:text-foreground'
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={cn(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                                isYearly
                                    ? 'bg-primary text-white'
                                    : 'text-foreground-muted hover:text-foreground'
                            )}
                        >
                            Yearly
                            <span className="px-1.5 py-0.5 text-xs rounded bg-success/20 text-success">
                                Save 20%
                            </span>
                        </button>
                    </motion.div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        const price = isYearly ? plan.price.yearly : plan.price.monthly;
                        const period = isYearly ? '/year' : '/month';

                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={cn(
                                    'relative p-8 rounded-2xl border transition-all duration-300',
                                    plan.popular
                                        ? 'bg-gradient-to-b from-primary/10 to-background-secondary border-primary/30 shadow-glow shadow-primary-glow'
                                        : 'bg-background-secondary border-border hover:border-border-hover hover:shadow-card-hover'
                                )}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute top-0 right-6 -translate-y-1/2">
                                        <span className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {/* Icon */}
                                <div
                                    className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-xl"
                                    style={{
                                        backgroundColor: `${plan.color}15`,
                                    }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: plan.color }} />
                                </div>

                                {/* Plan Details */}
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-foreground-muted mb-6">{plan.description}</p>

                                {/* Price */}
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-foreground">
                                        ${price}
                                    </span>
                                    {price > 0 && (
                                        <span className="text-foreground-muted">{period}</span>
                                    )}
                                </div>

                                {/* CTA */}
                                <Button
                                    variant={plan.popular ? 'primary' : 'secondary'}
                                    size="lg"
                                    className="w-full mb-8"
                                >
                                    {plan.cta}
                                </Button>

                                {/* Features */}
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div
                                                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${plan.color}20` }}
                                            >
                                                <Check
                                                    className="w-3 h-3"
                                                    style={{ color: plan.color }}
                                                />
                                            </div>
                                            <span className="text-foreground-muted">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Pricing;
