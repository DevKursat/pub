'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

export default function HelpPage() {
    const { locale } = useTranslation();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const t = {
        title: locale === 'tr' ? 'Yardım' : 'Help',
        description: locale === 'tr' ? 'Destek ve sıkça sorulan sorular' : 'Support and frequently asked questions',
        searchPlaceholder: locale === 'tr' ? 'Soru ara...' : 'Search questions...',
        faq: locale === 'tr' ? 'Sıkça Sorulan Sorular' : 'FAQ',
        contact: locale === 'tr' ? 'İletişim' : 'Contact',
        contactDesc: locale === 'tr' ? 'Yardıma mı ihtiyacın var? Bize ulaş!' : 'Need help? Reach out to us!',
        email: locale === 'tr' ? 'E-posta Gönder' : 'Send Email',
        chat: locale === 'tr' ? 'Canlı Destek' : 'Live Chat',
        docs: locale === 'tr' ? 'Dokümantasyon' : 'Documentation',
        docsDesc: locale === 'tr' ? 'Detaylı kullanım kılavuzları' : 'Detailed usage guides',
        viewDocs: locale === 'tr' ? 'Dokümanlara Git' : 'View Documentation',
    };

    const faqs = locale === 'tr' ? [
        {
            question: 'Sosyal medya hesaplarımı nasıl bağlarım?',
            answer: 'Dashboard → Hesaplar sayfasına gidin. "Hesap Bağla" butonuna tıklayın ve bağlamak istediğiniz platformu seçin. OAuth ile güvenli bir şekilde hesabınızı bağlayabilirsiniz.',
        },
        {
            question: 'Gönderi zamanlama nasıl çalışır?',
            answer: 'Yayınla sayfasında içeriğinizi oluşturun, platformları seçin ve "Zamanla" seçeneğini açın. Tarih ve saat seçerek gönderinizi planlayabilirsiniz.',
        },
        {
            question: 'Hangi sosyal medya platformları destekleniyor?',
            answer: 'Şu anda TikTok, Instagram, YouTube, Twitter/X, Facebook, LinkedIn ve Pinterest desteklenmektedir.',
        },
        {
            question: 'Ücretsiz planda kaç gönderi yapabilirim?',
            answer: 'Ücretsiz planda aylık 10 gönderi yapabilirsiniz. Daha fazla gönderi için Starter veya Pro plana yükseltebilirsiniz.',
        },
        {
            question: 'Analitik verileri ne kadar güncel?',
            answer: 'Analitik verileri her 24 saatte bir güncellenir. Anlık veriler için platform uygulamalarını kontrol etmenizi öneririz.',
        },
        {
            question: 'Hesabımı nasıl silerim?',
            answer: 'Ayarlar → Güvenlik bölümünden "Hesabı Sil" seçeneğini kullanabilirsiniz. Bu işlem geri alınamaz.',
        },
    ] : [
        {
            question: 'How do I connect my social media accounts?',
            answer: 'Go to Dashboard → Accounts page. Click "Connect Account" button and select the platform you want to connect. You can securely connect your account via OAuth.',
        },
        {
            question: 'How does post scheduling work?',
            answer: 'Create your content on the Publish page, select platforms, and enable the "Schedule" option. Choose a date and time to schedule your post.',
        },
        {
            question: 'Which social media platforms are supported?',
            answer: 'We currently support TikTok, Instagram, YouTube, Twitter/X, Facebook, LinkedIn, and Pinterest.',
        },
        {
            question: 'How many posts can I make on the free plan?',
            answer: 'You can make 10 posts per month on the free plan. Upgrade to Starter or Pro plan for more posts.',
        },
        {
            question: 'How current is the analytics data?',
            answer: 'Analytics data is updated every 24 hours. For real-time data, we recommend checking the platform apps.',
        },
        {
            question: 'How do I delete my account?',
            answer: 'You can use the "Delete Account" option in Settings → Security. This action cannot be undone.',
        },
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Header title={t.title} description={t.description} />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-border rounded-xl text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                {/* FAQ */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-primary" />
                                <CardTitle>{t.faq}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {filteredFaqs.map((faq, index) => (
                                <div key={index} className="border border-border rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-glass transition-colors"
                                    >
                                        <span className="font-medium text-foreground">{faq.question}</span>
                                        {expandedFaq === index ? (
                                            <ChevronUp className="w-5 h-5 text-foreground-muted" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-foreground-muted" />
                                        )}
                                    </button>
                                    {expandedFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-4 pb-4"
                                        >
                                            <p className="text-foreground-muted">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contact & Documentation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <MessageCircle className="w-5 h-5 text-primary" />
                                    <div>
                                        <CardTitle>{t.contact}</CardTitle>
                                        <p className="text-sm text-foreground-muted">{t.contactDesc}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="secondary" className="w-full" leftIcon={<Mail className="w-4 h-4" />}>
                                    {t.email}
                                </Button>
                                <Button variant="secondary" className="w-full" leftIcon={<MessageCircle className="w-4 h-4" />}>
                                    {t.chat}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Book className="w-5 h-5 text-primary" />
                                    <div>
                                        <CardTitle>{t.docs}</CardTitle>
                                        <p className="text-sm text-foreground-muted">{t.docsDesc}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button variant="secondary" className="w-full" rightIcon={<ExternalLink className="w-4 h-4" />}>
                                    {t.viewDocs}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
