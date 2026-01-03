// Social Media Services using Open Source Libraries
// Instagram: instagram-private-api
// Telegram: gramjs (telegram)
// Twitter/TikTok: Session-based auth

import { IgApiClient } from 'instagram-private-api';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

// ============================================
// INSTAGRAM SERVICE (instagram-private-api)
// ============================================

interface InstagramCredentials {
    username: string;
    password: string;
}

interface InstagramSession {
    cookies: string;
    state: any;
}

class InstagramService {
    private client: IgApiClient;
    private isLoggedIn: boolean = false;

    constructor() {
        this.client = new IgApiClient();
    }

    async login(credentials: InstagramCredentials): Promise<InstagramSession> {
        this.client.state.generateDevice(credentials.username);

        try {
            await this.client.account.login(credentials.username, credentials.password);
            this.isLoggedIn = true;

            // Serialize state for session persistence
            const serialized = await this.client.state.serialize();
            delete serialized.constants; // Remove non-serializable data

            return {
                cookies: JSON.stringify(serialized),
                state: serialized,
            };
        } catch (error: any) {
            if (error.name === 'IgCheckpointError') {
                throw new Error('Instagram requires verification. Please verify your account.');
            }
            throw error;
        }
    }

    async restoreSession(session: InstagramSession): Promise<boolean> {
        try {
            await this.client.state.deserialize(session.state);
            this.isLoggedIn = true;
            return true;
        } catch {
            return false;
        }
    }

    async postPhoto(imagePath: string, caption: string): Promise<{ id: string; url: string }> {
        if (!this.isLoggedIn) throw new Error('Not logged in to Instagram');

        const fs = await import('fs');
        const imageBuffer = fs.readFileSync(imagePath);

        const result = await this.client.publish.photo({
            file: imageBuffer,
            caption,
        });

        return {
            id: result.media.pk,
            url: `https://instagram.com/p/${result.media.code}`,
        };
    }

    async postVideo(videoPath: string, coverPath: string, caption: string): Promise<{ id: string; url: string }> {
        if (!this.isLoggedIn) throw new Error('Not logged in to Instagram');

        const fs = await import('fs');
        const videoBuffer = fs.readFileSync(videoPath);
        const coverBuffer = fs.readFileSync(coverPath);

        const result = await this.client.publish.video({
            video: videoBuffer,
            coverImage: coverBuffer,
            caption,
        });

        return {
            id: result.media.pk,
            url: `https://instagram.com/p/${result.media.code}`,
        };
    }

    async getProfile(): Promise<{
        username: string;
        fullName: string;
        profilePicUrl: string;
        followersCount: number;
        followingCount: number;
        postsCount: number;
    }> {
        if (!this.isLoggedIn) throw new Error('Not logged in to Instagram');

        const user = await this.client.account.currentUser();
        const userInfo = await this.client.user.info(user.pk);

        return {
            username: userInfo.username,
            fullName: userInfo.full_name,
            profilePicUrl: userInfo.profile_pic_url,
            followersCount: userInfo.follower_count,
            followingCount: userInfo.following_count,
            postsCount: userInfo.media_count,
        };
    }

    async logout(): Promise<void> {
        await this.client.account.logout();
        this.isLoggedIn = false;
    }
}

// ============================================
// TELEGRAM SERVICE (gramjs)
// ============================================

interface TelegramCredentials {
    phone: string;
    apiId: number;
    apiHash: string;
}

class TelegramService {
    private client: TelegramClient | null = null;
    private session: StringSession;

    constructor(sessionString: string = '') {
        this.session = new StringSession(sessionString);
    }

    async connect(credentials: TelegramCredentials): Promise<string> {
        this.client = new TelegramClient(
            this.session,
            credentials.apiId,
            credentials.apiHash,
            { connectionRetries: 5 }
        );

        await this.client.start({
            phoneNumber: async () => credentials.phone,
            phoneCode: async () => {
                throw new Error('NEED_CODE'); // Will be handled in UI
            },
            onError: (err) => console.error('Telegram error:', err),
        });

        return this.session.save();
    }

    async sendCode(phone: string, apiId: number, apiHash: string): Promise<{ phoneCodeHash: string }> {
        this.client = new TelegramClient(
            this.session,
            apiId,
            apiHash,
            { connectionRetries: 5 }
        );

        await this.client.connect();

        const result = await this.client.invoke({
            _: 'auth.sendCode',
            phone_number: phone,
            api_id: apiId,
            api_hash: apiHash,
            settings: { _: 'codeSettings' },
        } as any);

        return { phoneCodeHash: (result as any).phone_code_hash };
    }

    async verifyCode(
        phone: string,
        code: string,
        phoneCodeHash: string,
        apiId: number,
        apiHash: string
    ): Promise<string> {
        if (!this.client) {
            this.client = new TelegramClient(
                this.session,
                apiId,
                apiHash,
                { connectionRetries: 5 }
            );
            await this.client.connect();
        }

        await this.client.invoke({
            _: 'auth.signIn',
            phone_number: phone,
            phone_code_hash: phoneCodeHash,
            phone_code: code,
        } as any);

        return this.session.save();
    }

    async postToChannel(channelUsername: string, message: string, mediaPath?: string): Promise<{ id: string }> {
        if (!this.client) throw new Error('Not connected to Telegram');

        const entity = await this.client.getEntity(channelUsername);

        let result;
        if (mediaPath) {
            result = await this.client.sendFile(entity, {
                file: mediaPath,
                caption: message,
            });
        } else {
            result = await this.client.sendMessage(entity, { message });
        }

        return { id: String(result.id) };
    }

    async getMe(): Promise<{
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        phone: string;
    }> {
        if (!this.client) throw new Error('Not connected to Telegram');

        const me = await this.client.getMe();

        return {
            id: String((me as any).id),
            username: (me as any).username || '',
            firstName: (me as any).firstName || '',
            lastName: (me as any).lastName || '',
            phone: (me as any).phone || '',
        };
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.disconnect();
        }
    }
}

// ============================================
// UNIFIED SOCIAL MEDIA SERVICE
// ============================================

export type Platform = 'instagram' | 'telegram' | 'tiktok' | 'twitter' | 'youtube' | 'facebook' | 'linkedin';

export interface SocialMediaAccount {
    platform: Platform;
    username: string;
    displayName: string;
    profilePicUrl?: string;
    followersCount?: number;
    session: string; // Encrypted session data
    isConnected: boolean;
}

export interface PostResult {
    success: boolean;
    platform: Platform;
    postId?: string;
    postUrl?: string;
    error?: string;
}

class SocialMediaService {
    private instagramService: InstagramService;
    private telegramService: TelegramService;

    constructor() {
        this.instagramService = new InstagramService();
        this.telegramService = new TelegramService();
    }

    // Instagram Methods
    async connectInstagram(username: string, password: string): Promise<SocialMediaAccount> {
        const session = await this.instagramService.login({ username, password });
        const profile = await this.instagramService.getProfile();

        return {
            platform: 'instagram',
            username: profile.username,
            displayName: profile.fullName,
            profilePicUrl: profile.profilePicUrl,
            followersCount: profile.followersCount,
            session: session.cookies,
            isConnected: true,
        };
    }

    async postToInstagram(
        session: string,
        content: string,
        mediaPath: string,
        mediaType: 'photo' | 'video',
        coverPath?: string
    ): Promise<PostResult> {
        try {
            await this.instagramService.restoreSession({ cookies: session, state: JSON.parse(session) });

            let result;
            if (mediaType === 'photo') {
                result = await this.instagramService.postPhoto(mediaPath, content);
            } else {
                if (!coverPath) throw new Error('Cover image required for video');
                result = await this.instagramService.postVideo(mediaPath, coverPath, content);
            }

            return {
                success: true,
                platform: 'instagram',
                postId: result.id,
                postUrl: result.url,
            };
        } catch (error: any) {
            return {
                success: false,
                platform: 'instagram',
                error: error.message,
            };
        }
    }

    // Telegram Methods
    async sendTelegramCode(phone: string, apiId: number, apiHash: string): Promise<{ phoneCodeHash: string }> {
        return this.telegramService.sendCode(phone, apiId, apiHash);
    }

    async connectTelegram(
        phone: string,
        code: string,
        phoneCodeHash: string,
        apiId: number,
        apiHash: string
    ): Promise<SocialMediaAccount> {
        const sessionString = await this.telegramService.verifyCode(phone, code, phoneCodeHash, apiId, apiHash);
        const me = await this.telegramService.getMe();

        return {
            platform: 'telegram',
            username: me.username,
            displayName: `${me.firstName} ${me.lastName}`.trim(),
            followersCount: 0,
            session: sessionString,
            isConnected: true,
        };
    }

    async postToTelegram(sessionString: string, channelUsername: string, content: string, mediaPath?: string): Promise<PostResult> {
        try {
            const telegramService = new TelegramService(sessionString);
            const result = await telegramService.postToChannel(channelUsername, content, mediaPath);

            return {
                success: true,
                platform: 'telegram',
                postId: result.id,
            };
        } catch (error: any) {
            return {
                success: false,
                platform: 'telegram',
                error: error.message,
            };
        }
    }

    // Post to multiple platforms
    async postToMultiplePlatforms(
        accounts: { platform: Platform; session: string; channelId?: string }[],
        content: string,
        mediaPath?: string,
        mediaType?: 'photo' | 'video',
        coverPath?: string
    ): Promise<PostResult[]> {
        const results: PostResult[] = [];

        for (const account of accounts) {
            try {
                let result: PostResult;

                switch (account.platform) {
                    case 'instagram':
                        if (!mediaPath || !mediaType) {
                            result = { success: false, platform: 'instagram', error: 'Media required for Instagram' };
                        } else {
                            result = await this.postToInstagram(account.session, content, mediaPath, mediaType, coverPath);
                        }
                        break;

                    case 'telegram':
                        if (!account.channelId) {
                            result = { success: false, platform: 'telegram', error: 'Channel ID required' };
                        } else {
                            result = await this.postToTelegram(account.session, account.channelId, content, mediaPath);
                        }
                        break;

                    default:
                        result = { success: false, platform: account.platform, error: `Platform ${account.platform} not yet implemented` };
                }

                results.push(result);
            } catch (error: any) {
                results.push({
                    success: false,
                    platform: account.platform,
                    error: error.message,
                });
            }
        }

        return results;
    }
}

// Export singleton instance
export const socialMediaService = new SocialMediaService();
export { InstagramService, TelegramService };
