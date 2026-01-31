import React, { useMemo } from 'react';
import { VideoThumb } from './VideoThumb';
import { MultiTileBack } from './MultiTileBack';
import { ROBOTO_PRESETS } from '../../../../lib/fonts/roboto-presets';
import { SEED_FEEDS, FeedItem } from '../../../../lib/data/seed-feeds';

export interface MultiTileItem {
    id: string;
    title: string;
    meta?: string;
    imageUrl?: string;
    videoUrl?: string;
    href?: string;
    badge?: string;
    secondaryLink?: {
        href: string;
        label?: string;
    };
    // Feed Specifics
    price?: string;
    variant?: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube' | 'events' | 'blogs';
}

export interface MultiTileProps {
    items: MultiTileItem[];
    gridColsDesktop?: number;
    gridColsMobile?: number;

    gridGapXDesktop?: number;
    gridGapXMobile?: number;
    gridGapYDesktop?: number;
    gridGapYMobile?: number;

    gridTileRadiusDesktop?: number;
    gridTileRadiusMobile?: number;

    itemsDesktop?: number;
    itemsMobile?: number;

    align?: 'left' | 'center' | 'right';
    tileVariant?: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube' | 'events' | 'blogs';
    gridAspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
    tileShowTitle?: boolean;
    tileShowMeta?: boolean;
    tileShowBadge?: boolean;
    tileShowCtaLabel?: boolean;
    tileShowCtaArrow?: boolean;


    // Typography Props
    fontPresetIndex?: number;
    fontSizeDesktop?: number;
    fontSizeMobile?: number;
    lineHeight?: number;
    letterSpacing?: number;
    wordSpacing?: number;
    // New Type Setting
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    verticalAlign?: 'top' | 'center' | 'bottom' | 'justify';
    textTransform?: string;
    textDecoration?: string;
    axisWeight?: number | null;
    axisWidth?: number | null;
    fontFamily?: number;
    axisCasual?: number;
    axisSlant?: number;
    axisGrade?: number;

    // Style Props (Phase 8)
    styleBgColor?: string;
    styleTextColor?: string;
    styleAccentColor?: string;
    styleBorderColor?: string;
    styleBorderWidth?: number;
    styleTextStrokeColor?: string;
    styleTextStrokeWidth?: number;
    styleOpacity?: number;
    styleBlur?: number;

    // View Control
    isMobileView?: boolean;

    // Phase 10: Feeds & Layout
    feedSource?: 'kpi' | 'retail' | 'news' | 'youtube' | 'events' | null;
    feedLimit?: number;
    isCarousel?: boolean;
}

// --- Sub-Components ---

// YouTube Facade (Fixes "Giant Red Button" issue)
const YouTubeTile = ({ videoId, title, aspectClass }: { videoId: string, title: string, aspectClass: string }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    if (isPlaying) {
        return (
            <div className={`relative ${aspectClass} bg-black overflow-hidden group/yt z-0`} style={{ aspectRatio: '16/9' }}>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&playsinline=1`}
                    className="absolute inset-0 w-full h-full pointer-events-auto"
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div
            onClick={() => setIsPlaying(true)}
            className={`relative ${aspectClass} bg-black overflow-hidden group/yt z-0 cursor-pointer`}
        >
            {/* Thumbnail */}
            <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/yt:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover/yt:bg-black/10 transition-colors" />

            {/* Custom Play Button (Minimal) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 flex items-center justify-center opacity-90 group-hover/yt:scale-110 transition-transform drop-shadow-md">
                    <svg className="w-8 h-8 text-white fill-white" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export function MultiTile({
    items: initialItems,
    gridColsDesktop = 6,
    gridColsMobile = 2,

    gridGapXDesktop = 16,
    gridGapXMobile = 16,
    gridGapYDesktop = 16,
    gridGapYMobile = 16,

    gridTileRadiusDesktop = 8,
    gridTileRadiusMobile = 8,

    itemsDesktop = 12,
    itemsMobile = 6,

    align = 'center',
    tileVariant = 'generic',
    gridAspectRatio = '16:9',
    tileShowTitle = true,
    tileShowMeta = true,
    tileShowBadge = true,
    tileShowCtaLabel = true,
    tileShowCtaArrow = true,

    // Typo Defaults
    fontPresetIndex = 3,
    fontSizeDesktop = 16,
    fontSizeMobile = 16,
    lineHeight = 1.5,
    letterSpacing = 0,
    wordSpacing = 0,
    textAlign = 'left',
    verticalAlign = 'top',
    textTransform = 'none',
    textDecoration = 'none',
    axisWeight = null,
    axisWidth = null,
    fontFamily = 0,
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

    // Phase 10
    feedSource = null,
    feedLimit = 12,
    isCarousel = false,
}: MultiTileProps) {

    // --- Feed Data Logic (Refactored Phase 9.5: Polymorphic) ---
    const activeItems = useMemo(() => {
        // If NO Feed Source, use manual items (but respect limit)
        if (!feedSource || !SEED_FEEDS[feedSource]) {
            return initialItems.slice(0, feedLimit);
        }

        const rawFeed = SEED_FEEDS[feedSource];
        const limitedFeed = rawFeed.slice(0, feedLimit);

        return limitedFeed.map((item: FeedItem): MultiTileItem => {
            // Polymorphic Mapping: Translate Feed Type to UI Variant
            let mappedVariant: MultiTileItem['variant'] = 'generic';

            if (item.type === 'product') mappedVariant = 'product'; // Retail -> Product
            else if (item.type === 'video') mappedVariant = 'youtube'; // Video -> Youtube
            else if (item.type === 'kpi') mappedVariant = 'kpi';    // KPI -> KPI
            else if (feedSource === 'events') mappedVariant = 'events'; // Events -> Events
            else if (feedSource === 'news') mappedVariant = 'blogs'; // News -> Blogs (assumed)

            return {
                id: item.id,
                title: item.title,
                meta: item.subtitle, // News timestamp comes through here in seed-feeds
                imageUrl: item.image,
                videoUrl: item.videoUrl || (item.type === 'video' ? `https://www.youtube.com/watch?v=dQw4w9WgXcQ` : undefined),
                badge: item.badge,
                price: item.price,
                secondaryLink: item.cta ? { href: '#', label: item.cta } : undefined,
                variant: mappedVariant,
            };
        });
    }, [feedSource, feedLimit, initialItems, isMobileView, itemsMobile, itemsDesktop]);

    // Map Vertical Align to Flex logic
    const flexJustify = verticalAlign === 'top' ? 'flex-start' : verticalAlign === 'bottom' ? 'flex-end' : 'center';

    const alignmentClass = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    }[align];

    const inlineJustify = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';

    // Typo Resolver (Vario)
    const getEffectiveFont = (index: number, slantValue: number) => {
        // 0 = Flex (Variable)
        if (index === 0) return 'var(--font-roboto-flex)';

        // For static fonts (Mono, Slab, Serif), if slant is aggressive, use Italic variant if available
        // Note: In this simplified demo, we might just append a string or rely on CSS 'font-style: italic'
        // But the user requested "swap fontFamily string to ${family}-Italic" logic.
        // Assuming we have CSS vars defined like --font-roboto-mono-italic? 
        // Or actually, standard Google Fonts variable implementations often handle this via 'ital' axis or separate files.
        // Let's implement the logic requested:

        const base = (() => {
            switch (index) {
                case 1: return 'var(--font-roboto-serif)';
                case 2: return 'var(--font-roboto-slab)';
                case 3: return 'var(--font-roboto-mono)';
                default: return 'var(--font-roboto-flex)';
            }
        })();

        // If aggressive slant on non-flex, pretend we switch to Italic (or use font-style)
        // Since we are using CSS variables which map to class names/font-families, 
        // we'll enforce 'font-style: italic' in the style block for these cases instead of guessing variable names.
        return base;
    };

    const activeFontVar = getEffectiveFont(fontFamily || 0, axisSlant || 0);

    // Resolve Shared Axes
    const preset = ROBOTO_PRESETS[fontPresetIndex] || ROBOTO_PRESETS[3];
    const defaultAxes = { ...preset.axes };
    const wdth = axisWidth !== null && axisWidth !== -1 ? axisWidth : defaultAxes.wdth;

    // Logic: Only apply 'slnt' axis to Roboto Flex (0). 
    // Others get font-style: italic if slant < -5.
    const isFlex = (fontFamily === 0);
    const slnt = isFlex ? (axisSlant || 0) : 0;
    const grd = axisGrade || 0;
    const casl = isFlex ? (axisCasual || 0) : 0;

    // Aggressive Slant Check for non-flex
    const forceItalic = !isFlex && (axisSlant || 0) < -5;

    const activeFontSize = isMobileView ? fontSizeMobile : fontSizeDesktop;
    const variationSettings = `'wght' ${axisWeight !== null ? axisWeight : 400}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'CASL' ${casl}, 'GRAD' ${grd}`;
    const cssLetterSpacing = `${letterSpacing / 100}em`;

    // Dynamic Spacing Variables
    const activeGapX = isMobileView ? gridGapXMobile : gridGapXDesktop;
    const activeGapY = isMobileView ? gridGapYMobile : gridGapYDesktop;
    const activeRadius = isMobileView ? gridTileRadiusMobile : gridTileRadiusDesktop;
    const activeCols = isMobileView ? gridColsMobile : gridColsDesktop;

    // Derived
    const activeGapMargin = `${activeGapY}px`;
    const activePadding = `24px`;

    // Aspect Ratio Logic
    const aspectClass = {
        '16:9': 'aspect-video',
        '4:3': 'aspect-[4/3]',
        '1:1': 'aspect-square',
        '9:16': 'aspect-[9/16]',
    }[gridAspectRatio] || 'aspect-video';

    // --- Meta-Flip / SEO / UTM Logic (Phase 11) ---
    const [showMeta, setShowMeta] = React.useState(false);
    const [utmParams, setUtmParams] = React.useState({ source: '', medium: '', campaign: '' });

    // Helper: Construct Href with UTM
    const getLinkWithUtm = (baseHref: string = '#') => {
        if (!utmParams.source && !utmParams.medium && !utmParams.campaign) return baseHref;
        const separator = baseHref.includes('?') ? '&' : '?';
        const params = new URLSearchParams();
        if (utmParams.source) params.set('utm_source', utmParams.source);
        if (utmParams.medium) params.set('utm_medium', utmParams.medium);
        if (utmParams.campaign) params.set('utm_campaign', utmParams.campaign);
        return `${baseHref}${separator}${params.toString()}`;
    };

    if (showMeta) {
        return (
            <div className={`flex w-full h-[400px] ${alignmentClass}`}>
                <MultiTileBack
                    variant={activeItems[0]?.variant || 'generic'}
                    onFlipBack={() => setShowMeta(false)}
                    onUtmChange={setUtmParams}
                />
            </div>
        );
    }

    return (
        <div className={`flex w-full relative group/container ${alignmentClass}`}>
            {/* Builder Mode: Meta/SEO Overlay Button */}
            <button
                onClick={() => setShowMeta(true)}
                className="absolute top-2 right-2 z-50 bg-black/80 text-white text-[10px] font-bold px-2 py-1.5 rounded border border-white/20 shadow-lg hover:bg-neutral-900 transition-colors"
                title="Edit SEO & UTMs"
            >
                SEO / M
            </button>

            <div
                className={isCarousel
                    ? "flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
                    : "grid w-full"
                }
                style={{
                    // Dynamic Grid
                    gridTemplateColumns: `repeat(var(--grid-cols), minmax(0, 1fr))`,
                    columnGap: `var(--gap-x)`,
                    rowGap: `var(--gap-y)`,

                    // Generic Variables (Hydrated by Logic)
                    ['--grid-cols' as string]: activeCols,
                    ['--gap-x' as string]: `${activeGapX}px`,
                    ['--gap-y' as string]: `${activeGapY}px`,
                    ['--radius' as string]: `${activeRadius}px`,

                    // Helper vars
                    ['--gap-margin' as string]: activeGapMargin,
                    ['--content-padding' as string]: activePadding,

                    maxWidth: align === 'center' ? '100%' : 'auto',

                    // Style Variables
                    ['--style-bg' as string]: styleBgColor,
                    ['--style-text' as string]: styleTextColor,
                    ['--style-accent' as string]: styleAccentColor,
                    ['--style-border-color' as string]: styleBorderColor,
                    ['--style-border-width' as string]: `${styleBorderWidth}px`,
                    ['--style-text-stroke-color' as string]: styleTextStrokeColor,
                    ['--style-text-stroke-width' as string]: `${styleTextStrokeWidth}px`,
                    ['--style-opacity' as string]: `${styleOpacity / 100}`,
                    ['--style-blur' as string]: `${styleBlur}px`,

                    // Typography Variables
                    ['--multi-font-family' as string]: activeFontVar,
                    ['--multi-font-variations' as string]: variationSettings,
                    ['--multi-font-size' as string]: `${activeFontSize}px`,
                    ['--multi-line-height' as string]: lineHeight,
                    ['--multi-letter-spacing' as string]: cssLetterSpacing,
                    ['--multi-word-spacing' as string]: `${wordSpacing}em`,
                    ['--multi-text-align' as string]: textAlign,
                    ['--multi-vert-align' as string]: flexJustify,
                    ['--multi-text-transform' as string]: textTransform,
                    ['--multi-text-decoration' as string]: textDecoration,
                }}
            >
                <style jsx>{`
          /* Card Styles */
          .multi21-card {
             border-radius: var(--radius);
          }
          .multi21-card-image {
             border-radius: var(--radius);
             margin-bottom: 0;
          }
          .multi21-card-image--product {
             margin-bottom: 0;
          }
          .multi21-card-body {
             display: flex;
             flex-direction: column;
             height: 100%;
             min-height: 0;
          }
          .multi21-card-image--fill {
             flex: 1 1 auto;
             min-height: 0;
          }
          .multi21-content {
             padding: var(--content-padding);
             display: flex;
             flex-direction: column;
             justify-content: var(--multi-vert-align);
             text-align: var(--multi-text-align);
             height: 100%;
          }
          .multi21-content--compact {
             height: auto;
             justify-content: flex-start;
             padding: clamp(4px, 0.6vw, 8px) clamp(6px, 0.8vw, 10px);
          }
          .multi21-content--product {
             padding: clamp(4px, 0.6vw, 8px) clamp(6px, 0.8vw, 10px);
          }
          
          /* Typography Application */
          .multi21-typo-target, 
          .multi21-typo-target h3, 
          .multi21-typo-target p, 
          .multi21-typo-target a {
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
          /* Title Scaling (Example: 1em = base fontSize) */
          .multi21-typo-target h3 {
               font-size: var(--multi-font-size);
          }
          /* Meta Scaling (Smaller) */
          .multi21-typo-target p {
               font-size: calc(var(--multi-font-size) * 0.85);
          }

          /* Phase 8: Style Injections */
           .multi21-card, .multi21-content {
                /* Apply Border & Background */
                background-color: var(--style-bg);
                border: var(--style-border-width) solid var(--style-border-color);
                color: var(--style-text);
                opacity: var(--style-opacity);
                backdrop-filter: blur(var(--style-blur));
           }
           /* Ensure text inherits if set */
           .multi21-card h3, .multi21-card p,
           .multi21-content h3, .multi21-content p, .multi21-content a {
               color: inherit; 
           }
           /* Funk/Accent Color Application */
           .multi21-accent-bg {
               background-color: var(--style-accent) !important;
                color: white !important; /* Assume light text on accent for now */
           }
           .multi21-accent-text {
               color: var(--style-accent) !important;
           }

          ${!isMobileView ? `
          @media (min-width: 1024px) {
            /* Responsive Styles update to Desktop Vars */
            .multi21-card {
                border-radius: var(--radius-desktop) !important;
            }
            .multi21-card-image {
                border-radius: var(--radius-desktop) !important;
                margin-bottom: var(--gap-margin-desktop) !important;
            }
            .multi21-content {
                padding: var(--content-padding-desktop) !important;
            }
          }
          ` : ''}
        `}</style>

                {activeItems.map((item) => {
                    const effectiveVariant = item.variant ?? tileVariant;
                    const isProduct = effectiveVariant === 'product';
                    const isYoutube = effectiveVariant === 'youtube' && Boolean(item.videoUrl && item.videoUrl.includes('youtube'));
                    const hasCta = Boolean((tileShowCtaLabel || tileShowCtaArrow) && item.secondaryLink);
                    const showTitle = tileShowTitle && item.title;
                    const showMeta = tileShowMeta && item.meta;
                    const showPrice = tileShowMeta && item.price;
                    const showContent = showTitle || showMeta || showPrice || hasCta;

                    const ctaClassName = isProduct
                        ? 'text-[10px] uppercase tracking-wider no-underline multi21-accent-text'
                        : (effectiveVariant === 'youtube' || effectiveVariant === 'video')
                            ? 'text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider'
                            : 'text-[10px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200';

                    const ctaMarkup = hasCta ? (
                        <a
                            href={getLinkWithUtm(item.secondaryLink?.href || '#')}
                            className={`inline-flex items-center gap-1 shrink-0 transition-colors ${ctaClassName}`}
                            style={{ fontFamily: 'sans-serif', letterSpacing: '0.05em' }}
                        >
                            {tileShowCtaLabel && (item.secondaryLink?.label || 'More')}
                            {tileShowCtaArrow && effectiveVariant !== 'youtube' && effectiveVariant !== 'video' && (
                                <svg width="20" height="10" viewBox="0 0 28 10" fill="none" stroke="var(--multi-cta-arrow-color, currentColor)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M0 5h26M22 1l4 4-4 4" />
                                </svg>
                            )}
                        </a>
                    ) : null;

                    const productLine1 = (showTitle || showMeta) ? (
                        <div
                            className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 leading-tight"
                            style={{ justifyContent: inlineJustify }}
                        >
                            {showTitle && (
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                                    <a href={getLinkWithUtm(item.href || '#')} className="no-underline">
                                        {item.title}
                                    </a>
                                </h3>
                            )}
                            {showMeta && (
                                <span className="text-[11px] font-extralight text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {item.meta}
                                </span>
                            )}
                        </div>
                    ) : null;

                    const productLine2 = (showPrice || hasCta) ? (
                        <div
                            className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 leading-tight"
                            style={{ justifyContent: inlineJustify }}
                        >
                            {showPrice && (
                                <p className="text-[11px] font-extralight italic text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {item.price}
                                </p>
                            )}
                            {ctaMarkup}
                        </div>
                    ) : null;

                    const standardLine1 = showTitle ? (
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:underline decoration-1 underline-offset-2">
                            <a href={getLinkWithUtm(item.href || '#')}>
                                {item.title}
                            </a>
                        </h3>
                    ) : null;

                    const standardLine2 = (showMeta || hasCta) ? (
                        <div
                            className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                            style={{ justifyContent: inlineJustify }}
                        >
                            {showMeta && (
                                <p className="text-[11px] line-clamp-1 text-gray-500 dark:text-gray-400">
                                    {item.meta}
                                </p>
                            )}
                            {ctaMarkup}
                        </div>
                    ) : null;

                    const compactContent = showContent ? (
                        <div className={`flex flex-col gap-0.5 multi21-content multi21-content--compact ${isProduct ? 'multi21-content--product' : ''}`}>
                            {isProduct ? (
                                <>
                                    {productLine1}
                                    {productLine2}
                                </>
                            ) : (
                                <>
                                    {standardLine1}
                                    {standardLine2}
                                </>
                            )}
                        </div>
                    ) : null;

                    return (
                        <div
                            key={item.id}
                            className={`flex flex-col group relative multi21-item multi21-typo-target multi21-card overflow-hidden shrink-0 ${isYoutube ? '' : aspectClass} ${isCarousel ? 'snap-start w-[85%] md:w-[40%] mr-[var(--gap-x)]' : ''
                                }`}
                        >
                            {(effectiveVariant === 'kpi') && (
                                <div
                                    className="relative w-full h-full bg-neutral-900 overflow-hidden multi21-card-body"
                                    style={{ lineHeight: 0 }}
                                >
                                    {/* Background Image with Overlay */}
                                    {item.imageUrl && (
                                        <>
                                            <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
                                        </>
                                    )}

                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center z-10">
                                        {tileShowBadge && item.badge && (
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide mb-2 ${item.badge.includes('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white'}`} style={{ lineHeight: 1.2 }}>
                                                {item.badge}
                                            </span>
                                        )}
                                        {tileShowTitle && (
                                            <div className="font-bold text-white tracking-tight" style={{ fontSize: 'calc(var(--multi-font-size) * 2.5)', lineHeight: 1 }}>
                                                {item.title}
                                            </div>
                                        )}
                                        {tileShowMeta && item.meta && (
                                            <div className="text-xs text-neutral-400 font-medium uppercase tracking-widest mt-1">
                                                {item.meta}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {effectiveVariant === 'events' && (
                                <div className="multi21-card-body">
                                    <div className="relative w-full bg-gray-100 overflow-hidden multi21-card-image multi21-card-image--fill group/event">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/event:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="text-xs">No Image</span>
                                            </div>
                                        )}

                                    </div>

                                    {compactContent}
                                </div>
                            )}

                            {/* YouTube Real Player Logic (Facade) */}
                            {isYoutube ? (
                                <div className="multi21-card-body">
                                    <YouTubeTile
                                        videoId={item.videoUrl?.split('v=')[1]?.split('&')[0] || ''}
                                        title={item.title}
                                        aspectClass={`w-full ${aspectClass} multi21-card-image`}
                                    />
                                    {compactContent}
                                </div>
                            ) : null}

                            {effectiveVariant === 'text' && (
                                <div
                                    className="relative w-full h-full bg-gray-50 dark:bg-neutral-900 overflow-hidden multi21-card-body"
                                    style={{ lineHeight: 0 }}
                                >
                                    <div className="absolute inset-0 p-4 flex flex-col gap-2 justify-center">
                                        {tileShowTitle && (
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                {item.title}
                                            </h3>
                                        )}
                                        {tileShowMeta && item.meta && (
                                            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                                                {item.meta}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Standard Image Cards (Generic, Product, Blogs, Image, Video fallback) */
                                /* Render if NOT KPI, NOT Events, NOT Youtube-Player, NOT Text */
                            }
                            {(!['kpi', 'events', 'text'].includes(effectiveVariant) && !isYoutube) && (
                                <div className="multi21-card-body">
                                    {/* Card Image */}
                                    <div
                                        className={`relative w-full bg-gray-100 overflow-hidden multi21-card-image multi21-card-image--fill group/image ${isProduct ? 'multi21-card-image--product' : ''}`}
                                        style={{ lineHeight: 0 }}
                                    >
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="text-xs">No Image</span>
                                            </div>
                                        )}

                                        {/* Badges */}
                                        {tileShowBadge && item.badge && effectiveVariant !== 'product' && (
                                            <span className="absolute top-2 right-2 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-medium tracking-wide backdrop-blur-sm bg-black/70" style={{ fontFamily: 'sans-serif', lineHeight: 1.2 }}>
                                                {item.badge}
                                            </span>
                                        )}

                                        {/* Play Overlay (for Youtube/Video) */}
                                        {(effectiveVariant === 'youtube' || effectiveVariant === 'video') && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/image:bg-black/10 transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/50">
                                                    <svg className="w-5 h-5 text-white fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {compactContent}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
