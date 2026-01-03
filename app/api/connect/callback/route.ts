import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// Platform token exchange and user info endpoints
const PLATFORM_INFO: Record<string, {
    tokenUrl: string;
    userInfoUrl: string;
    clientIdEnv: string;
    clientSecretEnv: string;
}> = {
    tiktok: {
        tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
        userInfoUrl: 'https://open.tiktokapis.com/v2/user/info/',
        clientIdEnv: 'TIKTOK_CLIENT_KEY',
        clientSecretEnv: 'TIKTOK_CLIENT_SECRET',
    },
    instagram: {
        tokenUrl: 'https://api.instagram.com/oauth/access_token',
        userInfoUrl: 'https://graph.instagram.com/me',
        clientIdEnv: 'INSTAGRAM_CLIENT_ID',
        clientSecretEnv: 'INSTAGRAM_CLIENT_SECRET',
    },
    youtube: {
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
        clientIdEnv: 'GOOGLE_CLIENT_ID',
        clientSecretEnv: 'GOOGLE_CLIENT_SECRET',
    },
    twitter: {
        tokenUrl: 'https://api.twitter.com/2/oauth2/token',
        userInfoUrl: 'https://api.twitter.com/2/users/me',
        clientIdEnv: 'TWITTER_CLIENT_ID',
        clientSecretEnv: 'TWITTER_CLIENT_SECRET',
    },
    facebook: {
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        userInfoUrl: 'https://graph.facebook.com/me',
        clientIdEnv: 'FACEBOOK_APP_ID',
        clientSecretEnv: 'FACEBOOK_APP_SECRET',
    },
    linkedin: {
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        userInfoUrl: 'https://api.linkedin.com/v2/me',
        clientIdEnv: 'LINKEDIN_CLIENT_ID',
        clientSecretEnv: 'LINKEDIN_CLIENT_SECRET',
    },
    pinterest: {
        tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
        userInfoUrl: 'https://api.pinterest.com/v5/user_account',
        clientIdEnv: 'PINTEREST_APP_ID',
        clientSecretEnv: 'PINTEREST_APP_SECRET',
    },
};

// GET /api/connect/callback - Handle OAuth callback
export async function GET(request: NextRequest) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL(`/dashboard/accounts?error=${error}`, request.url));
    }

    if (!code || !state) {
        return NextResponse.redirect(new URL('/dashboard/accounts?error=missing_params', request.url));
    }

    try {
        // Verify state token
        const { data: oauthState, error: stateError } = await supabase
            .from('oauth_states')
            .select('*')
            .eq('state_token', state)
            .single();

        if (stateError || !oauthState) {
            return NextResponse.redirect(new URL('/dashboard/accounts?error=invalid_state', request.url));
        }

        // Check if state is expired
        if (new Date(oauthState.expires_at) < new Date()) {
            await supabase.from('oauth_states').delete().eq('id', oauthState.id);
            return NextResponse.redirect(new URL('/dashboard/accounts?error=expired_state', request.url));
        }

        const platform = oauthState.platform;
        const config = PLATFORM_INFO[platform];
        const clientId = process.env[config.clientIdEnv];
        const clientSecret = process.env[config.clientSecretEnv];

        if (!clientId || !clientSecret) {
            return NextResponse.redirect(new URL(`/dashboard/accounts?error=platform_not_configured`, request.url));
        }

        // Exchange code for token
        const tokenParams: Record<string, string> = {
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: oauthState.redirect_uri,
        };

        if (oauthState.code_verifier) {
            tokenParams.code_verifier = oauthState.code_verifier;
        }

        const tokenResponse = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(tokenParams),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token exchange failed:', tokenData);
            return NextResponse.redirect(new URL(`/dashboard/accounts?error=token_failed`, request.url));
        }

        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token;
        const expiresIn = tokenData.expires_in;

        // Get user info from platform
        const userInfoResponse = await fetch(config.userInfoUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userInfo = await userInfoResponse.json();

        // Extract user info based on platform
        let platformUserId = '';
        let platformUsername = '';
        let platformName = '';
        let platformAvatar = '';
        let followersCount = 0;

        switch (platform) {
            case 'tiktok':
                platformUserId = userInfo.data?.user?.open_id || '';
                platformUsername = userInfo.data?.user?.display_name || '';
                platformName = userInfo.data?.user?.display_name || '';
                platformAvatar = userInfo.data?.user?.avatar_url || '';
                followersCount = userInfo.data?.user?.follower_count || 0;
                break;
            case 'instagram':
                platformUserId = userInfo.id || '';
                platformUsername = userInfo.username || '';
                platformName = userInfo.username || '';
                break;
            case 'youtube':
                const channel = userInfo.items?.[0];
                platformUserId = channel?.id || '';
                platformUsername = channel?.snippet?.title || '';
                platformName = channel?.snippet?.title || '';
                platformAvatar = channel?.snippet?.thumbnails?.default?.url || '';
                followersCount = parseInt(channel?.statistics?.subscriberCount || '0');
                break;
            case 'twitter':
                platformUserId = userInfo.data?.id || '';
                platformUsername = `@${userInfo.data?.username}` || '';
                platformName = userInfo.data?.name || '';
                platformAvatar = userInfo.data?.profile_image_url || '';
                break;
            case 'facebook':
                platformUserId = userInfo.id || '';
                platformUsername = userInfo.name || '';
                platformName = userInfo.name || '';
                break;
            case 'linkedin':
                platformUserId = userInfo.id || '';
                platformUsername = `${userInfo.localizedFirstName} ${userInfo.localizedLastName}`;
                platformName = platformUsername;
                break;
            case 'pinterest':
                platformUserId = userInfo.username || '';
                platformUsername = userInfo.username || '';
                platformName = userInfo.username || '';
                followersCount = userInfo.follower_count || 0;
                break;
        }

        // Calculate token expiry
        const tokenExpiresAt = expiresIn
            ? new Date(Date.now() + expiresIn * 1000).toISOString()
            : null;

        // Save or update social account
        const { error: insertError } = await supabase
            .from('social_accounts')
            .upsert({
                user_id: oauthState.user_id,
                platform,
                platform_user_id: platformUserId,
                platform_username: platformUsername,
                platform_name: platformName,
                platform_avatar: platformAvatar,
                access_token: accessToken,
                refresh_token: refreshToken,
                token_expires_at: tokenExpiresAt,
                followers_count: followersCount,
                is_active: true,
                connection_status: 'connected',
                last_sync_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,platform,platform_user_id',
            });

        if (insertError) {
            console.error('Failed to save account:', insertError);
            return NextResponse.redirect(new URL(`/dashboard/accounts?error=save_failed`, request.url));
        }

        // Clean up oauth state
        await supabase.from('oauth_states').delete().eq('id', oauthState.id);

        // Create notification
        await supabase.from('notifications').insert({
            user_id: oauthState.user_id,
            type: 'system',
            title: 'Hesap bağlandı!',
            message: `${platform.charAt(0).toUpperCase() + platform.slice(1)} hesabın başarıyla bağlandı.`,
        });

        return NextResponse.redirect(new URL('/dashboard/accounts?success=connected', request.url));
    } catch (err: any) {
        console.error('OAuth callback error:', err);
        return NextResponse.redirect(new URL(`/dashboard/accounts?error=${err.message}`, request.url));
    }
}
