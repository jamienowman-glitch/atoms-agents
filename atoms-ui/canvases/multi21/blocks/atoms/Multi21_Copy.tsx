import React, { useEffect, useRef } from 'react';
import { useVarioEngine } from '../../../../hooks/useVarioEngine';

// Reuse types from original
export type CopyLevel = 'h2' | 'h3' | 'h4' | 'body';
export type CopyStylePreset = 'jumbo' | 'headline' | 'subtitle' | 'tagline' | 'quote' | 'body' | 'caption';

interface Multi21CopyProps {
    text: string;
    onTextChange?: (text: string) => void;
    level?: CopyLevel;
    stylePreset?: CopyStylePreset;

    // Vario Props
    fontFamily?: number;
    weight?: number | null;
    width?: number | null;
    slant?: number;
    casual?: number;
    grade?: number;
    fontSizeDesktop?: number;
    fontSizeMobile?: number;
    lineHeight?: number;
    letterSpacing?: number;
    wordSpacing?: number;
    textTransform?: string;
    textDecoration?: string;

    // Layout
    textAlign?: string;
    verticalAlign?: string;
    contentWidth?: string;
    stackGap?: number;

    // Styling
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

    fontFamily = 0,
    weight = null,
    width = null,
    slant = 0,
    casual = 0,
    grade = 0,
    fontSizeDesktop = 16,
    fontSizeMobile = 16,
    lineHeight = 1.5,
    letterSpacing = 0,
    wordSpacing = 0,

    textAlign = 'left',
    verticalAlign = 'top',
    contentWidth = '100%',
    stackGap = 16,

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

    // --- Vario Engine ---
    const baseSize = isMobileView ? fontSizeMobile : fontSizeDesktop;
    const styleConfig = STYLE_PRESETS[stylePreset] || STYLE_PRESETS.body;
    const computedSize = Math.max(8, baseSize * styleConfig.scale);
    const computedLineHeight = styleConfig.lineHeight ?? lineHeight;

    // We pass the COMPUTED weight (if any) or null to let engine resolve defaults
    const { style: varioStyle } = useVarioEngine({
        fontFamily,
        weight, // If -1 logic is handled by caller or default axes
        width,
        slant,
        casual,
        grade,
        size: computedSize
    });

    // Sync Text (Manual DOM)
    useEffect(() => {
        if (contentRef.current && document.activeElement !== contentRef.current) {
            if (contentRef.current.innerHTML !== text) {
                contentRef.current.innerHTML = text || '';
            }
        }
    }, [text, level]);

    const Tag = level === 'h2' ? 'h2' : level === 'h3' ? 'h3' : level === 'h4' ? 'h4' : 'p';
    const alignClass = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end',
        justify: 'text-justify items-stretch',
    }[textAlign] || 'text-left items-start';

    return (
        <div
            className={`flex flex-col ${alignClass} transition-all duration-300 group/copy-block`}
            style={{
                backgroundColor: styleBgColor,
                borderColor: styleBorderColor,
                borderWidth: `${styleBorderWidth}px`,
                borderStyle: 'solid',
                color: styleTextColor,
                opacity: styleOpacity / 100,
                backdropFilter: styleBlur > 0 ? `blur(${styleBlur}px)` : 'none',
                maxWidth: contentWidth,
                width: contentWidth, // Ensure width prop is respected
                gap: `${stackGap}px`,
                justifyContent: verticalAlign === 'center' ? 'center' : verticalAlign === 'bottom' ? 'flex-end' : 'flex-start',
                minHeight: '100%',
                padding: '16px',
                borderRadius: '12px'
            }}
        >
            <Tag
                ref={contentRef as any}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onTextChange?.(e.currentTarget.innerHTML)}
                className="outline-none min-h-[1em] hover:bg-blue-500/5 focus:bg-blue-500/10 rounded px-1 -mx-1 cursor-text"
                style={{
                    ...varioStyle,
                    lineHeight: computedLineHeight,
                    letterSpacing: `${letterSpacing / 100}em`,
                    wordSpacing: `${wordSpacing / 10}em`,
                    WebkitTextStroke: styleTextStrokeWidth > 0 ? `${styleTextStrokeWidth}px ${styleTextStrokeColor}` : 'initial'
                }}
            />
        </div>
    );
}
