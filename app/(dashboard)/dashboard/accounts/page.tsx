'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, AlertCircle, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, Button, Badge, Modal, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { useAccounts, formatNumber } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';

interface PlatformInfo {
    id: string;
    name: string;
    icon: string;
    color: string;
    authMethod: string;
    status: string;
    description: string;
}

export default function AccountsPage() {
    const { locale } = useTranslation();
    const searchParams = useSearchParams();
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<PlatformInfo | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState('');
    const [connectionSuccess, setConnectionSuccess] = useState('');
    const { accounts, loading, disconnectAccount, fetchAccounts } = useAccounts();
    const [platforms, setPlatforms] = useState<PlatformInfo[]>([]);

    // Form state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Fetch platforms on mount
    useEffect(() => {
        fetch('/api/social/connect')
            .then(res => res.json())
            .then(data => setPlatforms(data.platforms || []))
            .catch(() => { });
    }, []);

    useEffect(() => {
        const success = searchParams.get('success');
        if (success === 'connected') {
            fetchAccounts();
        }
    }, [searchParams, fetchAccounts]);

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
        comingSoon: locale === 'tr' ? 'Yakında' : 'Coming Soon',
        beta: locale === 'tr' ? 'Beta' : 'Beta',
        username: locale === 'tr' ? 'Kullanıcı Adı' : 'Username',
        email: locale === 'tr' ? 'E-posta' : 'Email',
        password: locale === 'tr' ? 'Şifre' : 'Password',
        connect: locale === 'tr' ? 'Bağlan' : 'Connect',
        back: locale === 'tr' ? 'Geri' : 'Back',
        loginWith: locale === 'tr' ? 'ile giriş yap' : 'login with',
    };

    const getPlatformInfo = (platformId: string) => platforms.find((p) => p.id === platformId);

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

    const handleDisconnect = async (accountId: string) => {
        if (confirm(locale === 'tr' ? 'Bu hesabı kaldırmak istediğinize emin misiniz?' : 'Are you sure you want to disconnect this account?')) {
            await disconnectAccount(accountId);
        }
    };

    const handlePlatformSelect = (platform: PlatformInfo) => {
        if (platform.status === 'coming_soon') return;
        setSelectedPlatform(platform);
        setConnectionError('');
        setConnectionSuccess('');
        setUsername('');
        setEmail('');
        setPassword('');
    };

    const handleConnect = async () => {
        if (!selectedPlatform || !password) return;

        const usernameValue = selectedPlatform.authMethod === 'email_password' ? email : username;
        if (!usernameValue) return;

        setConnecting(true);
        setConnectionError('');

        try {
            const response = await fetch('/api/social/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: selectedPlatform.id,
                    username: usernameValue,
                    email: email || undefined,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error);
            }

            setConnectionSuccess(`${data.account.displayName || data.account.username} başarıyla bağlandı!`);
            fetchAccounts();

            setTimeout(() => {
                setSelectedPlatform(null);
                setIsConnectModalOpen(false);
                setConnectionSuccess('');
            }, 2000);
        } catch (error: any) {
            setConnectionError(error.message);
        } finally {
            setConnecting(false);
        }
    };

    const renderConnectForm = () => {
        if (!selectedPlatform) return null;

        const isEmailAuth = selectedPlatform.authMethod === 'email_password';

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                        style={{ backgroundColor: `${selectedPlatform.color}15` }}
                    >
                        {selectedPlatform.icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-lg">{selectedPlatform.name}</h3>
                        <p className="text-sm text-foreground-muted">{selectedPlatform.description}</p>
                        {selectedPlatform.status === 'beta' && (
                            <Badge variant="warning" className="mt-1">{t.beta}</Badge>
                        )}
                    </div>
                </div>

                {isEmailAuth ? (
                    <Input
                        label={t.email}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                    />
                ) : (
                    <Input
                        label={t.username}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={`${selectedPlatform.name} ${t.username.toLowerCase()}`}
                    />
                )}

                {selectedPlatform.id === 'twitter' && (
                    <Input
                        label={`${t.email} (opsiyonel)`}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                    />
                )}

                <div className="relative">
                    <Input
                        label={t.password}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-foreground-muted hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>

                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-warning">
                    ⚠️ {locale === 'tr'
                        ? 'Şifreniz güvenli bir şekilde saklanır ve sadece hesap bağlantısı için kullanılır.'
                        : 'Your password is stored securely and only used for account connection.'}
                </div>

                <Button
                    className="w-full"
                    onClick={handleConnect}
                    disabled={connecting || !password || (isEmailAuth ? !email : !username)}
                    leftIcon={connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                >
                    {connecting ? t.connecting : t.connect}
                </Button>
            </div>
        );
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
                            onClick={() => { setIsConnectModalOpen(true); setSelectedPlatform(null); }}
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
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                                    style={{ backgroundColor: `${platform?.color || '#666'}15` }}
                                                >
                                                    {platform?.icon || '📱'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-foreground truncate">
                                                        {account.platform_name || account.platform_username}
                                                    </div>
                                                    <div className="text-sm text-foreground-muted truncate">
                                                        @{account.platform_username}
                                                    </div>
                                                    {account.followers_count > 0 && (
                                                        <div className="text-sm text-foreground-subtle mt-1">
                                                            {formatNumber(account.followers_count)} {t.followers}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {getStatusBadge(account.connection_status)}
                                                    <button
                                                        onClick={() => handleDisconnect(account.id)}
                                                        className="p-2 rounded-lg hover:bg-error/10 text-foreground-muted hover:text-error transition-colors"
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
                            <div className="text-4xl mb-4">📱</div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{t.noAccounts}</h3>
                            <p className="text-foreground-muted mb-6">{t.connectFirst}</p>
                            <Button onClick={() => setIsConnectModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                {t.connectAccount}
                            </Button>
                        </Card>
                    )}
                </div>
            </div>

            {/* Connect Modal */}
            <Modal
                isOpen={isConnectModalOpen}
                onClose={() => { setIsConnectModalOpen(false); setSelectedPlatform(null); }}
                title={selectedPlatform ? `${selectedPlatform.name} ${t.loginWith}` : t.availablePlatforms}
            >
                {connectionError && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{connectionError}</span>
                    </div>
                )}

                {connectionSuccess && (
                    <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm flex items-center gap-2">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        {connectionSuccess}
                    </div>
                )}

                {selectedPlatform ? (
                    <div>
                        <button
                            onClick={() => setSelectedPlatform(null)}
                            className="text-sm text-foreground-muted hover:text-foreground mb-4 flex items-center gap-1"
                        >
                            ← {t.back}
                        </button>
                        {renderConnectForm()}
                    </div>
                ) : (
                    <>
                        <p className="text-foreground-muted mb-6">{t.choosePlatform}</p>
                        <div className="grid grid-cols-2 gap-3">
                            {platforms.map((platform) => {
                                const isConnected = accounts.some((a) => a.platform === platform.id);
                                const isComingSoon = platform.status === 'coming_soon';
                                const isBeta = platform.status === 'beta';

                                return (
                                    <button
                                        key={platform.id}
                                        onClick={() => handlePlatformSelect(platform)}
                                        disabled={isConnected || isComingSoon}
                                        className={cn(
                                            'flex items-center gap-3 p-4 rounded-xl border transition-all text-left relative',
                                            isConnected
                                                ? 'border-success/30 bg-success/5 cursor-not-allowed'
                                                : isComingSoon
                                                    ? 'border-border bg-glass/50 cursor-not-allowed opacity-60'
                                                    : 'border-border hover:border-primary hover:bg-primary/5'
                                        )}
                                    >
                                        <span className="text-2xl">{platform.icon}</span>
                                        <div className="flex-1">
                                            <span className="font-medium text-foreground block">{platform.name}</span>
                                            <span className="text-xs text-foreground-muted">{platform.description}</span>
                                        </div>
                                        {isConnected && (
                                            <Check className="w-4 h-4 text-success absolute right-3 top-3" />
                                        )}
                                        {isComingSoon && (
                                            <span className="text-xs bg-background-tertiary px-2 py-0.5 rounded absolute right-3 top-3">{t.comingSoon}</span>
                                        )}
                                        {isBeta && !isConnected && (
                                            <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded absolute right-3 top-3">{t.beta}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
}
