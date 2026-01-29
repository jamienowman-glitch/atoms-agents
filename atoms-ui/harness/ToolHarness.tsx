"use client";

import React, { useCallback, useState } from 'react';
import { ToolControlProvider, ToolDefinition, useToolControl } from './ToolControlProvider';
import { ChatProvider } from './ChatContext';
import { ToolPop } from '../muscles/ToolPop/ToolPop';
import { TopPill } from '../muscles/TopPill/TopPill';
import { ToolPill } from '../muscles/ToolPill/ToolPill';
import { ChatRailShell } from '../muscles/ChatRail/ChatRail';
import { CanvasScope } from '../types/CanvasContext';
import { ToolOp, ToolTarget } from '../types/ToolEvent';
import { useCanvasTransport } from './transport/provider';

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
    toolPopAttachment?: 'screen' | 'chatrail';
    // Initial State
    initialTools?: Record<string, any>;
    transportCanvasId?: string;
}

function HarnessShell({
    children,
    feeds,
    showTopPill = true,
    showToolPill = true,
    showChatRail = true,
    showToolPop = true,
    toolPopAttachment = 'chatrail'
}: {
    children: React.ReactNode;
    feeds?: Record<string, any[]>;
    showTopPill?: boolean;
    showToolPill?: boolean;
    showChatRail?: boolean;
    showToolPop?: boolean;
    toolPopAttachment?: 'screen' | 'chatrail';
}) {
    const { useToolState } = useToolControl();
    const [chatMode, setChatMode] = useState<'nano' | 'micro' | 'standard' | 'full'>('micro');

    // ToolPill Props (Mock for now, should come from registry/provider)
    const [previewMode, setPreviewMode] = useToolState<'desktop' | 'mobile'>('previewMode', 'desktop');
    const [align, setAlign] = useToolState<'left' | 'center' | 'right'>('align', 'center');
    const [aspect, setAspect] = useToolState<'square' | 'portrait' | 'landscape'>('aspect', 'square');
    const [variant, setVariant] = useToolState<'generic' | 'product' | 'kpi' | 'text'>('tile.variant', 'generic');
    const [showTitle, setShowTitle] = useToolState<boolean>('tile.show_title', true);
    const [showMeta, setShowMeta] = useToolState<boolean>('tile.show_meta', true);
    const [showBadge, setShowBadge] = useToolState<boolean>('tile.show_badge', true);
    const [showCtaLabel, setShowCtaLabel] = useToolState<boolean>('tile.show_cta_label', true);
    const [showCtaArrow, setShowCtaArrow] = useToolState<boolean>('tile.show_cta_arrow', true);

    const [showTools, setShowTools] = useToolState<boolean>('ui.show_tools', false);
    const toggleTools = () => setShowTools(!showTools);

    const toolPopNode = showToolPop ? (
        <ToolPop
            feeds={feeds}
            attachment={toolPopAttachment}
        />
    ) : null;

    return (
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
            {showToolPop && toolPopAttachment === 'screen' && toolPopNode}

            {/* Layer 4: Chat Rail (Always on Top) */}
            {showChatRail && (
                <ChatRailShell
                    mode={chatMode}
                    onModeChange={setChatMode}
                    showTools={showTools}
                    onToggleTools={toggleTools}
                    toolPop={toolPopAttachment === 'chatrail' ? toolPopNode : undefined}
                />
            )}

        </div>
    );
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
    toolPopAttachment = 'chatrail',
    initialTools
    ,
    transportCanvasId
}: ToolHarnessProps) {
    const transport = useCanvasTransport();
    const handleToolUpdate = useCallback(
        (target: ToolTarget, op: ToolOp, value?: any) => {
            if (!transport || !transportCanvasId) return;
            transport.sendCommand(transportCanvasId, {
                base_rev: 0,
                ops: [],
                actor_id: 'u_me',
                correlation_id: crypto.randomUUID(),
                type: 'command',
                command: 'update_tool',
                payload: { target, op, value }
            });
        },
        [transport, transportCanvasId],
    );

    return (
        <ChatProvider>
            <ToolControlProvider
                scope={scope}
                registry={registry}
                initialState={initialTools}
                onUpdateTool={handleToolUpdate}
            >
                <HarnessShell
                    feeds={feeds}
                    showTopPill={showTopPill}
                    showToolPill={showToolPill}
                    showChatRail={showChatRail}
                    showToolPop={showToolPop}
                    toolPopAttachment={toolPopAttachment}
                >
                    {children}
                </HarnessShell>
            </ToolControlProvider>
        </ChatProvider>
    );
}
