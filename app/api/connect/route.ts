import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Platform OAuth configurations
const PLATFORM_CONFIG: Record<string, {
    authUrl: string;
    scopes: string[];
    clientIdEnv: string;
}> = {
    tiktok: {
        authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
        scopes: ['user.info.basic', 'video.publish', 'video.list'],
        clientIdEnv: 'TIKTOK_CLIENT_KEY',
    },
    instagram: {
        authUrl: 'https://api.instagram.com/oauth/authorize',
        scopes: ['user_profile', 'user_media'],
        clientIdEnv: 'INSTAGRAM_CLIENT_ID',
    },
    youtube: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly'],
        clientIdEnv: 'GOOGLE_CLIENT_ID',
    },
    twitter: {
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
        clientIdEnv: 'TWITTER_CLIENT_ID',
    },
    facebook: {
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
        clientIdEnv: 'FACEBOOK_APP_ID',
    },
    linkedin: {
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        scopes: ['r_liteprofile', 'w_member_social'],
        clientIdEnv: 'LINKEDIN_CLIENT_ID',
    },
    pinterest: {
        authUrl: 'https://www.pinterest.com/oauth/',
        scopes: ['boards:read', 'pins:read', 'pins:write'],
        clientIdEnv: 'PINTEREST_APP_ID',
    },
};

// GET /api/connect?platform=xxx - Start OAuth flow
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const { searchParams } = new URL(request.url);
        const platform = searchParams.get('platform');

        if (!platform || !PLATFORM_CONFIG[platform]) {
            return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
        }

        const config = PLATFORM_CONFIG[platform];
        const clientId = process.env[config.clientIdEnv];

        if (!clientId) {
            return NextResponse.json({
                error: `Platform not configured. Add ${config.clientIdEnv} to environment variables.`
            }, { status: 500 });
        }

        // Generate state token for security
        const stateToken = crypto.randomBytes(32).toString('hex');
        const codeVerifier = crypto.randomBytes(32).toString('base64url');
        const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url');

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const redirectUri = `${baseUrl}/api/connect/callback`;

        // Save state to database
        await supabase.from('oauth_states').insert({
            user_id: user.id,
            platform,
            state_token: stateToken,
            code_verifier: codeVerifier,
            redirect_uri: redirectUri,
        });

        // Build authorization URL
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: config.scopes.join(' '),
            state: stateToken,
        });

        // Add PKCE for platforms that support it
        if (['twitter', 'tiktok'].includes(platform)) {
            params.append('code_challenge', codeChallenge);
            params.append('code_challenge_method', 'S256');
        }

        const authUrl = `${config.authUrl}?${params.toString()}`;
        return NextResponse.redirect(authUrl);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
