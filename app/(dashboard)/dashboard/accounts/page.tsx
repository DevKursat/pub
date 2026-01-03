'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, AlertCircle, Trash2, Loader2, Eye, EyeOff, Send } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, Button, Badge, Modal, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { useAccounts, formatNumber } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';

const platforms = [
    { id: 'instagram', name: 'Instagram', color: '#e1306c', icon: '📸', authType: 'credentials' },
    { id: 'telegram', name: 'Telegram', color: '#0088cc', icon: '📨', authType: 'phone' },
    { id: 'tiktok', name: 'TikTok', color: '#ff0050', icon: '🎵', authType: 'coming_soon' },
    { id: 'youtube', name: 'YouTube', color: '#ff0000', icon: '▶️', authType: 'coming_soon' },
    { id: 'twitter', name: 'Twitter/X', color: '#1da1f2', icon: '𝕏', authType: 'coming_soon' },
    { id: 'facebook', name: 'Facebook', color: '#1877f2', icon: '📘', authType: 'coming_soon' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0a66c2', icon: '💼', authType: 'coming_soon' },
];

export default function AccountsPage() {
    const { locale } = useTranslation();
    const searchParams = useSearchParams();
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<typeof platforms[0] | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState('');
    const [connectionSuccess, setConnectionSuccess] = useState('');
    const { accounts, loading, disconnectAccount, fetchAccounts } = useAccounts();

    // Instagram state
    const [igUsername, setIgUsername] = useState('');
    const [igPassword, setIgPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Telegram state
    const [tgPhone, setTgPhone] = useState('');
    const [tgCode, setTgCode] = useState('');
    const [tgPhoneCodeHash, setTgPhoneCodeHash] = useState('');
    const [tgStep, setTgStep] = useState<'phone' | 'code'>('phone');

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
        username: locale === 'tr' ? 'Kullanıcı Adı' : 'Username',
        password: locale === 'tr' ? 'Şifre' : 'Password',
        phone: locale === 'tr' ? 'Telefon Numarası' : 'Phone Number',
        code: locale === 'tr' ? 'Doğrulama Kodu' : 'Verification Code',
        sendCode: locale === 'tr' ? 'Kod Gönder' : 'Send Code',
        verify: locale === 'tr' ? 'Doğrula' : 'Verify',
        connect: locale === 'tr' ? 'Bağlan' : 'Connect',
        phonePlaceholder: locale === 'tr' ? '+90 5XX XXX XX XX' : '+1 XXX XXX XXXX',
        codePlaceholder: locale === 'tr' ? '6 haneli kod' : '6-digit code',
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

    const handlePlatformSelect = (platform: typeof platforms[0]) => {
        if (platform.authType === 'coming_soon') return;
        setSelectedPlatform(platform);
        setConnectionError('');
        setConnectionSuccess('');
        setTgStep('phone');
        setTgPhoneCodeHash('');
    };

    const handleInstagramConnect = async () => {
        if (!igUsername || !igPassword) return;
        setConnecting(true);
        setConnectionError('');

        try {
            const response = await fetch('/api/social/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: 'instagram',
                    action: 'connect',
                    username: igUsername,
                    password: igPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error);
            }

            setConnectionSuccess(`${data.account.username} başarıyla bağlandı!`);
            setIgUsername('');
            setIgPassword('');
            fetchAccounts();

            setTimeout(() => {
                setSelectedPlatform(null);
                setIsConnectModalOpen(false);
            }, 2000);
        } catch (error: any) {
            setConnectionError(error.message);
        } finally {
            setConnecting(false);
        }
    };

    const handleTelegramSendCode = async () => {
        if (!tgPhone) return;
        setConnecting(true);
        setConnectionError('');

        try {
            const response = await fetch('/api/social/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: 'telegram',
                    action: 'send_code',
                    phone: tgPhone,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error);
            }

            setTgPhoneCodeHash(data.phoneCodeHash);
            setTgStep('code');
            setConnectionSuccess(data.message);
        } catch (error: any) {
            setConnectionError(error.message);
        } finally {
            setConnecting(false);
        }
    };

    const handleTelegramVerify = async () => {
        if (!tgCode || !tgPhoneCodeHash) return;
        setConnecting(true);
        setConnectionError('');

        try {
            const response = await fetch('/api/social/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: 'telegram',
                    action: 'verify_code',
                    phone: tgPhone,
                    code: tgCode,
                    phoneCodeHash: tgPhoneCodeHash,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error);
            }

            setConnectionSuccess(`Telegram başarıyla bağlandı!`);
            setTgPhone('');
            setTgCode('');
            fetchAccounts();

            setTimeout(() => {
                setSelectedPlatform(null);
                setIsConnectModalOpen(false);
            }, 2000);
        } catch (error: any) {
            setConnectionError(error.message);
        } finally {
            setConnecting(false);
        }
    };

    const renderPlatformForm = () => {
        if (!selectedPlatform) return null;

        if (selectedPlatform.id === 'instagram') {
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${selectedPlatform.color}15` }}
                        >
                            {selectedPlatform.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">{selectedPlatform.name}</h3>
                            <p className="text-sm text-foreground-muted">Kullanıcı adı ve şifre ile giriş</p>
                        </div>
                    </div>

                    <Input
                        label={t.username}
                        value={igUsername}
                        onChange={(e) => setIgUsername(e.target.value)}
                        placeholder="instagram_username"
                    />

                    <div className="relative">
                        <Input
                            label={t.password}
                            type={showPassword ? 'text' : 'password'}
                            value={igPassword}
                            onChange={(e) => setIgPassword(e.target.value)}
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

                    <Button
                        className="w-full"
                        onClick={handleInstagramConnect}
                        disabled={connecting || !igUsername || !igPassword}
                        leftIcon={connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                    >
                        {connecting ? t.connecting : t.connect}
                    </Button>
                </div>
            );
        }

        if (selectedPlatform.id === 'telegram') {
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${selectedPlatform.color}15` }}
                        >
                            {selectedPlatform.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">{selectedPlatform.name}</h3>
                            <p className="text-sm text-foreground-muted">Telefon numarası ile giriş</p>
                        </div>
                    </div>

                    {tgStep === 'phone' ? (
                        <>
                            <Input
                                label={t.phone}
                                value={tgPhone}
                                onChange={(e) => setTgPhone(e.target.value)}
                                placeholder={t.phonePlaceholder}
                            />
                            <Button
                                className="w-full"
                                onClick={handleTelegramSendCode}
                                disabled={connecting || !tgPhone}
                                leftIcon={connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            >
                                {connecting ? t.connecting : t.sendCode}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Input
                                label={t.code}
                                value={tgCode}
                                onChange={(e) => setTgCode(e.target.value)}
                                placeholder={t.codePlaceholder}
                            />
                            <Button
                                className="w-full"
                                onClick={handleTelegramVerify}
                                disabled={connecting || !tgCode}
                                leftIcon={connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            >
                                {connecting ? t.connecting : t.verify}
                            </Button>
                        </>
                    )}
                </div>
            );
        }

        return null;
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
                                                    style={{ backgroundColor: `${platform?.color}15` }}
                                                >
                                                    {platform?.icon}
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
                title={selectedPlatform ? selectedPlatform.name : t.availablePlatforms}
            >
                {connectionError && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {connectionError}
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
                            className="text-sm text-foreground-muted hover:text-foreground mb-4"
                        >
                            ← {locale === 'tr' ? 'Geri' : 'Back'}
                        </button>
                        {renderPlatformForm()}
                    </div>
                ) : (
                    <>
                        <p className="text-foreground-muted mb-6">{t.choosePlatform}</p>
                        <div className="grid grid-cols-2 gap-3">
                            {platforms.map((platform) => {
                                const isConnected = accounts.some((a) => a.platform === platform.id);
                                const isComingSoon = platform.authType === 'coming_soon';

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
                                        <span className="font-medium text-foreground">{platform.name}</span>
                                        {isConnected && (
                                            <Check className="w-4 h-4 text-success absolute right-3" />
                                        )}
                                        {isComingSoon && (
                                            <span className="text-xs text-foreground-subtle absolute right-3">{t.comingSoon}</span>
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
