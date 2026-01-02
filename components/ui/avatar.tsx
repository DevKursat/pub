'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    alt?: string;
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'busy' | 'away';
}

const sizeStyles: Record<string, { container: string; icon: string; status: string }> = {
    xs: { container: 'h-6 w-6', icon: 'h-3 w-3', status: 'h-2 w-2' },
    sm: { container: 'h-8 w-8', icon: 'h-4 w-4', status: 'h-2.5 w-2.5' },
    md: { container: 'h-10 w-10', icon: 'h-5 w-5', status: 'h-3 w-3' },
    lg: { container: 'h-12 w-12', icon: 'h-6 w-6', status: 'h-3.5 w-3.5' },
    xl: { container: 'h-16 w-16', icon: 'h-8 w-8', status: 'h-4 w-4' },
};

const statusColors: Record<string, string> = {
    online: 'bg-success',
    offline: 'bg-foreground-subtle',
    busy: 'bg-error',
    away: 'bg-warning',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    (
        {
            className,
            src,
            alt = 'Avatar',
            fallback,
            size = 'md',
            status,
            ...props
        },
        ref
    ) => {
        const styles = sizeStyles[size];

        return (
            <div
                ref={ref}
                className={cn('relative inline-flex', className)}
                {...props}
            >
                <div
                    className={cn(
                        'relative flex items-center justify-center',
                        'rounded-full overflow-hidden',
                        'bg-background-tertiary border border-border',
                        styles.container
                    )}
                >
                    {src ? (
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-cover"
                        />
                    ) : fallback ? (
                        <span className="text-foreground-muted font-medium text-sm uppercase">
                            {fallback.slice(0, 2)}
                        </span>
                    ) : (
                        <User className={cn('text-foreground-subtle', styles.icon)} />
                    )}
                </div>
                {status && (
                    <span
                        className={cn(
                            'absolute bottom-0 right-0',
                            'rounded-full border-2 border-background',
                            statusColors[status],
                            styles.status
                        )}
                    />
                )}
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';

export default Avatar;
