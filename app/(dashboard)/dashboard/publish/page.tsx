'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Image, Video, Calendar, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, Button, Badge, Modal } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import { useAccounts, usePosts } from '@/lib/hooks';

const platforms = [
    { id: 'tiktok', name: 'TikTok', color: '#ff0050', icon: '🎵' },
    { id: 'instagram', name: 'Instagram', color: '#e1306c', icon: '📸' },
    { id: 'youtube', name: 'YouTube', color: '#ff0000', icon: '▶️' },
    { id: 'twitter', name: 'Twitter/X', color: '#1da1f2', icon: '𝕏' },
    { id: 'facebook', name: 'Facebook', color: '#1877f2', icon: '📘' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0a66c2', icon: '💼' },
    { id: 'pinterest', name: 'Pinterest', color: '#e60023', icon: '📌' },
];

export default function PublishPage() {
    const { locale } = useTranslation();
    const { accounts, loading: accountsLoading } = useAccounts();
    const { createPost } = usePosts();

    const [content, setContent] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const t = {
        title: locale === 'tr' ? 'Yeni Gönderi' : 'New Post',
        description: locale === 'tr' ? 'İçeriğini oluştur ve paylaş' : 'Create and share your content',
        content: locale === 'tr' ? 'İçerik' : 'Content',
        contentPlaceholder: locale === 'tr' ? 'Ne paylaşmak istiyorsun?' : 'What do you want to share?',
        platforms: locale === 'tr' ? 'Platformlar' : 'Platforms',
        selectPlatforms: locale === 'tr' ? 'Paylaşılacak platformları seç' : 'Select platforms to post',
        noAccounts: locale === 'tr' ? 'Bağlı hesap yok' : 'No connected accounts',
        connectFirst: locale === 'tr' ? 'Önce hesap bağla' : 'Connect an account first',
        schedule: locale === 'tr' ? 'Zamanla' : 'Schedule',
        publishNow: locale === 'tr' ? 'Şimdi Yayınla' : 'Publish Now',
        schedulePost: locale === 'tr' ? 'Zamanla' : 'Schedule',
        date: locale === 'tr' ? 'Tarih' : 'Date',
        time: locale === 'tr' ? 'Saat' : 'Time',
        publishing: locale === 'tr' ? 'Yayınlanıyor...' : 'Publishing...',
        published: locale === 'tr' ? 'Yayınlandı!' : 'Published!',
        scheduled: locale === 'tr' ? 'Zamanlandı!' : 'Scheduled!',
        characters: locale === 'tr' ? 'karakter' : 'characters',
    };

    const connectedPlatforms = platforms.filter(p =>
        accounts.some(a => a.platform === p.id)
    );

    const togglePlatform = (platformId: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(p => p !== platformId)
                : [...prev, platformId]
        );
    };

    const handleSubmit = async () => {
        if (!content.trim() || selectedPlatforms.length === 0) return;

        setIsSubmitting(true);
        setError('');

        try {
            await createPost({
                content,
                platforms: selectedPlatforms,
                scheduled_for: isScheduled ? `${scheduledDate}T${scheduledTime}:00` : undefined,
                is_immediate: !isScheduled,
            });

            setSuccess(true);
            setContent('');
            setSelectedPlatforms([]);

            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header title={t.title} description={t.description} />

            <div className="p-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Success/Error Messages */}
                    {success && (
                        <div className="p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3">
                            <Check className="w-5 h-5 text-success" />
                            <span className="text-success">{isScheduled ? t.scheduled : t.published}</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-error" />
                            <span className="text-error">{error}</span>
                        </div>
                    )}

                    {/* Content Editor */}
                    <Card>
                        <label className="block text-sm font-medium text-foreground mb-3">{t.content}</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t.contentPlaceholder}
                            rows={6}
                            className="w-full bg-background-secondary border border-border rounded-xl p-4 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg hover:bg-glass text-foreground-muted hover:text-foreground transition-colors">
                                    <Image className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-glass text-foreground-muted hover:text-foreground transition-colors">
                                    <Video className="w-5 h-5" />
                                </button>
                            </div>
                            <span className="text-sm text-foreground-subtle">
                                {content.length} {t.characters}
                            </span>
                        </div>
                    </Card>

                    {/* Platform Selection */}
                    <Card>
                        <label className="block text-sm font-medium text-foreground mb-3">{t.platforms}</label>
                        <p className="text-sm text-foreground-muted mb-4">{t.selectPlatforms}</p>

                        {accountsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : connectedPlatforms.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {connectedPlatforms.map((platform) => {
                                    const isSelected = selectedPlatforms.includes(platform.id);
                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => togglePlatform(platform.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isSelected
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border hover:border-border-hover'
                                                }`}
                                        >
                                            <span className="text-xl">{platform.icon}</span>
                                            <span className="text-sm font-medium text-foreground">{platform.name}</span>
                                            {isSelected && <Check className="w-4 h-4 text-primary ml-auto" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <AlertCircle className="w-8 h-8 text-foreground-muted mx-auto mb-2" />
                                <p className="text-foreground-muted">{t.noAccounts}</p>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="mt-3"
                                    onClick={() => window.location.href = '/dashboard/accounts'}
                                >
                                    {t.connectFirst}
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Schedule Option */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-primary" />
                                <span className="font-medium text-foreground">{t.schedule}</span>
                            </div>
                            <button
                                onClick={() => setIsScheduled(!isScheduled)}
                                className={`w-12 h-6 rounded-full transition-colors ${isScheduled ? 'bg-primary' : 'bg-background-tertiary'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${isScheduled ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>

                        {isScheduled && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-foreground-muted mb-2">{t.date}</label>
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        className="w-full bg-background-secondary border border-border rounded-lg p-3 text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-foreground-muted mb-2">{t.time}</label>
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        className="w-full bg-background-secondary border border-border rounded-lg p-3 text-foreground"
                                    />
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Submit Button */}
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={!content.trim() || selectedPlatforms.length === 0 || isSubmitting}
                        leftIcon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    >
                        {isSubmitting ? t.publishing : isScheduled ? t.schedulePost : t.publishNow}
                    </Button>
                </motion.div>
            </div>
        </>
    );
}
