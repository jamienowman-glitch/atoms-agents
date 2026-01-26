import React from 'react';
import { Multi21_Tile } from '../atoms/Multi21_Tile';
import { Multi21Item } from '../../types';
import { useVarioEngine } from '../../../../hooks/useVarioEngine';

export interface Multi21GridProps {
    items: Multi21Item[];
    // Grid Props
    colsDesktop?: number;
    colsMobile?: number;
    gapXDesktop?: number;
    gapXMobile?: number;
    gapYDesktop?: number;
    gapYMobile?: number;
    radiusDesktop?: number;
    radiusMobile?: number;
    aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
    // Tile Toggles (PropDrilling to atom)
    showTitle?: boolean;
    showMeta?: boolean;
    showBadge?: boolean;
    showCtaLabel?: boolean;
    showCtaArrow?: boolean;
    // Vario Props (For Engine)
    fontFamily?: number;
    weight?: number | null;
    width?: number | null;
    slant?: number;
    casual?: number;
    grade?: number;
    lineHeight?: number;
    letterSpacing?: number;
    wordSpacing?: number;
    fontSizeDesktop?: number;
    fontSizeMobile?: number;
    textAlign?: string;
    verticalAlign?: string;
    textTransform?: string;
    textDecoration?: string;
    // Style Props
    styleBgColor?: string;
    styleTextColor?: string;
    styleAccentColor?: string;
    styleBorderColor?: string;
    styleBorderWidth?: number;
    styleTextStrokeColor?: string;
    styleTextStrokeWidth?: number;
    styleOpacity?: number;
    styleBlur?: number;
    // View
    isMobileView?: boolean;
}

export function Multi21_Grid({
    items,
    colsDesktop = 6,
    colsMobile = 2,
    gapXDesktop = 16,
    gapXMobile = 16,
    gapYDesktop = 16,
    gapYMobile = 16,
    radiusDesktop = 8,
    radiusMobile = 8,
    aspectRatio = '16:9',

    // Toggles
    showTitle = true,
    showMeta = true,
    showBadge = true,
    showCtaLabel = true,
    showCtaArrow = true,

    // Vario
    fontFamily = 0,
    weight = null,
    width = null,
    slant = 0,
    casual = 0,
    grade = 0,
    lineHeight = 1.5,
    letterSpacing = 0,
    wordSpacing = 0,
    fontSizeDesktop = 16,
    fontSizeMobile = 16,
    textAlign = 'left',
    verticalAlign = 'top',
    textTransform = 'none',
    textDecoration = 'none',

    // Style
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
}: Multi21GridProps) {

    // --- 1. Typography Engine ---
    const activeFontSize = isMobileView ? fontSizeMobile : fontSizeDesktop;
    const { style: varioStyle, values: { family: activeFontVar, opsz } } = useVarioEngine({
        fontFamily,
        weight,
        width,
        slant,
        casual,
        grade,
        size: activeFontSize
    });

    const forceItalic = !activeFontVar.includes('flex') && slant <= -5;


    // --- 2. Grid CSS Variables ---
    const activeGapX = isMobileView ? gapXMobile : gapXDesktop;
    const activeGapY = isMobileView ? gapYMobile : gapYDesktop;
    const activeCols = isMobileView ? colsMobile : colsDesktop;
    const activeRadius = isMobileView ? radiusMobile : radiusDesktop;

    const aspectClass = {
        '16:9': 'aspect-video',
        '4:3': 'aspect-[4/3]',
        '1:1': 'aspect-square',
        '9:16': 'aspect-[9/16]',
    }[aspectRatio] || 'aspect-video';

    // Flex Align Map
    const flexJustify = verticalAlign === 'top' ? 'flex-start' : verticalAlign === 'bottom' ? 'flex-end' : 'center';
    const inlineJustify = textAlign; // CSS grid works well with generic text align

    return (
        <div
            className="grid w-full transition-all duration-300 group/container"
            style={{
                // Layout
                gridTemplateColumns: `repeat(${activeCols}, minmax(0, 1fr))`,
                columnGap: `${activeGapX}px`,
                rowGap: `${activeGapY}px`,
                // Styles
                ['--radius' as string]: `${activeRadius}px`,
                ['--style-bg' as string]: styleBgColor,
                ['--style-text' as string]: styleTextColor,
                ['--style-accent' as string]: styleAccentColor,
                ['--style-border-color' as string]: styleBorderColor,
                ['--style-border-width' as string]: `${styleBorderWidth}px`,
                ['--style-text-stroke-color' as string]: styleTextStrokeColor,
                ['--style-text-stroke-width' as string]: `${styleTextStrokeWidth}px`,
                ['--style-opacity' as string]: styleOpacity / 100,
                ['--style-blur' as string]: `${styleBlur}px`,

                // Typography (CSS Vars for children)
                ['--multi-font-family' as string]: activeFontVar,
                ['--multi-font-variations' as string]: varioStyle.fontVariationSettings,
                ['--multi-font-size' as string]: `${activeFontSize}px`,
                ['--multi-line-height' as string]: lineHeight,
                ['--multi-letter-spacing' as string]: `${letterSpacing / 100}em`,
                ['--multi-word-spacing' as string]: `${wordSpacing}em`,
                ['--multi-text-align' as string]: textAlign,
                ['--multi-vert-align' as string]: flexJustify,
                ['--multi-text-transform' as string]: textTransform,
                ['--multi-text-decoration' as string]: textDecoration,
            }}
        >
            {/* Dynamic Style Injection for Children */}
            <style jsx>{`
                .multi21-card {
                    border-radius: var(--radius);
                    background-color: var(--style-bg);
                    border: var(--style-border-width) solid var(--style-border-color);
                    color: var(--style-text);
                    opacity: var(--style-opacity);
                    backdrop-filter: blur(var(--style-blur));
                }
                .multi21-card-image {
                     border-radius: var(--radius);
                }
                .multi21-typo-target, .multi21-typo-target h3, .multi21-typo-target p {
                    font-family: var(--multi-font-family), sans-serif !important;
                    font-variation-settings: var(--multi-font-variations) !important;
                    line-height: var(--multi-line-height);
                    letter-spacing: var(--multi-letter-spacing);
                    word-spacing: var(--multi-word-spacing);
                    text-align: var(--multi-text-align);
                    text-transform: var(--multi-text-transform);
                    text-decoration: var(--multi-text-decoration);
                    -webkit-text-stroke: var(--style-text-stroke-width) var(--style-text-stroke-color);
                    ${forceItalic ? 'font-style: italic !important;' : ''}
                }
                /* Font Sizing scaling */
                .multi21-typo-target h3 { font-size: var(--multi-font-size); }
                .multi21-typo-target p { font-size: calc(var(--multi-font-size) * 0.85); }
            `}</style>

            {items.map(item => (
                <Multi21_Tile
                    key={item.id}
                    item={item}
                    showTitle={showTitle}
                    showMeta={showMeta}
                    showBadge={showBadge}
                    showCtaLabel={showCtaLabel}
                    showCtaArrow={showCtaArrow}
                    aspectClass={aspectClass}
                />
            ))}
        </div>
    );
}
