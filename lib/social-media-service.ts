// Social Media Service using Open Source Libraries
// 
// Direct API Libraries:
// - Instagram: instagram-private-api (username/password login)
// - Twitter/X: @the-convocation/twitter-scraper (cookies-based)
// - LinkedIn: linkedin-private-api (username/password login)
//
// Browser Automation (via Worker):
// - TikTok: puppeteer automation
// - YouTube: puppeteer automation

import { IgApiClient, IgCheckpointError } from 'instagram-private-api';

// Worker URL for browser automation
const WORKER_URL = process.env.SOCIAL_WORKER_URL || 'http://localhost:3001';

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
    title?: string; // For YouTube
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
        return {
            success: false,
            platform: 'linkedin',
            error: 'LinkedIn posting requires worker automation'
        };
    }
}

// ============================================
// TIKTOK SERVICE (via Worker)
// ============================================

class TikTokService {
    private async callWorker(endpoint: string, data: any): Promise<any> {
        try {
            const response = await fetch(`${WORKER_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Worker request failed');
            }

            return response.json();
        } catch (error: any) {
            if (error.message.includes('ECONNREFUSED')) {
                throw new Error('TikTok worker is not running. Start with: node worker/social-automation.js');
            }
            throw error;
        }
    }

    async login(username: string, password: string): Promise<SocialAccount> {
        const result = await this.callWorker('/tiktok/login', { username, password });
        return {
            platform: 'tiktok',
            userId: result.userId,
            username: result.username,
            displayName: result.displayName,
            profilePicUrl: result.profilePicUrl,
            followersCount: result.followersCount,
            session: result.session,
            isConnected: true,
        };
    }

    async post(sessionData: string, content: PostContent): Promise<PostResult> {
        if (!content.mediaPath) {
            return { success: false, platform: 'tiktok', error: 'TikTok requires a video file' };
        }

        try {
            const result = await this.callWorker('/tiktok/upload', {
                session: sessionData,
                videoPath: content.mediaPath,
                caption: content.text,
            });

            return {
                success: result.success,
                platform: 'tiktok',
                postId: result.postId,
                error: result.error,
            };
        } catch (error: any) {
            return { success: false, platform: 'tiktok', error: error.message };
        }
    }
}

// ============================================
// YOUTUBE SERVICE (via Worker)
// ============================================

class YouTubeService {
    private async callWorker(endpoint: string, data: any): Promise<any> {
        try {
            const response = await fetch(`${WORKER_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Worker request failed');
            }

            return response.json();
        } catch (error: any) {
            if (error.message.includes('ECONNREFUSED')) {
                throw new Error('YouTube worker is not running. Start with: node worker/social-automation.js');
            }
            throw error;
        }
    }

    async login(email: string, password: string): Promise<SocialAccount> {
        const result = await this.callWorker('/youtube/login', { email, password });
        return {
            platform: 'youtube',
            userId: result.userId,
            username: result.username,
            displayName: result.displayName,
            profilePicUrl: result.profilePicUrl,
            followersCount: result.followersCount || 0,
            session: result.session,
            isConnected: true,
        };
    }

    async post(sessionData: string, content: PostContent): Promise<PostResult> {
        if (!content.mediaPath) {
            return { success: false, platform: 'youtube', error: 'YouTube requires a video file' };
        }

        try {
            const result = await this.callWorker('/youtube/upload', {
                session: sessionData,
                videoPath: content.mediaPath,
                title: content.title || content.text.substring(0, 100),
                description: content.text,
            });

            return {
                success: result.success,
                platform: 'youtube',
                postId: result.postId,
                postUrl: result.postUrl,
                error: result.error,
            };
        } catch (error: any) {
            return { success: false, platform: 'youtube', error: error.message };
        }
    }
}

// ============================================
// UNIFIED SOCIAL MEDIA SERVICE
// ============================================

export class SocialMediaService {
    private instagramService: InstagramService;
    private twitterService: TwitterService;
    private linkedInService: LinkedInService;
    private tiktokService: TikTokService;
    private youtubeService: YouTubeService;

    constructor() {
        this.instagramService = new InstagramService();
        this.twitterService = new TwitterService();
        this.linkedInService = new LinkedInService();
        this.tiktokService = new TikTokService();
        this.youtubeService = new YouTubeService();
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
                if (!credentials.username || !credentials.password) {
                    throw new Error('TikTok requires username and password');
                }
                return this.tiktokService.login(credentials.username, credentials.password);

            case 'youtube':
                if (!credentials.email || !credentials.password) {
                    throw new Error('YouTube requires Google email and password');
                }
                return this.youtubeService.login(credentials.email, credentials.password);

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

            case 'tiktok':
                return this.tiktokService.post(sessionData, content);

            case 'youtube':
                return this.youtubeService.post(sessionData, content);

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

    // Check if worker is running for TikTok/YouTube
    async checkWorkerStatus(): Promise<boolean> {
        try {
            const response = await fetch(`${WORKER_URL}/health`);
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Export singleton
export const socialMediaService = new SocialMediaService();
