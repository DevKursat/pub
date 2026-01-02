'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
    variant?: 'default' | 'glass' | 'gradient' | 'interactive';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    children?: ReactNode;
    className?: string;
    onClick?: () => void;
}

const variantStyles: Record<string, string> = {
    default: cn(
        'bg-background-secondary',
        'border border-border',
        'shadow-card'
    ),
    glass: cn(
        'bg-glass backdrop-blur-xl',
        'border border-border',
        'shadow-card'
    ),
    gradient: cn(
        'bg-gradient-to-br from-primary/10 via-background-secondary to-accent/10',
        'border border-border',
        'shadow-card'
    ),
    interactive: cn(
        'bg-glass backdrop-blur-xl',
        'border border-border',
        'shadow-card',
        'cursor-pointer'
    ),
};

const paddingStyles: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = 'default',
            padding = 'md',
            hover = false,
            children,
            onClick,
        },
        ref
    ) => {
        const shouldAnimate = hover || variant === 'interactive';
        const baseClassName = cn(
            'rounded-2xl',
            'transition-all duration-300',
            variantStyles[variant],
            paddingStyles[padding],
            shouldAnimate && ['hover:border-border-hover', 'hover:shadow-card-hover'],
            className
        );

        if (shouldAnimate) {
            return (
                <motion.div
                    ref={ref}
                    whileHover={{
                        y: -4,
                        scale: 1.01,
                        transition: { duration: 0.2 },
                    }}
                    className={baseClassName}
                    onClick={onClick}
                >
                    {children}
                </motion.div>
            );
        }

        return (
            <div ref={ref} className={baseClassName} onClick={onClick}>
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

interface CardHeaderProps {
    className?: string;
    children?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, children }, ref) => {
        return (
            <div ref={ref} className={cn('flex flex-col space-y-1.5', className)}>
                {children}
            </div>
        );
    }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps {
    className?: string;
    children?: ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, children }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn(
                    'text-lg font-semibold text-foreground tracking-tight',
                    className
                )}
            >
                {children}
            </h3>
        );
    }
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps {
    className?: string;
    children?: ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, children }, ref) => {
        return (
            <p ref={ref} className={cn('text-sm text-foreground-muted', className)}>
                {children}
            </p>
        );
    }
);

CardDescription.displayName = 'CardDescription';

interface CardContentProps {
    className?: string;
    children?: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children }, ref) => {
        return (
            <div ref={ref} className={cn('', className)}>
                {children}
            </div>
        );
    }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps {
    className?: string;
    children?: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, children }, ref) => {
        return (
            <div ref={ref} className={cn('flex items-center pt-4', className)}>
                {children}
            </div>
        );
    }
);

CardFooter.displayName = 'CardFooter';

export default Card;
