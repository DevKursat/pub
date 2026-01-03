'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, CreditCard, Loader2, Check, AlertCircle } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

export default function SettingsPage() {
    const { locale, setLocale } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
    });

    const t = {
        title: locale === 'tr' ? 'Ayarlar' : 'Settings',
        description: locale === 'tr' ? 'Hesap ve uygulama ayarları' : 'Account and app settings',
        profile: locale === 'tr' ? 'Profil' : 'Profile',
        profileDesc: locale === 'tr' ? 'Kişisel bilgilerini güncelle' : 'Update your personal information',
        name: locale === 'tr' ? 'Ad Soyad' : 'Full Name',
        email: locale === 'tr' ? 'E-posta' : 'Email',
        notifications: locale === 'tr' ? 'Bildirimler' : 'Notifications',
        notificationsDesc: locale === 'tr' ? 'Bildirim tercihlerini yönet' : 'Manage notification preferences',
        emailNotifications: locale === 'tr' ? 'E-posta Bildirimleri' : 'Email Notifications',
        pushNotifications: locale === 'tr' ? 'Push Bildirimleri' : 'Push Notifications',
        weeklyReport: locale === 'tr' ? 'Haftalık Rapor' : 'Weekly Report',
        language: locale === 'tr' ? 'Dil' : 'Language',
        languageDesc: locale === 'tr' ? 'Uygulama dilini seç' : 'Select app language',
        turkish: locale === 'tr' ? 'Türkçe' : 'Turkish',
        english: locale === 'tr' ? 'İngilizce' : 'English',
        theme: locale === 'tr' ? 'Tema' : 'Theme',
        themeDesc: locale === 'tr' ? 'Görünüm tercihini ayarla' : 'Set appearance preference',
        dark: locale === 'tr' ? 'Koyu' : 'Dark',
        light: locale === 'tr' ? 'Açık' : 'Light',
        system: locale === 'tr' ? 'Sistem' : 'System',
        subscription: locale === 'tr' ? 'Abonelik' : 'Subscription',
        subscriptionDesc: locale === 'tr' ? 'Plan ve faturalama' : 'Plan and billing',
        currentPlan: locale === 'tr' ? 'Mevcut Plan' : 'Current Plan',
        freePlan: locale === 'tr' ? 'Ücretsiz' : 'Free',
        upgradePlan: locale === 'tr' ? 'Planı Yükselt' : 'Upgrade Plan',
        save: locale === 'tr' ? 'Kaydet' : 'Save',
        saving: locale === 'tr' ? 'Kaydediliyor...' : 'Saving...',
        saved: locale === 'tr' ? 'Kaydedildi!' : 'Saved!',
        security: locale === 'tr' ? 'Güvenlik' : 'Security',
        securityDesc: locale === 'tr' ? 'Şifre ve güvenlik ayarları' : 'Password and security settings',
        changePassword: locale === 'tr' ? 'Şifreyi Değiştir' : 'Change Password',
        twoFactor: locale === 'tr' ? 'İki Faktörlü Doğrulama' : 'Two-Factor Authentication',
        deleteAccount: locale === 'tr' ? 'Hesabı Sil' : 'Delete Account',
    };

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        weekly: false,
    });

    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Load user data from Supabase
        const loadProfile = async () => {
            try {
                const { getCurrentUser, getUserProfile } = await import('@/lib/supabase');
                const user = await getCurrentUser();
                if (user) {
                    setProfile({
                        name: user.user_metadata?.full_name || '',
                        email: user.email || '',
                    });
                }
            } catch (err) {
                console.error('Failed to load profile:', err);
            }
        };
        loadProfile();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Save settings logic here
            await new Promise(r => setTimeout(r, 1000));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title={t.title} description={t.description} />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* Profile */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-primary" />
                                <div>
                                    <CardTitle>{t.profile}</CardTitle>
                                    <p className="text-sm text-foreground-muted">{t.profileDesc}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                label={t.name}
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                            <Input
                                label={t.email}
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                disabled
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Language */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-primary" />
                                <div>
                                    <CardTitle>{t.language}</CardTitle>
                                    <p className="text-sm text-foreground-muted">{t.languageDesc}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setLocale('tr')}
                                    className={`flex-1 p-4 rounded-xl border transition-all ${locale === 'tr' ? 'border-primary bg-primary/10' : 'border-border hover:border-border-hover'
                                        }`}
                                >
                                    <span className="text-2xl mb-2 block">🇹🇷</span>
                                    <span className="font-medium text-foreground">{t.turkish}</span>
                                </button>
                                <button
                                    onClick={() => setLocale('en')}
                                    className={`flex-1 p-4 rounded-xl border transition-all ${locale === 'en' ? 'border-primary bg-primary/10' : 'border-border hover:border-border-hover'
                                        }`}
                                >
                                    <span className="text-2xl mb-2 block">🇺🇸</span>
                                    <span className="font-medium text-foreground">{t.english}</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Notifications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-primary" />
                                <div>
                                    <CardTitle>{t.notifications}</CardTitle>
                                    <p className="text-sm text-foreground-muted">{t.notificationsDesc}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { key: 'email', label: t.emailNotifications },
                                { key: 'push', label: t.pushNotifications },
                                { key: 'weekly', label: t.weeklyReport },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between">
                                    <span className="text-foreground">{item.label}</span>
                                    <button
                                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                        className={`w-12 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-background-tertiary'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                                            }`} />
                                    </button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Subscription */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-primary" />
                                <div>
                                    <CardTitle>{t.subscription}</CardTitle>
                                    <p className="text-sm text-foreground-muted">{t.subscriptionDesc}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-glass rounded-xl">
                                <div>
                                    <div className="font-medium text-foreground">{t.currentPlan}</div>
                                    <div className="text-2xl font-bold text-primary">{t.freePlan}</div>
                                </div>
                                <Button>{t.upgradePlan}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : undefined}
                    >
                        {loading ? t.saving : saved ? t.saved : t.save}
                    </Button>
                </div>
            </div>
        </>
    );
}
