"use client";

import React, { useState } from 'react';
import { ToolControlProvider, ToolDefinition } from './ToolControlProvider';
import { ChatProvider } from './ChatContext';
import { ToolPop } from '../muscles/ToolPop/ToolPop';
import { TopPill } from '../muscles/TopPill/TopPill';
import { ToolPill } from '../muscles/ToolPill/ToolPill';
import { ChatRailShell } from '../muscles/ChatRail/ChatRail';
import { CanvasScope } from '../types/CanvasContext';

interface ToolHarnessProps {
    children: React.ReactNode;
    // Context Config
    scope?: CanvasScope;
    registry?: Record<string, ToolDefinition>;
    feeds?: Record<string, any[]>;
    // Muscle Config
    showTopPill?: boolean;
    showToolPill?: boolean;
    showChatRail?: boolean;
    showToolPop?: boolean;
    // Initial State
    initialTools?: Record<string, any>;
}

export function ToolHarness({
    children,
    scope = { surfaceId: 'default', scope: 'global' },
    registry,
    feeds,
    showTopPill = true,
    showToolPill = true,
    showChatRail = true,
    showToolPop = true,
    initialTools
}: ToolHarnessProps) {
    const [chatMode, setChatMode] = useState<'nano' | 'micro' | 'standard' | 'full'>('micro');

    // ToolPill Props (Mock for now, should come from registry/provider)
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
    const [aspect, setAspect] = useState<'square' | 'portrait' | 'landscape'>('square');
    const [variant, setVariant] = useState<'generic' | 'product' | 'kpi' | 'text'>('generic');
    const [showTitle, setShowTitle] = useState(true);
    const [showMeta, setShowMeta] = useState(true);
    const [showBadge, setShowBadge] = useState(true);
    const [showCtaLabel, setShowCtaLabel] = useState(true);
    const [showCtaArrow, setShowCtaArrow] = useState(true);

    return (
        <ChatProvider>
            <ToolControlProvider scope={scope} registry={registry} initialState={initialTools}>
                <div className="relative w-full h-screen overflow-hidden bg-neutral-900 text-white selection:bg-purple-500/30">

                    {/* Layer 0: The Canvas */}
                    <div className="absolute inset-0 z-0">
                        {children}
                    </div>

                    {/* Layer 1: Top Navigation */}
                    {showTopPill && (
                        <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
                            <div className="pointer-events-auto">
                                <TopPill />
                            </div>
                        </div>
                    )}

                    {/* Layer 2: Dock / ToolPill */}
                    {showToolPill && (
                        <div className="pointer-events-auto">
                            <ToolPill
                                previewMode={previewMode} setPreviewMode={setPreviewMode}
                                align={align} setAlign={setAlign}
                                aspectRatio={aspect} setAspectRatio={setAspect}
                                tileVariant={variant} setTileVariant={setVariant}
                                showTitle={showTitle} setShowTitle={setShowTitle}
                                showMeta={showMeta} setShowMeta={setShowMeta}
                                showBadge={showBadge} setShowBadge={setShowBadge}
                                showCtaLabel={showCtaLabel} setShowCtaLabel={setShowCtaLabel}
                                showCtaArrow={showCtaArrow} setShowCtaArrow={setShowCtaArrow}
                            />
                        </div>
                    )}

                    {/* Layer 3: Bottom Controls (ToolPop) */}
                    {showToolPop && (
                        <ToolPop
                            // activeBlockId from context? 
                            // In real harness, we'd sync this with selection
                            feeds={feeds}
                        />
                    )}

                    {/* Layer 4: Chat Rail (Always on Top) */}
                    {showChatRail && (
                        <ChatRailShell
                            mode={chatMode}
                            onModeChange={setChatMode}
                        />
                    )}

                </div>
            </ToolControlProvider>
        </ChatProvider>
    );
}
