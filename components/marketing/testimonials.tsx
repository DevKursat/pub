'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Content Creator',
        avatar: '👩‍💻',
        rating: 5,
        content: {
            en: 'Pub has completely transformed how I manage my social media. I used to spend hours posting to each platform individually. Now it\'s just one click!',
            tr: 'Pub sosyal medyamı yönetme şeklimi tamamen değiştirdi. Her platforma tek tek gönderi paylaşmak için saatler harcardım. Artık tek tıkla halloluyor!'
        },
    },
    {
        name: 'Marcus Williams',
        role: 'Digital Marketing Agency',
        avatar: '👨‍💼',
        rating: 5,
        content: {
            en: 'We manage 50+ client accounts and Pub has been a game-changer. The analytics alone are worth the subscription.',
            tr: '50\'den fazla müşteri hesabı yönetiyoruz ve Pub oyun değiştirici oldu. Sadece analitikler bile aboneliğe değer.'
        },
    },
    {
        name: 'Emma Rodriguez',
        role: 'Influencer',
        avatar: '👩‍🎤',
        rating: 5,
        content: {
            en: 'The AI scheduling feature is incredible. My engagement has gone up 40% since I started using Pub\'s optimal timing suggestions.',
            tr: 'Yapay zeka zamanlama özelliği inanılmaz. Pub\'ın optimal zamanlama önerilerini kullanmaya başladığımdan beri etkileşimim %40 arttı.'
        },
    },
];

export function Testimonials() {
    const { t, locale } = useTranslation();

    return (
        <section className="relative py-32 overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6"
                    >
                        {t.testimonials.title}{' '}
                        <span className="gradient-text">{t.testimonials.titleHighlight}</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-2xl mx-auto text-lg text-foreground-muted"
                    >
                        {t.testimonials.subtitle}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-background-secondary border border-border hover:border-border-hover transition-all duration-300"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>

                            <p className="text-foreground-muted mb-6 leading-relaxed">
                                "{testimonial.content[locale as 'en' | 'tr']}"
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{testimonial.avatar}</div>
                                <div>
                                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                                    <div className="text-sm text-foreground-subtle">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
