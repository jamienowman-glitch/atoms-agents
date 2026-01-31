"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCenter,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove
} from '@dnd-kit/sortable';

import { SortableBlockWrapper } from './SortableBlockWrapper';
import { MultiTile, MultiTileItem } from '@atoms/multi-tile/MultiTile';
import { MultiTileBlock } from '@atoms/multi-tile/MultiTileBlock';
import { HeroWeb } from '@atoms/hero/Hero.web';

// --- Types ---
export type Block = {
    id: string;
    type: 'media' | 'text' | 'copy' | 'cta' | 'row' | 'header' | 'hero';
    // For Rows
    columns?: number;
    children?: Block[][]; // Array of arrays. children[0] = Col 1 items.

    // State for the block (previously in ToolState)
    spanDesktop?: number;
    spanMobile?: number;
    variant?: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube';
};

// --- Mock Data Generator (Ported from ConnectedBlock) ---
const generateItems = (count: number, variant: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube', idPrefix: string): MultiTileItem[] => {
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
                meta: `Style ${i + 1}`,
                price: `£${(49 + i * 5).toFixed(2)}`,
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

// --- Helpers ---
const findContainer = (id: string, items: Block[]): string | undefined => {
    if (items.find(i => i.id === id)) return 'root';
    for (const item of items) {
        if (item.type === 'row' && item.children) {
            for (let col = 0; col < (item.columns || 1); col++) {
                const colItems = item.children[col] || [];
                if (colItems.find(i => i.id === id)) {
                    return `${item.id}-col-${col}`;
                }
            }
        }
    }
    return undefined;
};

interface WysiwygCanvasProps {
    blocks: Block[];
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
    activeBlockId: string | null;
    setActiveBlockId: (id: string | null) => void;
    toolState?: Record<string, any>;
}

export function WysiwygCanvas({ blocks, setBlocks, activeBlockId, setActiveBlockId, toolState = {} }: WysiwygCanvasProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    // --- DnD Sensors ---
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- DnD Logic ---
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        setActiveBlockId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;
        if (!overId || active.id === overId) return;

        setBlocks((prev) => {
            const activeContainer = findContainer(active.id as string, prev);
            const overContainer = (overId as string).includes('-col-') && !findContainer(overId as string, prev)
                ? overId as string
                : findContainer(overId as string, prev);

            if (!activeContainer || !overContainer || activeContainer === overContainer) {
                return prev;
            }

            const newBlocks = JSON.parse(JSON.stringify(prev));

            const removeFromContainer = (containerId: string, itemId: string) => {
                if (containerId === 'root') {
                    const idx = newBlocks.findIndex((i: Block) => i.id === itemId);
                    if (idx !== -1) return newBlocks.splice(idx, 1)[0];
                } else {
                    const match = containerId.match(/(.*)-col-(\d+)$/);
                    if (match) {
                        const row = newBlocks.find((i: Block) => i.id === match[1]);
                        const colIdx = parseInt(match[2], 10);
                        if (row && row.children) {
                            const idx = row.children[colIdx].findIndex((i: Block) => i.id === itemId);
                            if (idx !== -1) return row.children[colIdx].splice(idx, 1)[0];
                        }
                    }
                }
                return null;
            };

            const addToContainer = (containerId: string, item: Block, targetId: string) => {
                if (containerId === 'root') {
                    const idx = newBlocks.findIndex((i: Block) => i.id === targetId);
                    const newIndex = idx !== -1 ? idx : newBlocks.length;
                    newBlocks.splice(newIndex, 0, item);
                } else {
                    const match = containerId.match(/(.*)-col-(\d+)$/);
                    if (match) {
                        const row = newBlocks.find((i: Block) => i.id === match[1]);
                        const colIdx = parseInt(match[2], 10);
                        if (row) {
                            if (!row.children) {
                                row.children = Array.from({ length: row.columns || 1 }).map(() => []) as any;
                            }
                            if (targetId === containerId) {
                                row.children[colIdx].push(item);
                            } else {
                                const idx = row.children[colIdx].findIndex((i: Block) => i.id === targetId);
                                const newIndex = idx !== -1 ? idx : row.children[colIdx].length;
                                row.children[colIdx].splice(newIndex, 0, item);
                            }
                        }
                    }
                }
            };

            const item = removeFromContainer(activeContainer, active.id as string);
            if (item) {
                addToContainer(overContainer, item, overId as string);
            }

            return newBlocks;
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id as string, blocks);
        const overContainer = over ? (
            (over.id as string).includes('-col-') && !findContainer(over.id as string, blocks)
                ? over.id as string
                : findContainer(over.id as string, blocks)
        ) : null;

        if (activeContainer && overContainer && activeContainer === overContainer) {
            if (activeContainer === 'root') {
                const oldIndex = blocks.findIndex((x) => x.id === active.id);
                const newIndex = blocks.findIndex((x) => x.id === over?.id);
                if (oldIndex !== newIndex) {
                    setBlocks(arrayMove(blocks, oldIndex, newIndex));
                }
            } else {
                // Nested Row Logic (simplified)
            }
        }
        setActiveId(null);
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks((prev) => prev.filter(b => b.id !== id));
    };

    // Update block state helper
    const updateBlock = (id: string, updates: Partial<Block>) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const renderBlock = (block: Block, isSortable: boolean) => {
        // Mock Items: If media/hero, only 1 item. Else 12.
        const itemCount = (block.type === 'media' || block.type === 'hero') ? 1 : 12;
        const items = generateItems(itemCount, block.variant || 'generic', block.id);

        const content = (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveBlockId(block.id);
                }}
                className={`relative group/block bg-white dark:bg-black rounded-xl border transition-all duration-200 cursor-pointer ${activeBlockId === block.id
                    ? 'border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10 shadow-lg'
                    : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-800'
                    }`}
            >
                {/* Visual: Switch based on Type */}
                {block.type === 'hero' ? (
                    <HeroWeb
                        height={toolState?.['height_desktop'] || 80}
                        alignment={toolState?.['alignment'] || 'center'}
                        padding={toolState?.['padding_desktop'] || 24}
                        overlayOpacity={toolState?.['overlayOpacity'] || 0.4}
                        overlayColor={toolState?.['overlayColor'] || '#000000'}
                        textColor={toolState?.['textColor'] || '#FFFFFF'}
                    // Ensure props are passed from toolState if managed there
                    />
                ) : (
                    <MultiTile
                        items={items}
                        // Default Props (Can be overridden by ...block)
                        // If block has 'gridColsDesktop' (from Trait Tool), usage that.
                        // Fallback: If media, default to 1. Else spanDesktop or 6.
                        gridColsDesktop={(block as any).gridColsDesktop ?? (block.type === 'media' ? 1 : (block.spanDesktop || 6))}
                        gridColsMobile={(block as any).gridColsMobile ?? (block.type === 'media' ? 1 : (block.spanMobile || 2))}

                        // Aspect Ratio fallback
                        gridAspectRatio={(block as any).gridAspectRatio ?? (block.type === 'media' ? '16:9' : '1:1')}

                        tileVariant={block.variant || 'generic'}

                        // Pass through ALL other props (Style, Typo, etc.)
                        // This ensures 'gridTitleRadiusDesktop' etc. are passed through
                        {...block as any}
                    />
                )}

                {/* Controls Overlay (Only visible when active/selected) */}
                {/* Controls Overlay REMOVED. Logic moved to generic Toolbar. */}
            </div>
        );

        if (isSortable) {
            return (
                <SortableBlockWrapper
                    key={block.id}
                    id={block.id}
                    isSelected={activeBlockId === block.id}
                    onDelete={() => handleDeleteBlock(block.id)}
                >
                    <div onClick={() => setActiveBlockId(block.id)}>
                        {content}
                    </div>
                </SortableBlockWrapper>
            );
        }
        return <div key={block.id}>{content}</div>;
    };

    return (
        <div className="w-full h-full p-8 overflow-y-auto">
            <div className="max-w-[1200px] mx-auto min-h-[500px]">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-8">
                            {blocks.map(block => renderBlock(block, true))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
