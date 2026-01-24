"use client";

import React, { useState } from 'react';
import { ToolControlProvider, useToolControl } from '../../context/ToolControlContext';
import { PageControlProvider, usePageControl } from '../../context/PageControlContext';
import { ChatRailShell } from '../chat/ChatRailShell';
import { PageSettingsPanel } from '../../app/nx-marketing-agents/core/multi21/PageSettingsPanel';
import { ExportPanel } from '../../app/nx-marketing-agents/core/multi21/ExportPanel';
import { WorkbenchHeader } from './WorkbenchHeader';
import { FloatingControlsDock } from './FloatingControlsDock';
import { ConsoleProvider } from './ConsoleContext';
import { useWorkbenchTransport } from './useWorkbenchTransport';
import type { CanvasCartridge } from './types';

// Types needed for coordination
type ChatMode = 'nano' | 'micro' | 'standard' | 'full';
type PreviewMode = 'desktop' | 'mobile';
type Align = 'left' | 'center' | 'right';
type Aspect = 'square' | 'portrait' | 'landscape';
type Variant = 'generic' | 'product' | 'kpi' | 'text';

// Support both Legacy and CSP modes
type WorkbenchShellProps =
    | {
        cartridge: CanvasCartridge;
        children: React.ReactNode;
        surfaceId?: never;
        toolMap?: never;
        canvas?: never;
    }
    | {
        surfaceId: string;
        toolMap?: Record<string, string>;
        canvas: (transport: any) => React.ReactNode;
        children?: never;
        cartridge?: never;
    };

const initialToolState = {
    'multi21.designer:global:global:grid.cols_desktop': 6,
    'multi21.designer:global:global:grid.cols_mobile': 2,
    'multi21.designer:global:global:grid.gap_x': 16,
    'multi21.designer:global:global:previewMode': 'desktop',
    'multi21.designer:global:global:show_registry': false,
    // Standard Floating Dock States
    'global:dock:align': 'center',
    'global:dock:aspect': 'landscape',
    'global:dock:variant': 'generic',
    'global:dock:show_title': true,
    'global:dock:show_meta': true,
    'global:dock:show_badge': true,
    'global:dock:show_cta_label': true,
    'global:dock:show_cta_arrow': true,
};

export function WorkbenchShell(props: WorkbenchShellProps) {
    return (
        <ConsoleProvider>
            <ToolControlProvider initialState={initialToolState}>
                <PageControlProvider>
                    <WorkbenchShellInner {...props} />
                </PageControlProvider>
            </ToolControlProvider>
        </ConsoleProvider>
    );
}

function WorkbenchShellInner(props: WorkbenchShellProps) {
    const { useToolState } = useToolControl();
    const { design, setSettingsOpen, setExportOpen } = usePageControl();
    const transport = useWorkbenchTransport();

    // Determine Identity
    const surfaceId = props.surfaceId || props.cartridge?.id || 'unknown.surface';

    // Global Preview Mode
    const [previewMode, setPreviewMode] = useToolState<PreviewMode>({
        target: { surfaceId, toolId: 'previewMode' },
        defaultValue: 'desktop'
    });

    // Standard Dock States (Mapped to Surface)
    const [align, setAlign] = useToolState<Align>({ target: { surfaceId, toolId: 'align' }, defaultValue: 'center' });
    const [aspect, setAspect] = useToolState<Aspect>({ target: { surfaceId, toolId: 'aspect' }, defaultValue: 'landscape' });
    const [variant, setVariant] = useToolState<Variant>({ target: { surfaceId, toolId: 'variant' }, defaultValue: 'generic' });

    // Visibility States
    const [showTitle, setShowTitle] = useToolState<boolean>({ target: { surfaceId, toolId: 'show_title' }, defaultValue: true });
    const [showMeta, setShowMeta] = useToolState<boolean>({ target: { surfaceId, toolId: 'show_meta' }, defaultValue: true });
    const [showBadge, setShowBadge] = useToolState<boolean>({ target: { surfaceId, toolId: 'show_badge' }, defaultValue: true });
    const [showCtaLabel, setShowCtaLabel] = useToolState<boolean>({ target: { surfaceId, toolId: 'show_cta_label' }, defaultValue: true });
    const [showCtaArrow, setShowCtaArrow] = useToolState<boolean>({ target: { surfaceId, toolId: 'show_cta_arrow' }, defaultValue: true });

    // Manual State Wiring (Visibility)
    const [showTools, setShowTools] = useToolState<boolean>({ target: { surfaceId, toolId: 'ui.show_tools' }, defaultValue: false });
    const toggleTools = () => setShowTools(!showTools);

    // Chat Mode
    const [chatMode, setChatMode] = useState<ChatMode>('nano');

    // Legacy Support
    const enablePagePanels = props.cartridge?.enablePagePanels ?? true;
    const rightControls = props.cartridge?.TopControls ? <props.cartridge.TopControls /> : undefined;
    const logoIcon = props.cartridge?.logoIcon;

    return (
        <React.Fragment>
            {/* 1. Global Controls (Command Center) - TopLozenge */}
            <WorkbenchHeader
                logoIcon={logoIcon}
                RightControls={rightControls}
                setIsRightPanelOpen={enablePagePanels ? setSettingsOpen : undefined}
                setIsExportOpen={enablePagePanels ? setExportOpen : undefined}
            />

            {/* 2. Global Settings Drawer */}
            {enablePagePanels && <PageSettingsPanel />}
            {enablePagePanels && <ExportPanel />}

            {/* 3. The ToolPill (FloatingControlsDock) */}
            <FloatingControlsDock
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                align={align}
                setAlign={setAlign}
                aspectRatio={aspect}
                setAspectRatio={setAspect}
                tileVariant={variant}
                setTileVariant={setVariant}
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

            {/* 4. The AgentFax (ChatRailShell) - Includes ToolPop inside */}
            <ChatRailShell
                showTools={showTools}
                onToggleTools={toggleTools}
                mode={chatMode}
                onModeChange={setChatMode}
            />

            {/* Main Content Area (Layout Inheritor) */}
            <div
                className={`min-h-screen transition-all duration-300 ${previewMode === 'mobile' ? 'bg-neutral-100/50 dark:bg-neutral-900/50' : ''}`}
                style={{
                    // @ts-ignore
                    '--page-bg': design.backgroundColor,
                    '--global-funk': design.accentColor,
                    backgroundColor: previewMode === 'desktop' ? design.backgroundColor : undefined
                }}
            >
                {/* Render Legacy Children OR New Canvas Function */}
                {props.children ? props.children : props.canvas?.(transport)}
            </div>
        </React.Fragment>
    );
}
