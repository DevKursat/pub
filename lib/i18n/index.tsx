'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from './en.json';
import tr from './tr.json';

type Locale = 'en' | 'tr';
type Translations = typeof en;

interface I18nContextType {
    locale: Locale;
    t: Translations;
    setLocale: (locale: Locale) => void;
}

const translations: Record<Locale, Translations> = { en, tr };

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Detect user's locale from browser or geolocation
        const detectLocale = async () => {
            try {
                // First check localStorage
                const savedLocale = localStorage.getItem('locale') as Locale;
                if (savedLocale && (savedLocale === 'en' || savedLocale === 'tr')) {
                    setLocaleState(savedLocale);
                    setIsLoaded(true);
                    return;
                }

                // Check browser language
                const browserLang = navigator.language.toLowerCase();
                if (browserLang.startsWith('tr')) {
                    setLocaleState('tr');
                    localStorage.setItem('locale', 'tr');
                    setIsLoaded(true);
                    return;
                }

                // Try to detect country via timezone
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (timezone.includes('Istanbul') || timezone.includes('Turkey')) {
                    setLocaleState('tr');
                    localStorage.setItem('locale', 'tr');
                    setIsLoaded(true);
                    return;
                }

                // Default to English
                setLocaleState('en');
                localStorage.setItem('locale', 'en');
                setIsLoaded(true);
            } catch {
                setLocaleState('en');
                setIsLoaded(true);
            }
        };

        detectLocale();
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    const value: I18nContextType = {
        locale,
        t: translations[locale],
        setLocale,
    };

    // Don't render until locale is detected
    if (!isLoaded) {
        return null;
    }

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

export function useTranslation() {
    const { t, locale, setLocale } = useI18n();
    return { t, locale, setLocale };
}
