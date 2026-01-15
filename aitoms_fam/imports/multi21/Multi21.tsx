import React from 'react';

export interface Multi21Item {
    id: string;
    title: string;
    meta?: string;
    imageUrl?: string;
    href?: string;
    badge?: string;
    secondaryLink?: {
        href: string;
        label?: string;
    };
}

export interface Multi21Props {
    items: Multi21Item[];
    colsDesktop?: number;
    colsMobile?: number;
    tileGap?: number;
    tileRadius?: number;
    align?: 'left' | 'center' | 'right';
    tileVariant?: 'generic' | 'product' | 'kpi' | 'text';
    aspectRatio?: 'square' | 'portrait' | 'landscape';
    showTitle?: boolean;
    showMeta?: boolean;
    showBadge?: boolean;
    showCtaLabel?: boolean;
    showCtaArrow?: boolean;
    fullScreenMobile?: boolean;
    forceMobile?: boolean;
}

export function Multi21({
    items,
    colsDesktop = 6,
    colsMobile = 2,
    tileGap = 16,
    tileRadius = 8,
    align = 'center',
    tileVariant = 'generic',
    aspectRatio = 'landscape',
    showTitle = true,
    showMeta = true,
    showBadge = true,
    showCtaLabel = true,
    showCtaArrow = true,
    fullScreenMobile = false,
    forceMobile = false,
}: Multi21Props) {
    const alignmentClass = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    }[align];
    const aspectClass = {
        square: 'aspect-square',
        portrait: 'aspect-[3/4]',
        landscape: 'aspect-video',
    }[aspectRatio];

    const frameClass =
        'group relative flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900';

    const renderCTA = (item: Multi21Item) => {
        if (!(showCtaLabel || showCtaArrow) || !item.secondaryLink) return null;
        return (
            <a
                href={item.secondaryLink.href}
                className="mt-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 transition hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-50"
            >
                {showCtaLabel && (item.secondaryLink.label || 'More')}
                {showCtaArrow && (
                    <svg
                        width="20"
                        height="10"
                        viewBox="0 0 28 10"
                        fill="none"
                        stroke="var(--multi-cta-arrow-color, currentColor)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M0 5h26M22 1l4 4-4 4" />
                    </svg>
                )}
            </a>
        );
    };

    const renderMedia = (item: Multi21Item, variant: typeof tileVariant) => {
        if (variant === 'kpi') {
            return (
                <div
                    className={`relative ${aspectClass} bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900`}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
                        {showBadge && item.badge && (
                            <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                                {item.badge}
                            </span>
                        )}
                        {showTitle && (
                            <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
                                {item.title}
                            </div>
                        )}
                        {showMeta && item.meta && (
                            <div className="text-sm text-neutral-600 dark:text-neutral-300">
                                {item.meta}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (variant === 'text') {
            return (
                <div className={`relative ${aspectClass} bg-neutral-50 dark:bg-neutral-900`}>
                    <div className="absolute inset-0 p-4 flex flex-col gap-2 justify-center">
                        {showBadge && item.badge && (
                            <span className="self-start rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                {item.badge}
                            </span>
                        )}
                        {showTitle && (
                            <h3 className="text-base font-semibold leading-snug text-neutral-900 dark:text-neutral-50">
                                {item.title}
                            </h3>
                        )}
                        {showMeta && item.meta && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
                                {item.meta}
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className={`relative ${aspectClass} bg-neutral-100`}>
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-400">
                        <span className="text-xs">No Image</span>
                    </div>
                )}
                {showBadge && item.badge && (
                    <span
                        className={`absolute top-2 right-2 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm ${
                            variant === 'product' ? 'bg-emerald-600/90' : 'bg-black/70'
                        }`}
                    >
                        {item.badge}
                    </span>
                )}
            </div>
        );
    };

    const renderBody = (item: Multi21Item, variant: typeof tileVariant) => {
        if (variant === 'kpi') {
            return (
                <div className="flex flex-col gap-1 px-3 py-3">
                    {showTitle && (
                        <div className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                            {item.title}
                        </div>
                    )}
                    {showMeta && item.meta && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{item.meta}</div>
                    )}
                    {renderCTA(item)}
                </div>
            );
        }

        if (variant === 'text') {
            return (
                <div className="flex flex-col gap-2 px-3 py-3">
                    {renderCTA(item)}
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-1 px-3 py-3">
                {showTitle && (
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 transition group-hover:underline dark:text-neutral-50">
                        <a href={item.href || '#'}>{item.title}</a>
                    </h3>
                )}
                {showMeta && item.meta && (
                    <p
                        className={`text-xs ${variant === 'product' ? 'font-semibold text-emerald-600' : 'text-neutral-500 dark:text-neutral-400'}`}
                    >
                        {item.meta}
                    </p>
                )}
                {renderCTA(item)}
            </div>
        );
    };

    const isFullMobile = fullScreenMobile;
    const effectiveColsDesktop = forceMobile ? colsMobile : colsDesktop;

    return (
        <div className={`flex w-full ${alignmentClass}`}>
            <div
                className={`grid w-full ${isFullMobile ? 'multi21-full-mobile' : ''}`}
                style={{
                    gridTemplateColumns: `repeat(var(--cols-mobile), minmax(0, 1fr))`,
                    gap: `${tileGap}px`,
                    ['--cols-mobile' as string]: colsMobile,
                    ['--cols-desktop' as string]: effectiveColsDesktop,
                    maxWidth: align === 'center' ? '100%' : 'auto',
                }}
            >
                <style jsx>{`
                    @media (min-width: 768px) {
                        .grid {
                            grid-template-columns: repeat(var(--cols-desktop), minmax(0, 1fr)) !important;
                        }
                    }
                    @media (max-width: 767px) {
                        .multi21-full-mobile {
                            grid-template-columns: 1fr !important;
                            scroll-snap-type: y mandatory;
                            overflow-y: auto;
                        }
                        .multi21-full-mobile article {
                            min-height: 100vh;
                            scroll-snap-align: start;
                        }
                    }
                `}</style>

                {items.map((item) => (
                    <article
                        key={item.id}
                        className={frameClass}
                        style={{ borderRadius: `${tileRadius}px` }}
                        data-atom-id="atom-multi21-tile"
                    >
                        {renderMedia(item, tileVariant)}
                        {renderBody(item, tileVariant)}
                    </article>
                ))}
            </div>
        </div>
    );
}
