import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/posts - List user's posts
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        let query = supabase
            .from('posts')
            .select(`
        *,
        post_results (
          id,
          platform,
          status,
          likes_count,
          comments_count,
          shares_count,
          views_count,
          platform_post_url
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ posts: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { content, media_urls, platforms, scheduled_for, is_immediate } = body;

        if (!content || !platforms || platforms.length === 0) {
            return NextResponse.json({ error: 'Content and platforms are required' }, { status: 400 });
        }

        // Check user's post limit
        const { data: userData } = await supabase
            .from('users')
            .select('subscription_tier, posts_this_month')
            .eq('id', user.id)
            .single();

        const limits: Record<string, number> = {
            free: 10,
            starter: 30,
            pro: -1,
            enterprise: -1,
        };

        const limit = limits[userData?.subscription_tier || 'free'];
        if (limit !== -1 && (userData?.posts_this_month || 0) >= limit) {
            return NextResponse.json({ error: 'Monthly post limit reached' }, { status: 403 });
        }

        // Get connected accounts for selected platforms
        const { data: accounts } = await supabase
            .from('social_accounts')
            .select('id, platform')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .in('platform', platforms);

        if (!accounts || accounts.length === 0) {
            return NextResponse.json({ error: 'No connected accounts for selected platforms' }, { status: 400 });
        }

        // Create post
        const { data: post, error: postError } = await supabase
            .from('posts')
            .insert({
                user_id: user.id,
                content,
                media_urls: media_urls || [],
                platforms,
                scheduled_for: is_immediate ? null : scheduled_for,
                status: is_immediate ? 'publishing' : 'scheduled',
                is_immediate,
            })
            .select()
            .single();

        if (postError) throw postError;

        // Create post results for each account
        const postResults = accounts.map(account => ({
            post_id: post.id,
            social_account_id: account.id,
            platform: account.platform,
            status: 'pending',
        }));

        const { error: resultsError } = await supabase
            .from('post_results')
            .insert(postResults);

        if (resultsError) throw resultsError;

        // Update user's post count
        await supabase
            .from('users')
            .update({ posts_this_month: (userData?.posts_this_month || 0) + 1 })
            .eq('id', user.id);

        // If immediate, trigger publishing
        if (is_immediate) {
            await supabase
                .from('posts')
                .update({ status: 'published', published_at: new Date().toISOString() })
                .eq('id', post.id);

            await supabase
                .from('post_results')
                .update({ status: 'published', published_at: new Date().toISOString() })
                .eq('post_id', post.id);
        }

        return NextResponse.json({ post, message: is_immediate ? 'Post published!' : 'Post scheduled!' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
