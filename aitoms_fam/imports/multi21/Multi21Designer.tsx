"use client";

import React, { useEffect, useMemo } from 'react';
import { Multi21, Multi21Item } from './Multi21';
import { BottomControlsPanel } from './BottomControlsPanel';
import { DesktopPanelSystem } from './DesktopPanelSystem';
import { MobileFloatingManager } from './mobile/MobileFloatingManager';
import { ToolControlProvider, useToolControl } from '../../context/ToolControlContext';

// Mock Data Generator
const generateItems = (count: number, variant: 'generic' | 'product' | 'kpi' | 'text'): Multi21Item[] => {
    return Array.from({ length: count }).map((_, i) => {
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
            imageUrl: `https://picsum.photos/seed/${i + 100}/600/400`,
            href: '#',
            badge: i % 3 === 0 ? 'New' : undefined,
            secondaryLink: i % 2 === 0 ? { href: '#', label: 'Watch now' } : undefined,
        };
    });
};

const blocks = [
    { id: 'block-hero', label: 'Hero KPIs' },
    { id: 'block-products', label: 'Product Grid' },
];

const initialToolState = {
    // Global preview
    'multi21.designer:global:global:previewMode': 'desktop',
    // Per-block defaults
    'multi21.designer:block:block-hero:colsDesktop': 6,
    'multi21.designer:block:block-hero:colsMobile': 2,
    'multi21.designer:block:block-hero:tileGap': 12,
    'multi21.designer:block:block-hero:tileRadius': 12,
    'multi21.designer:block:block-hero:itemCount': 6,
    'multi21.designer:block:block-hero:align': 'center',
    'multi21.designer:block:block-hero:tileVariant': 'kpi',
    'multi21.designer:block:block-hero:aspectRatio': 'portrait',
    'multi21.designer:block:block-hero:showTitle': true,
    'multi21.designer:block:block-hero:showMeta': true,
    'multi21.designer:block:block-hero:showBadge': true,
    'multi21.designer:block:block-hero:showCtaLabel': false,
    'multi21.designer:block:block-hero:showCtaArrow': false,
    'multi21.designer:block:block-hero:offsetX': 0,
    'multi21.designer:block:block-hero:offsetY': 0,
    'multi21.designer:block:block-hero:fullScreenMobile': true,

    'multi21.designer:block:block-products:colsDesktop': 6,
    'multi21.designer:block:block-products:colsMobile': 2,
    'multi21.designer:block:block-products:tileGap': 16,
    'multi21.designer:block:block-products:tileRadius': 8,
    'multi21.designer:block:block-products:itemCount': 12,
    'multi21.designer:block:block-products:align': 'center',
    'multi21.designer:block:block-products:tileVariant': 'product',
    'multi21.designer:block:block-products:aspectRatio': 'landscape',
    'multi21.designer:block:block-products:showTitle': true,
    'multi21.designer:block:block-products:showMeta': true,
    'multi21.designer:block:block-products:showBadge': true,
    'multi21.designer:block:block-products:showCtaLabel': true,
    'multi21.designer:block:block-products:showCtaArrow': true,
    'multi21.designer:block:block-products:offsetX': 0,
    'multi21.designer:block:block-products:offsetY': 0,
    'multi21.designer:block:block-products:fullScreenMobile': false,
};

export function Multi21Designer() {
    return (
        <ToolControlProvider initialState={initialToolState}>
            <Multi21DesignerInner />
        </ToolControlProvider>
    );
}

function Multi21DesignerInner() {
    const { useToolState, getSurfaceConfig } = useToolControl();
    const [previewMode, setPreviewMode] = useToolState<'desktop' | 'mobile'>({ target: { surfaceId: 'multi21.designer', toolId: 'previewMode' }, defaultValue: 'desktop' });

    const useBlockTool = <T,>(blockId: string, toolId: string, defaultValue: T) =>
        useToolState<T>({ target: { surfaceId: 'multi21.designer', scope: 'block', entityId: blockId, toolId }, defaultValue });

    const [isDesktop, setIsDesktop] = React.useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [configPreview, setConfigPreview] = React.useState<string>('');
    const settingsPanels: React.ReactNode[] = [];
    const toolsPanels: React.ReactNode[] = [];

    const handleCopyConfig = () => {
        const cfg = getSurfaceConfig('multi21.designer');
        const json = JSON.stringify(cfg, null, 2);
        setConfigPreview(json);
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(json).catch(() => {
                console.debug('Clipboard write failed, config below', json);
            });
        }
    };

    const buildPanelDefinitions = () => [
        {
            id: 'settings',
            title: 'Settings',
            content: <div className="space-y-4">{settingsPanels}</div>,
        },
        {
            id: 'tools',
            title: 'Tools',
            content: <div className="space-y-4">{toolsPanels}</div>,
        },
    ];

    return (
        <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Multi²¹</p>
                        <h1 className="text-2xl font-semibold">Grid Designer</h1>
                        <p className="text-sm text-neutral-500">Stack multiple blocks with independent settings.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-900 p-1">
                            {(['desktop', 'mobile'] as const).map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setPreviewMode(opt)}
                                    className={`px-3 py-1 rounded-full text-sm capitalize ${previewMode === opt ? 'bg-white dark:bg-neutral-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                                    data-atom-id={`atom-multi21-preview-${opt}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleCopyConfig}
                            className="rounded-md border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800"
                        >
                            Copy config
                        </button>
                    </div>
                </header>

                {configPreview && (
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs font-mono text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-semibold text-neutral-600 dark:text-neutral-300">Config (copied)</span>
                            <button
                                onClick={() => setConfigPreview('')}
                                className="text-[11px] uppercase tracking-wide text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                            >
                                Hide
                            </button>
                        </div>
                        <pre className="whitespace-pre-wrap break-words">{configPreview}</pre>
                    </div>
                )}

                <div className="space-y-8">
                    {blocks.map(({ id, label }) => {
                        const [colsDesktop, setColsDesktop] = useBlockTool<number>(id, 'colsDesktop', 6);
                        const [colsMobile, setColsMobile] = useBlockTool<number>(id, 'colsMobile', 2);
                        const [tileGap, setTileGap] = useBlockTool<number>(id, 'tileGap', 16);
                        const [tileRadius, setTileRadius] = useBlockTool<number>(id, 'tileRadius', 8);
                        const [align, setAlign] = useBlockTool<'left' | 'center' | 'right'>(id, 'align', 'center');
                        const [tileVariant, setTileVariant] = useBlockTool<'generic' | 'product' | 'kpi' | 'text'>(id, 'tileVariant', 'generic');
                        const [aspectRatio, setAspectRatio] = useBlockTool<'square' | 'portrait' | 'landscape'>(id, 'aspectRatio', 'landscape');
                        const [itemCount, setItemCount] = useBlockTool<number>(id, 'itemCount', 8);
                        const [showTitle, setShowTitle] = useBlockTool<boolean>(id, 'showTitle', true);
                        const [showMeta, setShowMeta] = useBlockTool<boolean>(id, 'showMeta', true);
                        const [showBadge, setShowBadge] = useBlockTool<boolean>(id, 'showBadge', true);
                        const [showCtaLabel, setShowCtaLabel] = useBlockTool<boolean>(id, 'showCtaLabel', true);
                        const [showCtaArrow, setShowCtaArrow] = useBlockTool<boolean>(id, 'showCtaArrow', true);
                        const [offsetX, setOffsetX] = useBlockTool<number>(id, 'offsetX', 0);
                        const [offsetY, setOffsetY] = useBlockTool<number>(id, 'offsetY', 0);
                        const [fullScreenMobile, setFullScreenMobile] = useBlockTool<boolean>(id, 'fullScreenMobile', false);

                        const items = useMemo(() => generateItems(itemCount, tileVariant), [itemCount, tileVariant]);

                        const gridControls = (
                            <div className="flex flex-wrap items-center gap-3 justify-between">
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1">
                                        <span className="text-neutral-500">Cols D/M</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={12}
                                            value={colsDesktop}
                                            onChange={e => setColsDesktop(Number(e.target.value))}
                                            className="w-12 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1 py-0.5 text-xs"
                                        />
                                        <input
                                            type="number"
                                            min={1}
                                            max={6}
                                            value={colsMobile}
                                            onChange={e => setColsMobile(Number(e.target.value))}
                                            className="w-12 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1 py-0.5 text-xs"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1">
                                        <span className="text-neutral-500">Gap</span>
                                        <input
                                            type="number"
                                            min={0}
                                            max={48}
                                            value={tileGap}
                                            onChange={e => setTileGap(Number(e.target.value))}
                                            className="w-14 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1 py-0.5 text-xs"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1">
                                        <span className="text-neutral-500">Radius</span>
                                        <input
                                            type="number"
                                            min={0}
                                            max={32}
                                            value={tileRadius}
                                            onChange={e => setTileRadius(Number(e.target.value))}
                                            className="w-14 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1 py-0.5 text-xs"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1">
                                        <span className="text-neutral-500">Items</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={24}
                                            value={itemCount}
                                            onChange={e => setItemCount(Number(e.target.value))}
                                            className="w-14 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1 py-0.5 text-xs"
                                        />
                                    </div>
                                    <label className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1 text-xs">
                                        <input type="checkbox" checked={fullScreenMobile} onChange={e => setFullScreenMobile(e.target.checked)} className="rounded border-gray-300" />
                                        <span className="text-neutral-600">Full mobile</span>
                                    </label>
                                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1">
                                        <span className="text-neutral-500">Offset X</span>
                                        <input
                                            type="number"
                                            min={-120}
                                            max={120}
                                            value={offsetX}
                                            onChange={e => setOffsetX(Number(e.target.value))}
                                            className="w-14 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1 py-0.5 text-xs"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1">
                                        <span className="text-neutral-500">Offset Y</span>
                                        <input
                                            type="number"
                                            min={-120}
                                            max={120}
                                            value={offsetY}
                                            onChange={e => setOffsetY(Number(e.target.value))}
                                            className="w-14 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1 py-0.5 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        );

                        const layoutControls = (
                            <div className="flex flex-wrap gap-3">
                                <div className="flex gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800 p-1 text-xs">
                                    {(['left', 'center', 'right'] as const).map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setAlign(opt)}
                                            className={`px-2 py-1 rounded ${align === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800 p-1 text-xs">
                                    {(['square', 'portrait', 'landscape'] as const).map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setAspectRatio(opt)}
                                            className={`px-2 py-1 rounded ${aspectRatio === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800 p-1 text-xs">
                                    {(['generic', 'product', 'kpi', 'text'] as const).map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setTileVariant(opt)}
                                            className={`px-2 py-1 rounded ${tileVariant === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );

                        const visibilityControls = (
                            <div className="flex gap-2 text-xs items-center flex-wrap">
                                {[
                                    { label: 'Title', value: showTitle, setter: setShowTitle },
                                    { label: 'Meta', value: showMeta, setter: setShowMeta },
                                    { label: 'Badge', value: showBadge, setter: setShowBadge },
                                    { label: 'CTA Label', value: showCtaLabel, setter: setShowCtaLabel },
                                    { label: 'CTA Arrow', value: showCtaArrow, setter: setShowCtaArrow },
                                ].map(item => (
                                    <label key={item.label} className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1">
                                        <input type="checkbox" checked={item.value} onChange={e => item.setter(e.target.checked)} className="rounded border-gray-300" />
                                        <span>{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        );

                        settingsPanels.push(
                            <div key={`settings-${id}`} className="space-y-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
                                    <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Layout & Visibility</h3>
                                </div>
                                {layoutControls}
                                {visibilityControls}
                            </div>
                        );

                        toolsPanels.push(
                            <div key={`tools-${id}`} className="space-y-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
                                    <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Grid & Data</h3>
                                </div>
                                {gridControls}
                            </div>
                        );

                        const inlineControls = (
                            <div className="space-y-3">
                                {gridControls}
                                {layoutControls}
                                {visibilityControls}
                            </div>
                        );

                        return (
                            <section key={id} className="space-y-4" data-atom-id={`atom-multi21-block-${id}`} data-surface-id="surface-multi21-block">
                                <div className="flex flex-wrap items-center gap-3 justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-neutral-500">Block</p>
                                        <h2 className="text-lg font-semibold">{label}</h2>
                                    </div>
                                </div>

                                {!isDesktop && inlineControls}

                                <div className="w-full transition-transform" style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}>
                                    <Multi21
                                        items={items}
                                        colsDesktop={colsDesktop}
                                        colsMobile={colsMobile}
                                        tileGap={tileGap}
                                        tileRadius={tileRadius}
                                        align={align}
                                        tileVariant={tileVariant}
                                        aspectRatio={aspectRatio}
                                        showTitle={showTitle}
                                        showMeta={showMeta}
                                        showBadge={showBadge}
                                        showCtaLabel={showCtaLabel}
                                        showCtaArrow={showCtaArrow}
                                        fullScreenMobile={fullScreenMobile}
                                        forceMobile={previewMode === 'mobile'}
                                    />
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>

            {isDesktop ? <DesktopPanelSystem panels={buildPanelDefinitions()} /> : <MobileFloatingManager settingsContent={<div className="space-y-4">{settingsPanels}</div>} toolsContent={<div className="space-y-4">{toolsPanels}</div>} />}
            <BottomControlsPanel />
        </div>
    );
}
