"use client";

import React, { createContext, useContext, useState } from 'react';

type ViewMode = 'desktop' | 'mobile';

interface FlowContextType {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    activeTool: string | null;
    setActiveTool: (toolId: string | null) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: React.ReactNode }) {
    const [viewMode, setViewMode] = useState<ViewMode>('desktop');
    const [activeTool, setActiveTool] = useState<string | null>(null);

    return (
        <FlowContext.Provider value={{ viewMode, setViewMode, activeTool, setActiveTool }}>
            {children}
        </FlowContext.Provider>
    );
}

// Stub for legacy tool control to prevent breakages during migration
export function useToolControl() {
    const { activeTool, setActiveTool } = useFlow();

    // Minimal mock implementation
    const useToolState = <T,>(config: { defaultValue: T } & Record<string, any>) => {
        const [value, setValue] = useState<T>(config.defaultValue);
        return [value, setValue] as const;
    };

    return {
        useToolState,
        activeTool,
        setActiveTool,
        updateTool: () => console.log("updateTool stub"),
        state: {} // Empty state stub
    };
}

export function useFlow() {
    const context = useContext(FlowContext);
    if (!context) {
        throw new Error("useFlow must be used within a FlowProvider");
    }
    return context;
}
