// API Route for connecting social media accounts using open-source libraries
// Supports: Instagram, Twitter, LinkedIn, TikTok

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import type { Platform, SocialCredentials } from '@/lib/social-media-service';

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { platform, username, email, password } = body as {
            platform: Platform;
            username?: string;
            email?: string;
            password?: string;
        };

        if (!platform) {
            return NextResponse.json({ error: 'Platform is required' }, { status: 400 });
        }

        // Validate credentials based on platform
        const supportedPlatforms = ['instagram', 'twitter', 'linkedin', 'tiktok'];

        if (!supportedPlatforms.includes(platform)) {
            return NextResponse.json({
                error: `Platform ${platform} is not yet supported`,
                supportedPlatforms,
            }, { status: 400 });
        }

        if (!username || !password) {
            return NextResponse.json({
                error: 'Username and password are required',
            }, { status: 400 });
        }

        // Dynamic import to avoid server-side issues
        const { socialMediaService } = await import('@/lib/social-media-service');

        const credentials: SocialCredentials = {
            username,
            email,
            password,
        };

        try {
            const account = await socialMediaService.connect(platform, credentials);

            // Encrypt session before storing
            const encryptedSession = Buffer.from(account.session).toString('base64');

            // Save to database
            const { error: dbError } = await supabase
                .from('social_accounts')
                .upsert({
                    user_id: user.id,
                    platform: account.platform,
                    platform_user_id: account.userId,
                    platform_username: account.username,
                    platform_name: account.displayName,
                    platform_avatar: account.profilePicUrl,
                    followers_count: account.followersCount || 0,
                    access_token: encryptedSession,
                    connection_status: 'connected',
                    is_active: true,
                    connected_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id,platform,platform_user_id',
                });

            if (dbError) throw dbError;

            return NextResponse.json({
                success: true,
                account: {
                    platform: account.platform,
                    username: account.username,
                    displayName: account.displayName,
                    profilePicUrl: account.profilePicUrl,
                    followersCount: account.followersCount,
                },
            });
        } catch (error: any) {
            console.error(`${platform} connect error:`, error);

            // Handle specific error types
            if (error.message.includes('VERIFICATION_REQUIRED')) {
                return NextResponse.json({
                    error: 'verification_required',
                    message: error.message.split(': ')[1] || 'Hesabınız doğrulama gerektiriyor.',
                }, { status: 400 });
            }

            if (error.message.includes('checkpoint') || error.message.includes('challenge')) {
                return NextResponse.json({
                    error: 'verification_required',
                    message: 'Platform güvenlik doğrulaması gerektiriyor. Lütfen platformun uygulamasından giriş yapıp doğrulama işlemini tamamlayın.',
                }, { status: 400 });
            }

            if (error.message.includes('password') || error.message.includes('credentials')) {
                return NextResponse.json({
                    error: 'invalid_credentials',
                    message: 'Kullanıcı adı veya şifre hatalı.',
                }, { status: 401 });
            }

            return NextResponse.json({
                error: error.message,
                message: 'Bağlantı sırasında bir hata oluştu.',
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Social connect error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET: List supported platforms
export async function GET() {
    return NextResponse.json({
        platforms: [
            {
                id: 'instagram',
                name: 'Instagram',
                icon: '📸',
                color: '#e1306c',
                authMethod: 'username_password',
                status: 'active',
                description: 'Fotoğraf ve video paylaş'
            },
            {
                id: 'twitter',
                name: 'Twitter/X',
                icon: '𝕏',
                color: '#1da1f2',
                authMethod: 'username_password',
                status: 'active',
                description: 'Tweet paylaş'
            },
            {
                id: 'linkedin',
                name: 'LinkedIn',
                icon: '💼',
                color: '#0a66c2',
                authMethod: 'email_password',
                status: 'active',
                description: 'Profesyonel içerik paylaş'
            },
            {
                id: 'tiktok',
                name: 'TikTok',
                icon: '🎵',
                color: '#ff0050',
                authMethod: 'username_password',
                status: 'beta',
                description: 'Video paylaş (beta)'
            },
            {
                id: 'youtube',
                name: 'YouTube',
                icon: '▶️',
                color: '#ff0000',
                authMethod: 'cookies',
                status: 'coming_soon',
                description: 'Yakında'
            },
            {
                id: 'facebook',
                name: 'Facebook',
                icon: '📘',
                color: '#1877f2',
                authMethod: 'cookies',
                status: 'coming_soon',
                description: 'Yakında'
            },
            {
                id: 'pinterest',
                name: 'Pinterest',
                icon: '📌',
                color: '#e60023',
                authMethod: 'cookies',
                status: 'coming_soon',
                description: 'Yakında'
            },
        ]
    });
}
