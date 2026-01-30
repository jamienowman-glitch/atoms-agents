"use client";

import React, { useState } from 'react';
import { WysiwygCanvas, Block } from '../../canvas/wysiwyg/WysiwygCanvas';
import { WysiwygToolbar } from '../../canvas/wysiwyg/WysiwygToolbar';
import { WysiwygAddMenu } from '../../canvas/wysiwyg/WysiwygAddMenu';
import { WysiwygFloatingControls } from '../../canvas/wysiwyg/WysiwygFloatingControls';
import { TopPill } from './shells/TopPill';
import { ChatRailShell, ChatMode } from './shells/ChatRailShell';
import { ToolPop } from './shells/ToolPop';

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

            {/* 3. FLOATING TOOL POP (If Tools Enabled) */}
            {showTools && activeBlockId && (
                <div className="absolute bottom-[280px] left-1/2 -translate-x-1/2 z-[80] w-full max-w-xl px-4 animate-in fade-in slide-in-from-bottom-6 pointer-events-none">
                    <div className="pointer-events-auto">
                        <ToolPop atomId={activeBlockId} />
                    </div>
                </div>
            )}

            {/* 4. CHAT RAIL (Shell Bottom) - z-[90] to be always on top of tools if expanded */}
            <div className="z-[90] relative">
                <ChatRailShell
                    mode={chatMode}
                    onModeChange={setChatMode}
                    showTools={showTools}
                    onToggleTools={() => setShowTools(!showTools)}
                />
            </div>

            {/* 5. TOOLBAR - z-[70] to sit above canvas but below chat rail */}
            <div className={`transition-all duration-300 ${showTools && chatMode === 'nano' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'} fixed bottom-16 left-0 right-0 z-[70]`}>
                <WysiwygToolbar
                    activeBlockId={activeBlockId}
                    activeBlockType={activeBlockType}
                    isMobileView={isMobileView}
                    toolState={toolState}
                    onToolUpdate={handleToolUpdate}
                />
            </div>


            {/* 6. ADD MENU (Floating) */}
            <WysiwygAddMenu
                isOpen={isAddMenuOpen}
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            >
                <div className="fixed bottom-44 right-4 bg-white dark:bg-neutral-900 shadow-xl rounded-full p-2 flex flex-col gap-3 border border-neutral-200 dark:border-neutral-800 z-[60] animate-in fade-in slide-in-from-bottom-4 items-center w-12">
                    <button onClick={() => handleAddBlock('text')} className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-sm font-serif font-bold text-lg">T</button>
                    <button onClick={() => handleAddBlock('media')} className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </button>
                    <button onClick={() => handleAddBlock('cta')} className="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="4" y="8" width="16" height="8" rx="2" /><path d="M10 8V8" /></svg>
                    </button>
                </div>
            </WysiwygAddMenu>

        </div>
    );
}
