"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FloatingIcon, Corner } from './FloatingIcon';
import { FloatingToolbar } from './FloatingToolbar';
import { HorizontalToolbar, ToolItem } from './HorizontalToolbar';

export interface IconState {
    id: string;
    corner: Corner;
    offset: { x: number; y: number };
    isOpen: boolean;
    toolbarType: 'vertical' | 'horizontal';
}

interface MobileConfig {
    icons: Record<string, IconState>;
}

interface MobileFloatingManagerProps {
    settingsContent: React.ReactNode;
    toolsContent: React.ReactNode;
}

const STORAGE_KEY = 'multi21_mobile_layout';
const STACK_GAP = 72;

const gearIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.15.48.5.87.97 1.08H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
);

const toolsIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
    </svg>
);

const defaultConfig: MobileConfig = {
    icons: {
        settings: { id: 'settings', corner: 'BR', offset: { x: 0, y: 0 }, isOpen: false, toolbarType: 'vertical' },
        tools: { id: 'tools', corner: 'BR', offset: { x: 0, y: STACK_GAP }, isOpen: false, toolbarType: 'horizontal' },
    },
};

function loadConfig(): MobileConfig {
    if (typeof window === 'undefined') return defaultConfig;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig;
    try {
        const parsed = JSON.parse(raw) as MobileConfig;
        if (parsed && parsed.icons) {
            // ensure toolbarType defaults
            const patchedIcons: Record<string, IconState> = Object.fromEntries(
                Object.entries(parsed.icons).map(([id, icon]) => [
                    id,
                    {
                        ...icon,
                        toolbarType: icon.toolbarType ?? (id === 'tools' ? 'horizontal' : 'vertical'),
                    },
                ]),
            );
            return { ...parsed, icons: patchedIcons };
        }
        return defaultConfig;
    } catch {
        return defaultConfig;
    }
}

export function MobileFloatingManager({ settingsContent, toolsContent }: MobileFloatingManagerProps) {
    const [config, setConfig] = useState<MobileConfig>(() => loadConfig());
    const [iconRects, setIconRects] = useState<Record<string, DOMRect | null>>({});
    const iconsOrder = useMemo(() => ['settings', 'tools'], []);
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }, [config]);

    useEffect(() => {
        const handleOutside = (event: PointerEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;
            if (target.closest('[data-floating-icon]') || target.closest('[data-floating-toolbar]')) {
                return;
            }
            setConfig(prev => ({
                ...prev,
                icons: Object.fromEntries(Object.entries(prev.icons).map(([key, value]) => [key, { ...value, isOpen: false }])),
            }));
        };
        window.addEventListener('pointerdown', handleOutside);
        return () => window.removeEventListener('pointerdown', handleOutside);
    }, []);

    const applyStackOffsets = (icons: Record<string, IconState>) => {
        const nextIcons = { ...icons };
        const groups: Record<Corner, string[]> = { TL: [], TR: [], BL: [], BR: [] };
        Object.values(nextIcons).forEach(icon => {
            groups[icon.corner].push(icon.id);
        });
        (Object.keys(groups) as Corner[]).forEach(corner => {
            const ids = groups[corner];
            ids.sort((a, b) => iconsOrder.indexOf(a) - iconsOrder.indexOf(b));
            ids.forEach((id, index) => {
                const current = nextIcons[id];
                nextIcons[id] = {
                    ...current,
                    offset: { x: current.offset.x, y: index * STACK_GAP },
                };
            });
        });
        return nextIcons;
    };

    const toggleIcon = (id: string) => {
        setConfig(prev => {
            const nextIcons = Object.fromEntries(
                Object.entries(prev.icons).map(([key, value]) => [
                    key,
                    { ...value, isOpen: key === id ? !value.isOpen : false },
                ]),
            );
            return { ...prev, icons: applyStackOffsets(nextIcons as Record<string, IconState>) };
        });
    };

    const updateCorner = (id: string, corner: Corner) => {
        setConfig(prev => {
            const nextIcons = {
                ...prev.icons,
                [id]: { ...prev.icons[id], corner, isOpen: false },
            };
            return { ...prev, icons: applyStackOffsets(nextIcons) };
        });
    };

    const handleRectChange = (id: string, rect: DOMRect) => {
        setIconRects(prev => ({ ...prev, [id]: rect }));
    };

    const icons = config.icons;

    const toolItems: ToolItem[] = useMemo(
        () => [
            {
                id: 'grid-toggle',
                icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
                label: 'Grid',
                onClick: () => setConfig(prev => prev), // placeholder hook
            },
            {
                id: 'data-refresh',
                icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0 0 20.49 15" /></svg>,
                label: 'Refresh',
                onClick: () => setConfig(prev => prev),
            },
            {
                id: 'info',
                icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="8" /></svg>,
                label: 'Info',
                onClick: () => setConfig(prev => prev),
            },
        ],
        [],
    );

    return (
        <>
            {iconsOrder.map(id => {
                const iconState = icons[id];
                if (!iconState) return null;
                const iconNode = id === 'settings' ? gearIcon : toolsIcon;
                const content = id === 'settings' ? settingsContent : toolsContent;

                const isHorizontal = iconState.toolbarType === 'horizontal';

                return (
                    <React.Fragment key={id}>
                        <FloatingIcon
                            id={id}
                            icon={iconNode}
                            corner={iconState.corner}
                            offset={iconState.offset}
                            isToolbarOpen={iconState.isOpen}
                            onTap={() => toggleIcon(id)}
                            onCornerChange={next => updateCorner(id, next)}
                            onRectChange={rect => handleRectChange(id, rect)}
                        />
                        {isHorizontal ? (
                            <HorizontalToolbar
                                anchorIconRect={iconRects[id] ?? null}
                                corner={iconState.corner}
                                isOpen={iconState.isOpen}
                                tools={toolItems}
                                onClose={() => toggleIcon(id)}
                            />
                        ) : (
                            <FloatingToolbar
                                anchorIconRect={iconRects[id] ?? null}
                                corner={iconState.corner}
                                isOpen={iconState.isOpen}
                            >
                                <div data-floating-toolbar className="text-neutral-900 dark:text-neutral-100">
                                    {content}
                                </div>
                            </FloatingToolbar>
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
}
