'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
    primary: cn(
        'bg-primary text-white',
        'hover:bg-primary-hover',
        'shadow-glow shadow-primary-glow',
        'hover:shadow-glow-lg hover:shadow-primary-glow',
        'active:scale-[0.98]'
    ),
    secondary: cn(
        'bg-background-tertiary text-foreground',
        'border border-border',
        'hover:bg-glass-hover hover:border-border-hover',
        'active:scale-[0.98]'
    ),
    ghost: cn(
        'text-foreground-muted',
        'hover:text-foreground hover:bg-glass',
        'active:scale-[0.98]'
    ),
    outline: cn(
        'border border-border bg-transparent text-foreground',
        'hover:bg-glass hover:border-border-hover',
        'active:scale-[0.98]'
    ),
    danger: cn(
        'bg-error text-white',
        'hover:bg-error/90',
        'shadow-glow shadow-error-glow',
        'active:scale-[0.98]'
    ),
};

const sizes: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
    md: 'h-10 px-4 text-sm gap-2 rounded-xl',
    lg: 'h-12 px-6 text-base gap-2 rounded-xl',
    xl: 'h-14 px-8 text-lg gap-3 rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <motion.button
                ref={ref}
                disabled={disabled || isLoading}
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                transition={{ duration: 0.15 }}
                className={cn(
                    'relative inline-flex items-center justify-center font-medium',
                    'transition-all duration-200 ease-out',
                    'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin h-4 w-4" />
                )}
                <span
                    className={cn(
                        'inline-flex items-center gap-2',
                        isLoading && 'invisible'
                    )}
                >
                    {leftIcon}
                    {children}
                    {rightIcon}
                </span>
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
