"use client";

import React, { useState } from 'react';
import { WysiwygCanvas, Block } from '../../canvas/wysiwyg/WysiwygCanvas';
import { ToolPopGeneric } from '@harnesses/Mother/tool-areas/ToolPop/ToolPopGeneric';
import { LogicPop } from '../../canvas/wysiwyg/LogicPop'; // NEW: Agent Brain/Logging
import { ToolPill } from '../../canvas/wysiwyg/ToolPill'; // Formerly WysiwygAddMenu
// import { WysiwygFloatingControls } from '../../canvas/wysiwyg/WysiwygFloatingControls'; // Removed
import { TopPill } from './shells/TopPill';
import { ChatRailShell, ChatMode } from './shells/ChatRailShell';
import { LoggingLens } from './overlays/LoggingLens';
import { MultiTileConfig } from '@atoms/multi-tile/MultiTile.config';
import { HeroConfig } from '@atoms/hero/Hero.config';
import { BleedingHeroContract } from '@atoms/BleedingHero.contract';

// --- Canvas Cartridge Types ---
type CanvasMode = 'web' | 'seb' | 'deck' | 'dm';

export function WysiwygBuilderHarness() {
    // --- State ---
    const [canvasMode, setCanvasMode] = useState<CanvasMode>('web'); // The "Cartridge" Selector
    const [blocks, setBlocks] = useState<Block[]>([
        { id: 'block-1', type: 'media', spanDesktop: 6, spanMobile: 2, variant: 'generic' },
        { id: 'block-2', type: 'bleeding_hero', spanDesktop: 12, spanMobile: 4, variant: 'generic' }
    ]);
    const [activeBlockId, setActiveBlockId] = useState<string | null>('block-1');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [chatMode, setChatMode] = useState<ChatMode>('nano');
    const [showTools, setShowTools] = useState(true);
    const [showLogic, setShowLogic] = useState(false); // Default logic brain hidden
    const [showLogging, setShowLogging] = useState(false); // Logging Lens Overlay

    // Typography trait inheritance
    const [lastUsedTypographyState, setLastUsedTypographyState] = useState({
        weight: 400,
        slant: 0,
        alignment: 'left'
    });

    // Flat tool state map (replacing Context)
    const [toolState, setToolState] = useState<Record<string, any>>({
        'grid.cols_desktop': 6,
        'grid.cols_mobile': 2,
        'feed.query.limit_desktop': 12,
        'style.bg': 'transparent',
    });

    // --- Actions ---
    const handleToolUpdate = (key: string, value: any) => {
        // 1. Update Global State (for UI reflection)
        setToolState(prev => ({ ...prev, [key]: value }));

        // 2. Track typography changes for inheritance
        if (key === 'typo.weight') setLastUsedTypographyState(prev => ({ ...prev, weight: value }));
        if (key === 'typo.slant') setLastUsedTypographyState(prev => ({ ...prev, slant: value }));

        // 3. Update Active Block (Persistence)
        if (activeBlockId) {
            setBlocks(prev => prev.map(b => {
                if (b.id !== activeBlockId) return b;

                // Direct Mapping Strategy:
                // We flatten the 'grid.cols_desktop' format into snake_case props on the block
                // or just store them in a 'settings' object. 
                // For now, let's map the critical ones the User mentioned (Color, Sliders)

                const updates: any = {};

                // Legacy Mappings (Sync)
                if (key === 'grid.cols_desktop') updates.spanDesktop = value;
                if (key === 'grid.cols_mobile') updates.spanMobile = value;
                if (key === 'tile.variant') updates.variant = value;

                // Modern Mappings (Critical for Trait System)
                if (key === 'grid.cols_desktop') updates.gridColsDesktop = value;
                if (key === 'grid.cols_mobile') updates.gridColsMobile = value;

                // Universal Prop Store (New)
                // We store everything else in a 'style' bag or direct props if MultiTile accepts them.
                // Looking at MultiTileProps, it expects camelCase keys (e.g. styleBgColor).
                // Let's simple-map the ToolState keys to MultiTile keys.

                const keyMap: Record<string, string> = {
                    'style.bg': 'styleBgColor',
                    'style.text': 'styleTextColor',
                    'grid.gap_x_desktop': 'gridGapXDesktop',
                    'grid.gap_y_desktop': 'gridGapYDesktop',
                    'grid.tile_radius_desktop': 'gridTileRadiusDesktop',
                    'typo.size_desktop': 'fontSizeDesktop',
                    'typo.family': 'fontFamily',
                    // Typography (Vario)
                    'typo.weight': 'axisWeight',
                    'typo.width': 'axisWidth',
                    'typo.slant': 'axisSlant',
                    // Bleeding Hero Mappings
                    'layout.image_offset': 'imageOffset',
                    'layout.text_width': 'textColumnWidth',
                };

                const propName = keyMap[key];
                if (propName) {
                    updates[propName] = value;
                } else {
                    // Fallback: Store raw key just in case we map it later
                    updates[key] = value;
                }

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

    const handleAddBlock = (type: string, atomId?: string) => {
        const base: Block = {
            id: `block-${Date.now()}`,
            type: type as any,
            spanDesktop: 6,
            spanMobile: 2,
            variant: atomId || 'generic'
        };

        // Apply trait inheritance for Copy atoms
        if (type === 'text' && atomId) {
            (base as any).axisWeight = lastUsedTypographyState.weight;
            (base as any).axisSlant = lastUsedTypographyState.slant;
            (base as any).textSize = atomId === 'jumbo' ? 72 : atomId === 'headline' ? 48 : atomId === 'subtitle' ? 32 : 16;
        }

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
                            setActiveBlockId={(id) => {
                                setActiveBlockId(id);
                                if (id) setShowTools(true);
                            }}
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


            {/* 4. TOOL PILL (Floating Add Menu) */}
            <ToolPill
                onAddAtom={(atomType, atomId) => {
                    handleAddBlock(atomType, atomId);
                    setIsAddMenuOpen(false);
                }}
            />

            {/* 5. CHAT RAIL (Shell Bottom) - z-[90] to be always on top of tools if expanded */}
            {/* 5. CHAT RAIL (Shell Bottom) - z-[40] (Requested) */}
            <div className="z-[40] relative">
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
                className={`transition-all duration-300 ${showTools ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'} fixed left-0 right-0 z-[100]`}
                style={{ bottom: chatMode === 'full' ? '92vh' : chatMode === 'standard' ? '50vh' : chatMode === 'micro' ? '180px' : '128px' }}
            >
                <div className="flex-1 w-full pl-0">
                    {activeBlockType === 'bleeding_hero' ? (
                        <ToolPopGeneric
                            activeAtomContract={BleedingHeroContract}
                            toolState={toolState}
                            onToolUpdate={handleToolUpdate}
                            onClose={() => setShowTools(false)}
                            isMobileView={isMobileView}
                        />
                    ) : (
                        <div className="fixed left-0 right-0 bottom-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 rounded-2xl z-[100] h-[260px] flex items-center justify-center">
                            <div className="text-xs text-neutral-400">Select Bleeding Hero to use tools</div>
                        </div>
                    )}
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

