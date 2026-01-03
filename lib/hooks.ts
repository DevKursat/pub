'use client';

import { useState, useEffect, useCallback } from 'react';

interface Account {
    id: string;
    platform: string;
    platform_username: string;
    platform_name: string;
    platform_avatar: string;
    followers_count: number;
    connection_status: 'connected' | 'error' | 'expired' | 'pending';
    last_sync_at: string;
}

interface Post {
    id: string;
    content: string;
    media_urls: string[];
    platforms: string[];
    scheduled_for: string | null;
    published_at: string | null;
    status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'partial';
    created_at: string;
    post_results?: {
        id: string;
        platform: string;
        status: string;
        likes_count: number;
        comments_count: number;
        shares_count: number;
        views_count: number;
        platform_post_url: string | null;
    }[];
}

interface Analytics {
    summary: {
        totalFollowers: number;
        totalPosts: number;
        totalLikes: number;
        totalComments: number;
        totalShares: number;
        totalViews: number;
        totalReach: number;
        engagementRate: string;
    };
    accounts: Account[];
    snapshots: any[];
    range: string;
}

// Hook for fetching accounts
export function useAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/accounts');
            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            setAccounts(data.accounts || []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const disconnectAccount = useCallback(async (accountId: string) => {
        try {
            const response = await fetch(`/api/accounts?id=${accountId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            setAccounts(prev => prev.filter(a => a.id !== accountId));
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        }
    }, []);

    const connectAccount = useCallback((platform: string) => {
        window.location.href = `/api/connect?platform=${platform}`;
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return { accounts, loading, error, fetchAccounts, disconnectAccount, connectAccount };
}

// Hook for fetching and creating posts
export function usePosts(options?: { status?: string; limit?: number }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (options?.status) params.append('status', options.status);
            if (options?.limit) params.append('limit', options.limit.toString());

            const response = await fetch(`/api/posts?${params}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            setPosts(data.posts || []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [options?.status, options?.limit]);

    const createPost = useCallback(async (postData: {
        content: string;
        media_urls?: string[];
        platforms: string[];
        scheduled_for?: string;
        is_immediate?: boolean;
    }) => {
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            // Refresh posts
            await fetchPosts();
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, [fetchPosts]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return { posts, loading, error, fetchPosts, createPost };
}

// Hook for fetching analytics
export function useAnalytics(range: '7d' | '30d' | '90d' = '7d') {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/analytics?range=${range}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            setAnalytics(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [range]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return { analytics, loading, error, fetchAnalytics };
}

// Format number helper
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Format date helper
export function formatRelativeTime(date: string, locale: string = 'en'): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (locale === 'tr') {
        if (diffMins < 1) return 'az önce';
        if (diffMins < 60) return `${diffMins} dk önce`;
        if (diffHours < 24) return `${diffHours} saat önce`;
        if (diffDays < 7) return `${diffDays} gün önce`;
        return then.toLocaleDateString('tr-TR');
    }

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return then.toLocaleDateString('en-US');
}
