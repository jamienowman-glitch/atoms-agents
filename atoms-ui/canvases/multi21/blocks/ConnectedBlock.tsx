import React, { useMemo } from 'react';
import { useToolControl } from '../../../../context/ToolControlContext';

// Import Decomposed Parts
import { Multi21_Grid } from './molecules/Multi21_Grid';
import { Multi21_Text } from './atoms/Multi21_Text';
import { Multi21_Copy } from './atoms/Multi21_Copy';
import { Multi21_CTA } from './atoms/Multi21_CTA';
import { Multi21_Header } from './atoms/Multi21_Header';
import { Multi21_Row } from './modifiers/Multi21_Row'; // Assuming this is lifted or we stub it for now

import { useFeedMapper } from '../logic/useFeedMapper';
import { Multi21Item } from '../types';

// Mock Data Items (passed to FeedMapper as initial)
const MOCK_ITEMS: Multi21Item[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `item-${i}`,
    title: `Item ${i + 1}`,
    meta: `Meta ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/${i}/400/300`,
    variant: 'generic'
}));

interface ConnectedBlockProps {
    id: string;
    type: 'media' | 'text' | 'copy' | 'cta' | 'row' | 'header';
    isSelected: boolean;
    onClick: () => void;
    previewMode: 'desktop' | 'mobile';

    // Recursive Props
    data?: any;
    setActiveBlockId?: (id: string) => void;
    onDeleteBlock?: (id: string) => void;
    activeBlockId?: string;
}

export const ConnectedBlock: React.FC<ConnectedBlockProps> = ({
    id,
    type,
    isSelected,
    onClick,
    previewMode,
    data,
    setActiveBlockId,
    onDeleteBlock,
    activeBlockId
}) => {
    const { useToolState } = useToolControl();
    const scope = { surfaceId: 'multi21.designer', entityId: id };
    const isMobile = previewMode === 'mobile';

    // --- Media Block Logic (Grid Only) ---
    const [colsDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.cols_desktop' }, defaultValue: 6 });
    const [colsMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.cols_mobile' }, defaultValue: 2 });
    const [gapXDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_x_desktop' }, defaultValue: 16 });
    const [gapXMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_x_mobile' }, defaultValue: 16 });
    const [gapYDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_y_desktop' }, defaultValue: 16 });
    const [gapYMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_y_mobile' }, defaultValue: 16 });
    const [radiusDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.tile_radius_desktop' }, defaultValue: 8 });
    const [radiusMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.tile_radius_mobile' }, defaultValue: 8 });
    const [aspectRatio] = useToolState<'1:1' | '16:9' | '9:16' | '4:3'>({ target: { ...scope, toolId: 'grid.aspect_ratio' }, defaultValue: '16:9' });

    // Toggles
    const [showTitle] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_title' }, defaultValue: true });
    const [showMeta] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_meta' }, defaultValue: true });
    const [showBadge] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_badge' }, defaultValue: true });
    const [showCtaLabel] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_cta_label' }, defaultValue: true });
    const [showCtaArrow] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_cta_arrow' }, defaultValue: true });

    // Styles
    const [styleBgColor] = useToolState<string>({ target: { ...scope, toolId: 'style.bg' }, defaultValue: 'transparent' });
    const [styleTextColor] = useToolState<string>({ target: { ...scope, toolId: 'style.text' }, defaultValue: 'inherit' });
    const [styleAccentColor] = useToolState<string>({ target: { ...scope, toolId: 'style.accent' }, defaultValue: '#3b82f6' });
    const [styleBorderColor] = useToolState<string>({ target: { ...scope, toolId: 'style.border_color' }, defaultValue: 'transparent' });
    const [styleBorderWidth] = useToolState<number>({ target: { ...scope, toolId: 'style.border_width' }, defaultValue: 0 });
    const [styleTextStrokeColor] = useToolState<string>({ target: { ...scope, toolId: 'style.text_stroke_color' }, defaultValue: 'transparent' });
    const [styleTextStrokeWidth] = useToolState<number>({ target: { ...scope, toolId: 'style.text_stroke_width' }, defaultValue: 0 });
    const [styleOpacity] = useToolState<number>({ target: { ...scope, toolId: 'style.opacity' }, defaultValue: 100 });
    const [styleBlur] = useToolState<number>({ target: { ...scope, toolId: 'style.blur' }, defaultValue: 0 });

    // Typography
    const [fontFamily] = useToolState<number>({ target: { ...scope, toolId: 'typo.family' }, defaultValue: 0 });
    const [fontSizeDesktop] = useToolState<number>({ target: { ...scope, toolId: 'typo.size_desktop' }, defaultValue: 16 });
    const [fontSizeMobile] = useToolState<number>({ target: { ...scope, toolId: 'typo.size_mobile' }, defaultValue: 16 });
    const [lineHeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.line_height' }, defaultValue: 1.5 });
    const [letterSpacing] = useToolState<number>({ target: { ...scope, toolId: 'typo.tracking' }, defaultValue: 0 });
    const [wordSpacing] = useToolState<number>({ target: { ...scope, toolId: 'typo.word_spacing' }, defaultValue: 0 });
    const [textAlign] = useToolState<string>({ target: { ...scope, toolId: 'typo.align' }, defaultValue: 'left' });
    const [verticalAlign] = useToolState<string>({ target: { ...scope, toolId: 'typo.vert' }, defaultValue: 'top' });
    const [textTransform] = useToolState<string>({ target: { ...scope, toolId: 'typo.case' }, defaultValue: 'none' });
    const [textDecoration] = useToolState<string>({ target: { ...scope, toolId: 'typo.decoration' }, defaultValue: 'none' });

    // Vario Axes
    const [axisWeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.weight' }, defaultValue: -1 });
    const [axisWidth] = useToolState<number>({ target: { ...scope, toolId: 'typo.width' }, defaultValue: -1 });
    const [axisSlant] = useToolState<number>({ target: { ...scope, toolId: 'typo.slant' }, defaultValue: 0 });
    const [axisCasual] = useToolState<number>({ target: { ...scope, toolId: 'typo.casual' }, defaultValue: 0 });
    const [axisGrade] = useToolState<number>({ target: { ...scope, toolId: 'typo.grade' }, defaultValue: 0 });

    // Feed Data (Hooks!)
    const [feedSourceIndex] = useToolState<number>({ target: { ...scope, toolId: 'content.feed_source_index' }, defaultValue: 0 });
    const [itemsDesktop] = useToolState<number>({ target: { ...scope, toolId: 'feed.query.limit_desktop' }, defaultValue: 12 });
    const [itemsMobile] = useToolState<number>({ target: { ...scope, toolId: 'feed.query.limit_mobile' }, defaultValue: 6 });

    const feedSource = ['kpi', 'retail', 'news', 'youtube', 'events'][feedSourceIndex - 1] as any;

    // --- The Logic: Feed Mapper ---
    const mappedItems = useFeedMapper({
        source: feedSource,
        limit: isMobile ? itemsMobile : itemsDesktop,
        initialItems: MOCK_ITEMS // In real app, this might come from props or another query
    });

    const commonProps = { isMobileView: isMobile };

    return (
        <div
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`relative transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 z-10' : 'hover:ring-1 hover:ring-neutral-300'} rounded-xl`}
        >
            {type === 'media' && (
                <Multi21_Grid
                    items={mappedItems}
                    colsDesktop={colsDesktop}
                    colsMobile={colsMobile}
                    gapXDesktop={gapXDesktop}
                    gapXMobile={gapXMobile}
                    gapYDesktop={gapYDesktop}
                    gapYMobile={gapYMobile}
                    radiusDesktop={radiusDesktop}
                    radiusMobile={radiusMobile}
                    aspectRatio={aspectRatio}

                    showTitle={showTitle}
                    showMeta={showMeta}
                    showBadge={showBadge}
                    showCtaLabel={showCtaLabel}
                    showCtaArrow={showCtaArrow}

                    fontFamily={fontFamily}
                    fontSizeDesktop={fontSizeDesktop}
                    fontSizeMobile={fontSizeMobile}
                    lineHeight={lineHeight}
                    letterSpacing={letterSpacing}
                    wordSpacing={wordSpacing}
                    textAlign={textAlign}
                    verticalAlign={verticalAlign}
                    textTransform={textTransform}
                    textDecoration={textDecoration}

                    weight={axisWeight}
                    width={axisWidth}
                    slant={axisSlant}
                    casual={axisCasual}
                    grade={axisGrade}

                    styleBgColor={styleBgColor}
                    styleTextColor={styleTextColor}
                    styleAccentColor={styleAccentColor}
                    styleBorderColor={styleBorderColor}
                    styleBorderWidth={styleBorderWidth}
                    styleTextStrokeColor={styleTextStrokeColor}
                    styleTextStrokeWidth={styleTextStrokeWidth}
                    styleOpacity={styleOpacity}
                    styleBlur={styleBlur}

                    isMobileView={isMobile}
                />
            )}

            {/* Other Types would be similar... simplified for brevity of this wiring example */}
            {type === 'text' && <Multi21_Text {...commonProps} />}
            {type === 'copy' && <Multi21_Copy text="Sample Copy" {...commonProps} />}
            {type === 'cta' && <Multi21_CTA label="Button" {...commonProps} />}
            {type === 'header' && <Multi21_Header layout="logo_left" trustSignal="none" contactPriority="standard" ctaMode="conversion" navStructure="flat" menuSource="main" sticky={false} isMobileView={isMobile} />}
            {type === 'row' && <div>Row Placeholder</div>}
        </div>
    );
};
