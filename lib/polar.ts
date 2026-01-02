// Polar.sh Integration for Pub
// https://polar.sh/docs

const POLAR_API_URL = 'https://api.polar.sh/v1';
const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;

// Types
export interface PolarProduct {
    id: string;
    name: string;
    description: string;
    price_amount: number;
    price_currency: string;
    is_recurring: boolean;
    recurring_interval?: 'month' | 'year';
}

export interface PolarSubscription {
    id: string;
    customer_id: string;
    product_id: string;
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
}

export interface PolarCheckoutSession {
    id: string;
    url: string;
    success_url: string;
    cancel_url: string;
}

// Helper function for API requests
async function polarFetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${POLAR_API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${POLAR_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Polar API error');
    }

    return response.json();
}

// Product/Pricing functions
export async function getProducts(): Promise<PolarProduct[]> {
    const data = await polarFetch('/products');
    return data.items;
}

export async function getProduct(productId: string): Promise<PolarProduct> {
    return polarFetch(`/products/${productId}`);
}

// Subscription functions
export async function createCheckoutSession(
    productId: string,
    customerId: string,
    customerEmail: string,
    successUrl: string,
    cancelUrl: string
): Promise<PolarCheckoutSession> {
    return polarFetch('/checkout/sessions', {
        method: 'POST',
        body: JSON.stringify({
            product_id: productId,
            customer_id: customerId,
            customer_email: customerEmail,
            success_url: successUrl,
            cancel_url: cancelUrl,
        }),
    });
}

export async function getSubscription(subscriptionId: string): Promise<PolarSubscription> {
    return polarFetch(`/subscriptions/${subscriptionId}`);
}

export async function getCustomerSubscriptions(customerId: string): Promise<PolarSubscription[]> {
    const data = await polarFetch(`/subscriptions?customer_id=${customerId}`);
    return data.items;
}

export async function cancelSubscription(subscriptionId: string): Promise<PolarSubscription> {
    return polarFetch(`/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
    });
}

// Customer portal
export async function createCustomerPortalSession(customerId: string): Promise<{ url: string }> {
    return polarFetch('/customer-portal/sessions', {
        method: 'POST',
        body: JSON.stringify({
            customer_id: customerId,
        }),
    });
}

// Webhook verification
export function verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

// Subscription tier helpers
export const SUBSCRIPTION_TIERS = {
    free: {
        name: 'Free',
        maxAccounts: 1,
        maxPostsPerMonth: 10,
        features: ['1 social account', '10 posts/month', 'Basic analytics'],
    },
    starter: {
        name: 'Starter',
        priceMonthly: 9,
        priceYearly: 86,
        maxAccounts: 3,
        maxPostsPerMonth: 30,
        features: ['3 social accounts', '30 posts/month', 'Basic analytics', 'Email support'],
    },
    pro: {
        name: 'Pro',
        priceMonthly: 29,
        priceYearly: 278,
        maxAccounts: 10,
        maxPostsPerMonth: -1, // unlimited
        features: ['10 social accounts', 'Unlimited posts', 'Advanced analytics', 'Priority support', 'Team collaboration', 'Custom branding'],
    },
    enterprise: {
        name: 'Enterprise',
        priceMonthly: 99,
        priceYearly: 950,
        maxAccounts: -1, // unlimited
        maxPostsPerMonth: -1, // unlimited
        features: ['Unlimited accounts', 'Unlimited posts', 'White-label solution', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'],
    },
};

export function getTierLimits(tier: keyof typeof SUBSCRIPTION_TIERS) {
    return SUBSCRIPTION_TIERS[tier];
}

export function canAddAccount(tier: keyof typeof SUBSCRIPTION_TIERS, currentCount: number): boolean {
    const limits = SUBSCRIPTION_TIERS[tier];
    return limits.maxAccounts === -1 || currentCount < limits.maxAccounts;
}

export function canCreatePost(tier: keyof typeof SUBSCRIPTION_TIERS, currentCount: number): boolean {
    const limits = SUBSCRIPTION_TIERS[tier];
    return limits.maxPostsPerMonth === -1 || currentCount < limits.maxPostsPerMonth;
}
