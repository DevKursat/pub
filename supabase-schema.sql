-- ============================================
-- PUB - COMPLETE SUPABASE DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise')),
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing')),
    polar_customer_id TEXT,
    polar_subscription_id TEXT,
    trial_ends_at TIMESTAMPTZ,
    posts_this_month INTEGER DEFAULT 0,
    last_post_reset TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. SOCIAL ACCOUNTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'linkedin', 'pinterest')),
    platform_user_id TEXT NOT NULL,
    platform_username TEXT NOT NULL,
    platform_name TEXT,
    platform_avatar TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    followers_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMPTZ DEFAULT NOW(),
    connection_status TEXT DEFAULT 'connected' CHECK (connection_status IN ('connected', 'error', 'expired', 'pending')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, platform, platform_user_id)
);

-- ============================================
-- 3. POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    media_types TEXT[] DEFAULT '{}',
    platforms TEXT[] NOT NULL,
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'publishing', 'published', 'failed', 'partial')),
    is_immediate BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. POST RESULTS (per platform)
-- ============================================
CREATE TABLE IF NOT EXISTS public.post_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    social_account_id UUID NOT NULL REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    platform_post_id TEXT,
    platform_post_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'publishing', 'published', 'failed')),
    error_message TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    reach_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    last_analytics_sync TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. ANALYTICS SNAPSHOTS (daily)
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    total_shares INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    total_reach INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(social_account_id, snapshot_date)
);

-- ============================================
-- 6. MEDIA QUEUE (for uploads)
-- ============================================
CREATE TABLE IF NOT EXISTS public.media_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    width INTEGER,
    height INTEGER,
    status TEXT DEFAULT 'uploading' CHECK (status IN ('uploading', 'processing', 'ready', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. OAUTH STATES (for connection flow)
-- ============================================
CREATE TABLE IF NOT EXISTS public.oauth_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    state_token TEXT NOT NULL UNIQUE,
    code_verifier TEXT,
    redirect_uri TEXT,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('post_published', 'post_failed', 'account_error', 'subscription', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_social_accounts_user ON public.social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON public.social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_user ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON public.posts(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_post_results_post ON public.post_results(post_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON public.analytics_snapshots(user_id, snapshot_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own accounts" ON public.social_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts" ON public.social_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own accounts" ON public.social_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own accounts" ON public.social_accounts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own posts" ON public.posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own post results" ON public.post_results FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_results.post_id AND posts.user_id = auth.uid())
);

CREATE POLICY "Users can view own analytics" ON public.analytics_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own media" ON public.media_queue FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own oauth" ON public.oauth_states FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Reset monthly post count
CREATE OR REPLACE FUNCTION public.reset_monthly_posts()
RETURNS VOID AS $$
BEGIN
    UPDATE public.users
    SET posts_this_month = 0, last_post_reset = NOW()
    WHERE last_post_reset < DATE_TRUNC('month', NOW());
END;
$$ LANGUAGE plpgsql;

-- Get user stats
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS TABLE (
    total_followers BIGINT,
    total_posts BIGINT,
    total_reach BIGINT,
    avg_engagement DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(sa.followers_count), 0)::BIGINT as total_followers,
        COUNT(DISTINCT p.id)::BIGINT as total_posts,
        COALESCE(SUM(pr.reach_count), 0)::BIGINT as total_reach,
        COALESCE(AVG(
            CASE WHEN pr.views_count > 0 
            THEN ((pr.likes_count + pr.comments_count + pr.shares_count)::DECIMAL / pr.views_count) * 100
            ELSE 0 END
        ), 0)::DECIMAL as avg_engagement
    FROM public.users u
    LEFT JOIN public.social_accounts sa ON sa.user_id = u.id AND sa.is_active = TRUE
    LEFT JOIN public.posts p ON p.user_id = u.id AND p.status = 'published'
    LEFT JOIN public.post_results pr ON pr.post_id = p.id
    WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run these in Supabase Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- CREATE POLICY "Users can upload media" ON storage.objects FOR INSERT WITH CHECK (
--     bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]
-- );

-- CREATE POLICY "Anyone can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- CREATE POLICY "Users can delete own media" ON storage.objects FOR DELETE USING (
--     bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]
-- );

-- ============================================
-- DONE! Your database is ready.
-- ============================================
