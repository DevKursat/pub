'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, AlertCircle, Settings, Trash2, RefreshCw } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';

const platforms = [
    {
        id: 'tiktok',
        name: 'TikTok',
        color: '#ff0050',
        icon: '🎵',
        description: 'Short-form video content',
    },
    {
        id: 'instagram',
        name: 'Instagram',
        color: '#e1306c',
        icon: '📸',
        description: 'Photos, Stories & Reels',
    },
    {
        id: 'youtube',
        name: 'YouTube',
        color: '#ff0000',
        icon: '▶️',
        description: 'Long-form video content',
    },
    {
        id: 'twitter',
        name: 'Twitter/X',
        color: '#1da1f2',
        icon: '𝕏',
        description: 'Tweets and threads',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        color: '#1877f2',
        icon: '📘',
        description: 'Posts and Stories',
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        color: '#0a66c2',
        icon: '💼',
        description: 'Professional content',
    },
    {
        id: 'pinterest',
        name: 'Pinterest',
        color: '#e60023',
        icon: '📌',
        description: 'Visual discovery',
    },
];

interface ConnectedAccount {
    id: string;
    platform: string;
    username: string;
    followers: string;
    status: 'connected' | 'error' | 'expired';
    lastSync: string;
}

const connectedAccounts: ConnectedAccount[] = [
    { id: '1', platform: 'instagram', username: '@johndoe', followers: '45.2K', status: 'connected', lastSync: '5 min ago' },
    { id: '2', platform: 'twitter', username: '@johndoe', followers: '23.1K', status: 'connected', lastSync: '12 min ago' },
    { id: '3', platform: 'youtube', username: 'John Doe', followers: '12.3K', status: 'error', lastSync: '1 hour ago' },
];

export default function AccountsPage() {
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

    const getPlatformInfo = (platformId: string) => {
        return platforms.find((p) => p.id === platformId);
    };

    return (
        <>
            <Header title="Connected Accounts" description="Manage your social media connections" />

            <div className="p-6 space-y-8">
                {/* Connected Accounts */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">Your Accounts</h2>
                        <Button
                            size="sm"
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={() => setIsConnectModalOpen(true)}
                        >
                            Connect Account
                        </Button>
                    </div>

                    {connectedAccounts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {connectedAccounts.map((account, index) => {
                                const platform = getPlatformInfo(account.platform);
                                return (
                                    <motion.div
                                        key={account.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card variant="interactive" hover>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                                        style={{ backgroundColor: `${platform?.color}15` }}
                                                    >
                                                        {platform?.icon}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-foreground">{platform?.name}</div>
                                                        <div className="text-sm text-foreground-muted">{account.username}</div>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={account.status === 'connected' ? 'success' : 'error'}
                                                >
                                                    {account.status === 'connected' ? (
                                                        <><Check className="w-3 h-3 mr-1" /> Connected</>
                                                    ) : (
                                                        <><AlertCircle className="w-3 h-3 mr-1" /> Error</>
                                                    )}
                                                </Badge>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                                                <div className="text-sm">
                                                    <span className="text-foreground font-medium">{account.followers}</span>
                                                    <span className="text-foreground-muted ml-1">followers</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button className="p-1.5 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-glass transition-colors">
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-glass transition-colors">
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg text-foreground-subtle hover:text-error hover:bg-error/10 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="text-center py-12">
                            <p className="text-foreground-muted mb-4">No accounts connected yet</p>
                            <Button onClick={() => setIsConnectModalOpen(true)}>
                                Connect your first account
                            </Button>
                        </Card>
                    )}
                </div>

                {/* Available Platforms */}
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Available Platforms</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {platforms.map((platform, index) => {
                            const isConnected = connectedAccounts.some((a) => a.platform === platform.id);
                            return (
                                <motion.div
                                    key={platform.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        variant="interactive"
                                        hover
                                        className={cn(
                                            'cursor-pointer transition-all duration-300',
                                            isConnected && 'border-success/30 bg-success/5'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                                style={{ backgroundColor: `${platform.color}15` }}
                                            >
                                                {platform.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-foreground">{platform.name}</div>
                                                <div className="text-xs text-foreground-muted">{platform.description}</div>
                                            </div>
                                            {isConnected && (
                                                <Check className="w-5 h-5 text-success" />
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Connect Modal */}
            <Modal
                isOpen={isConnectModalOpen}
                onClose={() => setIsConnectModalOpen(false)}
                title="Connect Account"
                description="Choose a platform to connect"
                size="lg"
            >
                <div className="grid grid-cols-2 gap-3">
                    {platforms.map((platform) => (
                        <button
                            key={platform.id}
                            className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-border-hover hover:bg-glass transition-all"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                style={{ backgroundColor: `${platform.color}15` }}
                            >
                                {platform.icon}
                            </div>
                            <span className="font-medium text-foreground">{platform.name}</span>
                        </button>
                    ))}
                </div>
            </Modal>
        </>
    );
}
