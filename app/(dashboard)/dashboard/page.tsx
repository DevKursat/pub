'use client';

import { motion } from 'framer-motion';
import {
    Users,
    Send,
    Eye,
    TrendingUp,
    Calendar,
    Clock,
    ArrowRight,
    Plus,
} from 'lucide-react';
import { Header, StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Avatar } from '@/components/ui';

const stats = [
    {
        title: 'Total Followers',
        value: '124.5K',
        change: { value: 12.5, trend: 'up' as const },
        icon: Users,
        color: '#8b5cf6',
    },
    {
        title: 'Posts Published',
        value: '847',
        change: { value: 8.2, trend: 'up' as const },
        icon: Send,
        color: '#06b6d4',
    },
    {
        title: 'Total Reach',
        value: '2.4M',
        change: { value: 23.1, trend: 'up' as const },
        icon: Eye,
        color: '#10b981',
    },
    {
        title: 'Engagement Rate',
        value: '4.8%',
        change: { value: 0.3, trend: 'up' as const },
        icon: TrendingUp,
        color: '#f59e0b',
    },
];

const recentPosts = [
    {
        id: 1,
        content: 'Excited to announce our new feature launch! 🚀',
        platforms: ['twitter', 'instagram', 'linkedin'],
        status: 'published',
        engagement: '1.2K',
        time: '2 hours ago',
    },
    {
        id: 2,
        content: 'Behind the scenes of our product development...',
        platforms: ['tiktok', 'youtube'],
        status: 'scheduled',
        engagement: '-',
        time: 'Tomorrow, 10:00 AM',
    },
    {
        id: 3,
        content: '5 tips for growing your social media presence',
        platforms: ['twitter', 'instagram', 'facebook'],
        status: 'published',
        engagement: '856',
        time: '1 day ago',
    },
];

const scheduledPosts = [
    { time: '10:00 AM', title: 'Product announcement', platforms: 3 },
    { time: '2:00 PM', title: 'Customer testimonial', platforms: 2 },
    { time: '6:00 PM', title: 'Industry insights thread', platforms: 4 },
];

export default function DashboardPage() {
    return (
        <>
            <Header title="Dashboard" description="Welcome back, John 👋" />

            <div className="p-6 space-y-6">
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
                                <CardTitle>Recent Posts</CardTitle>
                                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                    View all
                                </Button>
                            </CardHeader>
                            <CardContent>
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
                                                        {post.status}
                                                    </Badge>
                                                    {post.status === 'published' && (
                                                        <span className="text-sm text-foreground-muted">{post.engagement}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                                    <CardTitle>Today's Schedule</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {scheduledPosts.map((post, index) => (
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
                                            <p className="text-xs text-foreground-subtle">{post.platforms} platforms</p>
                                        </div>
                                    </div>
                                ))}

                                <Button variant="secondary" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
                                    Schedule new post
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
