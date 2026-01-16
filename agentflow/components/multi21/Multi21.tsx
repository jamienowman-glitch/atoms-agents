import React, { useMemo } from 'react';
import { VideoThumb } from './VideoThumb';
import { Multi21Back } from './Multi21Back';
import { ROBOTO_PRESETS } from '../../lib/fonts/roboto-presets';
import { SEED_FEEDS, FeedItem } from '../../lib/data/seed-feeds';

export interface Multi21Item {
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
    variant?: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube';
}

export interface Multi21Props {
    items: Multi21Item[];
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
    tileVariant?: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube';
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
    styleOpacity?: number;
    styleBlur?: number;

    // View Control
    isMobileView?: boolean;

    // Phase 10: Feeds & Layout
    feedSource?: 'kpi' | 'retail' | 'news' | 'youtube' | null;
    feedLimit?: number;
    isCarousel?: boolean;
}

export function Multi21({
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
    styleOpacity = 100,
    styleBlur = 0,

    isMobileView = false,

    // Phase 10
    feedSource = null,
    feedLimit = 12,
    isCarousel = false,
}: Multi21Props) {

    // --- Feed Data Logic (Refactored Phase 9.5: Polymorphic) ---
    const activeItems = useMemo(() => {
        if (!feedSource || !SEED_FEEDS[feedSource]) {
            return initialItems.slice(0, isMobileView ? itemsMobile : itemsDesktop);
        }

        const rawFeed = SEED_FEEDS[feedSource];
        const limitedFeed = rawFeed.slice(0, feedLimit);

        return limitedFeed.map((item: FeedItem): Multi21Item => {
            // Polymorphic Mapping: Translate Feed Type to UI Variant
            let mappedVariant: Multi21Item['variant'] = 'generic';

            if (item.type === 'product') mappedVariant = 'product'; // Retail -> Product
            else if (item.type === 'video') mappedVariant = 'youtube'; // Video -> Youtube (or video)
            else if (item.type === 'kpi') mappedVariant = 'kpi';    // KPI -> KPI

            // 3. The Generator Function (getVarStyle) - SYNCED WITH MULTI21_TEXT
            const getVarStyle = (
                targetWeight: number,
                targetWidth: number,
                targetSlant: number,
                targetCasual: number
            ) => {
                let activeFontStyle = 'normal';
                let effectiveSlant = targetSlant;

                if (fontFamily === 0) {
                    // Flex: Use axis, style is normal
                    effectiveSlant = targetSlant;
                    activeFontStyle = 'normal';
                } else {
                    // Others (Serif/Mono): If slider pushed (e.g. < -1), switch to Italic style
                    effectiveSlant = 0;
                    if (targetSlant <= -1) {
                        activeFontStyle = 'italic';
                    }
                }

                return {
                    fontFamily: `${activeFontVar}, sans-serif`,
                    fontVariationSettings: `'wght' ${targetWeight}, 'wdth' ${targetWidth}, 'slnt' ${effectiveSlant}, 'CASL' ${targetCasual}, 'GRAD' ${axisGrade || 0}, 'opsz' ${12}`, // Fixed opsz for tiles
                    fontWeight: 'normal',
                    fontStyle: activeFontStyle
                };
            };
            // Note: 'news' type falls back to 'generic', but we ensure meta has the timestamp.

            return {
                id: item.id,
                title: item.title,
                meta: item.subtitle, // News timestamp comes through here in seed-feeds
                imageUrl: item.image,
                videoUrl: item.type === 'video' ? `https://www.youtube.com/watch?v=dQw4w9WgXcQ` : undefined,
                badge: item.badge,
                price: item.price,
                secondaryLink: item.cta ? { href: '#', label: item.cta } : undefined,
                variant: mappedVariant,
            };
        });
    }, [feedSource, feedLimit, initialItems, isMobileView, itemsMobile, itemsDesktop]);

    const alignmentClass = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    }[align];
    const aspectClass = {
        '1:1': 'aspect-square',
        '9:16': 'aspect-[9/16]',
        '16:9': 'aspect-video',
        '4:3': 'aspect-[4/3]',
    }[gridAspectRatio];

    // --- Typography Engine ---
    const preset = ROBOTO_PRESETS[fontPresetIndex] || ROBOTO_PRESETS[3];
    const axes = { ...preset.axes };

    // Manual Overrides
    if (axisWeight !== null) axes.wght = axisWeight;
    if (axisWidth !== null) axes.wdth = axisWidth;

    // Font Family Logic
    const getFontFamilyVar = (index: number) => {
        switch (index) {
            case 1: return 'var(--font-roboto-serif)';
            case 2: return 'var(--font-roboto-slab)';
            case 3: return 'var(--font-roboto-mono)';
            default: return 'var(--font-roboto-flex)';
        }
    };
    const activeFontVar = getFontFamilyVar(fontFamily);

    // Casual Axis (Only for Sans/Flex)
    const activeCasual = fontFamily === 0 ? axisCasual : 0;

    const variationSettings = `'opsz' ${axes.opsz}, 'wght' ${axes.wght}, 'GRAD' ${axisGrade}, 'wdth' ${axes.wdth}, 'slnt' ${axisSlant}, 'CASL' ${activeCasual}`;
    const cssLetterSpacing = `${letterSpacing / 1000}em`;

    // --- Dynamic Layout Logic ---
    const activeCols = isMobileView ? gridColsMobile : gridColsDesktop;
    const activeGapX = isMobileView ? gridGapXMobile : gridGapXDesktop;
    const activeGapY = isMobileView ? gridGapYMobile : gridGapYDesktop;
    const activeRadius = isMobileView ? gridTileRadiusMobile : gridTileRadiusDesktop;
    const activeFontSize = isMobileView ? fontSizeMobile : fontSizeDesktop;

    const activeGapMargin = activeGapX > 0 ? '8px' : '0';
    const activePadding = activeGapX > 0 ? '0 2px' : '0 4px';

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
                <Multi21Back
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
                    ['--style-opacity' as string]: `${styleOpacity / 100}`,
                    ['--style-blur' as string]: `${styleBlur}px`,

                    // Typography Variables
                    ['--multi-font-family' as string]: activeFontVar,
                    ['--multi-font-variations' as string]: variationSettings,
                    ['--multi-font-size' as string]: `${activeFontSize}px`,
                    ['--multi-line-height' as string]: lineHeight,
                    ['--multi-letter-spacing' as string]: cssLetterSpacing,
                }}
            >
                <style jsx>{`
          /* Card Styles */
          .multi21-card {
             border-radius: var(--radius);
          }
          .multi21-card-image {
             border-radius: var(--radius);
             margin-bottom: var(--gap-margin); 
          }
          .multi21-content {
             padding: var(--content-padding);
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

                    return (
                        <div
                            key={item.id}
                            className={`flex flex-col group relative multi21-item multi21-typo-target multi21-card overflow-hidden shrink-0 ${isCarousel ? 'snap-start w-[85%] md:w-[40%] mr-[var(--gap-x)]' : ''
                                }`}
                        >
                            {(effectiveVariant === 'kpi') && (
                                <div
                                    className={`relative ${aspectClass} bg-gray-50 dark:bg-neutral-900 overflow-hidden multi21-card`}
                                    style={{ lineHeight: 0 }}
                                >
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">

                                        {tileShowBadge && item.badge && (
                                            <span className="multi21-accent-bg text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide" style={{ lineHeight: 1.2 }}>
                                                {item.badge}
                                            </span>
                                        )}
                                        {tileShowTitle && (
                                            <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100" style={{ fontSize: 'calc(var(--multi-font-size) * 2)', lineHeight: 1.1 }}>
                                                {item.title}
                                            </div>
                                        )}
                                        {tileShowMeta && item.meta && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.meta}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {effectiveVariant === 'text' && (
                                <div
                                    className={`relative ${aspectClass} bg-gray-50 dark:bg-neutral-900 overflow-hidden multi21-card`}
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

                            {/* Standard Image Cards (Generic, Product, Video/Youtube) */}
                            {((effectiveVariant === 'generic' || effectiveVariant === 'product' || effectiveVariant === 'video' || effectiveVariant === 'youtube')) && (
                                <>
                                    {/* Card Image */}
                                    <div
                                        className={`relative ${aspectClass} bg-gray-100 overflow-hidden multi21-card-image group/image`}
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
                                            <span className={`absolute top-2 right-2 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-medium tracking-wide backdrop-blur-sm bg-black/70`} style={{ fontFamily: 'sans-serif', lineHeight: 1.2 }}>
                                                {item.badge}
                                            </span>
                                        )}

                                        {/* Product Price Tag */}
                                        {effectiveVariant === 'product' && item.price && (
                                            <span className="absolute bottom-2 left-2 bg-white/90 text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
                                                {item.price}
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

                                    {/* Content */}
                                    <div className="flex flex-col gap-0.5 multi21-content">
                                        {tileShowTitle && (
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
                                                <a href={getLinkWithUtm(item.href || '#')}>
                                                    {item.title}
                                                </a>
                                            </h3>
                                        )}

                                        {tileShowMeta && item.meta && (
                                            <p className={`line-clamp-1 ${effectiveVariant === 'product' ? 'text-emerald-600 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {/* Note: timestamp vs subtitle is handled by determining what mapped to 'meta' */}
                                                {item.meta}
                                            </p>
                                        )}

                                        {(tileShowCtaLabel || tileShowCtaArrow) && item.secondaryLink && (
                                            <a
                                                href={getLinkWithUtm(item.secondaryLink.href)}
                                                className={`mt-2 pb-1 text-[10px] flex items-center gap-2 transition-colors w-fit ${effectiveVariant === 'product'
                                                    ? 'bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800 no-underline group-hover:no-underline'
                                                    : (effectiveVariant === 'youtube' || effectiveVariant === 'video')
                                                        ? 'text-red-500 hover:text-red-700 font-bold uppercase tracking-wider'
                                                        : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                                    }`}
                                                style={{ fontFamily: 'sans-serif', letterSpacing: '0.05em' }}
                                            >
                                                {tileShowCtaLabel && (item.secondaryLink.label || 'More')}
                                                {tileShowCtaArrow && effectiveVariant !== 'product' && effectiveVariant !== 'youtube' && effectiveVariant !== 'video' && (
                                                    <svg width="20" height="10" viewBox="0 0 28 10" fill="none" stroke="var(--multi-cta-arrow-color, currentColor)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M0 5h26M22 1l4 4-4 4" />
                                                    </svg>
                                                )}
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
