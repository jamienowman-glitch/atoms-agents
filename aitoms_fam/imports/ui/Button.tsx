import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    loading?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    loading = false,
    disabled,
    startIcon,
    endIcon,
    className,
    ...rest
}) => {
    const base = 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors';
    const variants: Record<Variant, string> = {
        primary: 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-400 disabled:text-white',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400',
        outline: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-200',
        ghost: 'text-neutral-800 hover:bg-neutral-100 disabled:text-neutral-400',
    };

    const classNames = [base, variants[variant], className].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            disabled={disabled || loading}
            {...rest}
        >
            {loading && <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            {startIcon}
            {children}
            {endIcon}
        </button>
    );
};
