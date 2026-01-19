
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
    variant?: 'solid' | 'outline' | 'ghost' | 'atomic';
    size?: 'small' | 'medium' | 'large';
    width?: number;
    height?: number;
    scale?: number;

    // Style (Scoped via ConnectedBlock)
    styleAccentColor?: string; // The "Funk" color
    styleBgColor?: string;
    styleTextColor?: string;
    styleBorderColor?: string;
    styleBorderWidth?: number;

    // Typography (Vario Engine - Simplified for Button)
    fontPresetIndex?: number;
    fontFamily?: number; // 0=Sans, 1=Serif, etc.
    fontSizeDesktop?: number;
    fontSizeMobile?: number;
    axisWeight?: number | null;
    axisWidth?: number | null;
    axisCasual?: number;
    axisSlant?: number;
    axisGrade?: number;
    letterSpacing?: number;
    wordSpacing?: number;
    textTransform?: string;
    textDecoration?: string;
    isMobileView?: boolean;
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
    width = 180,
    height = 48,
    scale = 1,
    styleAccentColor = '#3b82f6',
    styleBgColor = 'transparent',
    styleTextColor = 'inherit',
    styleBorderColor = 'transparent',
    styleBorderWidth = 0,
    fontPresetIndex = 3,
    fontFamily = 0,
    fontSizeDesktop = 16,
    fontSizeMobile = 16,
    axisWeight = null,
    axisWidth = null,
    axisCasual = 0,
    axisSlant = 0,
    axisGrade = 0,
    letterSpacing = 0,
    wordSpacing = 0,
    textTransform = 'none',
    textDecoration = 'none',
    isMobileView = false,
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

    const baseWeight = variant === 'atomic' ? 500 : 600;
    const activeFontVar = getFontFamilyVar(fontFamily);
    const preset = ROBOTO_PRESETS[fontPresetIndex] || ROBOTO_PRESETS[3];
    const defaultAxes = { ...preset.axes };
    const wdth = axisWidth !== null && axisWidth !== -1 ? axisWidth : defaultAxes.wdth;
    const slnt = fontFamily === 0 ? axisSlant || 0 : 0;
    const casl = fontFamily === 0 ? axisCasual || 0 : 0;
    const grd = axisGrade || 0;
    const weight = axisWeight !== null && axisWeight !== -1 ? axisWeight : baseWeight;

    let activeFontStyle = 'normal';
    let effectiveSlant = slnt;
    if (fontFamily !== 0) {
        effectiveSlant = 0;
        if ((axisSlant || 0) <= -1) {
            activeFontStyle = 'italic';
        }
    }

    const baseFontStyle = {
        fontFamily: `${activeFontVar}, sans-serif`,
        fontVariationSettings: `'wght' ${weight}, 'wdth' ${wdth}, 'slnt' ${effectiveSlant}, 'CASL' ${casl}, 'GRAD' ${grd}`,
        fontStyle: activeFontStyle,
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

    const textColor = styleTextColor !== 'inherit' ? styleTextColor : styleAccentColor;
    const bgColor = styleBgColor !== 'transparent' ? styleBgColor : styleAccentColor;
    const borderColor = styleBorderColor !== 'transparent' ? styleBorderColor : styleAccentColor;
    const resolvedBorderWidth = styleBorderWidth > 0 ? styleBorderWidth : 2;

    const getVariantStyle = () => {
        const base = {
            ...baseFontStyle,
            transition: 'all 0.2s ease',
        };

        if (variant === 'solid') {
            return {
                ...base,
                backgroundColor: bgColor,
                color: styleTextColor !== 'inherit' ? styleTextColor : '#ffffff',
                border: `${styleBorderWidth > 0 ? styleBorderWidth : 0}px solid ${borderColor}`,
            };
        }
        if (variant === 'outline') {
            return {
                ...base,
                backgroundColor: 'transparent',
                color: textColor,
                border: `${resolvedBorderWidth}px solid ${borderColor}`,
            };
        }
        if (variant === 'ghost') {
            return {
                ...base,
                backgroundColor: 'transparent',
                color: textColor,
                border: '2px solid transparent',
            };
        }
        if (variant === 'atomic') {
            return {
                ...base,
                backgroundColor: 'transparent',
                color: textColor,
                border: '2px solid transparent',
            };
        }
        return base;
    };

    const scaledWidth = Math.round(width * scale);
    const scaledHeight = Math.round(height * scale);
    const baseFontSize = isMobileView ? fontSizeMobile : fontSizeDesktop;
    const scaledFontSize = Math.max(10, Math.round(baseFontSize * scale));
    const scaledPadding = Math.max(6, Math.round(12 * scale));


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
                style={{
                    ...getVariantStyle(),
                    width: fullWidth ? undefined : scaledWidth,
                    height: scaledHeight,
                    paddingInline: fullWidth ? undefined : scaledPadding,
                    paddingBlock: 0,
                    fontSize: scaledFontSize,
                    letterSpacing: `${letterSpacing / 100}em`,
                    wordSpacing: `${wordSpacing / 10}em`,
                    textTransform: textTransform,
                    textDecoration: textDecoration,
                }}
                onClick={(e) => e.preventDefault()} // Prevent nav in editor
            >
                {/* Editable Span */}
                <span
                    ref={labelRef}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    className="outline-none min-w-[1em] text-center font-sans"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {label}
                </span>

                {variant === 'atomic' && (
                    <span className="ml-2 inline-flex items-center" aria-hidden="true">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="13 6 19 12 13 18" />
                        </svg>
                    </span>
                )}

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
