// Supabase Integration for Pub
// https://supabase.com/docs

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types
export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise';
    subscription_status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    trial_ends_at?: string;
    created_at: string;
}

export interface SocialAccount {
    id: string;
    user_id: string;
    platform: 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'facebook' | 'linkedin' | 'pinterest';
    platform_user_id: string;
    platform_username: string;
    access_token: string;
    refresh_token?: string;
    token_expires_at?: string;
    is_active: boolean;
    created_at: string;
}

export interface ScheduledPost {
    id: string;
    user_id: string;
    content: string;
    media_urls?: string[];
    platforms: string[];
    scheduled_for: string;
    status: 'pending' | 'published' | 'failed';
    published_at?: string;
    error_message?: string;
    created_at: string;
}

// Lazy-load Supabase client (only on client-side)
let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (supabaseInstance) return supabaseInstance;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase environment variables are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
}

// Auth functions
export async function signUp(email: string, password: string, fullName: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) throw error;
    return data;
}

export async function signIn(email: string, password: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signInWithGoogle() {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/dashboard`,
        },
    });

    if (error) throw error;
    return data;
}

export async function signInWithGithub() {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/dashboard`,
        },
    });

    if (error) throw error;
    return data;
}

export async function signOut() {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function resetPassword(email: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return data;
}

export async function getCurrentUser() {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getSession() {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

// User profile functions
export async function getUserProfile(userId: string): Promise<User | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) return null;
    return data;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Social accounts functions
export async function getSocialAccounts(userId: string): Promise<SocialAccount[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

    if (error) throw error;
    return data || [];
}

export async function addSocialAccount(account: Omit<SocialAccount, 'id' | 'created_at'>) {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('social_accounts')
        .insert(account)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function removeSocialAccount(accountId: string) {
    const supabase = getSupabase();
    const { error } = await supabase
        .from('social_accounts')
        .update({ is_active: false })
        .eq('id', accountId);

    if (error) throw error;
}

// Scheduled posts functions
export async function getScheduledPosts(userId: string): Promise<ScheduledPost[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('scheduled_posts')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_for', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function createScheduledPost(post: Omit<ScheduledPost, 'id' | 'created_at' | 'status' | 'published_at'>) {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('scheduled_posts')
        .insert({ ...post, status: 'pending' })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateScheduledPost(postId: string, updates: Partial<ScheduledPost>) {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('scheduled_posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteScheduledPost(postId: string) {
    const supabase = getSupabase();
    const { error } = await supabase
        .from('scheduled_posts')
        .delete()
        .eq('id', postId);

    if (error) throw error;
}

// Analytics functions
export async function getPostAnalytics(userId: string, startDate: string, endDate: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('post_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (error) throw error;
    return data || [];
}

// Storage functions for media uploads
export async function uploadMedia(userId: string, file: File) {
    const supabase = getSupabase();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

    return publicUrl;
}

export async function deleteMedia(path: string) {
    const supabase = getSupabase();
    const { error } = await supabase.storage
        .from('media')
        .remove([path]);

    if (error) throw error;
}
