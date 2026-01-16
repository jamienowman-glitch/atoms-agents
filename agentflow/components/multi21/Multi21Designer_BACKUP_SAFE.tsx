"use client";

import React, { useEffect, useMemo } from 'react';
import { Multi21, Multi21Item } from './Multi21';
import { BottomControlsPanel } from './BottomControlsPanel';
import { DesktopPanelSystem } from './DesktopPanelSystem';

import { ToolControlProvider, useToolControl } from '../../context/ToolControlContext';

// Mock Data Generator
const generateItems = (count: number, variant: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube'): Multi21Item[] => {
    const isVideo = variant === 'video';
    const isYoutube = variant === 'youtube';

    return Array.from({ length: count }).map((_, i) => {
        if (isVideo) {
            return {
                id: `video-${i}`,
                title: `Video Title ${i + 1}`,
                meta: '12:34 • 4K',
                videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
                badge: i % 2 === 0 ? 'HD' : undefined,
            };
        }
        if (isYoutube) {
            return {
                id: `yt-${i}`,
                title: `YouTube Video ${i + 1}`,
                meta: 'Channel Name • 2.1M views',
                videoUrl: 'dQw4w9WgXcQ', // Default Rick Roll for safety/reliability
                badge: 'LIVE',
            };
        }
        if (variant === 'product') {
            return {
                id: `product-${i}`,
                title: `Board Pro ${900 + i}`,
                meta: `£${(49 + i * 5).toFixed(2)}`,
                imageUrl: `https://picsum.photos/seed/product-${i}/600/400`,
                href: '#',
                badge: i % 3 === 0 ? 'SALE' : undefined,
                secondaryLink: { href: '#', label: 'View' },
            };
        }
        if (variant === 'kpi') {
            const base = (12.3 + i * 0.5).toFixed(1);
            const trendUp = i % 2 === 0;
            return {
                id: `kpi-${i}`,
                title: `${base}%`,
                meta: trendUp ? 'CTR' : 'Bounce rate',
                badge: trendUp ? '▲ 3.1%' : '▼ 1.2%',
            };
        }
        if (variant === 'text') {
            return {
                id: `text-${i}`,
                title: `Note ${i + 1}`,
                meta: 'Sample body copy for quick reading.',
                secondaryLink: i % 2 === 0 ? { href: '#', label: 'Open' } : undefined,
            };
        }
        return {
            id: `item-${i}`,
            title: `Item Title ${i + 1} - A generic card title that might wrap`,
            meta: `Meta info • ${10 + i}k views • 2 days ago`,
            imageUrl: `https://picsum.photos/seed/${i + 100}/600/400`, // Random placeholder
            href: '#',
            badge: i % 3 === 0 ? 'New' : undefined,
            secondaryLink: i % 2 === 0 ? { href: '#', label: 'Watch now' } : undefined,
        };
    });
};

const initialToolState = {
    'multi21.designer:global:global:grid.cols_desktop': 6,
    'multi21.designer:global:global:grid.cols_mobile': 2,
    'multi21.designer:global:global:grid.gap_x': 16,
    'multi21.designer:global:global:grid.tile_radius': 8,
    'multi21.designer:global:global:feed.query.limit': 12,
    'multi21.designer:global:global:align': 'center',
    'multi21.designer:global:global:tile.variant': 'generic',
    'multi21.designer:global:global:grid.aspect_ratio': '16:9',
    'multi21.designer:global:global:previewMode': 'desktop',
    'multi21.designer:global:global:tile.show_title': true,
    'multi21.designer:global:global:tile.show_meta': true,
    'multi21.designer:global:global:tile.show_badge': true,
    'multi21.designer:global:global:tile.show_cta_label': true,
    'multi21.designer:global:global:tile.show_cta_arrow': true,
};

export function Multi21Designer() {
    return (
        <ToolControlProvider initialState={initialToolState}>
            <Multi21DesignerInner />
        </ToolControlProvider>
    );
}

function Multi21DesignerInner() {
    // Controls State
    const { useToolState } = useToolControl();
    const [colsDesktop, setColsDesktop] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'grid.cols_desktop' }, defaultValue: 6 });
    const [colsMobile, setColsMobile] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'grid.cols_mobile' }, defaultValue: 2 });

    // Split Gap State
    const [gapXDesktop, setGapXDesktop] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'grid.gap_x_desktop' }, defaultValue: 16 });
    const [gapXMobile, setGapXMobile] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'grid.gap_x_mobile' }, defaultValue: 16 });

    // Split Radius State
    const [radiusDesktop, setRadiusDesktop] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'grid.tile_radius_desktop' }, defaultValue: 8 });
    const [radiusMobile, setRadiusMobile] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'grid.tile_radius_mobile' }, defaultValue: 8 });

    // Split Items State
    const [itemsDesktop, setItemsDesktop] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'feed.query.limit_desktop' }, defaultValue: 12 });
    const [itemsMobile, setItemsMobile] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'feed.query.limit_mobile' }, defaultValue: 6 });

    const [align, setAlign] = useToolState<'left' | 'center' | 'right'>({ target: { surfaceId: 'multi21.designer', toolId: 'align' }, defaultValue: 'center' });
    const [tileVariant, setTileVariant] = useToolState<'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube'>({ target: { surfaceId: 'multi21.designer', toolId: 'tile.variant' }, defaultValue: 'generic' });
    const [aspectRatio, setAspectRatio] = useToolState<'1:1' | '16:9' | '9:16'>({ target: { surfaceId: 'multi21.designer', toolId: 'grid.aspect_ratio' }, defaultValue: '16:9' });
    const [previewMode, setPreviewMode] = useToolState<'desktop' | 'mobile'>({ target: { surfaceId: 'multi21.designer', toolId: 'previewMode' }, defaultValue: 'desktop' });

    const [showTitle, setShowTitle] = useToolState<boolean>({ target: { surfaceId: 'multi21.designer', toolId: 'tile.show_title' }, defaultValue: true });
    const [showMeta, setShowMeta] = useToolState<boolean>({ target: { surfaceId: 'multi21.designer', toolId: 'tile.show_meta' }, defaultValue: true });
    const [showBadge, setShowBadge] = useToolState<boolean>({ target: { surfaceId: 'multi21.designer', toolId: 'tile.show_badge' }, defaultValue: true });
    const [showCtaLabel, setShowCtaLabel] = useToolState<boolean>({ target: { surfaceId: 'multi21.designer', toolId: 'tile.show_cta_label' }, defaultValue: true });
    const [showCtaArrow, setShowCtaArrow] = useToolState<boolean>({ target: { surfaceId: 'multi21.designer', toolId: 'tile.show_cta_arrow' }, defaultValue: true });

    // Generate max items needed to satisfy both views
    const maxItems = Math.max(itemsDesktop, itemsMobile);
    const items = useMemo(() => generateItems(maxItems, tileVariant), [maxItems, tileVariant]);
    const [isDesktop, setIsDesktop] = React.useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const settingsContent = (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <span className="font-semibold text-xs uppercase tracking-wider text-neutral-500">View</span>
                <div className="flex rounded-md bg-neutral-100 dark:bg-neutral-800 p-0.5">
                    {(['desktop', 'mobile'] as const).map(opt => (
                        <button
                            key={opt}
                            onClick={() => setPreviewMode(opt)}
                            className={`px-2 py-1 rounded text-xs capitalize ${previewMode === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className="font-semibold text-xs uppercase tracking-wider text-neutral-500">Layout</span>
                <div className="flex rounded-md bg-neutral-100 dark:bg-neutral-800 p-0.5">
                    {(['left', 'center', 'right'] as const).map(opt => (
                        <button
                            key={opt}
                            onClick={() => setAlign(opt)}
                            className={`px-2 py-1 rounded text-xs capitalize ${align === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                <div className="flex rounded-md bg-neutral-100 dark:bg-neutral-800 p-0.5">
                    {(['1:1', '9:16', '16:9'] as const).map(opt => (
                        <button
                            key={opt}
                            onClick={() => setAspectRatio(opt)}
                            className={`px-2 py-1 rounded text-xs capitalize ${aspectRatio === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className="font-semibold text-xs uppercase tracking-wider text-neutral-500">Content</span>
                <div className="flex flex-wrap gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800 p-0.5">
                    {(['generic', 'product', 'kpi', 'text', 'video', 'youtube'] as const).map(opt => (
                        <button
                            key={opt}
                            onClick={() => setTileVariant(opt)}
                            className={`px-2 py-1 rounded text-xs capitalize ${tileVariant === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className="font-semibold text-xs uppercase tracking-wider text-neutral-500">Visibility</span>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={showTitle} onChange={e => setShowTitle(e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">Title</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={showMeta} onChange={e => setShowMeta(e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">Meta</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={showBadge} onChange={e => setShowBadge(e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">Badge</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={showCtaLabel} onChange={e => setShowCtaLabel(e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">CTA Label</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={showCtaArrow} onChange={e => setShowCtaArrow(e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">CTA Arrow</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const toolsContent = (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-300">Desktop Columns: {colsDesktop}</label>
                <input type="range" min={1} max={12} step={1} value={colsDesktop} onChange={e => setColsDesktop(Number(e.target.value))} className="accent-black dark:accent-white" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-300">Mobile Columns: {colsMobile}</label>
                <input type="range" min={1} max={6} step={1} value={colsMobile} onChange={e => setColsMobile(Number(e.target.value))} className="accent-black dark:accent-white" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-300">Desktop Gap: {gapXDesktop}px</label>
                <input type="range" min={0} max={48} step={4} value={gapXDesktop} onChange={e => setGapXDesktop(Number(e.target.value))} className="accent-black dark:accent-white" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-300">Mobile Gap: {gapXMobile}px</label>
                <input type="range" min={0} max={24} step={4} value={gapXMobile} onChange={e => setGapXMobile(Number(e.target.value))} className="accent-black dark:accent-white" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-300">Desktop Radius: {radiusDesktop}px</label>
                <input type="range" min={0} max={32} step={4} value={radiusDesktop} onChange={e => setRadiusDesktop(Number(e.target.value))} className="accent-black dark:accent-white" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-300">Mobile Radius: {radiusMobile}px</label>
                <input type="range" min={0} max={24} step={4} value={radiusMobile} onChange={e => setRadiusMobile(Number(e.target.value))} className="accent-black dark:accent-white" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-300">Desktop Items: {itemsDesktop}</label>
                <input type="range" min={1} max={48} step={1} value={itemsDesktop} onChange={e => setItemsDesktop(Number(e.target.value))} className="accent-black dark:accent-white" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-300">Mobile Items: {itemsMobile}</label>
                <input type="range" min={1} max={48} step={1} value={itemsMobile} onChange={e => setItemsMobile(Number(e.target.value))} className="accent-black dark:accent-white" />
            </div>
        </div>
    );

    const panels = useMemo(() => [
        { id: 'settings', title: 'Settings', content: settingsContent },
        { id: 'tools', title: 'Tools', content: toolsContent },
    ], [settingsContent, toolsContent]);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans relative md:pr-[300px]">
            {/* Control Panel */}
            <BottomControlsPanel settingsContent={settingsContent} />

            {/* MobileFloatingManager removed per user request for fixed bottom panel */}

            {isDesktop && (
                <DesktopPanelSystem panels={panels} />
            )}

            {/* Main Content Area */}
            <main className="p-4 pb-32 max-w-[1600px] mx-auto flex flex-col items-center">
                <div className="w-full mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                    <h2 className="text-2xl font-light tracking-tight">Collection Demo</h2>
                </div>

                <div
                    className={`transition-all duration-300 ease-in-out border border-transparent ${previewMode === 'mobile'
                        ? 'w-[390px] border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-black'
                        : 'w-full'
                        }`}
                >
                    <div className={previewMode === 'mobile' ? 'p-4 h-[844px] overflow-y-auto' : ''}>
                        <Multi21
                            items={items}
                            gridColsDesktop={previewMode === 'mobile' ? colsMobile : colsDesktop}
                            gridColsMobile={colsMobile}

                            gridGapXDesktop={gapXDesktop}
                            gridGapXMobile={gapXMobile}

                            gridTileRadiusDesktop={radiusDesktop}
                            gridTileRadiusMobile={radiusMobile}

                            itemsDesktop={itemsDesktop}
                            itemsMobile={itemsMobile}

                            align={align}
                            tileVariant={tileVariant}
                            gridAspectRatio={aspectRatio}
                            tileShowTitle={showTitle}
                            tileShowMeta={showMeta}
                            tileShowBadge={showBadge}
                            tileShowCtaLabel={showCtaLabel}
                            tileShowCtaArrow={showCtaArrow}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
