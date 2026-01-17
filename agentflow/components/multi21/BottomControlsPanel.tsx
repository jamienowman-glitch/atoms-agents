"use client";

import React, { useState, useEffect } from 'react';
import { useToolControl } from '../../context/ToolControlContext';
import { ColorRibbon } from '../ui/ColorRibbon';
import { ROBOTO_PRESETS } from '../../lib/fonts/roboto-presets';
import { ContentConfigurationPanel } from './ContentConfigurationPanel';

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3'] as const;

export type PanelState = 'collapsed' | 'compact' | 'full';

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
        className="w-full h-8 accent-black dark:accent-white cursor-pointer touch-none"
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
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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
                const maxDistance = 60;
                const scale = Math.max(0.7, 1.3 - (distance / maxDistance) * 0.8);
                const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.8);

                el.style.transform = `scale(${scale})`;
                el.style.opacity = `${opacity}`;
                el.style.zIndex = distance < 15 ? '20' : '10';

                if (distance < minDistance) {
                    minDistance = distance;
                    closestId = item.id;
                }
            }
        });

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (closestId && closestId !== activeId) {
                onSelect(closestId);
            }
            isScrollingRef.current = false;
        }, 50);

    }, [items, activeId, onSelect]);

    useEffect(() => {
        handleScroll();
    }, []);

    return (
        <div className="relative w-[140px] h-14 flex items-center shrink-0">
            <div
                ref={scrollRef}
                className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none w-full h-full px-[50%]"
                onScroll={handleScroll}
                style={{
                    scrollPaddingInline: '50%',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                <style jsx>{`
                    div::-webkit-scrollbar { display: none; }
                `}</style>

                {items.map(item => (
                    <button
                        key={item.id}
                        ref={el => { if (el) itemRefs.current.set(item.id, el); }}
                        onClick={() => {
                            onSelect(item.id);
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
    settingsContent: React.ReactNode;
    activeBlockId: string | null;
    activeBlockType?: 'media' | 'text' | 'cta' | 'header' | 'row' | 'popup'; // Phase 19 Updated
    isVisible?: boolean;
}

export function BottomControlsPanel({ settingsContent, activeBlockId, activeBlockType = 'media' }: BottomControlsPanelProps) {
    const { useToolState } = useToolControl();

    // Consume visibility state directly
    const [isVisible] = useToolState<boolean>({ target: { surfaceId: 'multi21.shell', toolId: 'ui.show_tools' }, defaultValue: false });

    // Fallback scope if no block selected (shouldn't happen in usage, but safe)
    const scope = { surfaceId: 'multi21.designer', entityId: activeBlockId || 'none' };

    // --- State: Layout (Media) ---
    const [colsDesktop, setColsDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.cols_desktop' }, defaultValue: 6 });
    const [colsMobile, setColsMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.cols_mobile' }, defaultValue: 2 });

    const [gapXDesktop, setGapXDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_x_desktop' }, defaultValue: 16 });
    const [gapXMobile, setGapXMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_x_mobile' }, defaultValue: 16 });

    const [radiusDesktop, setRadiusDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.tile_radius_desktop' }, defaultValue: 8 });
    const [radiusMobile, setRadiusMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.tile_radius_mobile' }, defaultValue: 8 });

    const [itemsDesktop, setItemsDesktop] = useToolState<number>({ target: { ...scope, toolId: 'feed.query.limit_desktop' }, defaultValue: 12 });
    const [itemsMobile, setItemsMobile] = useToolState<number>({ target: { ...scope, toolId: 'feed.query.limit_mobile' }, defaultValue: 6 });

    const [aspectRatioStr, setAspectRatioStr] = useToolState<'1:1' | '16:9' | '9:16' | '4:3'>({ target: { ...scope, toolId: 'grid.aspect_ratio' }, defaultValue: '16:9' });

    // Global Preview Mode
    const [previewMode, setPreviewMode] = useToolState<'desktop' | 'mobile'>({ target: { surfaceId: 'multi21.designer', toolId: 'previewMode' }, defaultValue: 'desktop' });
    const isMobileView = previewMode === 'mobile';

    // --- State: Typography ---
    // Global (Shared / Media)
    const [presetIndex, setPresetIndex] = useToolState<number>({ target: { ...scope, toolId: 'typo.preset_index' }, defaultValue: 3 });
    const [fontSizeDesktop, setFontSizeDesktop] = useToolState<number>({ target: { ...scope, toolId: 'typo.size_desktop' }, defaultValue: 16 });
    const [fontSizeMobile, setFontSizeMobile] = useToolState<number>({ target: { ...scope, toolId: 'typo.size_mobile' }, defaultValue: 16 });

    // Scoped Text Props (Phase 13 Restored)
    const [headlineSizeDesktop, setHeadlineSizeDesktop] = useToolState<number>({ target: { ...scope, toolId: 'typo.headline.size_desktop' }, defaultValue: 24 });
    const [headlineSizeMobile, setHeadlineSizeMobile] = useToolState<number>({ target: { ...scope, toolId: 'typo.headline.size_mobile' }, defaultValue: 20 });
    const [headlineWeight, setHeadlineWeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.headline.weight' }, defaultValue: 700 });

    const [subheadSizeDesktop, setSubheadSizeDesktop] = useToolState<number>({ target: { ...scope, toolId: 'typo.subhead.size_desktop' }, defaultValue: 18 });
    const [subheadSizeMobile, setSubheadSizeMobile] = useToolState<number>({ target: { ...scope, toolId: 'typo.subhead.size_mobile' }, defaultValue: 16 });
    const [subheadWeight, setSubheadWeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.subhead.weight' }, defaultValue: 400 });

    const [bodySizeDesktop, setBodySizeDesktop] = useToolState<number>({ target: { ...scope, toolId: 'typo.body.size_desktop' }, defaultValue: 16 });
    const [bodySizeMobile, setBodySizeMobile] = useToolState<number>({ target: { ...scope, toolId: 'typo.body.size_mobile' }, defaultValue: 16 });
    const [bodyWeight, setBodyWeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.body.weight' }, defaultValue: 300 });

    // Scoped Text Props (Phase 13 Dynamic Binding Helper)
    const [activeTextTarget, setActiveTextTarget] = useState<'headline' | 'subhead' | 'body'>('headline');

    // We use a trick: Component renders "Size" slider, but we bind it to a different toolId based on 'activeTextTarget'
    // This is handled in the Render section via `ToolScope`.

    // Global Axes
    const [axisWeight, setAxisWeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.weight' }, defaultValue: -1 });
    const [axisWidth, setAxisWidth] = useToolState<number>({ target: { ...scope, toolId: 'typo.width' }, defaultValue: -1 });
    const [fontFamily, setFontFamily] = useToolState<number>({ target: { ...scope, toolId: 'typo.family' }, defaultValue: 0 });
    const [axisCasual, setAxisCasual] = useToolState<number>({ target: { ...scope, toolId: 'typo.casual' }, defaultValue: 0 });
    const [axisSlant, setAxisSlant] = useToolState<number>({ target: { ...scope, toolId: 'typo.slant' }, defaultValue: 0 });
    const [axisGrade, setAxisGrade] = useToolState<number>({ target: { ...scope, toolId: 'typo.grade' }, defaultValue: 0 });

    // --- State: Style ---
    const [styleBgColor, setStyleBgColor] = useToolState<string>({ target: { ...scope, toolId: 'style.bg' }, defaultValue: 'transparent' });
    const [styleTextColor, setStyleTextColor] = useToolState<string>({ target: { ...scope, toolId: 'style.text' }, defaultValue: 'inherit' });
    const [styleAccentColor, setStyleAccentColor] = useToolState<string>({ target: { ...scope, toolId: 'style.accent' }, defaultValue: '#3b82f6' });

    // Style Extensions (Phase 13/14)
    const [styleBorderWidth, setStyleBorderWidth] = useToolState<number>({ target: { ...scope, toolId: 'style.border.width' }, defaultValue: 0 });
    const [styleBorderColor, setStyleBorderColor] = useToolState<string>({ target: { ...scope, toolId: 'style.border.color' }, defaultValue: 'transparent' });
    const [styleOpacity, setStyleOpacity] = useToolState<number>({ target: { ...scope, toolId: 'style.opacity' }, defaultValue: 100 });
    const [styleBlur, setStyleBlur] = useToolState<number>({ target: { ...scope, toolId: 'style.blur' }, defaultValue: 0 });

    // Local UI State
    const [colorTarget, setColorTarget] = useState<'bg' | 'text' | 'funk'>('funk');
    const fallbackColorInputRef = React.useRef<HTMLInputElement>(null);

    // --- Phase 13: Text Block Layout Tools ---
    const [textAlign, setTextAlign] = useToolState<'left' | 'center' | 'right' | 'justify'>({ target: { ...scope, toolId: 'text.align' }, defaultValue: 'left' });
    const [stackGap, setStackGap] = useToolState<number>({ target: { ...scope, toolId: 'text.stack_gap' }, defaultValue: 16 });
    const [contentWidthPercent, setContentWidthPercent] = useToolState<number>({ target: { ...scope, toolId: 'text.width_percent' }, defaultValue: 100 });

    // --- Phase 14: CTA Tools ---
    const [ctaVariant, setCtaVariant] = useToolState<'solid' | 'outline' | 'ghost'>({ target: { ...scope, toolId: 'cta.variant' }, defaultValue: 'solid' });
    const [ctaSize, setCtaSize] = useToolState<'small' | 'medium' | 'large'>({ target: { ...scope, toolId: 'cta.size' }, defaultValue: 'medium' });
    const [ctaFullWidth, setCtaFullWidth] = useToolState<boolean>({ target: { ...scope, toolId: 'cta.fullWidth' }, defaultValue: false });
    const [ctaAlign, setCtaAlign] = useToolState<'left' | 'center' | 'right'>({ target: { ...scope, toolId: 'cta.align' }, defaultValue: 'center' });

    // --- Phase 18: Header Tools ---
    const [headerLayout, setHeaderLayout] = useToolState<string>({ target: { ...scope, toolId: 'header.layout' }, defaultValue: 'logo_left' });
    const [headerTrust, setHeaderTrust] = useToolState<string>({ target: { ...scope, toolId: 'header.trust_signal' }, defaultValue: 'none' });
    const [headerContact, setHeaderContact] = useToolState<string>({ target: { ...scope, toolId: 'header.contact_priority' }, defaultValue: 'standard' });
    const [headerCtaMode, setHeaderCtaMode] = useToolState<string>({ target: { ...scope, toolId: 'header.cta_mode' }, defaultValue: 'conversion' });
    const [headerSticky, setHeaderSticky] = useToolState<boolean>({ target: { ...scope, toolId: 'header.sticky' }, defaultValue: false });
    const [headerMenu, setHeaderMenu] = useToolState<string>({ target: { ...scope, toolId: 'header.menu_source' }, defaultValue: 'main_site' });

    // --- Phase 19: Popup Engine Tools ---
    // Scope should ideally be passed for 'popup' type, but assuming 'page_popup' entity ID logic
    const [popupTrigger, setPopupTrigger] = useToolState<string>({ target: { ...scope, toolId: 'popup.trigger' }, defaultValue: 'exit' });
    const [popupDelay, setPopupDelay] = useToolState<number>({ target: { ...scope, toolId: 'popup.delay' }, defaultValue: 0 });
    const [popupFreq, setPopupFreq] = useToolState<string>({ target: { ...scope, toolId: 'popup.frequency' }, defaultValue: 'every_time' });
    const [popupPos, setPopupPos] = useToolState<string>({ target: { ...scope, toolId: 'popup.position' }, defaultValue: 'center' });
    const [popupOpacity, setPopupOpacity] = useToolState<number>({ target: { ...scope, toolId: 'popup.overlay_opacity' }, defaultValue: 50 });
    const [formUtms, setFormUtms] = useToolState<boolean>({ target: { ...scope, toolId: 'form.collect_utms' }, defaultValue: true });
    const [formDest, setFormDest] = useToolState<string>({ target: { ...scope, toolId: 'form.destination' }, defaultValue: 'email' });

    // Teaser
    const [teaserText, setTeaserText] = useToolState<string>({ target: { ...scope, toolId: 'popup.teaser_text' }, defaultValue: 'Start Here' });
    const [teaserPos, setTeaserPos] = useToolState<string>({ target: { ...scope, toolId: 'popup.teaser_position' }, defaultValue: 'bottom_right' });


    // --- Panel Flow State ---
    const [panelState, setPanelState] = useState<PanelState>('compact');
    const [lastNonCollapsed, setLastNonCollapsed] = useState<PanelState>('compact');

    // Dual Magnifier Logic
    const [activeMode, setActiveMode] = useState<'layout' | 'typography' | 'style'>('layout');
    const [activeLayoutTool, setActiveLayoutTool] = useState<string>('density');
    const [activeTypoTool, setActiveTypoTool] = useState<string>('identity');
    const [activeStyleTool, setActiveStyleTool] = useState<string>('palette');

    // Auto-Expand
    useEffect(() => {
        if (isVisible) {
            setPanelState('compact');
        }
    }, [isVisible]);

    const expand = () => setPanelState(lastNonCollapsed);
    const collapse = () => setPanelState('collapsed');

    // --- Configurations ---
    // --- Configurations ---
    const modes: ToolCarouselItem[] = [
        { id: 'layout', label: 'Layout', icon: 'grid' },
        { id: 'typography', label: 'Typography', icon: 'type' },
        { id: 'style', label: 'Style', icon: 'palette' },
    ];

    const layoutTools: ToolCarouselItem[] = [
        { id: 'density', label: 'Density', icon: 'grid' },
        { id: 'spacing', label: 'Spacing', icon: 'maximize' },
        { id: 'geometry', label: 'Geometry', icon: 'box' },
    ];

    const typoTools: ToolCarouselItem[] = [
        { id: 'identity', label: 'Identity', icon: 'type' },
        { id: 'body', label: 'Body', icon: 'align-left' }, // Weight/Width
        { id: 'scale', label: 'Scale', icon: 'maximize' }, // Preset/Size
        { id: 'type_style', label: 'Style', icon: 'italic' }, // Slant/Grade
    ];

    const styleTools: ToolCarouselItem[] = [
        { id: 'palette', label: 'Palette', icon: 'droplet' },
        { id: 'effects', label: 'Effects', icon: 'zap' },
        { id: 'borders', label: 'Borders', icon: 'square' },
    ];

    // --- Render Helpers ---
    const renderSliders = () => {
        // --- LAYOUT MODE ---
        if (activeMode === 'layout') {
            // 1. Text Block Layout
            if (activeBlockType === 'text') {
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        {/* Text Align & Gap */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium">
                                <span>Alignment</span>
                            </div>
                            <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                {(['left', 'center', 'right', 'justify'] as const).map(align => (
                                    <button
                                        key={align}
                                        onClick={() => setTextAlign(align)}
                                        className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all ${textAlign === align
                                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                                            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                            }`}
                                    >
                                        {align === 'justify' ? 'Justify' : align.charAt(0).toUpperCase() + align.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Width */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Container Width</span><span>{contentWidthPercent}%</span></div>
                            <UniversalSlider value={contentWidthPercent} min={20} max={100} step={5} onChange={setContentWidthPercent} />
                        </div>

                        {/* Stack Gap */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Stack Gap</span><span>{stackGap}px</span></div>
                            <UniversalSlider value={stackGap} min={0} max={64} step={4} onChange={setStackGap} />
                        </div>
                    </div>
                );
            }

            // 2. CTA Block Layout (Phase 14)
            if (activeBlockType === 'cta') {
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        {/* Alignment */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium">
                                <span>Alignment</span>
                            </div>
                            <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                {(['left', 'center', 'right'] as const).map(align => (
                                    <button
                                        key={align}
                                        onClick={() => setCtaAlign(align)}
                                        className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all ${ctaAlign === align
                                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                                            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                            }`}
                                    >
                                        {align.charAt(0).toUpperCase() + align.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Full Width Toggle */}
                        <div className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800">
                            <span className="text-sm font-medium">Full Width</span>
                            <button
                                onClick={() => setCtaFullWidth(!ctaFullWidth)}
                                className={`w-11 h-6 rounded-full transition-colors relative ${ctaFullWidth ? 'bg-blue-500' : 'bg-neutral-200 dark:bg-neutral-700'}`}
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${ctaFullWidth ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                );
            }

            // 3. Header Block Layout (Phase 18)
            if (activeBlockType === 'header') {
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        {/* Layout */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-500 font-medium">Layout</span>
                            <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                {(['logo_left', 'logo_center', 'logo_split'] as const).map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setHeaderLayout(opt)}
                                        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${headerLayout === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500'}`}
                                    >
                                        {opt.replace('logo_', '').replace(/^\w/, c => c.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trust Signal */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-500 font-medium">Trust Signal</span>
                            <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-x-auto">
                                {(['none', 'secure_icon', 'rating_star', 'verified_badge'] as const).map(opt => (
                                    <button key={opt} onClick={() => setHeaderTrust(opt)} className={`px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${headerTrust === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500'}`}>{opt.replace('_', ' ')}</button>
                                ))}
                            </div>
                        </div>

                        {/* Contact Priority */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-500 font-medium">Action Priority</span>
                            <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                {(['hidden', 'standard', 'highlight'] as const).map(opt => (
                                    <button key={opt} onClick={() => setHeaderContact(opt)} className={`flex-1 py-1.5 rounded-md text-xs font-medium ${headerContact === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500'}`}>{opt}</button>
                                ))}
                            </div>
                        </div>

                        {/* Sticky Toggle */}
                        <div className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800">
                            <span className="text-sm font-medium">Sticky Header</span>
                            <button onClick={() => setHeaderSticky(!headerSticky)} className={`w-9 h-5 rounded-full relative transition-colors ${headerSticky ? 'bg-blue-500' : 'bg-neutral-300'}`}>
                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${headerSticky ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                );
            }

            // 4. Popup Engine (Phase 19)
            if (activeBlockType === 'popup') {
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        {/* Trigger & Frequency */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-500 font-medium">Trigger & Timer</span>
                            <div className="flex gap-2">
                                <div className="flex-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex flex-wrap gap-0.5">
                                    {(['exit', 'timer', 'scroll', 'manual_teaser'] as const).map(t => (
                                        <button key={t} onClick={() => setPopupTrigger(t)} className={`flex-1 py-1 px-1 text-[10px] font-medium rounded whitespace-nowrap ${popupTrigger === t ? 'bg-white shadow-sm' : 'text-neutral-400'}`}>{t.replace('_', ' ').toUpperCase()}</button>
                                    ))}
                                </div>
                                {popupTrigger === 'timer' && (
                                    <div className="w-16"><UniversalSlider value={popupDelay} min={0} max={60} onChange={setPopupDelay} /></div>
                                )}
                            </div>
                        </div>

                        {/* Teaser Settings */}
                        {popupTrigger === 'manual_teaser' && (
                            <div className="flex flex-col gap-2 p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-neutral-500 font-medium">Teaser Label</span>
                                    <input
                                        type="text"
                                        value={teaserText}
                                        onChange={(e) => setTeaserText(e.target.value)}
                                        className="text-xs p-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Chat with us"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-neutral-500 font-medium">Teaser Position</span>
                                    <div className="flex p-0.5 bg-neutral-200 dark:bg-neutral-800 rounded">
                                        {(['bottom_left', 'bottom_right'] as const).map(p => (
                                            <button key={p} onClick={() => setTeaserPos(p)} className={`flex-1 py-1 rounded text-[10px] font-medium ${teaserPos === p ? 'bg-white shadow-sm' : 'text-neutral-500'}`}>{p.replace('_', ' ').toUpperCase()}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Position */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-500 font-medium">Position</span>
                            <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                {(['center', 'bottom_right', 'slide_in_left'] as const).map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setPopupPos(opt)}
                                        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${popupPos === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500'}`}
                                    >
                                        {opt.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Overlay Opacity */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Overlay Opacity</span><span>{popupOpacity}%</span></div>
                            <UniversalSlider value={popupOpacity} min={0} max={100} onChange={setPopupOpacity} />
                        </div>

                        {/* Form Data */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">Collect UTMs</span>
                                <button onClick={() => setFormUtms(!formUtms)} className={`w-8 h-4 rounded-full relative transition-colors ${formUtms ? 'bg-green-500' : 'bg-neutral-300'}`}>
                                    <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${formUtms ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">Destination</span>
                                <select
                                    value={formDest}
                                    onChange={(e) => setFormDest(e.target.value)}
                                    className="text-xs bg-neutral-100 dark:bg-neutral-800 rounded p-1 border-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="email">Email</option>
                                    <option value="webhook">Webhook</option>
                                    <option value="crm_id">CRM ID</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            }

            // 5. Media Block Layout (Default)
            if (activeLayoutTool === 'density') {
                const currentCols = isMobileView ? colsMobile : colsDesktop;
                const setCols = isMobileView ? setColsMobile : setColsDesktop;
                const currentItems = isMobileView ? itemsMobile : itemsDesktop;
                const setItems = isMobileView ? setItemsMobile : setItemsDesktop;

                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Columns</span><span>{currentCols}</span></div>
                            <UniversalSlider value={currentCols} min={1} max={12} step={1} onChange={setCols} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Item Count</span><span>{currentItems}</span></div>
                            <UniversalSlider value={currentItems} min={1} max={50} step={1} onChange={setItems} />
                        </div>
                    </div>
                );
            }
            if (activeLayoutTool === 'spacing') {
                const currentGapX = isMobileView ? gapXMobile : gapXDesktop;
                const setGapX = isMobileView ? setGapXMobile : setGapXDesktop;
                // For simplicity, GapY is linked or just handled as X for now in this demo panel, 
                // but let's show both if we want precision. Or just one 'Gap'.
                // ConnectedBlock has separate states but let's just control Gap X for now as "Gap".

                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Grid Gap</span><span>{currentGapX}px</span></div>
                            <UniversalSlider value={currentGapX} min={0} max={64} step={4} onChange={setGapX} />
                        </div>
                    </div>
                );
            }
            if (activeLayoutTool === 'geometry') {
                const currentRadius = isMobileView ? radiusMobile : radiusDesktop;
                const setRadius = isMobileView ? setRadiusMobile : setRadiusDesktop;
                const currentRatioIndex = ASPECT_RATIOS.indexOf(aspectRatioStr) !== -1 ? ASPECT_RATIOS.indexOf(aspectRatioStr) : 1;

                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Ratio</span><span>{aspectRatioStr}</span></div>
                            <UniversalSlider
                                value={currentRatioIndex}
                                min={0}
                                max={3}
                                step={1}
                                onChange={(idx) => {
                                    // @ts-ignore
                                    setAspectRatioStr(ASPECT_RATIOS[idx] || '16:9');
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Corner Radius</span><span>{currentRadius}px</span></div>
                            <UniversalSlider value={currentRadius} min={0} max={50} step={2} onChange={setRadius} />
                        </div>
                    </div>
                );
            }
        }

        // --- TYPOGRAPHY MODE ---
        else if (activeMode === 'typography') {
            if (activeBlockType === 'text') {
                const activeSize = activeTextTarget === 'headline'
                    ? (isMobileView ? headlineSizeMobile : headlineSizeDesktop)
                    : activeTextTarget === 'subhead'
                        ? (isMobileView ? subheadSizeMobile : subheadSizeDesktop)
                        : (isMobileView ? bodySizeMobile : bodySizeDesktop);

                const activeWeight = activeTextTarget === 'headline' ? headlineWeight
                    : activeTextTarget === 'subhead' ? subheadWeight : bodyWeight;

                const setSize = activeTextTarget === 'headline'
                    ? (isMobileView ? setHeadlineSizeMobile : setHeadlineSizeDesktop)
                    : activeTextTarget === 'subhead'
                        ? (isMobileView ? setSubheadSizeMobile : setSubheadSizeDesktop)
                        : (isMobileView ? setBodySizeMobile : setBodySizeDesktop);

                const setWeight = activeTextTarget === 'headline' ? setHeadlineWeight
                    : activeTextTarget === 'subhead' ? setSubheadWeight : setBodyWeight;

                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            {(['headline', 'subhead', 'body'] as const).map(target => (
                                <button
                                    key={target}
                                    onClick={() => setActiveTextTarget(target)}
                                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all ${activeTextTarget === target
                                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                                        : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                        }`}
                                >
                                    {target.charAt(0).toUpperCase() + target.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Size</span><span>{activeSize}px</span></div>
                            <UniversalSlider value={activeSize} min={10} max={128} onChange={setSize} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Weight</span><span>{activeWeight}</span></div>
                            <UniversalSlider value={activeWeight} min={100} max={1000} onChange={setWeight} />
                        </div>
                    </div>
                );
            }

            if (activeTypoTool === 'identity') {
                const families = ['Sans (Flex)', 'Serif', 'Slab', 'Mono'];
                const currentFamily = families[fontFamily] || 'Sans';
                const casualLabel = axisCasual < 0.2 ? 'Formal' : axisCasual > 0.8 ? 'Casual' : 'Neutral';

                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Family</span><span>{currentFamily}</span></div>
                            <UniversalSlider value={fontFamily} min={0} max={3} step={1} onChange={setFontFamily} />
                        </div>
                        <div className={`flex flex-col gap-1 transition-opacity duration-300 ${fontFamily === 0 ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium">
                                <span>Vibe {fontFamily !== 0 && '(Sans Only)'}</span>
                                <span>{casualLabel}</span>
                            </div>
                            <UniversalSlider value={axisCasual} min={0} max={1} step={0.01} onChange={setAxisCasual} />
                        </div>
                    </div>
                );
            }

            if (activeTypoTool === 'body') {
                const safeWeight = axisWeight === -1 ? 400 : axisWeight;
                const safeWidth = axisWidth === -1 ? 100 : axisWidth;
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Weight</span><span>{axisWeight === -1 ? 'Auto' : axisWeight}</span></div>
                            <UniversalSlider value={safeWeight} min={100} max={1000} onChange={setAxisWeight} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Width</span><span>{axisWidth === -1 ? 'Auto' : axisWidth}</span></div>
                            <UniversalSlider value={safeWidth} min={25} max={151} onChange={setAxisWidth} />
                        </div>
                    </div>
                );
            }


            if (activeTypoTool === 'scale') { // Preset & Size
                const currentPresetName = ROBOTO_PRESETS[presetIndex]?.name || 'Unknown';
                const currentFontSize = isMobileView ? fontSizeMobile : fontSizeDesktop;
                const setFontSize = isMobileView ? setFontSizeMobile : setFontSizeDesktop;

                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Preset</span><span>{currentPresetName}</span></div>
                            <UniversalSlider value={presetIndex} min={0} max={ROBOTO_PRESETS.length - 1} step={1} onChange={setPresetIndex} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>{isMobileView ? 'Mobile Size' : 'Desktop Size'}</span><span>{currentFontSize}px</span></div>
                            <UniversalSlider value={currentFontSize} min={10} max={64} onChange={setFontSize} />
                        </div>
                    </div>
                );
            }
            if (activeTypoTool === 'type_style') { // Slant & Grade
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Slant</span><span>{axisSlant}°</span></div>
                            <UniversalSlider value={axisSlant} min={-10} max={0} step={1} onChange={setAxisSlant} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Grade</span><span>{axisGrade}</span></div>
                            <UniversalSlider value={axisGrade} min={-200} max={150} step={1} onChange={setAxisGrade} />
                        </div>
                    </div>
                );
            }
        }

        // --- STYLE MODE ---
        else if (activeMode === 'style') {
            // 1. CTA Style
            if (activeBlockType === 'cta') {
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        {/* Variant */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium">
                                <span>Variant</span>
                            </div>
                            <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                {(['solid', 'outline', 'ghost'] as const).map(variant => (
                                    <button
                                        key={variant}
                                        onClick={() => setCtaVariant(variant)}
                                        className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all ${ctaVariant === variant
                                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                                            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                            }`}
                                    >
                                        {variant.charAt(0).toUpperCase() + variant.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium">
                                <span>Size</span>
                            </div>
                            <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                {(['small', 'medium', 'large'] as const).map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setCtaSize(size)}
                                        className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all ${ctaSize === size
                                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                                            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                            }`}
                                    >
                                        {size.charAt(0).toUpperCase() + size.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color (Funk) */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-semibold text-neutral-400 pl-1">Accent Color</span>
                            <ColorRibbon value={styleAccentColor} onChange={setStyleAccentColor} />
                        </div>
                    </div>
                );
            }

            if (activeStyleTool === 'palette') {
                return (
                    <div className="flex flex-col gap-3 p-1 animate-fadeIn">
                        <div className="flex w-full items-center gap-2">
                            {/* Target Switcher */}
                            <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full w-fit">
                                {(['bg', 'text', 'funk'] as const).map(target => (
                                    <button
                                        key={target}
                                        onClick={() => setColorTarget(target)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${colorTarget === target
                                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                                            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                            }`}
                                    >
                                        {target === 'bg' ? 'Background' : target === 'text' ? 'Text' : 'Funk'}
                                    </button>
                                ))}
                            </div>
                            {/* Eyedropper (Hybrid) */}
                            <button
                                onClick={() => {
                                    // @ts-ignore
                                    if (window.EyeDropper) {
                                        try {
                                            // @ts-ignore
                                            const eyeDropper = new window.EyeDropper();
                                            eyeDropper.open().then((result: { sRGBHex: string }) => {
                                                if (colorTarget === 'bg') setStyleBgColor(result.sRGBHex);
                                                else if (colorTarget === 'text') setStyleTextColor(result.sRGBHex);
                                                else setStyleAccentColor(result.sRGBHex);
                                            }).catch((e: any) => console.log('Eyedropper canceled'));
                                        } catch (e) {
                                            console.error('Eyedropper failed', e);
                                        }
                                        return;
                                    }
                                    fallbackColorInputRef.current?.click();
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors ml-auto border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                                title="Pick Color from Screen"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                    <path d="m15 6 3 3" />
                                </svg>
                            </button>

                            {/* Hidden Fallback Input */}
                            <input
                                ref={fallbackColorInputRef}
                                type="color"
                                className="opacity-0 absolute top-0 left-0 w-0 h-0 pointer-events-none border-0 p-0 m-0"
                                onChange={(e) => {
                                    if (colorTarget === 'bg') setStyleBgColor(e.target.value);
                                    else if (colorTarget === 'text') setStyleTextColor(e.target.value);
                                    else setStyleAccentColor(e.target.value);
                                }}
                            />
                        </div>

                        {/* Single Dynamic Ribbon */}
                        <div className="flex flex-col gap-1">
                            <ColorRibbon
                                value={
                                    colorTarget === 'bg' ? styleBgColor :
                                        colorTarget === 'text' ? styleTextColor :
                                            styleAccentColor
                                }
                                onChange={
                                    colorTarget === 'bg' ? setStyleBgColor :
                                        colorTarget === 'text' ? setStyleTextColor :
                                            setStyleAccentColor
                                }
                            />
                        </div>
                    </div>
                );
            }
            if (activeStyleTool === 'effects') {
                // Slider X: Opacity, Slider Y: Blur
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Opacity</span><span>{styleOpacity}%</span></div>
                            <UniversalSlider value={styleOpacity} min={0} max={100} onChange={setStyleOpacity} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Blur</span><span>{styleBlur}px</span></div>
                            <UniversalSlider value={styleBlur} min={0} max={20} onChange={setStyleBlur} />
                        </div>
                    </div>
                );
            }
            if (activeStyleTool === 'borders') {
                // Hybrid
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn p-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-neutral-500 font-medium"><span>Border Width</span><span>{styleBorderWidth}px</span></div>
                            <UniversalSlider value={styleBorderWidth} min={0} max={10} onChange={setStyleBorderWidth} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-semibold text-neutral-400 pl-1">Border Color</span>
                            <ColorRibbon value={styleBorderColor} onChange={setStyleBorderColor} />
                        </div>
                    </div>
                );
            }
        }

        return null; // Fallback
    };

    return (
        <div className={`fixed bottom-[72px] left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 transition-all duration-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
            <div className="w-[360px] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
                {/* Header / Tabs */}
                <div className="flex items-center justify-between px-2 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                    <div className="flex gap-1 bg-neutral-100/50 dark:bg-neutral-800/50 p-1 rounded-xl">
                        {(['layout', 'typography', 'style'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setActiveMode(mode)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeMode === mode
                                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm ring-1 ring-black/5'
                                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                    }`}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sub-Tool Navigation (Media Only) */}
                {activeBlockType === 'media' && (
                    <div className="w-full border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                        {activeMode === 'layout' && (
                            <ToolCarousel items={layoutTools} activeId={activeLayoutTool} onSelect={setActiveLayoutTool} />
                        )}
                        {activeMode === 'typography' && (
                            <ToolCarousel items={typoTools} activeId={activeTypoTool} onSelect={setActiveTypoTool} />
                        )}
                        {activeMode === 'style' && (
                            <ToolCarousel items={styleTools} activeId={activeStyleTool} onSelect={setActiveStyleTool} />
                        )}
                    </div>
                )}

                {/* Tool Sliders Area */}
                <div className="p-3 min-h-[120px]">
                    {renderSliders()}
                </div>
            </div>
        </div>
    );
}


