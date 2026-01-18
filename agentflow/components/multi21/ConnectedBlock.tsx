import React, { useMemo } from 'react';
import { useToolControl } from '../../context/ToolControlContext';
import { Multi21, Multi21Item } from './Multi21';
import { Multi21_Text } from './Multi21_Text';
import { Multi21_CTA } from './Multi21_CTA';
import { Multi21_Row } from './Multi21_Row';
import { Multi21_Header_Impl as Multi21_Header } from './Multi21_Header';

// Mock Data Generator (Moved from Designer)
const generateItems = (count: number, variant: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube', idPrefix: string): Multi21Item[] => {
    const isVideo = variant === 'video';
    const isYoutube = variant === 'youtube';

    return Array.from({ length: count }).map((_, i) => {
        if (isVideo) {
            return {
                id: `${idPrefix}-video-${i}`,
                title: `Video Title ${i + 1}`,
                meta: '12:34 • 4K',
                videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
                badge: i % 2 === 0 ? 'HD' : undefined,
            };
        }
        if (isYoutube) {
            return {
                id: `${idPrefix}-yt-${i}`,
                title: `YouTube Video ${i + 1}`,
                meta: 'Channel Name • 2.1M views',
                videoUrl: 'dQw4w9WgXcQ',
                badge: 'LIVE',
            };
        }
        if (variant === 'product') {
            return {
                id: `${idPrefix}-product-${i}`,
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
                id: `${idPrefix}-kpi-${i}`,
                title: `${base}%`,
                meta: trendUp ? 'CTR' : 'Bounce rate',
                badge: trendUp ? '▲ 3.1%' : '▼ 1.2%',
            };
        }
        return {
            id: `${idPrefix}-item-${i}`,
            title: `Item Title ${i + 1}`,
            meta: `Meta info • ${10 + i}k views`,
            imageUrl: `https://picsum.photos/seed/${i + 100}/600/400`,
            href: '#',
            badge: i % 3 === 0 ? 'New' : undefined,
            secondaryLink: i % 2 === 0 ? { href: '#', label: 'Watch now' } : undefined,
        };
    });
};

interface ConnectedBlockProps {
    id: string;
    type: 'media' | 'text' | 'cta' | 'row' | 'header';
    isSelected: boolean;
    onClick: () => void;
    previewMode: 'desktop' | 'mobile';

    // Recursive Props
    data?: any; // Contains 'columns' and 'children' for rows
    setActiveBlockId?: (id: string) => void;
    onDeleteBlock?: (id: string) => void;
    activeBlockId?: string; // Needed for nested highlighting logic in rows
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

    // Helper to scope tools to this block ID
    const scope = { surfaceId: 'multi21.designer', entityId: id };

    // --- Media Block Logic (Multi21) ---
    // Layout
    const [colsDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.cols_desktop' }, defaultValue: 6 });
    const [colsMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.cols_mobile' }, defaultValue: 2 });
    const [gapXDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_x_desktop' }, defaultValue: 16 });
    const [gapXMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_x_mobile' }, defaultValue: 16 });
    const [gapYDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_y_desktop' }, defaultValue: 16 });
    const [gapYMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.gap_y_mobile' }, defaultValue: 16 });
    const [radiusDesktop] = useToolState<number>({ target: { ...scope, toolId: 'grid.tile_radius_desktop' }, defaultValue: 8 });
    const [radiusMobile] = useToolState<number>({ target: { ...scope, toolId: 'grid.tile_radius_mobile' }, defaultValue: 8 });
    const [itemsDesktop] = useToolState<number>({ target: { ...scope, toolId: 'feed.query.limit_desktop' }, defaultValue: 12 });
    const [itemsMobile] = useToolState<number>({ target: { ...scope, toolId: 'feed.query.limit_mobile' }, defaultValue: 6 });
    const [align] = useToolState<'left' | 'center' | 'right'>({ target: { ...scope, toolId: 'align' }, defaultValue: 'center' });
    const [tileVariant] = useToolState<'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube'>({ target: { ...scope, toolId: 'tile.variant' }, defaultValue: 'generic' });
    const [aspectRatio] = useToolState<'1:1' | '16:9' | '9:16' | '4:3'>({ target: { ...scope, toolId: 'grid.aspect_ratio' }, defaultValue: '16:9' });

    // Toggles
    const [showTitle] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_title' }, defaultValue: true });
    const [showMeta] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_meta' }, defaultValue: true });
    const [showBadge] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_badge' }, defaultValue: true });
    const [showCtaLabel] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_cta_label' }, defaultValue: true });
    const [showCtaArrow] = useToolState<boolean>({ target: { ...scope, toolId: 'tile.show_cta_arrow' }, defaultValue: true });

    // Content (Phase 10)
    const [feedSourceIndex] = useToolState<number>({ target: { ...scope, toolId: 'content.feed_source_index' }, defaultValue: 0 });
    const [feedLimit] = useToolState<number>({ target: { ...scope, toolId: 'content.feed_limit' }, defaultValue: 12 });
    const [layoutMode] = useToolState<number>({ target: { ...scope, toolId: 'content.layout_mode' }, defaultValue: 0 });

    // --- Text Block Logic ---
    const [textAlign] = useToolState<'left' | 'center' | 'right' | 'justify'>({ target: { ...scope, toolId: 'text.align' }, defaultValue: 'left' });
    const [contentWidth] = useToolState<number>({ target: { ...scope, toolId: 'text.width_percent' }, defaultValue: 100 });
    const [stackGap] = useToolState<number>({ target: { ...scope, toolId: 'text.stack_gap' }, defaultValue: 16 });

    // --- CTA Block Logic (Phase 14) ---
    const [ctaVariant] = useToolState<'solid' | 'outline' | 'ghost'>({ target: { ...scope, toolId: 'cta.variant' }, defaultValue: 'solid' });
    const [ctaSize] = useToolState<'small' | 'medium' | 'large'>({ target: { ...scope, toolId: 'cta.size' }, defaultValue: 'medium' });
    const [ctaFullWidth] = useToolState<boolean>({ target: { ...scope, toolId: 'cta.fullWidth' }, defaultValue: false });
    const [ctaAlign] = useToolState<'left' | 'center' | 'right'>({ target: { ...scope, toolId: 'cta.align' }, defaultValue: 'center' });
    const [ctaLabel, setCtaLabel] = useToolState<string>({ target: { ...scope, toolId: 'cta.content.label' }, defaultValue: 'Click Me' });

    // Typography (Global / Shared)
    const [fontPresetIndex] = useToolState<number>({ target: { ...scope, toolId: 'typo.preset_index' }, defaultValue: 3 });
    const [fontSizeDesktop] = useToolState<number>({ target: { ...scope, toolId: 'typo.size_desktop' }, defaultValue: 16 });
    const [fontSizeMobile] = useToolState<number>({ target: { ...scope, toolId: 'typo.size_mobile' }, defaultValue: 16 });
    const [lineHeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.line_height' }, defaultValue: 1.5 });
    const [letterSpacing] = useToolState<number>({ target: { ...scope, toolId: 'typo.tracking' }, defaultValue: 0 });
    const [fontFamily] = useToolState<number>({ target: { ...scope, toolId: 'typo.family' }, defaultValue: 0 });

    // --- Styles ---
    // --- Styles ---
    const [styleBgColor] = useToolState<string>({ target: { ...scope, toolId: 'style.bg' }, defaultValue: 'transparent' }); // Tile BG
    const [styleBlockBgColor] = useToolState<string>({ target: { ...scope, toolId: 'style.block_bg' }, defaultValue: 'transparent' }); // Block BG
    const [styleTextColor] = useToolState<string>({ target: { ...scope, toolId: 'style.text' }, defaultValue: 'inherit' });
    const [styleAccentColor] = useToolState<string>({ target: { ...scope, toolId: 'style.accent' }, defaultValue: '#3b82f6' });
    const [styleBorderColor] = useToolState<string>({ target: { ...scope, toolId: 'style.border_color' }, defaultValue: 'transparent' });
    const [styleBorderWidth] = useToolState<number>({ target: { ...scope, toolId: 'style.border_width' }, defaultValue: 0 });
    const [styleOpacity] = useToolState<number>({ target: { ...scope, toolId: 'style.opacity' }, defaultValue: 100 });
    const [styleBlur] = useToolState<number>({ target: { ...scope, toolId: 'style.blur' }, defaultValue: 0 });


    // --- Text Block Content Persistence ---
    const [headline, setHeadline] = useToolState<string>({ target: { ...scope, toolId: 'text.content.headline' }, defaultValue: "Headline Text" });
    const [subhead, setSubhead] = useToolState<string>({ target: { ...scope, toolId: 'text.content.subhead' }, defaultValue: "Subhead goes here" });
    const [body, setBody] = useToolState<string>({ target: { ...scope, toolId: 'text.content.body' }, defaultValue: "Lorem ipsum dolor sit amet." });

    // Phase 13: Scoped Typography
    const [headlineSizeD] = useToolState<number>({ target: { ...scope, toolId: 'typo.headline.size_desktop' }, defaultValue: 40 });
    const [headlineSizeM] = useToolState<number>({ target: { ...scope, toolId: 'typo.headline.size_mobile' }, defaultValue: 32 });
    const [headlineWeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.headline.weight' }, defaultValue: 700 });

    const [subheadSizeD] = useToolState<number>({ target: { ...scope, toolId: 'typo.subhead.size_desktop' }, defaultValue: 24 });
    const [subheadSizeM] = useToolState<number>({ target: { ...scope, toolId: 'typo.subhead.size_mobile' }, defaultValue: 20 });
    const [subheadWeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.subhead.weight' }, defaultValue: 400 });

    const [bodySizeD] = useToolState<number>({ target: { ...scope, toolId: 'typo.body.size_desktop' }, defaultValue: 16 });
    const [bodySizeM] = useToolState<number>({ target: { ...scope, toolId: 'typo.body.size_mobile' }, defaultValue: 16 });
    const [bodyWeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.body.weight' }, defaultValue: 300 });

    // --- Global Vario Axes ---
    const [axisCasual] = useToolState<number>({ target: { ...scope, toolId: 'typo.casual' }, defaultValue: 0 });
    const [axisSlant] = useToolState<number>({ target: { ...scope, toolId: 'typo.slant' }, defaultValue: 0 });
    const [axisGrade] = useToolState<number>({ target: { ...scope, toolId: 'typo.grade' }, defaultValue: 0 });
    const [axisWeight] = useToolState<number>({ target: { ...scope, toolId: 'typo.weight' }, defaultValue: -1 });
    const [axisWidth] = useToolState<number>({ target: { ...scope, toolId: 'typo.width' }, defaultValue: -1 });

    // --- Phase 18: Header State ---
    const [headerLayout] = useToolState<any>({ target: { ...scope, toolId: 'header.layout' }, defaultValue: 'logo_left' });
    const [headerTrust] = useToolState<any>({ target: { ...scope, toolId: 'header.trust_signal' }, defaultValue: 'none' });
    const [headerContact] = useToolState<any>({ target: { ...scope, toolId: 'header.contact_priority' }, defaultValue: 'standard' });
    const [headerCtaMode] = useToolState<any>({ target: { ...scope, toolId: 'header.cta_mode' }, defaultValue: 'conversion' });
    const [headerNavStruct] = useToolState<any>({ target: { ...scope, toolId: 'nav.structure' }, defaultValue: 'flat' });
    const [headerSource] = useToolState<any>({ target: { ...scope, toolId: 'header.menu_source' }, defaultValue: 'main_site' });
    const [headerSticky] = useToolState<boolean>({ target: { ...scope, toolId: 'header.sticky' }, defaultValue: false });


    // Mock Data for Media
    const items = useMemo(() => generateItems(
        previewMode === 'mobile' ? itemsMobile : itemsDesktop,
        tileVariant,
        id
    ), [previewMode, itemsMobile, itemsDesktop, tileVariant, id]);

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            style={{ backgroundColor: styleBlockBgColor }}
            className={`
                relative transition-all duration-200
                ${isSelected ? 'ring-2 ring-blue-500 ring-offset-4 dark:ring-offset-black z-10' : 'hover:ring-1 hover:ring-neutral-300 dark:hover:ring-neutral-700'}
                rounded-xl
            `}
        >
            {type === 'text' ? (
                <Multi21_Text
                    // Content
                    headline={headline}
                    subhead={subhead}
                    body={body}
                    onHeadlineChange={setHeadline}
                    onSubheadChange={setSubhead}
                    onBodyChange={setBody}

                    // Layout
                    textAlign={textAlign}
                    contentWidth={`${contentWidth}%`}
                    stackGap={stackGap}

                    // Scoped Typo (Phase 13)
                    headlineSize={previewMode === 'mobile' ? headlineSizeM : headlineSizeD}
                    headlineWeight={headlineWeight}
                    subheadSize={previewMode === 'mobile' ? subheadSizeM : subheadSizeD}
                    subheadWeight={subheadWeight}
                    bodySize={previewMode === 'mobile' ? bodySizeM : bodySizeD}
                    bodyWeight={bodyWeight}

                    // Global
                    fontFamily={fontFamily}
                    axisWidth={axisWidth === -1 ? null : axisWidth}
                    axisSlant={axisSlant}
                    axisCasual={axisCasual}
                    axisGrade={axisGrade}
                    lineHeight={lineHeight}
                    letterSpacing={letterSpacing}

                    // Style
                    styleBgColor={styleBgColor}
                    styleTextColor={styleTextColor}
                    styleBorderColor={styleBorderColor}
                    styleBorderWidth={styleBorderWidth}
                    styleOpacity={styleOpacity}
                    styleBlur={styleBlur}

                    isMobileView={previewMode === 'mobile'}
                />
            ) : type === 'cta' ? (
                <Multi21_CTA
                    label={ctaLabel}
                    onLabelChange={setCtaLabel}
                    align={ctaAlign}
                    fullWidth={ctaFullWidth}
                    variant={ctaVariant}
                    size={ctaSize}
                    styleAccentColor={styleAccentColor}
                    fontFamily={fontFamily}
                />
            ) : type === 'header' ? (
                <Multi21_Header
                    layout={headerLayout}
                    trustSignal={headerTrust}
                    contactPriority={headerContact}
                    ctaMode={headerCtaMode}
                    navStructure={headerNavStruct}
                    menuSource={headerSource}
                    sticky={headerSticky}
                    styleBgColor={styleBgColor}
                    styleTextColor={styleTextColor}
                    styleAccentColor={styleAccentColor}
                    styleBorderColor={styleBorderColor}
                    styleBorderWidth={styleBorderWidth}
                    styleOpacity={styleOpacity}
                    styleBlur={styleBlur}
                    isMobileView={previewMode === 'mobile'}
                />
            ) : type === 'row' ? (
                <Multi21_Row
                    id={id}
                    columns={data?.columns || 1}
                    childrenArrays={data?.children || Array.from({ length: data?.columns || 1 }).map(() => [])}
                    activeBlockId={activeBlockId || ''}
                    setActiveBlockId={setActiveBlockId || (() => { })}
                    previewMode={previewMode}
                    onDeleteBlock={onDeleteBlock || (() => { })}
                />
            ) : (
                <Multi21
                    items={items}
                    gridColsDesktop={previewMode === 'mobile' ? colsMobile : colsDesktop}
                    gridColsMobile={colsMobile}
                    gridGapXDesktop={gapXDesktop}
                    gridGapXMobile={gapXMobile}
                    gridGapYDesktop={gapYDesktop}
                    gridGapYMobile={gapYMobile}
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

                    fontPresetIndex={fontPresetIndex}
                    fontSizeDesktop={fontSizeDesktop}
                    fontSizeMobile={fontSizeMobile}
                    lineHeight={lineHeight}
                    letterSpacing={letterSpacing}
                    axisWeight={axisWeight === -1 ? null : axisWeight}
                    axisWidth={axisWidth === -1 ? null : axisWidth}
                    fontFamily={fontFamily}
                    axisCasual={axisCasual}
                    axisSlant={axisSlant}
                    axisGrade={axisGrade}

                    // Style
                    styleBgColor={styleBgColor}
                    styleTextColor={styleTextColor}
                    styleAccentColor={styleAccentColor}
                    styleBorderColor={styleBorderColor}
                    styleBorderWidth={styleBorderWidth}
                    styleOpacity={styleOpacity}
                    styleBlur={styleBlur}

                    isMobileView={previewMode === 'mobile'}
                    feedSource={['kpi', 'retail', 'news', 'youtube', 'events'][feedSourceIndex - 1] as any}
                    feedLimit={feedLimit}
                    isCarousel={layoutMode === 1}
                />
            )}
        </div>
    );
};
