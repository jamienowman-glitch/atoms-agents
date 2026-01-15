import React, { useState, useEffect } from 'react';
import { useToolControl } from '../../context/ToolControlContext';
import { ToolPill, SubTool } from './tools/ToolPill';

export type PanelState = 'collapsed' | 'compact' | 'full';
type SliderTarget = 'grid.cols_desktop' | 'grid.cols_mobile' | 'grid.gap_x' | 'grid.tile_radius' | 'feed.query.limit' | 'settings';

interface UniversalSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (v: number) => void;
}

const UniversalSlider: React.FC<UniversalSliderProps> = ({ value, min, max, step = 1, onChange }) => (
    <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-8 accent-black dark:accent-white cursor-pointer"
    />
);

interface ToolCarouselItem {
    id: string;
    icon: React.ReactNode;
    label: string;
}

const ToolCarousel: React.FC<{ items: ToolCarouselItem[]; activeId: string; onSelect: (id: string) => void }> = ({ items, activeId, onSelect }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
    const isScrollingRef = React.useRef(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    // Initial Scroll to Active
    useEffect(() => {
        const container = scrollRef.current;
        const item = itemRefs.current.get(activeId);
        if (container && item && !isScrollingRef.current) {
            const containerCenter = container.offsetWidth / 2;
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            container.scrollTo({
                left: itemCenter - containerCenter,
                behavior: 'smooth'
            });
        }
    }, [activeId]);

    const handleScroll = React.useCallback(() => {
        if (!scrollRef.current) return;
        isScrollingRef.current = true;

        const container = scrollRef.current;
        const containerCenter = container.scrollLeft + container.offsetWidth / 2;

        let closestId = '';
        let minDistance = Infinity;

        // Visual Updates (Scale) & Find Closest
        items.forEach((item) => {
            const el = itemRefs.current.get(item.id);
            if (el) {
                const itemCenter = el.offsetLeft + el.offsetWidth / 2;
                const distance = Math.abs(containerCenter - itemCenter);

                // Tighter Magnification Curve for "Sitting Under" effect
                const maxDistance = 60;
                // Center item pops out more, sides recede significantly
                const scale = Math.max(0.7, 1.3 - (distance / maxDistance) * 0.8);
                const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.8);

                el.style.transform = `scale(${scale})`;
                el.style.opacity = `${opacity}`;
                // Explicit z-indexing for layering: Center is highest
                el.style.zIndex = distance < 15 ? '20' : '10';

                if (distance < minDistance) {
                    minDistance = distance;
                    closestId = item.id;
                }
            }
        });

        // Debounce selection update
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (closestId && closestId !== activeId) {
                onSelect(closestId);
            }
            isScrollingRef.current = false;
        }, 50);

    }, [items, activeId, onSelect]);

    // Initial visual setup
    useEffect(() => {
        handleScroll();
    }, []);

    return (
        <div className="relative w-[140px] h-14 flex items-center shrink-0">
            {/* Center Selection Indicator - subtle highlight */}
            {/* <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 pointer-events-none opacity-20 blur-sm" /> */}

            <div
                ref={scrollRef}
                className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none w-full h-full px-[50%]"
                onScroll={handleScroll}
                style={{
                    scrollPaddingInline: '50%',
                    scrollbarWidth: 'none',  /* Firefox */
                    msOverflowStyle: 'none'  /* IE 10+ */
                }}
            >
                {/* CSS to hide scrollbar for Webkit */}
                <style jsx>{`
                    div::-webkit-scrollbar { display: none; }
                `}</style>

                {items.map(item => (
                    <button
                        key={item.id}
                        ref={el => { if (el) itemRefs.current.set(item.id, el); }}
                        onClick={() => {
                            onSelect(item.id);
                            // Also scroll to it immediately to force snap
                            const container = scrollRef.current;
                            const el = itemRefs.current.get(item.id);
                            if (container && el) {
                                const containerCenter = container.offsetWidth / 2;
                                const itemCenter = el.offsetLeft + el.offsetWidth / 2;
                                container.scrollTo({ left: itemCenter - containerCenter, behavior: 'smooth' });
                            }
                        }}
                        className="flex-shrink-0 snap-center flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-75 ease-linear bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-sm border border-neutral-200 dark:border-neutral-700"
                        title={item.label}
                    >
                        {item.icon}
                    </button>
                ))}
            </div>

            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent pointer-events-none z-30" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent pointer-events-none z-30" />
        </div>
    );
};

interface BottomControlsPanelProps {
    settingsContent?: React.ReactNode;
}

export const BottomControlsPanel: React.FC<BottomControlsPanelProps> = ({ settingsContent }) => {
    const { useToolState } = useToolControl();

    // 1. Tool State Hooks
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

    // 2. Panel State
    const [panelState, setPanelState] = useState<PanelState>('compact');
    const [lastNonCollapsed, setLastNonCollapsed] = useState<PanelState>('compact');
    const [activeSlider, setActiveSlider] = useState<string>('grid.cols');

    useEffect(() => {
        const stored = localStorage.getItem('multi2_panel_state') as PanelState | null;
        if (stored && ['collapsed', 'compact', 'full'].includes(stored)) {
            setPanelState(stored);
            if (stored !== 'collapsed') setLastNonCollapsed(stored);
        } else {
            setPanelState('compact');
            setLastNonCollapsed('compact');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('multi2_panel_state', panelState);
        if (panelState !== 'collapsed') setLastNonCollapsed(panelState);
    }, [panelState]);

    const expand = () => setPanelState(lastNonCollapsed);
    const collapse = () => setPanelState('collapsed');
    const goFull = () => setPanelState('full');
    const goCompact = () => setPanelState('compact');

    // 3. Configurations
    interface SplitConfig {
        desktop: { value: number; setter: (v: number) => void; min: number; max: number; step: number; label: string };
        mobile: { value: number; setter: (v: number) => void; min: number; max: number; step: number; label: string };
        icon: React.ReactNode;
        label: string;
    }

    const sliderMap: Record<string, SplitConfig> = {
        'grid.cols': {
            desktop: { value: colsDesktop, setter: setColsDesktop, min: 1, max: 12, step: 1, label: 'Desktop Cols' },
            mobile: { value: colsMobile, setter: setColsMobile, min: 1, max: 6, step: 1, label: 'Mobile Cols' },
            label: 'Columns',
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2" ry="2" /><line x1="12" y1="16" x2="12" y2="20" /><line x1="8" y1="20" x2="16" y2="20" /></svg>,
        },
        'grid.gap_x': {
            desktop: { value: gapXDesktop, setter: setGapXDesktop, min: 0, max: 48, step: 4, label: 'Desktop Gap' },
            mobile: { value: gapXMobile, setter: setGapXMobile, min: 0, max: 24, step: 4, label: 'Mobile Gap' },
            label: 'Gap',
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></svg>,
        },
        'grid.tile_radius': {
            desktop: { value: radiusDesktop, setter: setRadiusDesktop, min: 0, max: 32, step: 4, label: 'Desktop Radius' },
            mobile: { value: radiusMobile, setter: setRadiusMobile, min: 0, max: 24, step: 4, label: 'Mobile Radius' },
            label: 'Radius',
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>,
        },
        'feed.query.limit': {
            desktop: { value: itemsDesktop, setter: setItemsDesktop, min: 1, max: 48, step: 1, label: 'Desktop Items' },
            mobile: { value: itemsMobile, setter: setItemsMobile, min: 1, max: 24, step: 1, label: 'Mobile Items' },
            label: 'Items',
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
        },
    };

    const activeSplitConfig = sliderMap[activeSlider];

    const renderContent = () => {
        if (panelState === 'collapsed') {
            return (
                <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none" onClick={expand}>
                    <span className="text-sm font-medium">MULTI² controls</span>
                    <svg className="w-4 h-4 transform rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                </div>
            );
        }

        // Use h-auto for compact to fit content (like dual sliders) but constrain it to avoiding covering full screen
        const heightClass = panelState === 'compact' ? 'h-auto max-h-[50vh] min-h-[12rem]' : 'h-[60vh]';

        return (
            <div className={`flex flex-col transition-all duration-300 ease-in-out ${heightClass}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                    <h2 className="text-sm font-medium">MULTI² Designer</h2>
                    <div className="flex gap-3">
                        <button onClick={collapse} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">

                    {/* Controls Row */}
                    <div className="flex items-start gap-4">

                        {/* LEFT: Standard Static Buttons for Tools & Settings */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs uppercase tracking-wider text-neutral-500">Adjust</span>
                                <span className="text-xs text-neutral-700 dark:text-neutral-300">
                                    {activeSlider === 'settings' ? 'Settings' : activeSplitConfig?.label || ''}
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Settings Icon Fixed First */}
                                <button
                                    onClick={() => setActiveSlider('settings')}
                                    className={`flex items-center justify-center min-w-[40px] w-10 h-10 rounded-md border transition-colors shrink-0
                                        ${activeSlider === 'settings'
                                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                                            : 'border-transparent bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.15.48.5.87.97 1.08H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
                                </button>

                                <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 shrink-0" />

                                {/* Tool Carousel - now tighter */}
                                <ToolCarousel
                                    items={Object.entries(sliderMap).map(([key, config]) => ({ id: key, icon: config.icon, label: config.label }))}
                                    activeId={activeSlider}
                                    onSelect={setActiveSlider}
                                />
                            </div>

                            {/* Active Slider / Settings Content */}
                            <div className="min-h-[40px]">
                                {activeSlider === 'settings' ? (
                                    <div className="text-sm animate-fadeIn">
                                        {settingsContent || <span className="text-neutral-400 italic">No settings available</span>}
                                    </div>
                                ) : (
                                    activeSplitConfig ? (
                                        <div className="flex flex-col gap-4 pt-1 animate-fadeIn">
                                            {/* Desktop Slider */}
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center text-xs text-neutral-500">
                                                    <span>Desktop</span>
                                                    <span>{activeSplitConfig.desktop.value} {activeSplitConfig.desktop.label.toLowerCase().includes('cols') ? 'cols' : activeSplitConfig.desktop.label.toLowerCase().includes('gap') ? 'px' : activeSplitConfig.desktop.label.toLowerCase().includes('radius') ? 'px' : ''}</span>
                                                </div>
                                                <UniversalSlider
                                                    value={activeSplitConfig.desktop.value}
                                                    min={activeSplitConfig.desktop.min}
                                                    max={activeSplitConfig.desktop.max}
                                                    step={activeSplitConfig.desktop.step}
                                                    onChange={activeSplitConfig.desktop.setter}
                                                />
                                            </div>
                                            {/* Mobile Slider */}
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center text-xs text-neutral-500">
                                                    <span>Mobile</span>
                                                    <span>{activeSplitConfig.mobile.value} {activeSplitConfig.mobile.label.toLowerCase().includes('cols') ? 'cols' : activeSplitConfig.mobile.label.toLowerCase().includes('gap') ? 'px' : activeSplitConfig.mobile.label.toLowerCase().includes('radius') ? 'px' : ''}</span>
                                                </div>
                                                <UniversalSlider
                                                    value={activeSplitConfig.mobile.value}
                                                    min={activeSplitConfig.mobile.min}
                                                    max={activeSplitConfig.mobile.max}
                                                    step={activeSplitConfig.mobile.step}
                                                    onChange={activeSplitConfig.mobile.setter}
                                                />
                                            </div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out pb-safe`}>
            {renderContent()}
        </div>
    );
};
