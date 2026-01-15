import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FloatingLaunchersLayoutConfig, FloatingLauncherState } from './LauncherTypes';
import { defaultLaunchers, DEFAULT_LAYOUT_VERSION } from './LauncherUtils';

const STORAGE_KEY = 'multi21_launchers_layout';

interface LauncherContextValue {
    layout: FloatingLaunchersLayoutConfig;
    updateLauncher: (id: string, updater: (prev: FloatingLauncherState) => FloatingLauncherState) => void;
    updateTool: (target: { launcherId: string; surfaceId: string; toolId: string }, payload: any) => void;
    setLayout: React.Dispatch<React.SetStateAction<FloatingLaunchersLayoutConfig>>;
}

const LauncherContext = createContext<LauncherContextValue | undefined>(undefined);

function loadLayout(): FloatingLaunchersLayoutConfig {
    if (typeof window === 'undefined') return defaultLaunchers();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultLaunchers();
    try {
        const parsed = JSON.parse(raw) as FloatingLaunchersLayoutConfig;
        if (parsed.version !== DEFAULT_LAYOUT_VERSION) {
            return defaultLaunchers();
        }
        return parsed;
    } catch {
        return defaultLaunchers();
    }
}

export function LauncherProvider({ children }: { children: React.ReactNode }) {
    const [layout, setLayout] = useState<FloatingLaunchersLayoutConfig>(() => loadLayout());

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
        }
    }, [layout]);

    const updateLauncher = (id: string, updater: (prev: FloatingLauncherState) => FloatingLauncherState) => {
        setLayout(prev => {
            const current = prev.launchers[id];
            if (!current) return prev;
            return {
                ...prev,
                launchers: {
                    ...prev.launchers,
                    [id]: updater(current),
                },
            };
        });
    };

    const updateTool = (_target: { launcherId: string; surfaceId: string; toolId: string }, _payload: any) => {
        // Placeholder: hook for SSE/tool updates; to be wired in future phases.
    };

    const value = useMemo(() => ({ layout, updateLauncher, updateTool, setLayout }), [layout]);

    return <LauncherContext.Provider value={value}>{children}</LauncherContext.Provider>;
}

export function useLauncherContext(): LauncherContextValue {
    const ctx = useContext(LauncherContext);
    if (!ctx) throw new Error('useLauncherContext must be used within LauncherProvider');
    return ctx;
}
