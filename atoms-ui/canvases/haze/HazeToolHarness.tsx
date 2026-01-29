"use client";

import React, { useState } from 'react';
import { ToolControlProvider, ToolDefinition } from '../../harness/ToolControlProvider';
import { ChatProvider } from '../../harness/ChatContext';
import { TopPill } from '../../muscles/TopPill/TopPill';
import { ChatRailShell } from '../../muscles/ChatRail/ChatRail';
import { CanvasScope } from '../../types/CanvasContext';

// HAZE-specific ToolPop with custom navigation controls
import { HazeToolPop } from './HazeToolPop';

interface HazeToolHarnessProps {
    children: React.ReactNode;
    scope?: CanvasScope;
    registry?: Record<string, ToolDefinition>;
}

export function HazeToolHarness({
    children,
    scope = { surfaceId: 'haze', scope: 'global' },
    registry
}: HazeToolHarnessProps) {
    const [chatMode, setChatMode] = useState<'nano' | 'micro' | 'standard' | 'full'>('micro');
    const [showTools, setShowTools] = useState(false);

    // TopPill state (for right panel, export, etc.)
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    return (
        <ChatProvider>
            <ToolControlProvider scope={scope} registry={registry}>
                <div className="relative w-full h-screen overflow-hidden bg-black text-white">

                    {/* Layer 0: The Canvas */}
                    <div className="absolute inset-0 z-0">
                        {children}
                    </div>

                    {/* Layer 1: Top Navigation */}
                    <TopPill
                        setIsRightPanelOpen={setIsRightPanelOpen}
                        setIsExportOpen={setIsExportOpen}
                    />

                    {/* Layer 2: HAZE ToolPop (pops up from ChatRail) */}
                    {showTools && (
                        <HazeToolPop onClose={() => setShowTools(false)} />
                    )}

                    {/* Layer 3: Chat Rail (Always on Top) */}
                    <ChatRailShell
                        mode={chatMode}
                        onModeChange={(newMode) => {
                            setChatMode(newMode);
                            // When expanding ChatRail, collapse ToolPop
                            if (newMode !== 'nano' && showTools) {
                                setShowTools(false);
                            }
                        }}
                        showTools={showTools}
                        onToggleTools={() => {
                            setShowTools(!showTools);
                            // When opening ToolPop, collapse ChatRail to nano
                            if (!showTools) {
                                setChatMode('nano');
                            }
                        }}
                    />

                    {/* Right Panel (Settings/Page) */}
                    {isRightPanelOpen && (
                        <div className="fixed right-0 top-0 bottom-0 w-80 bg-neutral-900 border-l border-white/10 z-60 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Settings</h2>
                                <button
                                    onClick={() => setIsRightPanelOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg"
                                >
                                    ×
                                </button>
                            </div>
                            <p className="text-sm text-white/50">HAZE settings panel placeholder</p>
                        </div>
                    )}

                    {/* Export Modal */}
                    {isExportOpen && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center">
                            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold">Export</h2>
                                    <button
                                        onClick={() => setIsExportOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-lg"
                                    >
                                        ×
                                    </button>
                                </div>
                                <p className="text-sm text-white/50">HAZE export options placeholder</p>
                            </div>
                        </div>
                    )}

                </div>
            </ToolControlProvider>
        </ChatProvider>
    );
}
