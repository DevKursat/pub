// API Route for connecting social media accounts using open-source libraries
// Instagram: Username + Password (instagram-private-api)
// Telegram: Phone + Code (gramjs)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { platform, action } = body;

        switch (platform) {
            case 'instagram':
                return handleInstagram(body, user.id, supabase);
            case 'telegram':
                return handleTelegram(body, user.id, supabase);
            default:
                return NextResponse.json({ error: `Platform ${platform} not supported yet` }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Social connect error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Instagram Handler
async function handleInstagram(body: any, userId: string, supabase: any) {
    const { action, username, password } = body;

    if (action !== 'connect') {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!username || !password) {
        return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    try {
        // Dynamic import to avoid build issues
        const { socialMediaService } = await import('@/lib/social-media-service');

        const account = await socialMediaService.connectInstagram(username, password);

        // Encrypt session before storing (in production, use proper encryption)
        const encryptedSession = Buffer.from(account.session).toString('base64');

        // Save to database
        const { error: dbError } = await supabase
            .from('social_accounts')
            .upsert({
                user_id: userId,
                platform: 'instagram',
                platform_user_id: account.username,
                platform_username: account.username,
                platform_name: account.displayName,
                platform_avatar: account.profilePicUrl,
                followers_count: account.followersCount,
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
        console.error('Instagram connect error:', error);

        if (error.message.includes('verification') || error.message.includes('checkpoint')) {
            return NextResponse.json({
                error: 'verification_required',
                message: 'Instagram hesabınız doğrulama gerektiriyor. Lütfen Instagram uygulamasından giriş yapıp doğrulama işlemini tamamlayın.',
            }, { status: 400 });
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Telegram Handler
async function handleTelegram(body: any, userId: string, supabase: any) {
    const { action, phone, code, phoneCodeHash, apiId, apiHash } = body;

    // Default API credentials (you can get your own from my.telegram.org)
    const telegramApiId = apiId || parseInt(process.env.TELEGRAM_API_ID || '0');
    const telegramApiHash = apiHash || process.env.TELEGRAM_API_HASH || '';

    if (!telegramApiId || !telegramApiHash) {
        return NextResponse.json({
            error: 'Telegram API credentials not configured',
            message: 'TELEGRAM_API_ID ve TELEGRAM_API_HASH env değişkenlerini ayarlayın veya my.telegram.org adresinden alın.',
        }, { status: 400 });
    }

    try {
        const { socialMediaService } = await import('@/lib/social-media-service');

        if (action === 'send_code') {
            if (!phone) {
                return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
            }

            const result = await socialMediaService.sendTelegramCode(phone, telegramApiId, telegramApiHash);

            return NextResponse.json({
                success: true,
                phoneCodeHash: result.phoneCodeHash,
                message: 'Doğrulama kodu telefonunuza gönderildi.',
            });
        }

        if (action === 'verify_code') {
            if (!phone || !code || !phoneCodeHash) {
                return NextResponse.json({ error: 'Phone, code, and phoneCodeHash required' }, { status: 400 });
            }

            const account = await socialMediaService.connectTelegram(
                phone,
                code,
                phoneCodeHash,
                telegramApiId,
                telegramApiHash
            );

            // Encrypt session before storing
            const encryptedSession = Buffer.from(account.session).toString('base64');

            // Save to database
            const { error: dbError } = await supabase
                .from('social_accounts')
                .upsert({
                    user_id: userId,
                    platform: 'telegram',
                    platform_user_id: account.username || phone,
                    platform_username: account.username || phone,
                    platform_name: account.displayName,
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
                },
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Telegram connect error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
