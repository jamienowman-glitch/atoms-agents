"use client";

import React, { useState } from 'react';
import { WysiwygCanvas, Block } from '../../canvas/wysiwyg/WysiwygCanvas';
import { ToolPop } from '../../canvas/wysiwyg/ToolPop'; // Formerly WysiwygToolbar
import { ToolPill } from '../../canvas/wysiwyg/ToolPill'; // Formerly WysiwygAddMenu
// import { WysiwygFloatingControls } from '../../canvas/wysiwyg/WysiwygFloatingControls'; // Removed
import { TopPill } from './shells/TopPill';
import { ChatRailShell, ChatMode } from './shells/ChatRailShell';
// import { ContextPill } from './shells/ContextPill'; // DELETED per user request

export function WysiwygBuilderHarness() {
    // --- State ---
    const [blocks, setBlocks] = useState<Block[]>([
        { id: 'block-1', type: 'media', spanDesktop: 6, spanMobile: 2, variant: 'generic' }
    ]);
    const [activeBlockId, setActiveBlockId] = useState<string | null>('block-1');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [chatMode, setChatMode] = useState<ChatMode>('nano');
    const [showTools, setShowTools] = useState(true);

    // Flat tool state map (replacing Context)
    const [toolState, setToolState] = useState<Record<string, any>>({
        'grid.cols_desktop': 6,
        'grid.cols_mobile': 2,
        'feed.query.limit_desktop': 12,
        'style.bg': 'transparent',
    });

    // --- Actions ---
    const handleToolUpdate = (key: string, value: any) => {
        setToolState(prev => ({ ...prev, [key]: value }));

        if (activeBlockId) {
            setBlocks(prev => prev.map(b => {
                if (b.id !== activeBlockId) return b;
                const updates: Partial<Block> = {};
                if (key === 'grid.cols_desktop') updates.spanDesktop = value;
                if (key === 'grid.cols_mobile') updates.spanMobile = value;
                if (key === 'tile.variant') updates.variant = value;
                return { ...b, ...updates };
            }));
        }
    };

    // Determine active type
    const activeBlock = blocks.find(b => b.id === activeBlockId);
    const activeBlockType = activeBlock?.type || 'media';

    // Mock Add Logic
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const handleAddBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: `block-${Date.now()}`,
            type,
            spanDesktop: 6,
            spanMobile: 2,
            variant: 'generic'
        };
        setBlocks(prev => [...prev, newBlock]);
        setActiveBlockId(newBlock.id);
        setIsAddMenuOpen(false);
    };

    const isMobileView = previewMode === 'mobile';

    return (
        <div className="relative w-full h-[100dvh] bg-neutral-50 dark:bg-neutral-950 overflow-hidden flex flex-col">

            {/* 1. TOP PILL (Header) */}
            <TopPill
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                setIsRightPanelOpen={() => console.log('Settings Open')}
                setIsExportOpen={() => console.log('Export Open')}
            />



            {/* 2. MAIN CANVAS AREA */}
            <div
                className={`flex-1 overflow-hidden relative transition-colors duration-300 ${isMobileView ? 'flex justify-center items-center bg-neutral-200/50 dark:bg-neutral-900/50' : 'pt-16 pb-32'}`} // Added padding for desktop to avoid overlap
            >
                <div className={`transition-all duration-300 origin-center ${isMobileView ? 'w-[390px] h-[844px] bg-white dark:bg-neutral-900 border-4 border-neutral-300 dark:border-neutral-700 rounded-3xl overflow-hidden shadow-2xl' : 'w-full h-full'}`}>
                    <WysiwygCanvas
                        blocks={blocks}
                        setBlocks={setBlocks}
                        activeBlockId={activeBlockId}
                        setActiveBlockId={setActiveBlockId}
                        toolState={toolState}
                    />
                </div>
            </div>

            {/* 3. CONTEXT PILL (REMOVED) */}
            {/* The user requested to remove the 'Selected' lozenge entirely. */}

            {/* 4. TOOL PILL (Floating Add Menu) - Formerly WysiwygAddMenu */}
            <ToolPill
                isOpen={isAddMenuOpen}
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            >
                {/* Expandable Menu Content would go here */}
                {isAddMenuOpen && (
                    <div className="absolute bottom-12 right-0 mb-2 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-2 min-w-[200px] animate-in slide-in-from-bottom-2 fade-in duration-200">
                        <div className="text-xs font-semibold text-neutral-500 mb-2 px-2">Add Block</div>
                        <div className="space-y-1">
                            {['Text', 'Image', 'Video', 'Button', 'Spacer'].map(item => (
                                <button
                                    key={item}
                                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm transition-colors"
                                    onClick={() => {
                                        console.log('Add', item);
                                        setIsAddMenuOpen(false);
                                    }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </ToolPill>

            {/* 5. CHAT RAIL (Shell Bottom) - z-[90] to be always on top of tools if expanded */}
            <div className="z-[90] relative">
                <ChatRailShell
                    mode={chatMode}
                    onModeChange={setChatMode}
                    showTools={showTools}
                    onToggleTools={() => setShowTools(!showTools)}
                />
            </div>

            {/* 6. TOOL POP (Bottom Panel) - Formerly WysiwygToolbar */}
            <div className={`transition-all duration-300 ${showTools && chatMode === 'nano' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'} fixed bottom-16 left-0 right-0 z-[70]`}>
                <ToolPop
                    activeBlockId={activeBlockId}
                    activeBlockType={activeBlockType}
                    isMobileView={isMobileView}
                    toolState={toolState}
                    onToolUpdate={handleToolUpdate}
                />
            </div>



        </div >
    );
}
