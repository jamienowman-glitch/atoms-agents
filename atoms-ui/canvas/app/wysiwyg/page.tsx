"use client";

import React, { useState, useEffect } from 'react';
import { FlowHarness } from '../../../harnesses/flow/FlowHarness';
import { WysiwygCanvas, Block } from '../../../canvases/wysiwyg/WysiwygCanvas';
import { WysiwygToolbar } from '../../../canvases/wysiwyg/WysiwygToolbar';
import { WysiwygAddMenu } from '../../../canvases/wysiwyg/WysiwygAddMenu';
import { useFlow } from '../../../harnesses/flow/context/FlowContext';

// Internal Wrapper to access Context safely (Rendered inside FlowHarness)
function WysiwygToolbarWrapper({ blocks }: { blocks: Block[] }) {
    const { activeTool: activeBlockId } = useFlow();

    // Helper to find block type
    const findBlockType = (id: string, items: Block[]): string | undefined => {
        const match = items.find(b => b.id === id);
        if (match) return match.type;
        for (const item of items) {
            if (item.children) {
                for (const col of item.children) {
                    const found = findBlockType(id, col);
                    if (found) return found;
                }
            }
        }
        return undefined;
    };

    const activeBlockType = activeBlockId
        ? (findBlockType(activeBlockId, blocks) as any) || 'media'
        : 'media';

    return (
        <WysiwygToolbar
            activeBlockId={activeBlockId === null ? undefined : activeBlockId}
            activeBlockType={activeBlockType}
        />
    );
}

// Main Page Component
function WysiwygPageContent() {
    // Initial Blocks
    const [blocks, setBlocks] = useState<Block[]>([
        { id: 'block-1', type: 'media' },
        { id: 'block-2', type: 'text' },
    ]);

    // Add Block Logic
    const handleAddBlock = (type: 'media' | 'text' | 'copy' | 'cta' | 'row' | 'header', columns?: number) => {
        const newBlock: Block = {
            id: `block-${Date.now()}`,
            type,
            columns,
            children: type === 'row' ? Array.from({ length: columns || 1 }).map(() => []) : undefined
        };
        setBlocks(prev => [...prev, newBlock]);
    };

    return (
        <FlowHarness
            toolPopContent={<WysiwygToolbarWrapper blocks={blocks} />}
            toolPillContent={<WysiwygAddMenu onAdd={handleAddBlock} />}
        >
            <WysiwygCanvas blocks={blocks} setBlocks={setBlocks} />
        </FlowHarness>
    );
}

export default function WysiwygPage() {
    return (
        <WysiwygPageContent />
    );
}
