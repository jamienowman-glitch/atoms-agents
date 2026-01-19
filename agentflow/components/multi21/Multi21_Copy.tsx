import React, { useEffect, useRef } from 'react';
import { ROBOTO_PRESETS } from '../../lib/fonts/roboto-presets';

export type CopyLevel = 'h2' | 'h3' | 'h4' | 'body';
export type CopyStylePreset = 'jumbo' | 'headline' | 'subtitle' | 'tagline' | 'quote' | 'body' | 'caption';

export interface Multi21CopyProps {
    text: string;
    onTextChange?: (text: string) => void;

    level?: CopyLevel;
    stylePreset?: CopyStylePreset;

    // Layout
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    contentWidth?: string | number;
    stackGap?: number;
    verticalAlign?: 'top' | 'center' | 'bottom' | 'justify';

    // Typography
    fontPresetIndex?: number;
    fontSizeDesktop?: number;
    fontSizeMobile?: number;
    lineHeight?: number;
    letterSpacing?: number;
    wordSpacing?: number;
    textTransform?: string;
    textDecoration?: string;
    fontFamily?: number;
    axisWeight?: number | null;
    axisWidth?: number | null;
    axisCasual?: number;
    axisSlant?: number;
    axisGrade?: number;

    // Style
    styleBgColor?: string;
    styleTextColor?: string;
    styleBorderColor?: string;
    styleBorderWidth?: number;
    styleTextStrokeColor?: string;
    styleTextStrokeWidth?: number;
    styleOpacity?: number;
    styleBlur?: number;

    isMobileView?: boolean;
}

const STYLE_PRESETS: Record<CopyStylePreset, { scale: number; lineHeight?: number }> = {
    jumbo: { scale: 2.6, lineHeight: 1.05 },
    headline: { scale: 1.9, lineHeight: 1.15 },
    subtitle: { scale: 1.35, lineHeight: 1.25 },
    tagline: { scale: 1.15, lineHeight: 1.2 },
    quote: { scale: 1.5, lineHeight: 1.3 },
    body: { scale: 1, lineHeight: 1.5 },
    caption: { scale: 0.85, lineHeight: 1.2 },
};

export function Multi21_Copy({
    text,
    onTextChange,
    level = 'body',
    stylePreset = 'body',
    textAlign = 'left',
    contentWidth = '100%',
    stackGap = 12,
    verticalAlign = 'top',
    fontPresetIndex = 3,
    fontSizeDesktop = 16,
    fontSizeMobile = 16,
    lineHeight = 1.5,
    letterSpacing = 0,
    wordSpacing = 0,
    textTransform = 'none',
    textDecoration = 'none',
    fontFamily = 0,
    axisWeight = null,
    axisWidth = null,
    axisCasual = 0,
    axisSlant = 0,
    axisGrade = 0,
    styleBgColor = 'transparent',
    styleTextColor = 'inherit',
    styleBorderColor = 'transparent',
    styleBorderWidth = 0,
    styleTextStrokeColor = 'transparent',
    styleTextStrokeWidth = 0,
    styleOpacity = 100,
    styleBlur = 0,
    isMobileView = false,
}: Multi21CopyProps) {
    const contentRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (contentRef.current && document.activeElement !== contentRef.current) {
            if (contentRef.current.innerHTML !== text) {
                contentRef.current.innerHTML = text || '';
            }
        }
    }, [text, level]);

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        onTextChange?.(e.currentTarget.innerHTML);
    };
    const handleInput = (e: React.FormEvent<HTMLElement>) => {
        onTextChange?.(e.currentTarget.innerHTML);
    };

    const getFontFamilyVar = (index: number) => {
        switch (index) {
            case 1: return 'var(--font-roboto-serif)';
            case 2: return 'var(--font-roboto-slab)';
            case 3: return 'var(--font-roboto-mono)';
            default: return 'var(--font-roboto-flex)';
        }
    };

    const activeFontVar = getFontFamilyVar(fontFamily || 0);
    const preset = ROBOTO_PRESETS[fontPresetIndex] || ROBOTO_PRESETS[3];
    const defaultAxes = { ...preset.axes };
    const wdth = axisWidth !== null && axisWidth !== -1 ? axisWidth : defaultAxes.wdth;
    const isFlex = fontFamily === 0;
    const slnt = isFlex ? (axisSlant || 0) : 0;
    const casl = isFlex ? (axisCasual || 0) : 0;
    const grd = axisGrade || 0;
    const wght = axisWeight !== null && axisWeight !== -1 ? axisWeight : (defaultAxes.wght || 400);
    const forceItalic = !isFlex && (axisSlant || 0) < -5;

    const baseSize = isMobileView ? fontSizeMobile : fontSizeDesktop;
    const styleConfig = STYLE_PRESETS[stylePreset] || STYLE_PRESETS.body;
    const computedSize = Math.max(8, baseSize * styleConfig.scale);
    const computedLineHeight = styleConfig.lineHeight ?? lineHeight;

    const alignmentClass = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end',
        justify: 'text-justify items-stretch',
    }[textAlign];

    const containerWidth = typeof contentWidth === 'number' ? `${contentWidth}px` : contentWidth;
    const Tag = level === 'h2' ? 'h2' : level === 'h3' ? 'h3' : level === 'h4' ? 'h4' : 'p';
    const isJumbo = stylePreset === 'jumbo';

    return (
        <div
            className={`
                relative flex flex-col
                ${verticalAlign === 'center' ? 'justify-center' : verticalAlign === 'bottom' ? 'justify-end' : verticalAlign === 'justify' ? 'justify-between' : 'justify-start'}
                transition-all duration-300
                animate-fadeIn
                ${alignmentClass}
                group/copy-block
            `}
            style={{
                backgroundColor: styleBgColor,
                borderColor: styleBorderColor,
                borderWidth: `${styleBorderWidth}px`,
                borderStyle: 'solid',
                color: styleTextColor,
                opacity: styleOpacity / 100,
                backdropFilter: styleBlur > 0 ? `blur(${styleBlur}px)` : 'none',
                maxWidth: containerWidth,
                margin: textAlign === 'center' ? '0 auto' : undefined,
                marginLeft: textAlign === 'right' ? 'auto' : undefined,
                width: contentWidth,
                gap: `${stackGap}px`,
                height: '100%',
                minHeight: '100%',
                padding: '16px',
                borderRadius: '12px'
            }}
        >
            <Tag
                ref={contentRef as React.RefObject<HTMLElement>}
                style={{
                    fontFamily: `${activeFontVar}, sans-serif`,
                    fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'CASL' ${casl}, 'GRAD' ${grd}`,
                    fontSize: `${computedSize}px`,
                    fontStyle: forceItalic ? 'italic' : 'normal',
                    lineHeight: computedLineHeight,
                    letterSpacing: `${letterSpacing / 100}em`,
                    wordSpacing: `${wordSpacing / 10}em`,
                    textTransform: textTransform,
                    textDecoration: textDecoration,
                    textAlign: isJumbo ? 'justify' : undefined,
                    textAlignLast: isJumbo ? 'justify' : undefined,
                    textJustify: isJumbo ? 'inter-word' : undefined,
                    width: isJumbo ? '100%' : undefined,
                    display: isJumbo ? 'block' : undefined,
                    WebkitTextStroke: styleTextStrokeWidth > 0 ? `${styleTextStrokeWidth}px ${styleTextStrokeColor}` : 'initial'
                }}
                className="transition-all duration-200 ease-out outline-none min-h-[1em] hover:bg-blue-500/5 focus:bg-blue-500/10 rounded px-1 -mx-1 cursor-text"
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur}
                onInput={handleInput}
            />

            <div className="absolute inset-0 border-2 border-transparent group-hover/copy-block:border-blue-500/20 pointer-events-none rounded-xl transition-colors"></div>
        </div>
    );
}
