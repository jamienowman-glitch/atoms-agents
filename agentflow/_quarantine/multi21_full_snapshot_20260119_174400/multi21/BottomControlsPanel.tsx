"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useToolControl } from '../../context/ToolControlContext';
import { ColorRibbon } from '../ui/ColorRibbon';
import { DualMagnifier, MagnetItem } from './DualMagnifier';
import { ContentPicker, ContentPickerItem } from './ui/ContentPicker';
import { MediaPicker, MediaItem } from './ui/MediaPicker';
import { SEED_FEEDS } from '../../lib/data/seed-feeds';

// --- Types & Interfaces ---
export type PanelState = 'collapsed' | 'compact' | 'full';

// Simplified Slider Component (Touch-Aware)
interface UniversalSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (v: number) => void;
}
const UniversalSlider: React.FC<UniversalSliderProps> = ({ value, min, max, step = 1, onChange }) => {
    const trackRef = useRef<HTMLDivElement>(null);

    const handleInteract = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent default touch actions (scrolling/selection)
        if ('touches' in e && e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();

        // Use pageX/clientX carefully. ClientX is consistent with getBoundingClientRect
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

        let percentage = (clientX - rect.left) / rect.width;
        percentage = Math.max(0, Math.min(1, percentage));

        const rawValue = min + percentage * (max - min);
        // Snap to step
        let stepped = Math.round(rawValue / step) * step;

        // Clamp result due to JS floating point
        stepped = Math.max(min, Math.min(max, stepped));

        onChange(stepped);
    };

    return (
        <div
            ref={trackRef}
            onClick={handleInteract}
            onTouchMove={handleInteract}
            onTouchStart={handleInteract}
            className="relative w-full h-8 flex items-center group cursor-pointer touch-none select-none"
        >
            {/* Track bg */}
            <div className="absolute w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflows-hidden">
                {/* Progress Fill (Optional polish) */}
                <div
                    className="h-full bg-neutral-400 dark:bg-neutral-600 rounded-full"
                    style={{ width: `${((value - min) / (max - min)) * 100}%` }}
                />
            </div>

            {/* Thumb */}
            <div
                className="absolute w-4 h-4 bg-black dark:bg-white rounded-full shadow-sm transform -translate-x-1/2 pointer-events-none transition-transform duration-75"
                style={{ left: `${((value - min) / (max - min)) * 100}%` }}
            />
        </div>
    );
};


// Constants
const ASPECT_RATIOS = ['16:9', '4:3', '1:1', '9:16'];
const COPY_LEVELS = ['h2', 'h3', 'h4', 'body'] as const;
const COPY_STYLES = ['jumbo', 'headline', 'subtitle', 'tagline', 'quote', 'body', 'caption'] as const;

// --- Main Component ---
interface BottomControlsPanelProps {
    settingsContent: React.ReactNode;
    activeBlockId: string | null;
    activeBlockType?: 'media' | 'text' | 'copy' | 'cta' | 'header' | 'row' | 'popup';
}

export function BottomControlsPanel({ settingsContent, activeBlockId, activeBlockType = 'media' }: BottomControlsPanelProps) {
    const { useToolState } = useToolControl();

    // 1. Visibility & State
    const [isVisible, setIsVisible] = useToolState<boolean>({ target: { surfaceId: 'multi21.shell', toolId: 'ui.show_tools' }, defaultValue: false });
    const [previewMode] = useToolState<'desktop' | 'mobile'>({ target: { surfaceId: 'multi21.designer', toolId: 'previewMode' }, defaultValue: 'desktop' });
    const isMobileView = previewMode === 'mobile';

    // We MUST match that entityId.
    const scope = useMemo(() => ({ surfaceId: 'multi21.designer', entityId: activeBlockId || 'none' }), [activeBlockId]);

    // 2. Control Mode State
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeMode, setActiveMode] = useState<'layout' | 'font' | 'type' | 'colour'>('layout');
    const [activeLayoutTool, setActiveLayoutTool] = useState<string>('density');

    // Content Mode State
    const [activeContentCat, setActiveContentCat] = useState<string>('youtube');
    const [activeStrategy, setActiveStrategy] = useState<string>('feed');

    const [activeFontTool, setActiveFontTool] = useState<string>('size'); // Was Typography, Default to Size
    const [activeTypeTool, setActiveTypeTool] = useState<string>('align'); // Was Set/Typeset
    const [activeColourTool, setActiveColourTool] = useState<string>('palette');
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        if (activeBlockType === 'copy') {
            if (activeLayoutTool !== 'copy') setActiveLayoutTool('copy');
            return;
        }
        if (activeBlockType === 'cta') {
            if (!activeLayoutTool.startsWith('cta_')) setActiveLayoutTool('cta_frame');
            return;
        }
        if (activeLayoutTool === 'copy' || activeLayoutTool.startsWith('cta_')) {
            setActiveLayoutTool('density');
        }
    }, [activeBlockType, activeLayoutTool]);

    // 3. Tool Hooks (Layout)
    // COLS
    const [colsDesktop, setColsDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.cols_desktop' }, defaultValue: 6 });
    const [colsMobile, setColsMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.cols_mobile' }, defaultValue: 2 });

    // GAP X (Split)
    const [gapXDesktop, setGapXDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_x_desktop' }, defaultValue: 16 });
    const [gapXMobile, setGapXMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_x_mobile' }, defaultValue: 16 });

    // GAP Y (Split)
    const [gapYDesktop, setGapYDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_y_desktop' }, defaultValue: 16 });
    const [gapYMobile, setGapYMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_y_mobile' }, defaultValue: 16 });

    // RADIUS (Split)
    const [radiusDesktop, setRadiusDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.tile_radius_desktop' }, defaultValue: 8 });
    const [radiusMobile, setRadiusMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.tile_radius_mobile' }, defaultValue: 8 });

    // Aspect Ratio (Shared)
    const [aspectRatioStr, setAspectRatioStr] = useToolState<string>({ target: { ...scope, toolId: 'grid.aspect_ratio' }, defaultValue: '1:1' });

    // Copy Atom Layout
    const [copyLevel, setCopyLevel] = useToolState<string>({ target: { ...scope, toolId: 'copy.level' }, defaultValue: 'body' });
    const [copyStyle, setCopyStyle] = useToolState<string>({ target: { ...scope, toolId: 'copy.style' }, defaultValue: 'body' });

    // CTA Atom Layout
    const [ctaWidth, setCtaWidth] = useToolState<number>({ target: { ...scope, toolId: 'cta.width' }, defaultValue: 180 });
    const [ctaHeight, setCtaHeight] = useToolState<number>({ target: { ...scope, toolId: 'cta.height' }, defaultValue: 48 });
    const [ctaScale, setCtaScale] = useToolState<number>({ target: { ...scope, toolId: 'cta.scale' }, defaultValue: 1 });
    const [ctaVariant, setCtaVariant] = useToolState<string>({ target: { ...scope, toolId: 'cta.variant' }, defaultValue: 'solid' });

    // Items Limit (Split)
    const [limitDesktop, setLimitDesktop] = useToolState<number>({ target: { ...scope, toolId: 'feed.query.limit_desktop' }, defaultValue: 12 });
    const [limitMobile, setLimitMobile] = useToolState<number>({ target: { ...scope, toolId: 'feed.query.limit_mobile' }, defaultValue: 6 });


    // 4. Tool Hooks (Typography)
    const [fontFamily, setFontFamily] = useToolState<number>({ target: { ...scope, toolId: 'typo.family' }, defaultValue: 0 }); // 0=Sans
    const [axisWeight, setAxisWeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.weight' }, defaultValue: 400 });
    const [axisWidth, setAxisWidth] = useToolState<number>({ target: { ...scope, toolId: 'typo.width' }, defaultValue: 100 });
    const [axisCasual, setAxisCasual] = useToolState<number>({ target: { ...scope, toolId: 'typo.casual' }, defaultValue: 0 });
    const [axisSlant, setAxisSlant] = useToolState<number>({ target: { ...scope, toolId: 'typo.slant' }, defaultValue: 0 });
    const [fontSizeDesktop, setFontSizeDesktop] = useToolState<number>({ target: { ...scope, toolId: 'typo.size_desktop' }, defaultValue: 16 });
    const [fontSizeMobile, setFontSizeMobile] = useToolState<number>({ target: { ...scope, toolId: 'typo.size_mobile' }, defaultValue: 16 });

    // 5. Tool Hooks (Style)
    const [bgColor, setBgColor] = useToolState<string>({ target: { ...scope, toolId: 'style.bg' }, defaultValue: 'transparent' });
    const [blockBgColor, setBlockBgColor] = useToolState<string>({ target: { ...scope, toolId: 'style.block_bg' }, defaultValue: 'transparent' });
    const [textColor, setTextColor] = useToolState<string>({ target: { ...scope, toolId: 'style.text' }, defaultValue: 'inherit' });
    const [borderColor, setBorderColor] = useToolState<string>({ target: { ...scope, toolId: 'style.border_color' }, defaultValue: 'transparent' });
    const [borderWidth, setBorderWidth] = useToolState<number>({ target: { ...scope, toolId: 'style.border_width' }, defaultValue: 0 });
    const [opacity, setOpacity] = useToolState<number>({ target: { ...scope, toolId: 'style.opacity' }, defaultValue: 100 });
    const [blur, setBlur] = useToolState<number>({ target: { ...scope, toolId: 'style.blur' }, defaultValue: 0 });
    const [textStrokeColor, setTextStrokeColor] = useToolState<string>({ target: { ...scope, toolId: 'style.text_stroke_color' }, defaultValue: 'transparent' });
    const [textStrokeWidth, setTextStrokeWidth] = useToolState<number>({ target: { ...scope, toolId: 'style.text_stroke_width' }, defaultValue: 0 });

    // 5b. Tool Hooks (Type Setting - Phase 16)
    const [textAlign, setTextAlign] = useToolState<string>({ target: { ...scope, toolId: 'typo.align' }, defaultValue: 'left' });
    const [lineHeight, setLineHeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.line_height' }, defaultValue: 1.5 });
    const [letterSpacing, setLetterSpacing] = useToolState<number>({ target: { ...scope, toolId: 'typo.tracking' }, defaultValue: 0 });
    const [wordSpacing, setWordSpacing] = useToolState<number>({ target: { ...scope, toolId: 'typo.word_spacing' }, defaultValue: 0 });
    // Vertical Type
    // Vertical Type
    const [verticalAlign, setVerticalAlign] = useToolState<string>({ target: { ...scope, toolId: 'typo.vert' }, defaultValue: 'top' });
    const [stackGap, setStackGap] = useToolState<number>({ target: { ...scope, toolId: 'typo.stack_gap' }, defaultValue: 16 });

    const [textTransform, setTextTransform] = useToolState<string>({ target: { ...scope, toolId: 'typo.case' }, defaultValue: 'none' });
    const [textDecoration, setTextDecoration] = useToolState<string>({ target: { ...scope, toolId: 'typo.decoration' }, defaultValue: 'none' });

    // 6. Content Wiring (Phase 14)
    const [tileVariant, setTileVariant] = useToolState<'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube' | 'events' | 'blogs'>({
        target: { ...scope, toolId: 'tile.variant' },
        defaultValue: 'generic'
    });
    // Tile Elements (Booleans)
    const [tileShowTitle, setTileShowTitle] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_title' }, defaultValue: true });
    const [tileShowMeta, setTileShowMeta] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_meta' }, defaultValue: true });
    const [tileShowBadge, setTileShowBadge] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_badge' }, defaultValue: true });
    const [tileShowCtaLabel, setTileShowCtaLabel] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_cta_label' }, defaultValue: true });
    const [tileShowCtaArrow, setTileShowCtaArrow] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_cta_arrow' }, defaultValue: true });
    const [feedSourceIndex, setFeedSourceIndex] = useToolState<number>({
        target: { ...scope, toolId: 'content.feed_source_index' },
        defaultValue: 0
    });

    // Sync Strategy & Canvas State
    useEffect(() => {
        // 1. Reset UI Strategy
        if (activeContentCat === 'youtube') setActiveStrategy('playlist');
        else if (activeContentCat === 'product') setActiveStrategy('collection');
        else if (activeContentCat === 'kpi') setActiveStrategy('6-core');
        else if (activeContentCat === 'events') setActiveStrategy('sched');
        else if (activeContentCat === 'blogs') setActiveStrategy('blog');
        else setActiveStrategy('album');

        // 2. Update Canvas (Tool State)
        if (activeContentCat === 'youtube') {
            setTileVariant('youtube');
            setFeedSourceIndex(4);
            setColsDesktop(3);
            setLimitDesktop(6);
            setAspectRatioStr('16:9');
        } else if (activeContentCat === 'product') {
            setTileVariant('product');
            setFeedSourceIndex(2);
            setColsDesktop(4);
            setLimitDesktop(8);
            setAspectRatioStr('9:16');
        } else if (activeContentCat === 'kpi') {
            setTileVariant('kpi');
            setFeedSourceIndex(1);
            setColsDesktop(6);
            setLimitDesktop(12);
            setAspectRatioStr('16:9');
        } else if (activeContentCat === 'events') {
            setTileVariant('events');
            setFeedSourceIndex(5);
            setColsDesktop(3);
            setLimitDesktop(6);
            setAspectRatioStr('9:16');
        } else if (activeContentCat === 'blogs') {
            setTileVariant('blogs');
            setFeedSourceIndex(3);
            setColsDesktop(3);
            setLimitDesktop(6);
            setAspectRatioStr('9:16');
        } else {
            // generic
            setTileVariant('generic');
            setFeedSourceIndex(3);
            setColsDesktop(4);
            setLimitDesktop(8);
            setAspectRatioStr('16:9');
        }
    }, [activeContentCat, setTileVariant, setFeedSourceIndex, setColsDesktop, setLimitDesktop, setAspectRatioStr]);

    // UI Local State
    const [colorTarget, setColorTarget] = useState<'block' | 'bg' | 'text'>('block');
    const [elementMode, setElementMode] = useState<'fill' | 'stroke'>('fill');

    // --- Configuration Maps ---
    const designModes: MagnetItem[] = [
        { id: 'layout', label: 'Layout', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
        { id: 'font', label: 'Font', icon: <span className="text-[10px] font-bold">Aa</span> },
        { id: 'type', label: 'Type', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="18" y2="18" /></svg> },
        { id: 'colour', label: 'Colour', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg> },
    ];

    // Naming Proposal: Frame, Type, Style
    const defaultLayoutTools: MagnetItem[] = [
        { id: 'density', label: 'Grid', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
        { id: 'spacing', label: 'Space', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="10" y2="21" /><line x1="16" y1="3" x2="16" y2="21" /></svg> },
        { id: 'geometry', label: 'Shape', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /></svg> },
    ];

    const copyLayoutTools: MagnetItem[] = [
        { id: 'copy', label: 'Copy', icon: <span className="text-[10px] font-bold">H</span> },
    ];

    const ctaLayoutTools: MagnetItem[] = [
        { id: 'cta_frame', label: 'Frame', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="4" y="7" width="16" height="10" rx="2" /><path d="M4 12h16" /></svg> },
        { id: 'cta_scale', label: 'Scale', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h6v6M20 20h-6v-6" /><path d="M20 4l-6 6" /><path d="M4 20l6-6" /></svg> },
        { id: 'cta_style', label: 'Style', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M7 12h10" /></svg> },
    ];

    const fontTools: MagnetItem[] = [
        { id: 'size', label: 'Size', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg> },
        { id: 'identity', label: 'Font', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 7V4h16v3M9 20h6M12 4v16" /></svg> },
        { id: 'tune', label: 'Tune', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /></svg> },
    ];

    const layoutTools = activeBlockType === 'copy'
        ? copyLayoutTools
        : activeBlockType === 'cta'
            ? ctaLayoutTools
            : defaultLayoutTools;

    const typeTools: MagnetItem[] = [
        { id: 'align', label: 'Align', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" /></svg> },
        { id: 'space', label: 'Spacing', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="13 17 13 21 16 21 16 17" /><polyline points="13 7 13 3 16 3 16 7" /><line x1="9" y1="21" x2="9" y2="3" /></svg> },
        { id: 'vert', label: 'Vertical', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3v18" /><path d="M8 6h8" /><path d="M8 18h8" /></svg> },
    ];

    const colourTools: MagnetItem[] = [
        { id: 'palette', label: 'Color', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg> },
        { id: 'effects', label: 'FX', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
    ];

    // --- Content Source Config ---
    const contentCategories: MagnetItem[] = [
        { id: 'youtube', label: 'YouTube', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg> },
        { id: 'product', label: 'Product', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> },
        { id: 'kpi', label: 'KPI', icon: <span className="text-[10px] font-black tracking-tighter">KPI</span> },
        { id: 'image', label: 'Image', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> },
        { id: 'video', label: 'Video', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg> },
        { id: 'events', label: 'Events', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
        { id: 'blogs', label: 'Blogs', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg> },
    ];

    // Strategy Maps
    const getStrategyTools = (category: string): MagnetItem[] => {
        // Text Icon Helper
        const mkText = (id: string, label: string, textOverride?: string) => ({
            id,
            label,
            icon: <span className="text-[8px] font-bold tracking-tight uppercase leading-none">{textOverride || label}</span>
        });

        switch (category) {
            case 'youtube': return [mkText('playlist', 'Playlist', 'P-LIST'), mkText('feed', 'Feed', 'FEED'), mkText('video', 'Video', 'VIDEO')];
            case 'product': return [mkText('collection', 'Collection', 'COLL'), mkText('feed', 'Feed', 'FEED'), mkText('product', 'Product', 'PROD')];
            case 'kpi': return [mkText('6-core', '6-Core', '6-CORE'), mkText('feed', 'Feed', 'FEED'), mkText('focused', 'Focused', 'FOCUS')];
            case 'image': return [mkText('album', 'Album', 'ALBUM'), mkText('feed', 'Feed', 'FEED'), mkText('image', 'Image', 'IMG')];
            case 'video': return [mkText('album', 'Album', 'ALBUM'), mkText('feed', 'Feed', 'FEED'), mkText('video', 'Video', 'VID')];
            case 'events': return [
                mkText('sched', 'Schedule', 'SCHED'),
                mkText('feed', 'Feed', 'FEED'),
                mkText('next', 'Next', 'NEXT')
            ];
            case 'blogs': return [mkText('blog', 'Blog', 'BLOG'), mkText('feed', 'Feed', 'FEED'), mkText('post', 'Post', 'POST')];
            default: return [];
        }
    };

    // --- Render Logic: Sliders ---
    // --- Render Logic: Sliders ---
    const renderSliders = () => {
        // Shared Setters Check
        const setCols = isMobileView ? setColsMobile : setColsDesktop;
        const currentCols = isMobileView ? colsMobile : colsDesktop;
        const setLimit = isMobileView ? setLimitMobile : setLimitDesktop;
        const currentLimit = isMobileView ? limitMobile : limitDesktop;

        const setGapX = isMobileView ? setGapXMobile : setGapXDesktop;
        const currentGapX = isMobileView ? gapXMobile : gapXDesktop;
        const setGapY = isMobileView ? setGapYMobile : setGapYDesktop;
        const currentGapY = isMobileView ? gapYMobile : gapYDesktop;

        const setRadius = isMobileView ? setRadiusMobile : setRadiusDesktop;
        const currentRadius = isMobileView ? radiusMobile : radiusDesktop;

        const setFontSize = isMobileView ? setFontSizeMobile : setFontSizeDesktop;
        const currentFontSize = isMobileView ? fontSizeMobile : fontSizeDesktop;

        // Helper: Button Group
        const renderBtnGroup = (options: { label: string, value: string }[], current: string, onChange: (v: string) => void) => (
            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 gap-1">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onPointerDown={(e) => {
                            e.preventDefault(); // Prevent focus stealing and ghost clicks
                            onChange(opt.value);
                        }}
                        className={`
                        flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all
                        flex items-center justify-center gap-1.5
                        ${current === opt.value
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                                : 'bg-transparent text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            }
                    `}
                    >        {opt.label}
                    </button>
                ))}
            </div>
        );

        // LAYOUT MODE
        if (activeMode === 'layout') {
            if (activeBlockType === 'cta' && activeLayoutTool === 'cta_frame') {
                return (
                    <div className="flex flex-col gap-1 animate-fadeIn">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Width (X)</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{ctaWidth}px</span>
                            </div>
                            <UniversalSlider value={ctaWidth} min={80} max={520} step={4} onChange={setCtaWidth} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Height (Y)</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{ctaHeight}px</span>
                            </div>
                            <UniversalSlider value={ctaHeight} min={24} max={120} step={2} onChange={setCtaHeight} />
                        </div>
                    </div>
                );
            }
            if (activeBlockType === 'cta' && activeLayoutTool === 'cta_scale') {
                return (
                    <div className="flex flex-col gap-1 animate-fadeIn">
                        <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                            <span>Scale</span>
                            <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{ctaScale.toFixed(2)}x</span>
                        </div>
                        <UniversalSlider value={ctaScale} min={0.5} max={2} step={0.05} onChange={setCtaScale} />
                    </div>
                );
            }
            if (activeBlockType === 'cta' && activeLayoutTool === 'cta_style') {
                const variants = [
                    { label: 'Primary', value: 'solid' },
                    { label: 'Secondary', value: 'outline' },
                    { label: 'Text', value: 'ghost' },
                    { label: 'Atomic', value: 'atomic' },
                ];
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn">
                        {renderBtnGroup(variants, ctaVariant, setCtaVariant)}
                    </div>
                );
            }
            if (activeBlockType === 'copy' && activeLayoutTool === 'copy') {
                const levelIndex = Math.max(0, COPY_LEVELS.indexOf(copyLevel as any));
                const styleIndex = Math.max(0, COPY_STYLES.indexOf(copyStyle as any));
                return (
                    <div className="flex flex-col gap-1 animate-fadeIn">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Level</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                                    {COPY_LEVELS[levelIndex]?.toUpperCase() || 'BODY'}
                                </span>
                            </div>
                            <UniversalSlider
                                value={levelIndex}
                                min={0}
                                max={COPY_LEVELS.length - 1}
                                step={1}
                                onChange={(idx) => setCopyLevel(COPY_LEVELS[idx] || 'body')}
                            />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Style</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                                    {(COPY_STYLES[styleIndex] || 'body').toUpperCase()}
                                </span>
                            </div>
                            <UniversalSlider
                                value={styleIndex}
                                min={0}
                                max={COPY_STYLES.length - 1}
                                step={1}
                                onChange={(idx) => setCopyStyle(COPY_STYLES[idx] || 'body')}
                            />
                        </div>
                    </div>
                );
            }
            if (activeLayoutTool === 'density') {
                return (
                    <div className="flex flex-col gap-1 animate-fadeIn">
                        {/* Top Slider: Mobile Cols */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>{isMobileView ? 'Mobile Cols' : 'Desktop Cols'}</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{currentCols}</span>
                            </div>
                            <UniversalSlider
                                value={currentCols}
                                min={1}
                                max={12}
                                step={1}
                                onChange={setCols}
                            />
                        </div>
                        {/* Bot Slider: Items Limit */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Total Items</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{currentLimit}</span>
                            </div>
                            <UniversalSlider value={currentLimit} min={1} max={50} onChange={setLimit} />
                        </div>
                    </div>
                );
            }
            if (activeLayoutTool === 'spacing') {
                return (
                    <div className="flex flex-col gap-1 animate-fadeIn">
                        {/* Top: Gap X */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Horizontal Gap (X)</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{currentGapX}px</span>
                            </div>
                            <UniversalSlider value={currentGapX} min={0} max={64} step={4} onChange={setGapX} />
                        </div>
                        {/* Bot: Gap Y */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Vertical Gap (Y)</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{currentGapY}px</span>
                            </div>
                            <UniversalSlider value={currentGapY} min={0} max={64} step={4} onChange={setGapY} />
                        </div>
                    </div>
                );
            }
            if (activeLayoutTool === 'geometry') {
                const currentRatioIndex = ASPECT_RATIOS.indexOf(aspectRatioStr) !== -1 ? ASPECT_RATIOS.indexOf(aspectRatioStr) : 1;
                return (
                    <div className="flex flex-col gap-1 animate-fadeIn">
                        {/* Top: Aspect Ratio */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Aspect Ratio</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{aspectRatioStr}</span>
                            </div>
                            <UniversalSlider
                                value={currentRatioIndex}
                                min={0}
                                max={3}
                                step={1}
                                onChange={(idx) => setAspectRatioStr(ASPECT_RATIOS[idx] || '1:1')}
                            />
                        </div>
                        {/* Bot: Radius */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Corner Radius</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{currentRadius}px</span>
                            </div>
                            <UniversalSlider value={currentRadius} min={0} max={50} onChange={setRadius} />
                        </div>
                    </div>
                );
            }
        }

        // FONT MODE
        if (activeMode === 'font') {
            if (activeFontTool === 'size') {
                return (
                    <div className="flex flex-col gap-1 animate-fadeIn">
                        <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                            <span>Base Size</span>
                            <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{currentFontSize}px</span>
                        </div>
                        <UniversalSlider value={currentFontSize} min={10} max={64} onChange={setFontSize} />
                    </div>
                );
            }
            if (activeFontTool === 'identity') {
                const families = [
                    { label: 'Sans', value: '0' },
                    { label: 'Serif', value: '1' },
                    { label: 'Slab', value: '2' },
                    { label: 'Mono', value: '3' }
                ];
                return (
                    <div className="flex flex-col gap-3 animate-fadeIn">
                        {/* Font Family Button Group */}
                        {renderBtnGroup(families, fontFamily.toString(), (v) => setFontFamily(parseInt(v)))}
                    </div>
                );
            }
            if (activeFontTool === 'tune') {
                return (
                    <div className="flex flex-col gap-1 animate-fadeIn">
                        {/* Weight */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Weight</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{axisWeight}</span>
                            </div>
                            <UniversalSlider value={axisWeight} min={100} max={1000} onChange={setAxisWeight} />
                        </div>
                        {/* Width */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Width</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{axisWidth}</span>
                            </div>
                            <UniversalSlider value={axisWidth} min={50} max={150} onChange={setAxisWidth} />
                        </div>
                        {/* Slant */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Slant</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{axisSlant}deg</span>
                            </div>
                            <UniversalSlider value={axisSlant} min={-10} max={0} step={1} onChange={setAxisSlant} />
                        </div>
                    </div>
                );
            }
        }

        // TYPE MODE
        if (activeMode === 'type') {
            if (activeTypeTool === 'align') {
                return (
                    <div className="flex flex-col gap-2 animate-fadeIn p-2">
                        {renderBtnGroup([
                            { label: 'Left', value: 'left' },
                            { label: 'Center', value: 'center' },
                            { label: 'Right', value: 'right' },
                            { label: 'Justify', value: 'justify' }
                        ], textAlign, setTextAlign)}
                    </div>
                );
            }
            if (activeTypeTool === 'space') {
                return (
                    <div className="flex flex-col gap-1 animate-fadeIn">
                        {/* Tracking */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Tracking</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{letterSpacing}</span>
                            </div>
                            <UniversalSlider value={letterSpacing} min={-0.1} max={0.5} step={0.01} onChange={setLetterSpacing} />
                        </div>
                        {/* Leading */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Leading</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{lineHeight}</span>
                            </div>
                            <UniversalSlider value={lineHeight} min={0.8} max={3.0} step={0.1} onChange={setLineHeight} />
                        </div>
                    </div>
                );
            }
            if (activeTypeTool === 'vert') {
                return (
                    <div className="flex flex-col gap-2 animate-fadeIn p-2">
                        {renderBtnGroup([
                            { label: 'Top', value: 'top' },
                            { label: 'Center', value: 'center' },
                            { label: 'Bottom', value: 'bottom' }
                        ], verticalAlign, setVerticalAlign)}
                    </div>
                );
            }
        }



        // COLOUR MODE
        if (activeMode === 'colour') {
            if (activeColourTool === 'palette') {
                // Resolve Active Color
                let activeColor = '';
                let setActiveColor: (c: string) => void = () => { };

                if (colorTarget === 'block') {
                    activeColor = blockBgColor;
                    setActiveColor = setBlockBgColor;
                } else if (colorTarget === 'text') {
                    if (elementMode === 'fill') {
                        activeColor = textColor;
                        setActiveColor = setTextColor;
                    } else {
                        activeColor = textStrokeColor;
                        setActiveColor = setTextStrokeColor;
                    }
                } else {
                    // Element (Background)
                    if (elementMode === 'fill') {
                        activeColor = bgColor;
                        setActiveColor = setBgColor;
                    } else {
                        activeColor = borderColor;
                        setActiveColor = setBorderColor;
                    }
                }

                return (
                    <div className="flex flex-col gap-2 animate-fadeIn">
                        {/* Unified Toolbar: Targets (Left) + Mode (Right) */}
                        <div className="flex items-center justify-between">
                            {/* Targets */}
                            <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-fit">
                                <button onClick={() => { setColorTarget('block'); setElementMode('fill'); }} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${colorTarget === 'block' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>Block</button>
                                <button onClick={() => setColorTarget('bg')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${colorTarget === 'bg' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>Background</button>
                                <button onClick={() => setColorTarget('text')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${colorTarget === 'text' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>Text</button>
                            </div>

                            {/* Mode (Fill/Outline) - Visible for Background & Text */}
                            {colorTarget !== 'block' && (
                                <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-700 ml-2">
                                    <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
                                        <button
                                            onClick={() => setElementMode('fill')}
                                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${elementMode === 'fill' ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                                        >
                                            Fill
                                        </button>
                                        <button
                                            onClick={() => setElementMode('stroke')}
                                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${elementMode === 'stroke' ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                                        >
                                            Outline
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Color Ribbon */}
                        <ColorRibbon
                            value={activeColor}
                            onChange={setActiveColor}
                        />

                        {/* Stroke Width Slider (Contextual) */}
                        {colorTarget !== 'block' && elementMode === 'stroke' && (
                            <div className="animate-fadeIn">
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-400 mb-1">
                                    <span>{colorTarget === 'bg' ? 'Border Width' : 'Stroke Width'}</span>
                                    <span>{colorTarget === 'bg' ? borderWidth : textStrokeWidth}px</span>
                                </div>
                                <UniversalSlider
                                    value={colorTarget === 'bg' ? borderWidth : textStrokeWidth}
                                    min={0}
                                    max={colorTarget === 'bg' ? 20 : 10} // Text stroke usually smaller
                                    step={colorTarget === 'bg' ? 1 : 0.5}
                                    onChange={colorTarget === 'bg' ? setBorderWidth : setTextStrokeWidth}
                                />
                            </div>
                        )}
                    </div>
                );
            }

            if (activeColourTool === 'effects') {
                return (
                    <div className="flex flex-col gap-2 animate-fadeIn">
                        {/* Opacity */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Opacity</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{opacity}%</span>
                            </div>
                            <UniversalSlider value={opacity} min={0} max={100} onChange={setOpacity} />
                        </div>
                        {/* Blur */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>Glass / Blur</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{blur}px</span>
                            </div>
                            <UniversalSlider value={blur} min={0} max={20} onChange={setBlur} />
                        </div>
                    </div>
                );
            }
        }

        // Default Empty State
        return <div className="text-xs text-neutral-400 p-4 text-center">Select a tool</div>;
    };

    // --- Visibility ---
    const visibilityClass = isVisible
        ? 'translate-y-0 opacity-100 pointer-events-auto'
        : 'translate-y-[100%] opacity-0 pointer-events-none';

    return (
        <div className={`fixed left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 rounded-2xl z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bottom-0 select-none ${visibilityClass}`}>

            <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'h-[60px]' : 'h-[260px]'}`}>
                {/* HEAD: Dual Magnifier + Settings Trigger */}
                <div className="flex items-center justify-center p-2 border-b border-neutral-100 dark:border-neutral-800 relative bg-neutral-50/50 dark:bg-neutral-900/50 shrink-0 h-[72px] rounded-t-2xl z-20">

                    {/* Settings Trigger (Far Left) - Toggles Content Mode */}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`absolute left-4 w-11 h-11 flex items-center justify-center rounded-full border transition-all touch-manipulation
                                ${showSettings
                                ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-md scale-105'
                                : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-black dark:hover:text-white'
                            }`}
                        style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.15.48.5.87.97 1.08H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
                    </button>

                    {/* Dual Magnifier */}
                    <DualMagnifier
                        // Mode Wheel (Left)
                        activeMode={showSettings ? activeContentCat : activeMode}
                        onModeSelect={(id) => showSettings ? setActiveContentCat(id) : setActiveMode(id as any)}

                        // Tool Wheel (Right)
                        activeTool={showSettings ? activeStrategy : (activeMode === 'layout' ? activeLayoutTool : activeMode === 'font' ? activeFontTool : activeMode === 'type' ? activeTypeTool : activeColourTool)}
                        onToolSelect={(id) => {
                            if (showSettings) {
                                setActiveStrategy(id);
                            } else {
                                if (activeMode === 'layout') setActiveLayoutTool(id);
                                else if (activeMode === 'font') setActiveFontTool(id);
                                else if (activeMode === 'type') setActiveTypeTool(id);
                                else setActiveColourTool(id);
                            }
                        }}

                        // Options
                        modeOptions={showSettings ? contentCategories : designModes}
                        toolOptions={showSettings ? getStrategyTools(activeContentCat) : (activeMode === 'layout' ? layoutTools : activeMode === 'font' ? fontTools : activeMode === 'type' ? typeTools : colourTools)}
                    />

                    {/* Collapse & Close Controls (Right) */}
                    <div className="absolute right-4 flex items-center gap-2">
                        {/* Close X */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-red-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* BODY: Sliders OR Settings */}
                <div className={`flex-1 overflow-y-auto px-4 pt-4 pb-[calc(80px+env(safe-area-inset-bottom))] transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="max-w-md mx-auto">
                        {showSettings ? (
                            <div className="flex flex-col gap-1 pt-0">
                                {/* Dynamic Picker Switch */}
                                {(() => {
                                    // 1. ATOMIC MEDIA (Image/Video) - Use MediaPicker
                                    if (['image', 'video'].includes(activeContentCat) && ['image', 'video', 'album'].includes(activeStrategy)) {
                                        // Mock Data Transform
                                        const mockItems: MediaItem[] = SEED_FEEDS.news.map(n => ({
                                            id: n.id,
                                            type: 'image',
                                            src: n.image,
                                            title: n.title
                                        }));
                                        // If video, mix in some video mocks
                                        if (activeContentCat === 'video') {
                                            const videoItems: MediaItem[] = SEED_FEEDS.youtube.map(v => ({
                                                id: v.id,
                                                type: 'video',
                                                src: v.image, // Use thumb as src for now
                                                title: v.title,
                                                duration: v.subtitle?.split('•')[0] // hacky parse
                                            }));
                                            mockItems.push(...videoItems);
                                        }

                                        return (
                                            <MediaPicker
                                                type={activeContentCat as 'image' | 'video'}
                                                items={mockItems}
                                                onSelect={(id) => console.log('Selected Media:', id)}
                                                onUpload={() => console.log('Trigger Upload')}
                                                onGenerate={() => console.log('Trigger AI Gen')}
                                            />
                                        );
                                    }

                                    // 2. HIGH LEVEL COLLECTIONS (Playlist, Feed, etc) - Use ContentPicker
                                    let mockPickerItems: ContentPickerItem[] = [];
                                    let label = `Select ${activeStrategy}`;

                                    // Simple Mock Mapping based on Category
                                    if (activeContentCat === 'youtube') {
                                        mockPickerItems = SEED_FEEDS.youtube.map(y => ({ id: y.id, title: y.title, subtitle: y.subtitle }));
                                    } else if (activeContentCat === 'product') {
                                        mockPickerItems = SEED_FEEDS.retail.map(r => ({ id: r.id, title: r.title, subtitle: r.price, badge: r.badge }));
                                    } else if (activeContentCat === 'kpi') {
                                        mockPickerItems = SEED_FEEDS.kpi.map(k => ({ id: k.id, title: k.title, subtitle: k.subtitle, badge: k.badge }));
                                    } else if (activeContentCat === 'events') {
                                        // Use mock events
                                        mockPickerItems = SEED_FEEDS.events.map(e => ({ id: e.id, title: e.title, subtitle: e.subtitle, badge: e.badge }));
                                    } else {
                                        // Generic Fallback
                                        mockPickerItems = SEED_FEEDS.news.map(n => ({ id: n.id, title: n.title, subtitle: n.subtitle }));
                                    }

                                    return (
                                        <ContentPicker
                                            type={activeStrategy}
                                            label={label}
                                            items={mockPickerItems}
                                            selectedValue={mockPickerItems[0]?.id} // Select 1st by default
                                            onSelect={(id) => {
                                                // WIRING: Update Block State
                                                if (activeContentCat === 'youtube') {
                                                    setTileVariant('youtube');
                                                    setFeedSourceIndex(4); // 4 = youtube in Multi21 logic
                                                } else if (activeContentCat === 'product') {
                                                    setTileVariant('product');
                                                    setFeedSourceIndex(2); // 2 = retail
                                                } else if (activeContentCat === 'kpi') {
                                                    setTileVariant('kpi');
                                                    setFeedSourceIndex(1); // 1 = kpi
                                                } else if (activeContentCat === 'events') {
                                                    setTileVariant('events');
                                                    setFeedSourceIndex(5); // 5 = events
                                                } else {
                                                    setTileVariant('generic');
                                                    setFeedSourceIndex(3); // 3 = news/generic
                                                }
                                                console.log('Picked Content Source:', id);
                                            }}
                                            onCreate={() => console.log('Create New:', activeStrategy)}
                                        />
                                    );
                                })()}

                                {/* CONTEXTUAL SETTINGS */}
                                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-3">
                                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                        {activeContentCat} Elements
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        {/* Helper for Checkboxes */}
                                        {[
                                            { label: 'Title', val: tileShowTitle, set: setTileShowTitle },
                                            {
                                                label: activeContentCat === 'youtube' ? 'Views & Date' :
                                                    activeContentCat === 'product' ? 'Price' :
                                                        activeContentCat === 'events' ? 'Date & Loc' :
                                                            'Meta / Subtitle',
                                                val: tileShowMeta, set: setTileShowMeta
                                            },
                                            {
                                                label: activeContentCat === 'youtube' ? 'Duration' :
                                                    activeContentCat === 'product' ? 'Status Tag' :
                                                        'Badge',
                                                val: tileShowBadge, set: setTileShowBadge
                                            },
                                            { label: 'Action (CTA)', val: tileShowCtaLabel, set: setTileShowCtaLabel },
                                            { label: 'Arrow', val: tileShowCtaArrow, set: setTileShowCtaArrow },
                                        ].map((opt, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 cursor-pointer group select-none active:opacity-50"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    // Force toggle
                                                    opt.set(!opt.val);
                                                    console.log(`Toggling ${opt.label}: ${!opt.val}`);
                                                }}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${opt.val
                                                    ? 'bg-black border-black dark:bg-white dark:border-white'
                                                    : 'bg-transparent border-neutral-300 dark:border-neutral-600 group-hover:border-neutral-400'
                                                    }`}>
                                                    {opt.val && <svg className="w-3 h-3 text-white dark:text-black pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>}
                                                </div>
                                                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white">
                                                    {opt.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : renderSliders()}
                    </div>
                </div>
            </div >
        </div >
    );
}
