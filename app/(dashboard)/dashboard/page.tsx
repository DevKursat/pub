'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Send, Eye, TrendingUp, Calendar, Clock, ArrowRight, Plus, AlertCircle } from 'lucide-react';
import { Header, StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import { useAnalytics, usePosts, formatNumber, formatRelativeTime } from '@/lib/hooks';

export default function DashboardPage() {
    const { t, locale } = useTranslation();
    const { analytics, loading: analyticsLoading, error: analyticsError } = useAnalytics('7d');
    const { posts, loading: postsLoading } = usePosts({ limit: 5 });

    // Build stats from real data or fallback to zeros
    const stats = [
        {
            title: t.dashboard.stats.followers,
            value: analytics ? formatNumber(analytics.summary.totalFollowers) : '0',
            change: { value: 0, trend: 'up' as const },
            icon: Users,
            color: '#8b5cf6',
        },
        {
            title: t.dashboard.stats.posts,
            value: analytics ? analytics.summary.totalPosts.toString() : '0',
            change: { value: 0, trend: 'up' as const },
            icon: Send,
            color: '#06b6d4',
        },
        {
            title: t.dashboard.stats.reach,
            value: analytics ? formatNumber(analytics.summary.totalReach) : '0',
            change: { value: 0, trend: 'up' as const },
            icon: Eye,
            color: '#10b981',
        },
        {
            title: t.dashboard.stats.engagement,
            value: analytics ? `${analytics.summary.engagementRate}%` : '0%',
            change: { value: 0, trend: 'up' as const },
            icon: TrendingUp,
            color: '#f59e0b',
        },
    ];

    // Get scheduled posts for today
    const scheduledPosts = posts
        .filter(p => p.status === 'scheduled' && p.scheduled_for)
        .slice(0, 3)
        .map(p => ({
            time: new Date(p.scheduled_for!).toLocaleTimeString(locale === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
            title: p.content.slice(0, 30) + (p.content.length > 30 ? '...' : ''),
            platforms: p.platforms.length,
        }));

    // Get recent posts
    const recentPosts = posts.slice(0, 3).map(p => ({
        id: p.id,
        content: p.content,
        platforms: p.platforms,
        status: p.status,
        engagement: p.post_results?.reduce((sum, r) => sum + r.likes_count + r.comments_count, 0).toString() || '-',
        time: p.published_at
            ? formatRelativeTime(p.published_at, locale)
            : p.scheduled_for
                ? new Date(p.scheduled_for).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US')
                : '',
    }));

    const isLoading = analyticsLoading || postsLoading;
    const hasData = posts.length > 0 || (analytics && analytics.summary.totalFollowers > 0);

    return (
        <>
            <Header
                title={locale === 'tr' ? 'Panel' : 'Dashboard'}
                description={`${t.dashboard.welcome} 👋`}
            />

            <div className="p-6 space-y-6">
                {/* No data message */}
                {!isLoading && !hasData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {locale === 'tr' ? 'Henüz veri yok' : 'No data yet'}
                            </h3>
                            <p className="text-foreground-muted mb-6">
                                {locale === 'tr'
                                    ? 'Sosyal medya hesaplarını bağla ve ilk gönderini oluştur.'
                                    : 'Connect your social accounts and create your first post.'}
                            </p>
                            <Button onClick={() => window.location.href = '/dashboard/accounts'}>
                                {locale === 'tr' ? 'Hesap Bağla' : 'Connect Account'}
                            </Button>
                        </Card>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <StatsCard {...stat} />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Posts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <Card padding="none">
                            <CardHeader className="p-6 pb-4 flex-row items-center justify-between">
                                <CardTitle>{t.dashboard.recentPosts}</CardTitle>
                                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                    {t.dashboard.viewAll}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {recentPosts.length > 0 ? (
                                    <div className="divide-y divide-border">
                                        {recentPosts.map((post) => (
                                            <div key={post.id} className="px-6 py-4 hover:bg-glass transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-foreground truncate mb-2">{post.content}</p>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex -space-x-1">
                                                                {post.platforms.map((platform, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="w-5 h-5 rounded-full bg-background-tertiary border border-border flex items-center justify-center text-[10px] font-bold text-foreground-muted uppercase"
                                                                    >
                                                                        {platform[0]}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-foreground-subtle">{post.time}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant={post.status === 'published' ? 'success' : 'primary'}>
                                                            {post.status === 'published'
                                                                ? (locale === 'tr' ? 'Yayınlandı' : 'Published')
                                                                : (locale === 'tr' ? 'Planlandı' : 'Scheduled')
                                                            }
                                                        </Badge>
                                                        {post.status === 'published' && post.engagement !== '-' && (
                                                            <span className="text-sm text-foreground-muted">{post.engagement}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-6 py-8 text-center text-foreground-muted">
                                        {locale === 'tr' ? 'Henüz gönderi yok' : 'No posts yet'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Today's Schedule */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card>
                            <CardHeader className="flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <CardTitle>{t.dashboard.schedule}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {scheduledPosts.length > 0 ? (
                                    scheduledPosts.map((post, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-3 rounded-xl bg-glass border border-border"
                                        >
                                            <div className="flex items-center gap-2 text-sm text-foreground-subtle">
                                                <Clock className="w-4 h-4" />
                                                {post.time}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-foreground truncate">{post.title}</p>
                                                <p className="text-xs text-foreground-subtle">
                                                    {post.platforms} {locale === 'tr' ? 'platform' : 'platforms'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-foreground-muted">
                                        {locale === 'tr' ? 'Bugün için planlı gönderi yok' : 'No posts scheduled for today'}
                                    </div>
                                )}

                                <Button variant="secondary" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
                                    {t.dashboard.scheduleNew}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
