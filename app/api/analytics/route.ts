import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/analytics - Get user's analytics
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '7d';

        // Calculate date range
        const now = new Date();
        const startDate = new Date();
        switch (range) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            default:
                startDate.setDate(now.getDate() - 7);
        }

        // Get connected accounts with follower counts
        const { data: accounts } = await supabase
            .from('social_accounts')
            .select('id, platform, platform_username, followers_count')
            .eq('user_id', user.id)
            .eq('is_active', true);

        // Get posts with engagement
        const { data: posts } = await supabase
            .from('posts')
            .select(`
        id,
        status,
        published_at,
        post_results (
          likes_count,
          comments_count,
          shares_count,
          views_count,
          reach_count
        )
      `)
            .eq('user_id', user.id)
            .eq('status', 'published')
            .gte('published_at', startDate.toISOString());

        // Calculate totals
        let totalFollowers = 0;
        const totalPosts = posts?.length || 0;
        let totalLikes = 0;
        let totalComments = 0;
        let totalShares = 0;
        let totalViews = 0;
        let totalReach = 0;

        accounts?.forEach(account => {
            totalFollowers += account.followers_count || 0;
        });

        posts?.forEach(post => {
            (post.post_results as any[])?.forEach((result) => {
                totalLikes += result.likes_count || 0;
                totalComments += result.comments_count || 0;
                totalShares += result.shares_count || 0;
                totalViews += result.views_count || 0;
                totalReach += result.reach_count || 0;
            });
        });

        const engagementRate = totalViews > 0
            ? ((totalLikes + totalComments + totalShares) / totalViews * 100).toFixed(2)
            : '0.00';

        // Get analytics snapshots for chart
        const { data: snapshots } = await supabase
            .from('analytics_snapshots')
            .select('*')
            .eq('user_id', user.id)
            .gte('snapshot_date', startDate.toISOString().split('T')[0])
            .order('snapshot_date', { ascending: true });

        return NextResponse.json({
            summary: {
                totalFollowers,
                totalPosts,
                totalLikes,
                totalComments,
                totalShares,
                totalViews,
                totalReach,
                engagementRate,
            },
            accounts,
            snapshots,
            range,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
