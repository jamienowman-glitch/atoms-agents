"use client";

import React, { useState } from 'react';
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
    rectIntersection,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove
} from '@dnd-kit/sortable';

import { ConnectedBlock } from './blocks/ConnectedBlock';
import { SortableBlockWrapper } from './blocks/SortableBlockWrapper';
import { useFlow } from '../../harnesses/flow/context/FlowContext';

// --- Types ---
export type Block = {
    id: string;
    type: 'media' | 'text' | 'copy' | 'cta' | 'row' | 'header';
    columns?: number;
    children?: Block[][];
};

interface WysiwygCanvasProps {
    blocks: Block[];
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}

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

export function WysiwygCanvas({ blocks, setBlocks }: WysiwygCanvasProps) {
    const { viewMode, activeTool, setActiveTool } = useFlow();
    const [activeId, setActiveId] = useState<string | null>(null);

    // Sync activeBlockId with FlowContext activeTool (assuming activeTool holds block ID when selected)
    // Actually, FlowContext has 'activeTool', which might be tool ID. 
    // Usually we want 'activeSelection'. For now let's map 'activeTool' to block ID logic implicitly or via a new state?
    // The prompt says "create a FlowContext ... activeTool". 
    // In ConnectedBlock, we need isSelected. 
    // We will use 'activeTool' as the 'selectedBlockId' for simplicity in this migration.
    const activeBlockId = activeTool;
    const setActiveBlockId = setActiveTool;

    // --- DnD Sensors ---
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- DnD Handlers ---
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
                const match = activeContainer.match(/(.*)-col-(\d+)$/);
                if (match) {
                    const [_, rowId, colIndexStr] = match;
                    const colIdx = parseInt(colIndexStr, 10);
                    setBlocks((prev) => {
                        const newBlocks = [...prev];
                        const rowIdx = newBlocks.findIndex(b => b.id === rowId);
                        if (rowIdx === -1) return prev;
                        const row = { ...newBlocks[rowIdx] };
                        if (!row.children) return prev;
                        const colItems = [...row.children[colIdx]];
                        const oldIndex = colItems.findIndex(x => x.id === active.id);
                        const newIndex = colItems.findIndex(x => x.id === over?.id);
                        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                            row.children = [...row.children];
                            row.children[colIdx] = arrayMove(colItems, oldIndex, newIndex);
                            newBlocks[rowIdx] = row;
                            return newBlocks;
                        }
                        return prev;
                    });
                }
            }
        }
        setActiveId(null);
    };

    const handleDeleteBlock = (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        setBlocks((prev) => {
            if (prev.find(b => b.id === id)) return prev.filter(b => b.id !== id);
            const filterRecursive = (items: Block[]): Block[] => {
                return items.map(item => {
                    if (item.type === 'row' && item.children) {
                        return { ...item, children: item.children.map(col => filterRecursive(col)) };
                    }
                    return item;
                }).filter(b => b.id !== id);
            };
            return filterRecursive(prev);
        });
        setActiveBlockId(null);
    };

    const renderBlockList = (items: Block[]) => (
        <div className="flex flex-col gap-8 pb-16 min-h-[50vh]">
            {items.map((block) => (
                <SortableBlockWrapper
                    key={block.id}
                    id={block.id}
                    isSelected={activeBlockId === block.id}
                    onDelete={() => handleDeleteBlock(block.id)}
                >
                    <ConnectedBlock
                        id={block.id}
                        type={block.type}
                        isSelected={activeBlockId === block.id}
                        onClick={() => setActiveBlockId(block.id)}
                        previewMode={viewMode}
                        data={block}
                        /* We don't propagate recursive setters purely here for simplicity, 
                           but ConnectedBlock expects them for Row functionality. 
                           We might need a Context for block manipulation if we want deep rows to work perfectly.
                           For now, we pass placeholders or just rely on 'setBlocks' top level update via finding.
                           Wait, ConnectedBlock receives setActiveBlockId and onDeleteBlock.
                        */
                        setActiveBlockId={setActiveBlockId}
                        onDeleteBlock={handleDeleteBlock}
                        activeBlockId={activeBlockId || undefined}
                    />
                </SortableBlockWrapper>
            ))}
        </div>
    );

    return (
        <div className={`transition-all duration-300 mx-auto ${viewMode === 'mobile' ? 'max-w-[390px]' : 'max-w-[1200px]'}`}>
            <div className={`${viewMode === 'mobile' ? 'bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-[3rem] shadow-2xl p-4 min-h-[844px] overflow-hidden' : ''}`}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        {renderBlockList(blocks)}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
