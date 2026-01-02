'use client';

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    id?: string;
}

const sizeStyles = {
    sm: 'h-9 text-sm px-3',
    md: 'h-11 text-base px-4',
    lg: 'h-13 text-lg px-5',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = 'text',
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            size = 'md',
            disabled,
            placeholder,
            value,
            onChange,
            required,
            name,
            id,
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const [isFocused, setIsFocused] = useState(false);
        const isPassword = type === 'password';
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-foreground-muted">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={inputType}
                        disabled={disabled}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required={required}
                        name={name}
                        id={id}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={cn(
                            'w-full rounded-xl',
                            'bg-background-secondary border border-border',
                            'text-foreground placeholder:text-foreground-subtle',
                            'transition-all duration-200',
                            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            error && 'border-error focus:border-error focus:ring-error/20',
                            sizeStyles[size],
                            leftIcon && 'pl-10',
                            (rightIcon || isPassword) && 'pr-10',
                            className
                        )}
                    />
                    {(rightIcon || isPassword) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isPassword ? (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-foreground-subtle hover:text-foreground transition-colors p-1"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            ) : (
                                <div className="text-foreground-subtle">{rightIcon}</div>
                            )}
                        </div>
                    )}
                </div>
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-sm text-error"
                        >
                            {error}
                        </motion.p>
                    )}
                    {hint && !error && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-sm text-foreground-subtle"
                        >
                            {hint}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
