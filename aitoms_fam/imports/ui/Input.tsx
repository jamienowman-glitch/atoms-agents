import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    helperText?: string;
    error?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, helperText, error, startIcon, endIcon, id, className = '', ...rest },
    ref,
) {
    const inputId = id || rest.name || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined;
    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={inputId} className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                {label}
            </label>
            <div className={`flex items-center gap-2 rounded-md border px-3 py-2 bg-white dark:bg-neutral-900 ${error ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'} ${className}`}>
                {startIcon}
                <input
                    ref={ref}
                    id={inputId}
                    aria-invalid={!!error}
                    aria-describedby={describedBy}
                    className="flex-1 bg-transparent outline-none text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                    {...rest}
                />
                {endIcon}
            </div>
            {helperText && !error && (
                <p id={`${inputId}-helper`} className="text-xs text-neutral-500">
                    {helperText}
                </p>
            )}
            {error && (
                <p id={`${inputId}-error`} className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
});
