"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
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
    getFirstCollision,
    CollisionDetection,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove
} from '@dnd-kit/sortable';

import { ConnectedBlock } from './ConnectedBlock';
import { BottomControlsPanel } from './BottomControlsPanel';
import { DesktopPanelSystem } from './DesktopPanelSystem';
import { FloatingAction } from '../../../../components/ui/FloatingAction';
import { useToolControl } from '../../../../context/ToolControlContext';
import { SortableBlockWrapper } from './SortableBlockWrapper';
import { Multi21_PopupWrapper } from './Multi21_PopupWrapper';
import { HiddenAttributionFields } from './HiddenAttributionFields';
import { AgentflowApp } from './lenses/AgentflowApp';

// --- Types ---
export type Block = {
    id: string;
    type: 'media' | 'text' | 'copy' | 'cta' | 'row' | 'header';
    // For Rows
    columns?: number;
    children?: Block[][]; // Array of arrays. children[0] = Col 1 items.
};

// --- Helpers ---

// Find which container (root or column-array-id) an item is in.
const findContainer = (id: string, items: Block[]): string | undefined => {
    // Check root
    if (items.find(i => i.id === id)) return 'root';

    // Check nested rows
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

export interface Multi21DesignerProps {
    userRole?: 'tenant' | 'architect';
}

export function Multi21Designer({ userRole = 'tenant' }: Multi21DesignerProps) {
    // -- Role & Dev Mode Logic --
    const [devMode, setDevMode] = useState(false);
    const effectiveRole = devMode ? 'architect' : userRole;

    // Ctrl + . Trigger for Dev Mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '.') {
                e.preventDefault();
                setDevMode(prev => !prev);
                console.log('[Multi21Designer] Dev Mode Toggled:', !devMode);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [devMode]);

    return <Multi21DesignerContent effectiveRole={effectiveRole} />;
}

function Multi21DesignerContent({ effectiveRole }: { effectiveRole: 'tenant' | 'architect' }) {
    // Controls State
    const { useToolState, updateTool, state } = useToolControl();

    // -- Global State (View) --
    // Auto-Detect Mobile Device (Run Once)
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            // We need to set the state, but we can't use 'setPreviewMode' before it's defined if we put this effect before the hook.
            // However, hooks order matters.
            // Better approach: Use the hook first, then the effect.
        }
    }, []);

    const [previewMode, setPreviewMode] = useToolState<'desktop' | 'mobile'>({ target: { surfaceId: 'multi21.designer', toolId: 'previewMode' }, defaultValue: 'desktop' });

    // Auto-Detect Mobile Device (Implementation)
    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 768) {
                setPreviewMode('mobile');
            }
        };
        checkMobile();
    }, [setPreviewMode]);

    // -- Active Lens State --
    const [activeLens, setActiveLens] = useToolState<'page' | 'graph'>({ target: { surfaceId: 'multi21.designer', toolId: 'activeLens' }, defaultValue: 'page' });

    // Force Page View if Tenant
    useEffect(() => {
        if (effectiveRole === 'tenant' && activeLens !== 'page') {
            setActiveLens('page');
        }
    }, [effectiveRole, activeLens, setActiveLens]);

    // -- Layer State (Phase 19) --
    const [viewLayer, setViewLayer] = useState<'page' | 'popup'>('page');

    // -- Stack State (Recursive) --
    const [pageBlocks, setPageBlocks] = useState<Block[]>([
        { id: 'block-1', type: 'media' }
    ]);
    const [popupBlocks, setPopupBlocks] = useState<Block[]>([
        // Default empty or simple text
        { id: 'popup-text-1', type: 'text' }
    ]);

    const blocks = viewLayer === 'page' ? pageBlocks : popupBlocks;
    const setBlocks = (action: React.SetStateAction<Block[]>) => {
        if (viewLayer === 'page') setPageBlocks(action);
        else setPopupBlocks(action);
    };

    const [activeBlockId, setActiveBlockId] = useState<string | null>('block-1');
    const [activeId, setActiveId] = useState<string | null>(null); // For Drag Overlay (if used later)

    // Add Menu State
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const COPY_INHERIT_TOOL_IDS = [
        'typo.preset_index',
        'typo.family',
        'typo.weight',
        'typo.width',
        'typo.casual',
        'typo.slant',
        'typo.grade',
        'typo.size_desktop',
        'typo.size_mobile',
        'typo.line_height',
        'typo.tracking',
        'typo.word_spacing',
        'typo.align',
        'typo.vert',
        'typo.case',
        'typo.decoration',
        'style.bg',
        'style.block_bg',
        'style.text',
        'style.accent',
        'style.border_color',
        'style.border_width',
        'style.text_stroke_color',
        'style.text_stroke_width',
        'style.opacity',
        'style.blur',
        'text.width_percent',
        'text.stack_gap',
        'copy.level',
        'copy.style',
    ];

    const toolKey = (entityId: string, toolId: string) => `multi21.designer:global:${entityId}:${toolId}`;

    const flattenBlocks = (items: Block[], acc: Block[] = []) => {
        items.forEach((item) => {
            acc.push(item);
            if (item.type === 'row' && item.children) {
                item.children.forEach((col) => flattenBlocks(col, acc));
            }
        });
        return acc;
    };

    const findLastCopyBlockId = (items: Block[]) => {
        const flat = flattenBlocks(items, []);
        for (let i = flat.length - 1; i >= 0; i -= 1) {
            if (flat[i].type === 'copy') return flat[i].id;
        }
        return undefined;
    };

    const inheritCopyFormatting = (sourceId: string, targetId: string) => {
        COPY_INHERIT_TOOL_IDS.forEach((toolId) => {
            const key = toolKey(sourceId, toolId);
            if (Object.prototype.hasOwnProperty.call(state, key)) {
                updateTool({ surfaceId: 'multi21.designer', entityId: targetId, toolId }, 'setValue', state[key]);
            }
        });
    };

    // --- DnD Sensors ---
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- DnD Logic (Recursive) ---
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

        if (
            activeContainer &&
            overContainer &&
            activeContainer === overContainer
        ) {
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

    // --- Deletion Logic (Recursive) ---
    const handleDeleteBlock = (id: string) => {
        if (!window.confirm("Are you sure?")) return;

        setBlocks((prev) => {
            if (prev.find(b => b.id === id)) {
                return prev.filter(b => b.id !== id);
            }
            const filterRecursive = (items: Block[]): Block[] => {
                return items.map(item => {
                    if (item.type === 'row' && item.children) {
                        return {
                            ...item,
                            children: item.children.map(col => filterRecursive(col))
                        };
                    }
                    return item;
                }).filter(b => b.id !== id);
            };
            return filterRecursive(prev);
        });
        setActiveBlockId(null);
    };

    // Add Block Logic
    const createBlockId = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    };

    const handleAddBlock = (type: 'media' | 'text' | 'copy' | 'cta' | 'row' | 'header', columns?: number) => {
        const newBlock: Block = {
            id: createBlockId(),
            type,
            columns: columns,
            children: type === 'row' ? Array.from({ length: columns || 1 }).map(() => []) : undefined
        };
        setBlocks([...blocks, newBlock]);
        if (type === 'copy') {
            const previousCopyId = findLastCopyBlockId(blocks);
            if (previousCopyId) {
                inheritCopyFormatting(previousCopyId, newBlock.id);
            }
        }
        toggleAddMenu();
    };

    const toggleAddMenu = () => setIsAddMenuOpen(prev => !prev);
    const [isDesktop, setIsDesktop] = React.useState(false);
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Panels ---
    const settingsContent = (
        <div className="flex flex-col gap-4">
            <span className="text-sm">Config...</span>
            <div className="flex flex-col gap-2">
                <span className="font-semibold text-xs uppercase tracking-wider text-neutral-500">View</span>
                <div className="flex rounded-md bg-neutral-100 dark:bg-neutral-800 p-0.5">
                    {(['desktop', 'mobile'] as const).map(opt => (
                        <button
                            key={opt}
                            onClick={() => setPreviewMode(opt)}
                            className={`px-2 py-1 rounded text-xs capitalize ${previewMode === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            {/* Debug Info */}
            <div className="text-xs text-neutral-400 mt-4">
                Active Layer: {viewLayer}<br />
                Blocks: {blocks.length}
            </div>
        </div>
    );

    const toolsContent = (<div>Tools</div>);

    const navigatorContent = (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <span className="font-semibold text-xs uppercase tracking-wider text-neutral-500">Layers</span>
                <div className="flex flex-col gap-1 p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
                    <button
                        onClick={() => { setViewLayer('page'); setActiveBlockId(null); }}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${viewLayer === 'page'
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg>
                            Page
                        </div>
                    </button>

                    <button
                        onClick={() => { setViewLayer('popup'); setActiveBlockId(null); }}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${viewLayer === 'popup'
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="4" y="6" width="16" height="12" rx="2" /><path d="M12 2v2" /><path d="M12 20v2" /></svg>
                            Pop-up Overlay
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );

    const panels = useMemo(() => [
        { id: 'navigator', title: 'Navigator', content: navigatorContent },
        { id: 'settings', title: 'Settings', content: settingsContent },
        { id: 'tools', title: 'Tools', content: toolsContent },
    ], [settingsContent, navigatorContent, activeBlockId, blocks]);

    // This is now properly inside the provider!
    const [showTools] = useToolState<boolean>({ target: { surfaceId: 'multi21.shell', toolId: 'ui.show_tools' }, defaultValue: false });

    // --- Block Rendering ---
    const renderBlockList = (items: Block[], isActiveContext: boolean) => (
        <div className="flex flex-col gap-8 pb-16">
            {items.map((block) => (
                isActiveContext ? (
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
                            previewMode={previewMode}
                            data={block}
                            setActiveBlockId={setActiveBlockId}
                            onDeleteBlock={handleDeleteBlock}
                            activeBlockId={activeBlockId || undefined}
                        />
                    </SortableBlockWrapper>
                ) : (
                    <ConnectedBlock
                        key={block.id}
                        id={block.id}
                        type={block.type}
                        // Non-interactive background
                        isSelected={false}
                        onClick={() => { }}
                        previewMode={previewMode}
                        data={block}
                        setActiveBlockId={() => { }}
                        onDeleteBlock={() => { }}
                        activeBlockId={undefined}
                    />
                )
            ))}
        </div>
    );

    return (
        // WorkbenchShell provides the frame.
        <>
            <HiddenAttributionFields />

            {activeLens === 'page' ? (
                <>
                    <BottomControlsPanel
                        settingsContent={settingsContent}
                        activeBlockId={activeBlockId || (viewLayer === 'page' ? pageBlocks[0]?.id : popupBlocks[0]?.id)}
                        activeBlockType={
                            (() => {
                                const findType = (items: Block[]): string | undefined => {
                                    if (!activeBlockId) return undefined;
                                    const match = items.find(b => b.id === activeBlockId);
                                    if (match) return match.type;
                                    for (const b of items) {
                                        if (b.children) {
                                            for (const col of b.children) {
                                                const nested = findType(col);
                                                if (nested) return nested;
                                            }
                                        }
                                    }
                                    return undefined;
                                };
                                const found = findType(blocks);
                                if (found) return found as 'media' | 'text' | 'copy' | 'cta' | 'row' | 'header';
                                if (viewLayer === 'popup' && !activeBlockId) return 'popup';
                                return undefined;
                            })()
                        }
                    // Removed isVisible prop as BottomControlsPanel now consumes it directly
                    />

                    {isAddMenuOpen && (
                        <div className="fixed bottom-44 right-4 bg-white dark:bg-neutral-900 shadow-xl rounded-full p-2 flex flex-col gap-3 border border-neutral-200 dark:border-neutral-800 z-[60] animate-in fade-in slide-in-from-bottom-4 items-center w-12">
                            <button onClick={() => handleAddBlock('text')} className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-sm" title="Add Text"><span className="font-serif font-bold text-lg leading-none">T</span></button>
                            <button onClick={() => handleAddBlock('copy')} className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm" title="Add Copy"><span className="font-serif font-bold text-lg leading-none">C</span></button>
                            <button onClick={() => handleAddBlock('media')} className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm" title="Add Media"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg></button>
                            <button onClick={() => handleAddBlock('cta')} className="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm" title="Add Button"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="4" y="8" width="16" height="8" rx="2" /><path d="M10 8V8" /></svg></button>
                            <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                            <button onClick={() => handleAddBlock('row', 1)} className="w-8 h-8 rounded-full bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center shadow-sm font-mono text-xs" title="1 Column">[I]</button>
                            <button onClick={() => handleAddBlock('row', 2)} className="w-8 h-8 rounded-full bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center shadow-sm font-mono text-xs" title="2 Columns">[II]</button>
                            <button onClick={() => handleAddBlock('row', 3)} className="w-8 h-8 rounded-full bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center shadow-sm font-mono text-xs" title="3 Columns">[III]</button>
                        </div>
                    )}
                    <FloatingAction onClick={toggleAddMenu} />

                    {isDesktop && <DesktopPanelSystem panels={panels} />}

                    <main
                        className={`pb-32 flex flex-col ${previewMode === 'mobile'
                            ? 'px-0 max-w-none items-stretch'
                            : 'p-4 max-w-[1600px] mx-auto items-center'
                            }`}
                    >

                        <div
                            className={`transition-all duration-300 ease-in-out border border-transparent ${previewMode === 'mobile'
                                ? 'w-full sm:w-[390px] sm:border-neutral-200 sm:dark:border-neutral-800 sm:rounded-3xl sm:overflow-hidden sm:shadow-2xl sm:bg-white sm:dark:bg-black'
                                : 'w-full'
                                }`}
                        >
                            <div className={previewMode === 'mobile' ? 'p-0 sm:p-4 min-h-[100vh] sm:h-[844px] overflow-y-auto scrollbar-hide' : ''}>
                                {/* 1. Page Background Blocks (Dimmed if popup active) */}
                                <div className={`transition-opacity duration-300 ${viewLayer === 'popup' ? 'opacity-20 pointer-events-none filter blur-sm' : 'opacity-100'}`}>
                                    {/* If Page is Active, we use DnD for it. If Popup is active, we just render it statically here. */}
                                    {viewLayer === 'page' ? (
                                        isClient ? (
                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragStart={handleDragStart}
                                                onDragOver={handleDragOver}
                                                onDragEnd={handleDragEnd}
                                            >
                                                <SortableContext items={pageBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                                    {renderBlockList(pageBlocks, true)}
                                                </SortableContext>
                                            </DndContext>
                                        ) : (
                                            renderBlockList(pageBlocks, false)
                                        )
                                    ) : (
                                        renderBlockList(pageBlocks, false)
                                    )}
                                </div>

                                {/* 2. Popup Overlay */}
                                <Multi21_PopupWrapper isOpen={viewLayer === 'popup'} onClose={() => setViewLayer('page')}>
                                    <div className="p-4 min-h-[200px]">
                                        {/* DnD Context for Popup */}
                                        {isClient ? (
                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragStart={handleDragStart}
                                                onDragOver={handleDragOver}
                                                onDragEnd={handleDragEnd}
                                            >
                                                <SortableContext items={popupBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                                    {renderBlockList(popupBlocks, true)}
                                                </SortableContext>
                                            </DndContext>
                                        ) : (
                                            renderBlockList(popupBlocks, false)
                                        )}
                                    </div>
                                </Multi21_PopupWrapper>
                            </div>
                        </div>
                    </main>
                </>
            ) : (
                <AgentflowApp
                    canvasId="current-demo"
                    deviceMode={previewMode}
                    onNodeSelect={(nodeId) => setActiveBlockId(nodeId)}
                />
            )}
        </>
    );
}
