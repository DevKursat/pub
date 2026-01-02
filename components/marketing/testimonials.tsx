'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Avatar } from '@/components/ui';

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Content Creator',
        avatar: null,
        content: 'Pub has completely transformed my workflow. What used to take me 2 hours now takes 5 minutes. The scheduling AI is incredibly smart.',
        rating: 5,
    },
    {
        name: 'Marcus Johnson',
        role: 'Social Media Manager',
        avatar: null,
        content: 'Managing 15 client accounts used to be a nightmare. With Pub, I can handle everything from one dashboard. Game changer!',
        rating: 5,
    },
    {
        name: 'Emily Rodriguez',
        role: 'Agency Owner',
        avatar: null,
        content: 'The analytics alone are worth the subscription. Being able to see all platforms in one view has helped us make better content decisions.',
        rating: 5,
    },
    {
        name: 'David Kim',
        role: 'Startup Founder',
        avatar: null,
        content: 'We went from 1K to 50K followers in 3 months using Pub\'s scheduling and analytics. The ROI is incredible.',
        rating: 5,
    },
    {
        name: 'Lisa Thompson',
        role: 'Influencer',
        avatar: null,
        content: 'Finally, a tool that actually understands how creators work. The format adaptation feature saves me hours every week.',
        rating: 5,
    },
    {
        name: 'Alex Rivera',
        role: 'Marketing Director',
        avatar: null,
        content: 'Enterprise-grade features at startup-friendly pricing. Pub is the best decision we made for our social strategy.',
        rating: 5,
    },
];

export function Testimonials() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
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
                        Loved by{' '}
                        <span className="gradient-text">Creators</span>
                        <br />
                        Worldwide
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-2xl mx-auto text-lg text-foreground-muted"
                    >
                        Join thousands of creators who are scaling their social presence with Pub.
                    </motion.p>
                </div>

                {/* Testimonials Grid */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative p-6 rounded-2xl bg-background-secondary border border-border hover:border-border-hover transition-all duration-300 hover:shadow-card-hover group"
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20 group-hover:text-primary/30 transition-colors" />

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-warning text-warning"
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-foreground-muted leading-relaxed mb-6">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src={testimonial.avatar}
                                    fallback={testimonial.name}
                                    size="md"
                                />
                                <div>
                                    <div className="font-medium text-foreground">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-foreground-subtle">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default Testimonials;
