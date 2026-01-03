// API Route for publishing posts to connected social media accounts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import type { Platform, PostContent } from '@/lib/social-media-service';

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { postId, platforms, content, mediaPath, mediaType } = body as {
            postId?: string;
            platforms: Platform[];
            content: string;
            mediaPath?: string;
            mediaType?: 'photo' | 'video';
        };

        if (!platforms || platforms.length === 0) {
            return NextResponse.json({ error: 'At least one platform is required' }, { status: 400 });
        }

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Get connected accounts for specified platforms
        const { data: accounts, error: accountsError } = await supabase
            .from('social_accounts')
            .select('*')
            .eq('user_id', user.id)
            .in('platform', platforms)
            .eq('is_active', true)
            .eq('connection_status', 'connected');

        if (accountsError) throw accountsError;

        if (!accounts || accounts.length === 0) {
            return NextResponse.json({
                error: 'No connected accounts found for specified platforms',
                message: 'Lütfen önce hesap bağlayın.',
            }, { status: 400 });
        }

        // Dynamically import the social media service
        const { socialMediaService } = await import('@/lib/social-media-service');

        const results = [];
        const postContent: PostContent = {
            text: content,
            mediaPath,
            mediaType,
        };

        for (const account of accounts) {
            try {
                // Decrypt session
                const session = Buffer.from(account.access_token, 'base64').toString('utf-8');

                // Post to platform
                const result = await socialMediaService.post(
                    account.platform as Platform,
                    session,
                    postContent
                );

                // Save post result to database
                if (postId) {
                    await supabase
                        .from('post_results')
                        .upsert({
                            post_id: postId,
                            social_account_id: account.id,
                            platform: account.platform,
                            status: result.success ? 'published' : 'failed',
                            platform_post_id: result.postId,
                            platform_post_url: result.postUrl,
                            error_message: result.error,
                            published_at: result.success ? new Date().toISOString() : null,
                        });
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

        // Update post status based on results
        if (postId) {
            const allSuccess = results.every(r => r.success);
            const anySuccess = results.some(r => r.success);

            await supabase
                .from('posts')
                .update({
                    status: allSuccess ? 'published' : anySuccess ? 'partial' : 'failed',
                    published_at: anySuccess ? new Date().toISOString() : null,
                })
                .eq('id', postId);
        }

        return NextResponse.json({
            success: true,
            results,
            summary: {
                total: results.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
            },
        });
    } catch (error: any) {
        console.error('Publish error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
