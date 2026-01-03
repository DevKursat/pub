'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Edit, Trash2, MoreHorizontal, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, Button, Badge } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import { usePosts, formatRelativeTime } from '@/lib/hooks';

const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'youtube', name: 'YouTube', icon: '▶️' },
    { id: 'twitter', name: 'Twitter/X', icon: '𝕏' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌' },
];

export default function SchedulePage() {
    const { locale } = useTranslation();
    const { posts, loading, error } = usePosts({ status: 'scheduled' });

    const t = {
        title: locale === 'tr' ? 'Zamanlama' : 'Schedule',
        description: locale === 'tr' ? 'Planlanmış gönderilerini yönet' : 'Manage your scheduled posts',
        noScheduled: locale === 'tr' ? 'Planlanmış gönderi yok' : 'No scheduled posts',
        createFirst: locale === 'tr' ? 'İlk planlanmış gönderini oluştur' : 'Create your first scheduled post',
        newPost: locale === 'tr' ? 'Yeni Gönderi' : 'New Post',
        today: locale === 'tr' ? 'Bugün' : 'Today',
        tomorrow: locale === 'tr' ? 'Yarın' : 'Tomorrow',
        thisWeek: locale === 'tr' ? 'Bu Hafta' : 'This Week',
        scheduled: locale === 'tr' ? 'Planlandı' : 'Scheduled',
        platforms: locale === 'tr' ? 'platform' : 'platforms',
    };

    const getPlatformIcon = (platformId: string) => {
        return platforms.find(p => p.id === platformId)?.icon || '📱';
    };

    const formatScheduleDate = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (d.toDateString() === now.toDateString()) {
            return t.today + ' - ' + d.toLocaleTimeString(locale === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
        }
        if (d.toDateString() === tomorrow.toDateString()) {
            return t.tomorrow + ' - ' + d.toLocaleTimeString(locale === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Header title={t.title} description={t.description} />

            <div className="p-6">
                {/* Header Actions */}
                <div className="flex justify-end mb-6">
                    <Button
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={() => window.location.href = '/dashboard/publish'}
                    >
                        {t.newPost}
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-4">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card variant="interactive" hover>
                                    <div className="flex items-start gap-4">
                                        {/* Time indicator */}
                                        <div className="flex-shrink-0 w-20 text-center">
                                            <div className="text-2xl font-bold text-foreground">
                                                {new Date(post.scheduled_for!).getHours().toString().padStart(2, '0')}
                                            </div>
                                            <div className="text-sm text-foreground-muted">
                                                :{new Date(post.scheduled_for!).getMinutes().toString().padStart(2, '0')}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="w-px h-20 bg-border" />

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-foreground line-clamp-2 mb-3">{post.content}</p>

                                            <div className="flex items-center gap-4">
                                                {/* Platforms */}
                                                <div className="flex items-center gap-1">
                                                    {post.platforms.map((p, i) => (
                                                        <span key={i} className="text-lg" title={p}>
                                                            {getPlatformIcon(p)}
                                                        </span>
                                                    ))}
                                                    <span className="text-sm text-foreground-muted ml-1">
                                                        {post.platforms.length} {t.platforms}
                                                    </span>
                                                </div>

                                                {/* Date */}
                                                <div className="flex items-center gap-1 text-sm text-foreground-muted">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatScheduleDate(post.scheduled_for!)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <Badge variant="primary">{t.scheduled}</Badge>
                                            <button className="p-2 rounded-lg hover:bg-glass text-foreground-muted hover:text-foreground transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-error/10 text-foreground-muted hover:text-error transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-16">
                        <Calendar className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">{t.noScheduled}</h3>
                        <p className="text-foreground-muted mb-6">{t.createFirst}</p>
                        <Button onClick={() => window.location.href = '/dashboard/publish'}>
                            {t.newPost}
                        </Button>
                    </Card>
                )}
            </div>
        </>
    );
}
