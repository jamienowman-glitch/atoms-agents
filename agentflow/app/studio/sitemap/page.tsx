"use client";

import React from 'react';
import { AllucaneeatCanvas } from '@/components/canvases/AllucaneeatCanvas';
import { FloatingControlsDock } from '@/components/workbench/FloatingControlsDock';
import { ChatRailShell } from '@/components/chat/ChatRailShell';
import { ToolControlProvider, useToolControl } from '@/context/ToolControlContext';
import { ConsoleProvider } from '@/components/workbench/ConsoleContext';

// --- Inner Component (Consumes Context) ---
function SitemapStudioContent() {
    const { useToolState } = useToolControl();

    // -- Floating Controls Wiring (allucaneeat.designer) --
    const [previewMode, setPreviewMode] = useToolState<'desktop' | 'mobile'>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'previewMode' }, defaultValue: 'desktop' });
    const [align, setAlign] = useToolState<'left' | 'center' | 'right'>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'align' }, defaultValue: 'center' });
    const [aspectRatio, setAspectRatio] = useToolState<'square' | 'portrait' | 'landscape'>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'aspectRatio' }, defaultValue: 'square' });
    const [tileVariant, setTileVariant] = useToolState<'generic' | 'product' | 'kpi' | 'text'>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'tileVariant' }, defaultValue: 'generic' });

    // Booleans
    const [showTitle, setShowTitle] = useToolState<boolean>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'showTitle' }, defaultValue: true });
    const [showMeta, setShowMeta] = useToolState<boolean>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'showMeta' }, defaultValue: true });
    const [showBadge, setShowBadge] = useToolState<boolean>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'showBadge' }, defaultValue: true });
    const [showCtaLabel, setShowCtaLabel] = useToolState<boolean>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'showCtaLabel' }, defaultValue: true });
    const [showCtaArrow, setShowCtaArrow] = useToolState<boolean>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'showCtaArrow' }, defaultValue: true });

    // ChatRail Mode
    const [chatMode, setChatMode] = useToolState<'nano' | 'micro' | 'standard' | 'full'>({ target: { surfaceId: 'allucaneeat.shell', toolId: 'chatMode' }, defaultValue: 'standard' });
    const [showTools, setShowTools] = useToolState<boolean>({ target: { surfaceId: 'allucaneeat.shell', toolId: 'showTools' }, defaultValue: false });

    return (
        <div className="relative w-full h-screen bg-neutral-950 overflow-hidden">
            {/* Layer 0: Canvas */}
            <div className="absolute inset-0 z-0">
                <AllucaneeatCanvas transport={null} />
            </div>

            {/* Layer 10: FloatingControlsDock */}
            <div className="z-10 relative pointer-events-none">
                {/* Dock handles its own positioning but is 'interactive' so we need pointer-events-auto on it (handled by component usually) 
                     However, the Dock component renders fixed position. 
                 */}
                <FloatingControlsDock
                    previewMode={previewMode}
                    setPreviewMode={setPreviewMode}
                    align={align}
                    setAlign={setAlign}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    tileVariant={tileVariant}
                    setTileVariant={setTileVariant}
                    showTitle={showTitle}
                    setShowTitle={setShowTitle}
                    showMeta={showMeta}
                    setShowMeta={setShowMeta}
                    showBadge={showBadge}
                    setShowBadge={setShowBadge}
                    showCtaLabel={showCtaLabel}
                    setShowCtaLabel={setShowCtaLabel}
                    showCtaArrow={showCtaArrow}
                    setShowCtaArrow={setShowCtaArrow}
                />
            </div>

            {/* Layer 20: ChatRailShell */}
            <div className="z-20 relative">
                <ChatRailShell
                    mode={chatMode}
                    onModeChange={setChatMode}
                    showTools={showTools}
                    onToggleTools={() => setShowTools(!showTools)}
                />
            </div>
        </div>
    );
}

export default function SitemapStudioPage() {
    return (
        <ConsoleProvider>
            <ToolControlProvider>
                <SitemapStudioContent />
            </ToolControlProvider>
        </ConsoleProvider>
    );
}
