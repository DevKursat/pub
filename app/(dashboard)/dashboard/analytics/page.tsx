'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import { useAnalytics, useAccounts, formatNumber } from '@/lib/hooks';

export default function AnalyticsPage() {
    const { locale } = useTranslation();
    const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');
    const { analytics, loading, error } = useAnalytics(range);
    const { accounts } = useAccounts();

    const t = {
        title: locale === 'tr' ? 'Analitik' : 'Analytics',
        description: locale === 'tr' ? 'Performansını takip et' : 'Track your performance',
        followers: locale === 'tr' ? 'Takipçi' : 'Followers',
        posts: locale === 'tr' ? 'Gönderi' : 'Posts',
        reach: locale === 'tr' ? 'Erişim' : 'Reach',
        engagement: locale === 'tr' ? 'Etkileşim' : 'Engagement',
        likes: locale === 'tr' ? 'Beğeni' : 'Likes',
        comments: locale === 'tr' ? 'Yorum' : 'Comments',
        shares: locale === 'tr' ? 'Paylaşım' : 'Shares',
        views: locale === 'tr' ? 'Görüntülenme' : 'Views',
        last7Days: locale === 'tr' ? 'Son 7 Gün' : 'Last 7 Days',
        last30Days: locale === 'tr' ? 'Son 30 Gün' : 'Last 30 Days',
        last90Days: locale === 'tr' ? 'Son 90 Gün' : 'Last 90 Days',
        noData: locale === 'tr' ? 'Henüz veri yok' : 'No data yet',
        connectAccounts: locale === 'tr' ? 'Hesap bağlayarak başla' : 'Connect accounts to get started',
        platformBreakdown: locale === 'tr' ? 'Platform Dağılımı' : 'Platform Breakdown',
        engagementRate: locale === 'tr' ? 'Etkileşim Oranı' : 'Engagement Rate',
    };

    const stats = analytics ? [
        { label: t.followers, value: formatNumber(analytics.summary.totalFollowers), icon: Users, color: '#8b5cf6' },
        { label: t.posts, value: analytics.summary.totalPosts.toString(), icon: BarChart3, color: '#06b6d4' },
        { label: t.reach, value: formatNumber(analytics.summary.totalReach), icon: Eye, color: '#10b981' },
        { label: t.engagement, value: `${analytics.summary.engagementRate}%`, icon: TrendingUp, color: '#f59e0b' },
    ] : [];

    const engagementStats = analytics ? [
        { label: t.likes, value: formatNumber(analytics.summary.totalLikes), icon: Heart, color: '#ef4444' },
        { label: t.comments, value: formatNumber(analytics.summary.totalComments), icon: MessageCircle, color: '#3b82f6' },
        { label: t.shares, value: formatNumber(analytics.summary.totalShares), icon: Share2, color: '#22c55e' },
        { label: t.views, value: formatNumber(analytics.summary.totalViews), icon: Eye, color: '#a855f7' },
    ] : [];

    return (
        <>
            <Header title={t.title} description={t.description} />

            <div className="p-6 space-y-6">
                {/* Date Range Selector */}
                <div className="flex gap-2">
                    {[
                        { value: '7d', label: t.last7Days },
                        { value: '30d', label: t.last30Days },
                        { value: '90d', label: t.last90Days },
                    ].map((option) => (
                        <Button
                            key={option.value}
                            variant={range === option.value ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setRange(option.value as '7d' | '30d' | '90d')}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : accounts.length === 0 ? (
                    <Card className="text-center py-16">
                        <BarChart3 className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">{t.noData}</h3>
                        <p className="text-foreground-muted mb-6">{t.connectAccounts}</p>
                        <Button onClick={() => window.location.href = '/dashboard/accounts'}>
                            {locale === 'tr' ? 'Hesap Bağla' : 'Connect Account'}
                        </Button>
                    </Card>
                ) : (
                    <>
                        {/* Main Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: `${stat.color}15` }}
                                            >
                                                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                                <div className="text-sm text-foreground-muted">{stat.label}</div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Engagement Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.engagementRate}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    {engagementStats.map((stat, index) => (
                                        <div key={index} className="text-center">
                                            <div
                                                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
                                                style={{ backgroundColor: `${stat.color}15` }}
                                            >
                                                <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
                                            </div>
                                            <div className="text-xl font-bold text-foreground">{stat.value}</div>
                                            <div className="text-sm text-foreground-muted">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Platform Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.platformBreakdown}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {accounts.map((account, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-glass flex items-center justify-center">
                                                {account.platform_avatar ? (
                                                    <img src={account.platform_avatar} alt="" className="w-8 h-8 rounded" />
                                                ) : (
                                                    <span className="text-lg">📱</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-foreground">{account.platform_username}</div>
                                                <div className="text-sm text-foreground-muted capitalize">{account.platform}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-foreground">{formatNumber(account.followers_count)}</div>
                                                <div className="text-sm text-foreground-muted">{t.followers}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
}
