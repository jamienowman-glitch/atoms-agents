"use client";

import React from 'react';
import { FlowProvider } from './context/FlowContext';
import { TopPill } from './shells/TopPill';
import { ChatRail } from './shells/ChatRail';
import { ToolPop } from './shells/ToolPop';
import { ToolPill } from './shells/ToolPill';

interface FlowHarnessProps {
    children: React.ReactNode;
    toolPopContent?: React.ReactNode;
    toolPillContent?: React.ReactNode;
}

export function FlowHarness({ children, toolPopContent, toolPillContent }: FlowHarnessProps) {
    return (
        <FlowProvider>
            <div className="min-h-screen bg-neutral-100 dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans selection:bg-orange-500/30">
                {/* 1. Global HUD */}
                <TopPill />

                {/* 2. The Canvas Workspace */}
                <main className="relative z-0 min-h-screen pt-16 pb-32">
                    {children}
                </main>

                {/* 3. The Orchestration Layer (Overlays) */}
                <ChatRail />

                {/* 4. Tool Surfaces */}
                <ToolPop isOpen={!!toolPopContent}>
                    {toolPopContent}
                </ToolPop>

                <ToolPill>
                    {toolPillContent}
                </ToolPill>
            </div>
        </FlowProvider>
    );
}
