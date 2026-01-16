
import React, { useRef, useEffect } from 'react';
import { ROBOTO_PRESETS } from '../../lib/fonts/roboto-presets';

export interface Multi21CTAProps {
    // Content
    label?: string;
    onLabelChange?: (text: string) => void;
    href?: string;

    // Layout
    align?: 'left' | 'center' | 'right';
    fullWidth?: boolean;

    // Visuals
    variant?: 'solid' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';

    // Style (Scoped via ConnectedBlock)
    styleAccentColor?: string; // The "Funk" color

    // Typography (Vario Engine - Simplified for Button)
    fontFamily?: number; // 0=Sans, 1=Serif, etc.
}

export function Multi21_CTA({
    // Defaults
    label = "Click Me",
    onLabelChange,
    href = "#",
    align = 'center',
    fullWidth = false,
    variant = 'solid',
    size = 'medium',
    styleAccentColor = '#3b82f6',
    fontFamily = 0,
}: Multi21CTAProps) {

    // --- Vario Engine (Simplified) ---
    // Buttons usually need a bit more weight than body text.
    const getFontFamilyVar = (index: number) => {
        switch (index) {
            case 1: return 'var(--font-roboto-serif)';
            case 2: return 'var(--font-roboto-slab)';
            case 3: return 'var(--font-roboto-mono)';
            default: return 'var(--font-roboto-flex)';
        }
    };

    // Hardcoded punchy button font settings
    const fontStyle = {
        fontFamily: getFontFamilyVar(fontFamily),
        fontVariationSettings: `'wght' 600, 'wdth' 100`,
    };

    // --- Helpers ---
    const sizeClasses = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
    }[size];

    const alignClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    }[align];


    // --- Variant Logic ---
    // We use dynamic styles because Tailwind can't interpolate arbitrary CSS variables for colors easily without setup.
    // relying on `styleAccentColor` passed from the tool.

    const getVariantStyle = () => {
        const base = {
            ...fontStyle,
            transition: 'all 0.2s ease',
        };

        if (variant === 'solid') {
            return {
                ...base,
                backgroundColor: styleAccentColor,
                color: '#ffffff',
                border: `2px solid ${styleAccentColor}`,
            };
        }
        if (variant === 'outline') {
            return {
                ...base,
                backgroundColor: 'transparent',
                color: styleAccentColor,
                border: `2px solid ${styleAccentColor}`,
            };
        }
        if (variant === 'ghost') {
            return {
                ...base,
                backgroundColor: 'transparent',
                color: styleAccentColor,
                border: '2px solid transparent', // Keep alignment stable
            };
        }
        return base;
    };


    // --- Inline Editing (Manual DOM Sync) ---
    const labelRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (labelRef.current && document.activeElement !== labelRef.current) {
            if (labelRef.current.innerText !== label) {
                labelRef.current.innerText = label || '';
            }
        }
    }, [label]);

    const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
        onLabelChange?.(e.currentTarget.innerText);
    };

    return (
        <div className={`w-full flex ${alignClasses} p-4`}>
            <a
                href={href}
                className={`
                    inline-flex items-center justify-center rounded-lg font-medium cursor-pointer relative group
                    ${fullWidth ? 'w-full' : ''}
                    ${sizeClasses}
                `}
                style={getVariantStyle()}
                onClick={(e) => e.preventDefault()} // Prevent nav in editor
            >
                {/* Editable Span */}
                <span
                    ref={labelRef}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    className="outline-none min-w-[1em] text-center"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {label}
                </span>

                {/* Optional: Hover overlay for "Ghost" or generic hover effects could go here, 
                    but simplistic CSS transition is usually handled by `hover:` classes. 
                    Since we use inline styles for colors, hover effects need care.
                    For now, we accept standard hover brightness via CSS filter if possible, 
                    or just rely on the 'transform' active state.
                */}
            </a>
        </div>
    );
}
