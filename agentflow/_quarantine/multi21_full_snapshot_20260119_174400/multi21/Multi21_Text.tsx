import React, { useRef, useEffect } from 'react';
import { ROBOTO_PRESETS } from '../../lib/fonts/roboto-presets';

export interface Multi21TextProps {
    // Content
    headline?: string;
    subhead?: string;
    body?: string;
    showDivider?: boolean;

    // Inline Updating Handlers
    onHeadlineChange?: (text: string) => void;
    onSubheadChange?: (text: string) => void;
    onBodyChange?: (text: string) => void;

    // Layout
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    contentWidth?: string | number; // e.g. '100%' or '800px'
    stackGap?: number;

    // Scoped Typography (Phase 13)
    headlineSize?: number;
    headlineWeight?: number;
    subheadSize?: number;
    subheadWeight?: number;
    bodySize?: number;
    bodyWeight?: number;

    // Global Font Settings (Shared)
    fontPresetIndex?: number;
    lineHeight?: number;
    letterSpacing?: number; // EM units
    wordSpacing?: number; // EM units
    // Vertical
    verticalAlign?: 'top' | 'center' | 'bottom' | 'justify'; // Note: justify here means space-between
    // New Type Setting
    textTransform?: string;
    textDecoration?: string;
    fontFamily?: number;

    // Global Variable Axes (Shared Width/Slant/Casual/Grade)
    // Weight is now scoped, but we might want a global fallback? No, scoped is cleaner.
    axisWidth?: number | null;
    axisCasual?: number;
    axisSlant?: number;
    axisGrade?: number;

    // Deprecated / Unused (for Text Block, kept optional for interface compat if needed, but ignored)
    fontSizeDesktop?: number;
    fontSizeMobile?: number;
    axisWeight?: number | null;

    // Style Props (Shared)
    styleBgColor?: string;
    styleTextColor?: string;
    styleAccentColor?: string;
    styleBorderColor?: string;
    styleBorderWidth?: number;
    // New: Text Stroke
    styleTextStrokeColor?: string;
    styleTextStrokeWidth?: number;
    styleOpacity?: number;
    styleBlur?: number;

    // View Control
    isMobileView?: boolean;
}

export function Multi21_Text({
    // Content Defaults
    headline = "Headline Text",
    subhead = "Subhead goes here",
    body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    showDivider = false,

    // Handlers
    onHeadlineChange,
    onSubheadChange,
    onBodyChange,

    // Layout Defaults
    textAlign = 'left',
    contentWidth = '100%',
    stackGap = 16,
    verticalAlign = 'top',

    // Scoped Typo Defaults
    headlineSize = 40,
    headlineWeight = 700,
    subheadSize = 24,
    subheadWeight = 400,

    // Global Defaults
    fontPresetIndex = 3,
    lineHeight = 1.6,
    letterSpacing = 0,
    wordSpacing = 0,
    fontFamily = 0,

    // New Type Settings
    textTransform = 'none',
    textDecoration = 'none',

    // Scoped Body
    bodySize = 16,
    bodyWeight = 400,

    axisWidth = null,
    axisCasual = 0,
    axisSlant = 0,
    axisGrade = 0,

    // Style Defaults
    styleBgColor = 'transparent',
    styleTextColor = 'inherit',
    styleAccentColor = '#3b82f6',
    styleBorderColor = 'transparent',
    styleBorderWidth = 0,
    styleTextStrokeColor = 'transparent',
    styleTextStrokeWidth = 0,
    styleOpacity = 100,
    styleBlur = 0,

    isMobileView = false,
}: Multi21TextProps) {

    // --- The Vario Engine ---
    const getFontFamilyVar = (index: number) => {
        switch (index) {
            case 1: return 'var(--font-roboto-serif)';
            case 2: return 'var(--font-roboto-slab)';
            case 3: return 'var(--font-roboto-mono)';
            default: return 'var(--font-roboto-flex)'; // 0 = Sans
        }
    };
    const activeFontVar = getFontFamilyVar(fontFamily || 0);

    // Resolve Shared Axes
    const preset = ROBOTO_PRESETS[fontPresetIndex] || ROBOTO_PRESETS[3];
    const defaultAxes = { ...preset.axes };
    const wdth = axisWidth !== null && axisWidth !== -1 ? axisWidth : defaultAxes.wdth;
    const slnt = (fontFamily === 0) ? (axisSlant || 0) : 0; // Slant only on Flex
    const grd = axisGrade || 0;
    const casl = (fontFamily === 0) ? (axisCasual || 0) : 0; // Casual only on Flex

    // Generator (Scoped Weight)
    const getVarStyle = (
        targetSize: number,
        targetWeight: number,
    ) => {
        // OPSZ should match the visual size
        const opsz = Math.min(144, Math.max(8, targetSize));

        let activeFontStyle = 'normal';
        let effectiveSlant = slnt;

        if (fontFamily !== 0) {
            effectiveSlant = 0;
            if ((axisSlant || 0) <= -1) {
                activeFontStyle = 'italic';
            }
        }

        return {
            fontFamily: `${activeFontVar}, sans-serif`,
            fontVariationSettings: `'wght' ${targetWeight}, 'wdth' ${wdth}, 'slnt' ${effectiveSlant}, 'CASL' ${casl}, 'GRAD' ${grd}, 'opsz' ${opsz}`,
            fontSize: `${targetSize}px`,
            fontWeight: 'normal',
            fontStyle: activeFontStyle,
            WebkitTextStroke: styleTextStrokeWidth > 0 ? `${styleTextStrokeWidth}px ${styleTextStrokeColor}` : 'initial'
        } as React.CSSProperties; // Cast to avoid TS issues with WebkitTextStroke
    };

    // --- Styles (Independent) ---
    const headlineStyle = {
        ...getVarStyle(headlineSize, headlineWeight),
        lineHeight: 1.1,
        letterSpacing: `${(letterSpacing - 2) / 100}em`, // Adjusted base offset and divisor
        textTransform: textTransform
    };

    const subheadStyle = {
        ...getVarStyle(subheadSize, subheadWeight),
        lineHeight: 1.3,
        letterSpacing: `${letterSpacing / 100}em`,
        wordSpacing: `${wordSpacing / 10}em`,
        textTransform: textTransform,
        opacity: 0.85
    };

    const bodyStyle = {
        ...getVarStyle(bodySize, bodyWeight),
        lineHeight: lineHeight,
        letterSpacing: `${letterSpacing / 100}em`,
        wordSpacing: `${wordSpacing / 10}em`,
        textTransform: textTransform,
        opacity: 0.95
    };

    // Helper for container width
    const resolvedWidth = contentWidth; // It's already passed as a string/percent from ConnectedBlock

    // Layout Helpers (Restored)
    const alignmentClass = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end',
        justify: 'text-justify items-stretch',
    }[textAlign];

    const containerWidth = typeof contentWidth === 'number' ? `${contentWidth}px` : contentWidth;


    // --- Editable Logic (Manual DOM Sync) ---
    // We use explicit refs and manual DOM manipulation to avoid React's reconciliation 
    // clobbering the text content during rapid re-renders (race conditions).

    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subheadRef = useRef<HTMLHeadingElement>(null);
    const bodyRef = useRef<HTMLParagraphElement>(null);

    // Sync Props to DOM (Safely)
    // Only update the DOM if the element is NOT focused. 
    // This protects the user's typing session.
    useEffect(() => {
        if (headlineRef.current && document.activeElement !== headlineRef.current) {
            if (headlineRef.current.innerHTML !== headline) {
                headlineRef.current.innerHTML = headline || '';
            }
        }
    }, [headline]);

    useEffect(() => {
        if (subheadRef.current && document.activeElement !== subheadRef.current) {
            if (subheadRef.current.innerHTML !== subhead) {
                subheadRef.current.innerHTML = subhead || '';
            }
        }
    }, [subhead]);

    useEffect(() => {
        if (bodyRef.current && document.activeElement !== bodyRef.current) {
            if (bodyRef.current.innerHTML !== body) {
                bodyRef.current.innerHTML = body || '';
            }
        }
    }, [body]);


    // Handlers
    const handleHeadlineBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
        onHeadlineChange?.(e.currentTarget.innerHTML);
    };

    const handleSubheadBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
        onSubheadChange?.(e.currentTarget.innerHTML);
    };

    const handleBodyBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
        onBodyChange?.(e.currentTarget.innerHTML);
    };

    return (
        <div
            className={`
                flex flex-col
                ${verticalAlign === 'center' ? 'justify-center' : verticalAlign === 'bottom' ? 'justify-end' : verticalAlign === 'justify' ? 'justify-between' : 'justify-start'}
                overflow-visible
                transition-all duration-300
                animate-fadeIn
                multi21-typo-container
                ${alignmentClass} group/text-block
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
                // Ensure height 100% so vertical justify works
                height: '100%',
                minHeight: '100%',
                padding: '24px',
                borderRadius: '12px'
            }}
        >
            {headline !== undefined && (
                <h2
                    ref={headlineRef}
                    style={headlineStyle}
                    className="transition-all duration-200 ease-out outline-none min-h-[1em] hover:bg-blue-500/5 focus:bg-blue-500/10 rounded px-1 -mx-1 cursor-text"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleHeadlineBlur}
                />
            )}

            {subhead !== undefined && (
                <h3
                    ref={subheadRef}
                    style={subheadStyle}
                    className="transition-all duration-200 ease-out outline-none min-h-[1em] hover:bg-blue-500/5 focus:bg-blue-500/10 rounded px-1 -mx-1 cursor-text"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleSubheadBlur}
                />
            )}

            {showDivider && (
                <hr style={{ borderColor: styleBorderColor || 'rgba(0,0,0,0.1)', width: '100%', margin: '0' }} />
            )}

            {body !== undefined && (
                <p
                    ref={bodyRef}
                    style={bodyStyle}
                    className="transition-all duration-200 ease-out outline-none min-h-[1em] hover:bg-blue-500/5 focus:bg-blue-500/10 rounded px-1 -mx-1 cursor-text whitespace-pre-wrap"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBodyBlur}
                />
            )}

            {/* Hover Indicator */}
            <div className="absolute inset-0 border-2 border-transparent group-hover/text-block:border-blue-500/20 pointer-events-none rounded-xl transition-colors"></div>
        </div>
    );
}
