import React from 'react';
import { useVarioEngine } from '../../../../hooks/useVarioEngine';

interface Multi21CTAProps {
    label: string;
    onLabelChange?: (t: string) => void;
    href?: string;

    // Style Props
    variant?: 'solid' | 'outline' | 'ghost' | 'atomic';
    size?: 'small' | 'medium' | 'large';
    align?: 'left' | 'center' | 'right';
    fullWidth?: boolean;
    styleAccentColor?: string;
    styleBgColor?: string;
    styleTextColor?: string;
    styleBorderColor?: string;
    styleBorderWidth?: number;

    // Vario Props
    fontFamily?: number;
    weight?: number | null;
    width?: number | null;
    slant?: number;
    casual?: number;
    grade?: number;
    fontSizeDesktop?: number;
    fontSizeMobile?: number;
    letterSpacing?: number;
    wordSpacing?: number;
    textTransform?: string;
    textDecoration?: string;

    // Layout
    width?: number; // px
    height?: number; // px
    scale?: number;

    isMobileView?: boolean;
}

export function Multi21_CTA({
    label,
    onLabelChange,
    href = '#',
    variant = 'solid',
    size = 'medium',
    align = 'center',
    fullWidth = false,
    width = 180,
    height = 48,
    scale = 1,

    styleAccentColor = '#3b82f6',
    styleBgColor = 'transparent',
    styleTextColor = 'inherit',
    styleBorderColor = 'transparent',
    styleBorderWidth = 0,

    fontFamily = 0,
    weight = null,
    width: axisWidth = null,
    slant = 0,
    casual = 0,
    grade = 0,
    fontSizeDesktop = 16,
    fontSizeMobile = 16,
    letterSpacing = 0,
    wordSpacing = 0,
    textTransform = 'none',
    textDecoration = 'none',

    isMobileView = false
}: Multi21CTAProps) {

    // --- Vario Engine ---
    const baseSize = isMobileView ? fontSizeMobile : fontSizeDesktop;
    const scaledFontSize = Math.max(10, Math.round(baseSize * scale));

    // Buttons are usually heavier. If weight is null, default to 600
    const effectiveWeight = (weight === null || weight === -1) ? 600 : weight;

    const { style: varioStyle } = useVarioEngine({
        fontFamily,
        weight: effectiveWeight,
        width: axisWidth,
        slant,
        casual,
        grade,
        size: scaledFontSize
    });

    // --- Button Styles ---
    const textColor = styleTextColor !== 'inherit' ? styleTextColor : styleAccentColor;
    const bgColor = styleBgColor !== 'transparent' ? styleBgColor : styleAccentColor;
    const borderColor = styleBorderColor !== 'transparent' ? styleBorderColor : styleAccentColor;
    const resolvedBorderWidth = styleBorderWidth > 0 ? styleBorderWidth : 2;

    const getVariantStyle = () => {
        const base = {
            ...varioStyle,
            transition: 'all 0.2s ease',
            textTransform: textTransform as any,
            textDecoration: textDecoration as any,
            letterSpacing: `${letterSpacing / 100}em`,
            wordSpacing: `${wordSpacing / 10}em`,
        };

        if (variant === 'solid') {
            return { ...base, backgroundColor: bgColor, color: styleTextColor !== 'inherit' ? styleTextColor : '#ffffff', border: `${styleBorderWidth}px solid ${borderColor}` };
        }
        if (variant === 'outline') {
            return { ...base, backgroundColor: 'transparent', color: textColor, border: `${resolvedBorderWidth}px solid ${borderColor}` };
        }
        return { ...base, backgroundColor: 'transparent', color: textColor, border: '2px solid transparent' };
    };

    const alignClass = { left: 'justify-start', center: 'justify-center', right: 'justify-end' }[align];
    const scaledWidth = Math.round(width * scale);
    const scaledHeight = Math.round(height * scale);
    const scaledPadding = Math.round(16 * scale);

    return (
        <div className={`w-full flex ${alignClass} p-4`}>
            <a
                href={href}
                className={`inline-flex items-center justify-center rounded-lg font-medium cursor-pointer relative group ${fullWidth ? 'w-full' : ''}`}
                style={{
                    ...getVariantStyle(),
                    width: fullWidth ? undefined : scaledWidth,
                    height: scaledHeight,
                    paddingInline: fullWidth ? undefined : scaledPadding,
                    fontSize: `${scaledFontSize}px`,
                }}
                onClick={(e) => e.preventDefault()}
            >
                <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onLabelChange?.(e.currentTarget.innerText)}
                    className="outline-none min-w-[1em] text-center"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {label}
                </span>
            </a>
        </div>
    );
}
