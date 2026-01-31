"use client";

import React, { useState } from 'react';
import { WysiwygCanvas, Block } from '../../canvas/wysiwyg/WysiwygCanvas';
import { ToolPop } from '../../canvas/wysiwyg/ToolPop'; // Formerly WysiwygToolbar
import { LogicPop } from '../../canvas/wysiwyg/LogicPop'; // NEW: Agent Brain/Logging
import { ToolPill } from '../../canvas/wysiwyg/ToolPill'; // Formerly WysiwygAddMenu
// import { WysiwygFloatingControls } from '../../canvas/wysiwyg/WysiwygFloatingControls'; // Removed
import { TopPill } from './shells/TopPill';
import { ChatRailShell, ChatMode } from './shells/ChatRailShell';
import { LoggingLens } from './overlays/LoggingLens';
import { MultiTileConfig } from '../../ui-atoms/multi-tile/MultiTile.config';
import { HeroConfig } from '../../ui-atoms/hero/Hero.config';

// --- Canvas Cartridge Types ---
type CanvasMode = 'web' | 'seb' | 'deck' | 'dm';

export function WysiwygBuilderHarness() {
    // --- State ---
    const [canvasMode, setCanvasMode] = useState<CanvasMode>('web'); // The "Cartridge" Selector
    const [blocks, setBlocks] = useState<Block[]>([
        { id: 'block-1', type: 'media', spanDesktop: 6, spanMobile: 2, variant: 'generic' }
    ]);
    const [activeBlockId, setActiveBlockId] = useState<string | null>('block-1');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [chatMode, setChatMode] = useState<ChatMode>('nano');
    const [showTools, setShowTools] = useState(true);
    const [showLogic, setShowLogic] = useState(false); // Default logic brain hidden
    const [showLogging, setShowLogging] = useState(false); // Logging Lens Overlay

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
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const handleAddBlock = (type: Block['type']) => {
        const base: Block = {
            id: `block-${Date.now()}`,
            type,
            spanDesktop: 6,
            spanMobile: 2,
            variant: 'generic'
        };

        // Defaults by Type
        if (type === 'hero') {
            base.spanDesktop = 12; // Full width
            base.spanMobile = 2;
            base.variant = 'generic'; // Hero doesn't use variant prop same way, but keep safe
        } else if (type === 'text') {
            base.spanDesktop = 12;
            base.variant = 'text';
        } else if (type === 'media') {
            base.spanDesktop = 6;
            base.variant = 'generic';
        }

        const newBlock = base;
        setBlocks(prev => [...prev, newBlock]);
        setActiveBlockId(newBlock.id);
        setIsAddMenuOpen(false);
    };

    const isMobileView = previewMode === 'mobile';

    return (
        <div className="relative w-full h-[100dvh] bg-neutral-50 dark:bg-neutral-950 overflow-hidden flex flex-col">

            {/* 0. LOGGING LENS OVERLAY */}
            {showLogging && (
                <LoggingLens onClose={() => setShowLogging(false)} />
            )}

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
                    {/* --- DYNAMIC CANVAS CARTRIDGE LOADER --- */}
                    {canvasMode === 'web' && (
                        <WysiwygCanvas
                            blocks={blocks}
                            setBlocks={setBlocks}
                            activeBlockId={activeBlockId}
                            setActiveBlockId={setActiveBlockId}
                            toolState={toolState}
                        />
                    )}
                    {/* Future Cartridges: */}
                    {/* canvasMode === 'seb' && <EmailCanvas ... /> */}
                    {/* canvasMode === 'deck' && <DeckCanvas ... /> */}
                    {/* canvasMode === 'dm' && <MessagingCanvas ... /> */}
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
                {/* Vertical Lozenge Pop-out (Smart Direction) */}
                {({ anchor }) => {
                    const isUp = anchor === 'bottom';
                    // No absolute positioning needed here. ToolPill handles placement.
                    // Just Stack Direction.
                    const stackClass = isUp ? 'flex-col-reverse' : 'flex-col';

                    return (
                        <div className={`flex ${stackClass} items-center gap-3 animate-in fade-in duration-200`}>

                            {/* Categories */}
                            {[
                                { id: 'layout', icon: <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />, label: 'Layout' },
                                { id: 'media', icon: <path d="m21 15-9-7-9 7 21 0 z" />, label: 'Media' },
                                { id: 'commerce', icon: <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />, label: 'Commerce' }
                            ].map(cat => (
                                <div key={cat.id} className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent closing ToolPill
                                            setActiveCategory(activeCategory === cat.id ? null : cat.id);
                                        }}
                                        className={`w-10 h-10 rounded-full shadow-lg border flex items-center justify-center text-xs hover:scale-110 transition-transform ${activeCategory === cat.id ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'}`}
                                        title={cat.label}
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            {cat.icon}
                                        </svg>
                                    </button>

                                    {/* Level 2: Horizontal Pop-out (Active State) */}
                                    {activeCategory === cat.id && (
                                        <div className="absolute right-12 top-0 pr-2 flex items-center gap-2 z-[100]">
                                            <div className="bg-white dark:bg-neutral-900 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-xl p-1 flex items-center gap-2 px-2 h-10 animate-in slide-in-from-right-4 fade-in duration-200">

                                                {/* Layout Atoms */}
                                                {cat.id === 'layout' && (
                                                    <>
                                                        <button onClick={() => handleAddBlock('hero')} className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center" title="Hero Banner">
                                                            {/* Hero Icon (Banner) */}
                                                            <svg className="w-4 h-4 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                                <rect x="2" y="2" width="20" height="20" rx="2" />
                                                                <line x1="2" y1="8" x2="22" y2="8" />
                                                            </svg>
                                                        </button>
                                                        <button onClick={() => handleAddBlock('text')} className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center" title="Text Block">
                                                            {/* Text Icon */}
                                                            <svg className="w-4 h-4 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                                <path d="M4 6h16M4 12h16M4 18h8" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}

                                                {/* Media Atoms */}
                                                {cat.id === 'media' && (
                                                    <button onClick={() => handleAddBlock('media')} className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center" title="Image / Video">
                                                        {/* Image Icon */}
                                                        <svg className="w-4 h-4 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                                            <polyline points="21 15 16 10 5 21" />
                                                        </svg>
                                                    </button>
                                                )}

                                                {/* Commerce Atoms (Placeholder) */}
                                                {cat.id === 'commerce' && (
                                                    <div className="text-[10px] uppercase font-bold text-neutral-400 px-2 min-w-12">Soon</div>
                                                )}

                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                }}
            </ToolPill>

            {/* 5. CHAT RAIL (Shell Bottom) - z-[90] to be always on top of tools if expanded */}
            <div className="z-[90] relative">
                <ChatRailShell
                    mode={chatMode}
                    onModeChange={setChatMode}
                    showTools={showTools}
                    onToggleTools={() => {
                        setShowTools(!showTools);
                        if (!showTools) setShowLogic(false); // Mutually exclusive (optional but cleaner)
                    }}
                    showLogic={showLogic}
                    onToggleLogic={() => {
                        setShowLogic(!showLogic);
                        if (!showLogic) setShowTools(false); // Mutually exclusive
                    }}
                />
            </div>

            {/* 6A. TOOL POP (Bottom Right) - Canvas Output Tools */}
            <div
                className={`transition-all duration-300 ${showTools ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'} fixed left-0 right-0 z-[60]`}
                style={{ bottom: chatMode === 'full' ? '92vh' : chatMode === 'standard' ? '50vh' : chatMode === 'micro' ? '180px' : '128px' }}
            >
                <div className="flex-1 w-full pl-0">
                    <ToolPop
                        activeBlockId={activeBlockId}
                        activeBlockType={activeBlockType}
                        isMobileView={isMobileView}
                        toolState={toolState}
                        onToolUpdate={handleToolUpdate}
                        onClose={() => setShowTools(false)} // Explicit Close Handler
                        atomConfig={activeBlockType === 'hero' ? HeroConfig : undefined} // <--- REVERT: Only drive Hero via Registry. Keep MultiTile hardcoded.
                    />
                </div>
            </div>

            {/* 6B. LOGIC POP (Bottom Full Width) - Agent Brain Tools 
                 Attached to top of ChatRail (which is h-[44px]). 
                 bottom-11 = 44px. 
             */}
            <div
                className={`transition-all duration-300 ${showLogic ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'} fixed left-0 right-0 z-[60] pointer-events-none`}
                style={{ bottom: chatMode === 'full' ? '92vh' : chatMode === 'standard' ? '50vh' : chatMode === 'micro' ? '180px' : '128px' }}
            >
                {/* z-40 so it's behind the Rail Header (z-1000) if we want it to look like it pops out *under* it? 
                   User said "looks like it is popping out of the top". usually means it slides UP from BEHIND the rail.
                   Rail shell has z-50. So z-40 is perfect. It will slide up from behind.
                */}
                <div className="absolute bottom-0 inset-x-0 pointer-events-auto">
                    <LogicPop
                        onClose={() => setShowLogic(false)}
                        onToggleLogging={() => {
                            console.log('Toggle logging clicked');
                            setShowLogic(false); // Hide LogicPop to Focus
                            setShowLogging(true); // Show Lens
                        }}
                    />
                </div>
            </div>



        </div >
    );
}

