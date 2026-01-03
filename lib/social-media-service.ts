// Social Media Service using Open Source Libraries
// 
// Libraries Used:
// - Instagram: instagram-private-api (username/password login)
// - Twitter/X: @the-convocation/twitter-scraper (cookies-based)
// - LinkedIn: linkedin-private-api (username/password login)
// Note: TikTok, YouTube, Facebook need browser automation which runs separately

import { IgApiClient, IgCheckpointError } from 'instagram-private-api';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type Platform = 'instagram' | 'tiktok' | 'twitter' | 'youtube' | 'facebook' | 'linkedin' | 'pinterest';

export interface SocialCredentials {
    username?: string;
    email?: string;
    password?: string;
    cookies?: string;
    session?: string;
}

export interface SocialAccount {
    platform: Platform;
    userId: string;
    username: string;
    displayName: string;
    profilePicUrl?: string;
    followersCount?: number;
    session: string;
    isConnected: boolean;
}

export interface PostResult {
    success: boolean;
    platform: Platform;
    postId?: string;
    postUrl?: string;
    error?: string;
}

export interface PostContent {
    text: string;
    mediaPath?: string;
    mediaType?: 'photo' | 'video';
    coverPath?: string;
}

// ============================================
// INSTAGRAM SERVICE (instagram-private-api)
// ============================================

class InstagramService {
    private client: IgApiClient;
    private isLoggedIn: boolean = false;

    constructor() {
        this.client = new IgApiClient();
    }

    async login(username: string, password: string): Promise<SocialAccount> {
        this.client.state.generateDevice(username);

        try {
            const auth = await this.client.account.login(username, password);
            this.isLoggedIn = true;

            const user = await this.client.user.info(auth.pk);
            const serialized = await this.client.state.serialize();
            delete serialized.constants;

            return {
                platform: 'instagram',
                userId: String(auth.pk),
                username: auth.username,
                displayName: user.full_name,
                profilePicUrl: user.profile_pic_url,
                followersCount: user.follower_count,
                session: JSON.stringify(serialized),
                isConnected: true,
            };
        } catch (error: any) {
            if (error instanceof IgCheckpointError) {
                throw new Error('VERIFICATION_REQUIRED: Instagram doğrulama istiyor. Lütfen Instagram uygulamasından giriş yapın.');
            }
            throw error;
        }
    }

    async restoreSession(sessionData: string): Promise<boolean> {
        try {
            const session = JSON.parse(sessionData);
            await this.client.state.deserialize(session);
            this.isLoggedIn = true;
            return true;
        } catch {
            return false;
        }
    }

    async post(content: PostContent): Promise<PostResult> {
        if (!this.isLoggedIn) {
            return { success: false, platform: 'instagram', error: 'Not logged in' };
        }

        try {
            const fs = await import('fs');
            let result: any;

            if (!content.mediaPath) {
                return { success: false, platform: 'instagram', error: 'Instagram requires media (photo or video)' };
            }

            const mediaBuffer = fs.readFileSync(content.mediaPath);

            if (content.mediaType === 'video') {
                const coverBuffer = content.coverPath ? fs.readFileSync(content.coverPath) : undefined;
                result = await this.client.publish.video({
                    video: mediaBuffer,
                    coverImage: coverBuffer!,
                    caption: content.text,
                });
            } else {
                result = await this.client.publish.photo({
                    file: mediaBuffer,
                    caption: content.text,
                });
            }

            return {
                success: true,
                platform: 'instagram',
                postId: result.media.pk,
                postUrl: `https://instagram.com/p/${result.media.code}`,
            };
        } catch (error: any) {
            return { success: false, platform: 'instagram', error: error.message };
        }
    }
}

// ============================================
// TWITTER SERVICE (@the-convocation/twitter-scraper)
// ============================================

class TwitterService {
    private scraper: any = null;
    private isLoggedIn: boolean = false;

    async login(username: string, password: string, email?: string): Promise<SocialAccount> {
        const { Scraper } = await import('@the-convocation/twitter-scraper');
        this.scraper = new Scraper();

        await this.scraper.login(username, password, email);
        this.isLoggedIn = true;

        const profile = await this.scraper.getProfile(username);
        const cookies = await this.scraper.getCookies();

        return {
            platform: 'twitter',
            userId: profile.userId || username,
            username: username,
            displayName: profile.name || username,
            profilePicUrl: profile.avatar,
            followersCount: profile.followersCount,
            session: JSON.stringify(cookies),
            isConnected: true,
        };
    }

    async restoreSession(sessionData: string): Promise<boolean> {
        try {
            const { Scraper } = await import('@the-convocation/twitter-scraper');
            this.scraper = new Scraper();

            const cookies = JSON.parse(sessionData);
            await this.scraper.setCookies(cookies);

            const isLoggedIn = await this.scraper.isLoggedIn();
            this.isLoggedIn = isLoggedIn;
            return isLoggedIn;
        } catch {
            return false;
        }
    }

    async post(content: PostContent): Promise<PostResult> {
        if (!this.isLoggedIn || !this.scraper) {
            return { success: false, platform: 'twitter', error: 'Not logged in' };
        }

        try {
            let result;

            if (content.mediaPath) {
                const fs = await import('fs');
                const mediaData = fs.readFileSync(content.mediaPath);
                result = await this.scraper.sendTweet(content.text, undefined, [{
                    data: mediaData,
                    mediaType: content.mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
                }]);
            } else {
                result = await this.scraper.sendTweet(content.text);
            }

            return {
                success: true,
                platform: 'twitter',
                postId: result?.id,
                postUrl: result?.permanentUrl,
            };
        } catch (error: any) {
            return { success: false, platform: 'twitter', error: error.message };
        }
    }
}

// ============================================
// LINKEDIN SERVICE (linkedin-private-api)
// ============================================

class LinkedInService {
    private client: any = null;
    private isLoggedIn: boolean = false;

    async login(email: string, password: string): Promise<SocialAccount> {
        const { Client } = await import('linkedin-private-api');
        this.client = new Client();

        await this.client.login.userPass({ username: email, password });
        this.isLoggedIn = true;

        const profile = await this.client.profile.getOwnProfile();

        return {
            platform: 'linkedin',
            userId: profile.entityUrn || email,
            username: profile.publicIdentifier || email,
            displayName: `${profile.firstName} ${profile.lastName}`,
            profilePicUrl: profile.picture?.rootUrl,
            followersCount: 0,
            session: JSON.stringify({
                cookies: this.client.request?.cookieJar?.toJSON?.() || {},
            }),
            isConnected: true,
        };
    }

    async post(content: PostContent): Promise<PostResult> {
        // LinkedIn unofficial API doesn't support posting yet
        return {
            success: false,
            platform: 'linkedin',
            error: 'LinkedIn posting is not yet available in this version'
        };
    }
}

// ============================================
// UNIFIED SOCIAL MEDIA SERVICE
// ============================================

export class SocialMediaService {
    private instagramService: InstagramService;
    private twitterService: TwitterService;
    private linkedInService: LinkedInService;

    constructor() {
        this.instagramService = new InstagramService();
        this.twitterService = new TwitterService();
        this.linkedInService = new LinkedInService();
    }

    async connect(platform: Platform, credentials: SocialCredentials): Promise<SocialAccount> {
        switch (platform) {
            case 'instagram':
                if (!credentials.username || !credentials.password) {
                    throw new Error('Instagram requires username and password');
                }
                return this.instagramService.login(credentials.username, credentials.password);

            case 'twitter':
                if (!credentials.username || !credentials.password) {
                    throw new Error('Twitter requires username and password');
                }
                return this.twitterService.login(credentials.username, credentials.password, credentials.email);

            case 'linkedin':
                if (!credentials.username || !credentials.password) {
                    throw new Error('LinkedIn requires email and password');
                }
                return this.linkedInService.login(credentials.username, credentials.password);

            case 'tiktok':
                throw new Error('TikTok connection requires browser automation. Please use cookies-based login.');

            case 'youtube':
                throw new Error('YouTube connection requires browser automation. Please use cookies-based login.');

            case 'facebook':
                throw new Error('Facebook connection requires browser automation. Please use cookies-based login.');

            default:
                throw new Error(`Platform ${platform} not yet supported`);
        }
    }

    async post(platform: Platform, sessionData: string, content: PostContent): Promise<PostResult> {
        switch (platform) {
            case 'instagram':
                await this.instagramService.restoreSession(sessionData);
                return this.instagramService.post(content);

            case 'twitter':
                await this.twitterService.restoreSession(sessionData);
                return this.twitterService.post(content);

            case 'linkedin':
                return this.linkedInService.post(content);

            default:
                return { success: false, platform, error: `Platform ${platform} not yet supported for posting` };
        }
    }

    async postToMultiple(
        accounts: { platform: Platform; session: string }[],
        content: PostContent
    ): Promise<PostResult[]> {
        const results: PostResult[] = [];

        for (const account of accounts) {
            const result = await this.post(account.platform, account.session, content);
            results.push(result);
        }

        return results;
    }
}

// Export singleton
export const socialMediaService = new SocialMediaService();
