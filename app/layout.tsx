import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const outfit = Outfit({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    title: {
        default: 'Pub - Publish Everywhere, Instantly',
        template: '%s | Pub',
    },
    description: 'The ultimate social media distribution platform. One click to publish your content across TikTok, Instagram, YouTube, Twitter, and more.',
    keywords: ['social media', 'content distribution', 'scheduling', 'TikTok', 'Instagram', 'YouTube', 'Twitter', 'automation'],
    authors: [{ name: 'Pub' }],
    creator: 'Pub',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://getpub.io',
        siteName: 'Pub',
        title: 'Pub - Publish Everywhere, Instantly',
        description: 'The ultimate social media distribution platform. One click to publish your content across all platforms.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Pub - Social Media Distribution Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pub - Publish Everywhere, Instantly',
        description: 'The ultimate social media distribution platform. One click to publish your content across all platforms.',
        images: ['/og-image.png'],
        creator: '@getpub',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
    themeColor: '#09090b',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`}>
            <body className="min-h-screen bg-background font-sans antialiased">
                <I18nProvider>
                    <div className="relative flex min-h-screen flex-col">
                        {children}
                    </div>
                </I18nProvider>
            </body>
        </html>
    );
}
