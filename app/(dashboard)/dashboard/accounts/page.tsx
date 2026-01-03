'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, AlertCircle, Settings, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, Button, Badge, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { useAccounts, formatNumber } from '@/lib/hooks';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const platforms = [
    { id: 'tiktok', name: 'TikTok', color: '#ff0050', icon: '🎵' },
    { id: 'instagram', name: 'Instagram', color: '#e1306c', icon: '📸' },
    { id: 'youtube', name: 'YouTube', color: '#ff0000', icon: '▶️' },
    { id: 'twitter', name: 'Twitter/X', color: '#1da1f2', icon: '𝕏' },
    { id: 'facebook', name: 'Facebook', color: '#1877f2', icon: '📘' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0a66c2', icon: '💼' },
    { id: 'pinterest', name: 'Pinterest', color: '#e60023', icon: '📌' },
];

export default function AccountsPage() {
    const { locale } = useTranslation();
    const searchParams = useSearchParams();
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [connecting, setConnecting] = useState<string | null>(null);
    const { accounts, loading, error, disconnectAccount, connectAccount, fetchAccounts } = useAccounts();

    // Handle success/error from OAuth callback
    useEffect(() => {
        const success = searchParams.get('success');
        const errorParam = searchParams.get('error');

        if (success === 'connected') {
            fetchAccounts();
        }
        if (errorParam) {
            console.error('Connection error:', errorParam);
        }
    }, [searchParams, fetchAccounts]);

    const handleConnect = (platformId: string) => {
        setConnecting(platformId);
        connectAccount(platformId);
    };

    const handleDisconnect = async (accountId: string) => {
        if (confirm(locale === 'tr' ? 'Bu hesabı kaldırmak istediğinize emin misiniz?' : 'Are you sure you want to disconnect this account?')) {
            await disconnectAccount(accountId);
        }
    };

    const getPlatformInfo = (platformId: string) => platforms.find((p) => p.id === platformId);

    const t = {
        title: locale === 'tr' ? 'Bağlı Hesaplar' : 'Connected Accounts',
        description: locale === 'tr' ? 'Sosyal medya bağlantılarını yönet' : 'Manage your social media connections',
        yourAccounts: locale === 'tr' ? 'Hesapların' : 'Your Accounts',
        connectAccount: locale === 'tr' ? 'Hesap Bağla' : 'Connect Account',
        connected: locale === 'tr' ? 'Bağlı' : 'Connected',
        error: locale === 'tr' ? 'Hata' : 'Error',
        expired: locale === 'tr' ? 'Süresi Doldu' : 'Expired',
        pending: locale === 'tr' ? 'Bekliyor' : 'Pending',
        followers: locale === 'tr' ? 'takipçi' : 'followers',
        noAccounts: locale === 'tr' ? 'Henüz bağlı hesap yok' : 'No accounts connected yet',
        connectFirst: locale === 'tr' ? 'İlk hesabını bağla' : 'Connect your first account',
        availablePlatforms: locale === 'tr' ? 'Mevcut Platformlar' : 'Available Platforms',
        choosePlatform: locale === 'tr' ? 'Bağlanmak için platform seç' : 'Choose a platform to connect',
        connecting: locale === 'tr' ? 'Bağlanıyor...' : 'Connecting...',
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'connected':
                return <Badge variant="success"><Check className="w-3 h-3 mr-1" /> {t.connected}</Badge>;
            case 'error':
                return <Badge variant="error"><AlertCircle className="w-3 h-3 mr-1" /> {t.error}</Badge>;
            case 'expired':
                return <Badge variant="warning"><AlertCircle className="w-3 h-3 mr-1" /> {t.expired}</Badge>;
            default:
                return <Badge variant="default">{t.pending}</Badge>;
        }
    };

    return (
        <>
            <Header title={t.title} description={t.description} />

            <div className="p-6 space-y-8">
                {/* Connected Accounts */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">{t.yourAccounts}</h2>
                        <Button
                            size="sm"
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={() => setIsConnectModalOpen(true)}
                        >
                            {t.connectAccount}
                        </Button>
                    </div>

                    {loading ? (
                        <Card className="text-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                        </Card>
                    ) : accounts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {accounts.map((account, index) => {
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
                                                        {account.platform_avatar ? (
                                                            <img src={account.platform_avatar} alt="" className="w-10 h-10 rounded-lg" />
                                                        ) : (
                                                            platform?.icon
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-foreground">{platform?.name}</div>
                                                        <div className="text-sm text-foreground-muted">{account.platform_username}</div>
                                                    </div>
                                                </div>
                                                {getStatusBadge(account.connection_status)}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                                                <div className="text-sm">
                                                    <span className="text-foreground font-medium">{formatNumber(account.followers_count)}</span>
                                                    <span className="text-foreground-muted ml-1">{t.followers}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        className="p-1.5 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-glass transition-colors"
                                                        onClick={() => fetchAccounts()}
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-glass transition-colors">
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 rounded-lg text-foreground-subtle hover:text-error hover:bg-error/10 transition-colors"
                                                        onClick={() => handleDisconnect(account.id)}
                                                    >
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
                            <AlertCircle className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
                            <p className="text-foreground-muted mb-4">{t.noAccounts}</p>
                            <Button onClick={() => setIsConnectModalOpen(true)}>
                                {t.connectFirst}
                            </Button>
                        </Card>
                    )}
                </div>

                {/* Available Platforms */}
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">{t.availablePlatforms}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {platforms.map((platform, index) => {
                            const isConnected = accounts.some((a) => a.platform === platform.id);
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
                                        onClick={() => !isConnected && handleConnect(platform.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                                style={{ backgroundColor: `${platform.color}15` }}
                                            >
                                                {connecting === platform.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    platform.icon
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-foreground">{platform.name}</div>
                                                <div className="text-xs text-foreground-muted">
                                                    {connecting === platform.id
                                                        ? t.connecting
                                                        : isConnected
                                                            ? t.connected
                                                            : (locale === 'tr' ? 'Bağla' : 'Connect')}
                                                </div>
                                            </div>
                                            {isConnected && <Check className="w-5 h-5 text-success" />}
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
                title={t.connectAccount}
                description={t.choosePlatform}
                size="lg"
            >
                <div className="grid grid-cols-2 gap-3">
                    {platforms.map((platform) => {
                        const isConnected = accounts.some((a) => a.platform === platform.id);
                        return (
                            <button
                                key={platform.id}
                                disabled={isConnected || connecting === platform.id}
                                onClick={() => handleConnect(platform.id)}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border transition-all",
                                    isConnected
                                        ? "border-success/30 bg-success/5 cursor-not-allowed"
                                        : "border-border hover:border-border-hover hover:bg-glass"
                                )}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                    style={{ backgroundColor: `${platform.color}15` }}
                                >
                                    {connecting === platform.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        platform.icon
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <span className="font-medium text-foreground">{platform.name}</span>
                                    {isConnected && <Check className="w-4 h-4 text-success inline ml-2" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Modal>
        </>
    );
}
