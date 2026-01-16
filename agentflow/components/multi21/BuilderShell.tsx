"use client";

import React, { useState } from 'react';
import { ToolControlProvider, useToolControl } from '../../context/ToolControlContext';
import { ChatRailShell } from '../chat/ChatRailShell';




import { PageControlProvider, usePageControl } from '../../context/PageControlContext';
import { TopControls } from './TopControls';
import { PageSettingsPanel } from './PageSettingsPanel';

const initialToolState = {
    'multi21.designer:global:global:grid.cols_desktop': 6,
    'multi21.designer:global:global:grid.cols_mobile': 2,
    'multi21.designer:global:global:grid.gap_x': 16,
    'multi21.designer:global:global:grid.tile_radius': 8,
    'multi21.designer:global:global:feed.query.limit': 12,
    'multi21.designer:global:global:align': 'center',
    'multi21.designer:global:global:tile.variant': 'generic',
    'multi21.designer:global:global:grid.aspect_ratio': '16:9',
    'multi21.designer:global:global:previewMode': 'desktop',
    'multi21.designer:global:global:tile.show_title': true,
    'multi21.designer:global:global:tile.show_meta': true,
    'multi21.designer:global:global:tile.show_badge': true,
    'multi21.designer:global:global:tile.show_cta_label': true,
    'multi21.designer:global:global:tile.show_cta_arrow': true,
    'multi21.shell:global:global:chat.mode': 'nano',
};

// Types needed for coordination
type ChatMode = 'nano' | 'micro' | 'standard' | 'full';

export function BuilderShell({ children, showGraphControls }: { children: React.ReactNode, showGraphControls?: boolean }) {
    return (
        <ToolControlProvider initialState={initialToolState}>
            <PageControlProvider>
                <BuilderShellInner showGraphControls={showGraphControls}>
                    {children}
                </BuilderShellInner>
            </PageControlProvider>
        </ToolControlProvider>
    );
}

function BuilderShellInner({ children, showGraphControls }: { children: React.ReactNode, showGraphControls?: boolean }) {
    const { useToolState } = useToolControl();
    const { design } = usePageControl();

    // Global Preview Mode
    const [previewMode] = useToolState<'desktop' | 'mobile'>({ target: { surfaceId: 'multi21.designer', toolId: 'previewMode' }, defaultValue: 'desktop' });

    // 1. Manual State Wiring (Visibility)
    // Connecting to Global Tool State so Multi21Designer can read it
    const [showTools, setShowTools] = useToolState<boolean>({ target: { surfaceId: 'multi21.shell', toolId: 'ui.show_tools' }, defaultValue: false });
    const toggleTools = () => {
        console.log('[BuilderShell] Toggling Tools:', !showTools);
        setShowTools(!showTools);
    };

    // 2. Manual Layout Wiring (Positioning)
    // Lifting 'chatMode' state so both the Rail (Height) and Panel (Bottom Position) update synchronously.
    const [chatMode, setChatMode] = useState<ChatMode>('nano');

    return (
        <React.Fragment>
            {/* 1. Global Controls (Command Center) */}
            <TopControls showGraphControls={showGraphControls} />

            {/* 2. Global Settings Drawer */}
            <PageSettingsPanel />

            {/* 4. Chat Rail Shell (Bottom Fixed) */}
            {/* Manual Wiring: Passed toggle function and CONTROLLED mode */}
            <ChatRailShell
                showTools={showTools}
                onToggleTools={toggleTools}
                mode={chatMode}
                onModeChange={setChatMode}
            />

            {/* Main Content Area (Layout Inheritor) */}
            {/* We apply global CSS variables here for the Cascade */}
            <div
                className={`min-h-screen transition-all duration-300 ${previewMode === 'mobile' ? 'bg-neutral-100/50 dark:bg-neutral-900/50' : ''}`}
                style={{
                    // @ts-ignore
                    '--page-bg': design.backgroundColor,
                    '--global-funk': design.accentColor,
                    backgroundColor: previewMode === 'desktop' ? design.backgroundColor : undefined // Apply mainly in desktop/full mode
                }}
            >
                {children}
            </div>
        </React.Fragment>
    );
}
