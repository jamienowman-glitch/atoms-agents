import React from 'react';
import { VideoThumb } from './VideoThumb';

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
}

export interface Multi21Props {
    items: Multi21Item[];
    gridColsDesktop?: number;
    gridColsMobile?: number;

    gridGapXDesktop?: number;
    gridGapXMobile?: number;

    gridTileRadiusDesktop?: number;
    gridTileRadiusMobile?: number;

    itemsDesktop?: number;
    itemsMobile?: number;

    align?: 'left' | 'center' | 'right';
    tileVariant?: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube';
    gridAspectRatio?: '1:1' | '16:9' | '9:16';
    tileShowTitle?: boolean;
    tileShowMeta?: boolean;
    tileShowBadge?: boolean;
    tileShowCtaLabel?: boolean;
    tileShowCtaArrow?: boolean;
}

export function Multi21({
    items,
    gridColsDesktop = 6,
    gridColsMobile = 2,

    gridGapXDesktop = 16,
    gridGapXMobile = 16,

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
}: Multi21Props) {
    const alignmentClass = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    }[align];
    const aspectClass = {
        '1:1': 'aspect-square',
        '9:16': 'aspect-[9/16]',
        '16:9': 'aspect-video',
    }[gridAspectRatio];

    return (
        <div className={`flex w-full ${alignmentClass}`}>
            <div
                className="grid w-full"
                style={{
                    // Mobile Defaults
                    gridTemplateColumns: `repeat(var(--cols-mobile), minmax(0, 1fr))`,
                    gap: `var(--gap-mobile)`,
                    ['--cols-mobile' as string]: gridColsMobile,
                    ['--cols-desktop' as string]: gridColsDesktop,
                    ['--gap-mobile' as string]: `${gridGapXMobile}px`,
                    ['--gap-desktop' as string]: `${gridGapXDesktop}px`,
                    ['--radius-mobile' as string]: `${gridTileRadiusMobile}px`,
                    ['--radius-desktop' as string]: `${gridTileRadiusDesktop}px`,
                    ['--gap-margin-mobile' as string]: gridGapXMobile > 0 ? '8px' : '0',
                    ['--gap-margin-desktop' as string]: gridGapXDesktop > 0 ? '8px' : '0',
                    ['--content-padding-mobile' as string]: gridGapXMobile > 0 ? '0 2px' : '0 4px',
                    ['--content-padding-desktop' as string]: gridGapXDesktop > 0 ? '0 2px' : '0 4px',

                    maxWidth: align === 'center' ? '100%' : 'auto',
                }}
            >
                <style jsx>{`
          /* Mobile First: Hide items beyond itemsMobile limit */
          .multi21-item:nth-child(n + ${itemsMobile + 1}) {
             display: none;
          }

          /* Default Mobile Styles using CSS Vars */
          .multi21-card {
             border-radius: var(--radius-mobile);
          }
          .multi21-card-image {
             border-radius: var(--radius-mobile);
             margin-bottom: var(--gap-margin-mobile); 
          }
          .multi21-content {
             padding: var(--content-padding-mobile);
          }

          @media (min-width: 1024px) {
            .grid {
              grid-template-columns: repeat(var(--cols-desktop), minmax(0, 1fr)) !important;
              gap: var(--gap-desktop) !important;
            }
            /* Desktop: Show items up to itemsDesktop limit */
            .multi21-item:nth-child(n + ${itemsMobile + 1}) {
               display: flex; /* Reset check */
            }
             .multi21-item:nth-child(n + ${itemsDesktop + 1}) {
               display: none !important;
            }

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
        `}</style>

                {items.map((item) => (
                    <div key={item.id} className="flex flex-col group relative multi21-item">
                        {tileVariant === 'kpi' && (
                            <div
                                className={`relative ${aspectClass} bg-gray-50 dark:bg-neutral-900 overflow-hidden multi21-card`}
                                style={{
                                    lineHeight: 0,
                                }}
                            >
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
                                    {tileShowBadge && item.badge && (
                                        <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                                            {item.badge}
                                        </span>
                                    )}
                                    {tileShowTitle && (
                                        <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
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

                        {tileVariant === 'text' && (
                            <div
                                className={`relative ${aspectClass} bg-gray-50 dark:bg-neutral-900 overflow-hidden multi21-card`}
                                style={{
                                    lineHeight: 0,
                                }}
                            >
                                <div className="absolute inset-0 p-4 flex flex-col gap-2 justify-center">
                                    {tileShowTitle && (
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                                            {item.title}
                                        </h3>
                                    )}
                                    {tileShowMeta && item.meta && (
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                            {item.meta}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {(tileVariant === 'generic' || tileVariant === 'product') && (
                            <>
                                {/* Card Image */}
                                <div
                                    className={`relative ${aspectClass} bg-gray-100 overflow-hidden multi21-card-image`}
                                    style={{
                                        lineHeight: 0,
                                    }}
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

                                    {tileShowBadge && item.badge && (
                                        <span className={`absolute top-2 right-2 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-medium tracking-wide backdrop-blur-sm ${tileVariant === 'product' ? 'bg-emerald-600/90' : 'bg-black/70'}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div
                                    className="flex flex-col gap-0.5 multi21-content"
                                >
                                    {tileShowTitle && (
                                        <h3 className="font-medium text-sm leading-tight text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
                                            <a href={item.href || '#'}>
                                                {item.title}
                                            </a>
                                        </h3>
                                    )}

                                    {tileShowMeta && item.meta && (
                                        <p className={`text-xs line-clamp-1 ${tileVariant === 'product' ? 'text-emerald-600 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {item.meta}
                                        </p>
                                    )}

                                    {(tileShowCtaLabel || tileShowCtaArrow) && item.secondaryLink && (
                                        <a
                                            href={item.secondaryLink.href}
                                            className="mt-2 pb-1 text-[10px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-2 transition-colors w-fit"
                                        >
                                            {tileShowCtaLabel && (item.secondaryLink.label || 'More')}
                                            {tileShowCtaArrow && (
                                                <svg width="20" height="10" viewBox="0 0 28 10" fill="none" stroke="var(--multi-cta-arrow-color, currentColor)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M0 5h26M22 1l4 4-4 4" />
                                                </svg>
                                            )}
                                        </a>
                                    )}
                                </div>
                            </>
                        )}
                        {(tileVariant === 'video' || tileVariant === 'youtube') && (
                            <>
                                <div
                                    className={`relative ${aspectClass} bg-black overflow-hidden group/video multi21-card-image`}
                                    style={{
                                        lineHeight: 0,
                                    }}
                                >
                                    {tileVariant === 'video' && item.videoUrl ? (
                                        <VideoThumb src={item.videoUrl} aspectRatio={gridAspectRatio === '16:9' ? 'landscape' : gridAspectRatio === '1:1' ? 'square' : 'portrait'} />
                                    ) : tileVariant === 'youtube' && item.videoUrl ? (
                                        <div className="w-full h-full relative">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${item.videoUrl.split('v=')[1] || item.videoUrl}?controls=0`}
                                                title={item.title}
                                                className="absolute inset-0 w-full h-full pointer-events-none"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            />
                                            {/* Overlay to prevent interaction stealing clicks */}
                                            <div className="absolute inset-0 bg-transparent" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800">
                                            <span className="text-xs">No Video Source</span>
                                        </div>
                                    )}

                                    {tileShowBadge && item.badge && (
                                        <span className="absolute top-2 right-2 bg-red-600/90 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-medium tracking-wide backdrop-blur-sm shadow-md z-10">
                                            {item.badge}
                                        </span>
                                    )}

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div
                                    className="flex flex-col gap-0.5 multi21-content"
                                >
                                    {tileShowTitle && (
                                        <h3 className="font-medium text-sm leading-tight text-gray-900 dark:text-gray-100 line-clamp-2">
                                            {item.title}
                                        </h3>
                                    )}

                                    {tileShowMeta && item.meta && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                            {item.meta}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}
