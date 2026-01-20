"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableBlockWrapper } from './SortableBlockWrapper';
import { ConnectedBlock } from './ConnectedBlock';

// We need to import Block type or define recursive type here.
// For simplicity, we'll use `any` for the children blocks in props to avoid circular dependency hell in this file,
// but in a real app we'd share the type.
interface Multi21RowProps {
    id: string; // The Row Block ID
    columns: number; // 1, 2, or 3
    childrenArrays: any[][]; // Array of Arrays of Blocks. childrenArrays[0] = Col 1 blocks.
    activeBlockId: string;
    setActiveBlockId: (id: string) => void;
    previewMode: 'desktop' | 'mobile';
    onDeleteBlock: (id: string) => void;
}

export function Multi21_Row({
    id,
    columns,
    childrenArrays,
    activeBlockId,
    setActiveBlockId,
    previewMode,
    onDeleteBlock
}: Multi21RowProps) {

    // Grid class based on columns
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
    }[columns] || 'grid-cols-1';

    return (
        <div className={`grid ${gridCols} gap-4 w-full min-h-[100px] border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-2 bg-neutral-50/50 dark:bg-neutral-900/50`}>
            {Array.from({ length: columns }).map((_, colIndex) => {
                const columnId = `${id}-col-${colIndex}`;
                const items = childrenArrays[colIndex] || [];

                return (
                    <ColumnDroppable
                        key={columnId}
                        id={columnId}
                        items={items}
                        activeBlockId={activeBlockId}
                        setActiveBlockId={setActiveBlockId}
                        previewMode={previewMode}
                        onDeleteBlock={onDeleteBlock}
                    />
                );
            })}
        </div>
    );
}

function ColumnDroppable({ id, items, activeBlockId, setActiveBlockId, previewMode, onDeleteBlock }: any) {
    const { setNodeRef } = useDroppable({ id }); // Make column droppable even if empty

    return (
        <SortableContext
            id={id}
            items={items.map((b: any) => b.id)}
            strategy={verticalListSortingStrategy}
        >
            <div ref={setNodeRef} className="flex flex-col gap-4 min-h-[80px] h-full rounded-lg bg-white/50 dark:bg-black/20 p-2 border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-colors">
                {items.map((block: any) => (
                    <SortableBlockWrapper
                        key={block.id}
                        id={block.id}
                        isSelected={activeBlockId === block.id}
                        onDelete={() => onDeleteBlock(block.id)}
                    >
                        <ConnectedBlock
                            id={block.id}
                            type={block.type}
                            isSelected={activeBlockId === block.id}
                            onClick={() => setActiveBlockId(block.id)}
                            previewMode={previewMode}
                            // Pass down nested children if this internal block is ALSO a row (recursive)
                            // Note: ConnectedBlock needs to handle this recursion.
                            data={block}
                        />
                    </SortableBlockWrapper>
                ))}
                {items.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-xs text-neutral-300 dark:text-neutral-700 font-mono border-2 border-dotted border-neutral-200 dark:border-neutral-800 rounded-lg min-h-[60px]">
                        Drop Here
                    </div>
                )}
            </div>
        </SortableContext>
    );
}
