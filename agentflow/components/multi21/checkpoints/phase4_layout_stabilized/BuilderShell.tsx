"use client";

import React, { useState } from 'react';
import { ToolControlProvider, useToolControl } from '../../context/ToolControlContext';
import { ChatRailShell } from '../chat/ChatRailShell';
import { FloatingAction } from '../ui/FloatingAction';
import { BottomControlsPanel } from './BottomControlsPanel';

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

export function BuilderShell({ children }: { children: React.ReactNode }) {
    return (
        <ToolControlProvider initialState={initialToolState}>
            <BuilderShellInner>
                {children}
            </BuilderShellInner>
        </ToolControlProvider>
    );
}

function BuilderShellInner({ children }: { children: React.ReactNode }) {
    const { useToolState } = useToolControl();
    const [previewMode, setPreviewMode] = useToolState<'desktop' | 'mobile'>({ target: { surfaceId: 'multi21.designer', toolId: 'previewMode' }, defaultValue: 'desktop' });

    // 1. Manual State Wiring (Visibility)
    const [showTools, setShowTools] = useState(false);
    const toggleTools = () => setShowTools(prev => !prev);

    // 2. Manual Layout Wiring (Positioning)
    // Lifting 'chatMode' state so both the Rail (Height) and Panel (Bottom Position) update synchronously.
    const [chatMode, setChatMode] = useState<ChatMode>('nano');

    return (
        <React.Fragment>
            {/* 1. Top Context Pill (Floating) */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 h-12 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl rounded-full px-4 flex items-center gap-2 z-[60] transition-all duration-300">

                {/* Device Selectors */}
                <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-full p-1">
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-2 rounded-full transition-all duration-200 ${previewMode === 'mobile' ? 'bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white' : 'text-neutral-400 hover:text-neutral-600'}`}
                        title="Mobile View"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="12" height="20" x="6" y="2" rx="2" ry="2" /></svg>
                    </button>
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-2 rounded-full transition-all duration-200 ${previewMode === 'desktop' ? 'bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white' : 'text-neutral-400 hover:text-neutral-600'}`}
                        title="Desktop View"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                    </button>
                </div>

                <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />

                {/* Export Action */}
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-colors">
                    <span>Export</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                </button>
            </div>

            {/* 2. Floating Action Button (New) */}
            <FloatingAction />

            {/* 3. Bottom Controls Panel (Rides the Rail) */}
            {/* Manual Wiring: Passed isVisible AND chatMode directly */}
            <BottomControlsPanel
                isVisible={showTools}
                chatMode={chatMode}
            />

            {/* 4. Chat Rail Shell (Bottom Fixed) */}
            {/* Manual Wiring: Passed toggle function and CONTROLLED mode */}
            <ChatRailShell
                showTools={showTools}
                onToggleTools={toggleTools}
                mode={chatMode}
                onModeChange={setChatMode}
            />

            {/* Main Content Area */}
            <div className={`min-h-screen transition-colors duration-300 ${previewMode === 'mobile' ? 'bg-neutral-100/50 dark:bg-neutral-900/50' : ''}`}>
                {children}
            </div>
        </React.Fragment>
    );
}
