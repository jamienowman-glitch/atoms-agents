"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// --- State Definitions ---

export interface PageDesignState {
    backgroundColor: string;
    accentColor: string;
}

export interface PageSeoState {
    title: string;
    description: string;
    slug: string;
    ogImage?: string;
}

export interface PageTrackingState {
    ga4: string;
    metaPixel: string;
    tiktokPixel: string;
}

export interface PageState {
    design: PageDesignState;
    seo: PageSeoState;
    tracking: PageTrackingState;
}

interface PageControlContextType {
    // State Accessors
    design: PageDesignState;
    seo: PageSeoState;
    tracking: PageTrackingState;

    // Setters
    setDesign: (design: Partial<PageDesignState>) => void;
    setSeo: (seo: Partial<PageSeoState>) => void;
    setTracking: (tracking: Partial<PageTrackingState>) => void;

    // UI State
    isSettingsOpen: boolean;
    setSettingsOpen: (open: boolean) => void;
}

const defaultState: PageState = {
    design: {
        backgroundColor: '#ffffff',
        accentColor: '#3b82f6',
    },
    seo: {
        title: 'My Awesome Page',
        description: 'This is a description of my awesome page built with Multi21.',
        slug: 'my-awesome-page',
    },
    tracking: {
        ga4: '',
        metaPixel: '',
        tiktokPixel: '',
    },
};

const PageControlContext = createContext<PageControlContextType | undefined>(undefined);

export function PageControlProvider({ children, initialData }: { children: React.ReactNode, initialData?: Partial<PageState> }) {
    // --- State ---
    const [design, setDesignState] = useState<PageDesignState>({ ...defaultState.design, ...initialData?.design });
    const [seo, setSeoState] = useState<PageSeoState>({ ...defaultState.seo, ...initialData?.seo });
    const [tracking, setTrackingState] = useState<PageTrackingState>({ ...defaultState.tracking, ...initialData?.tracking });

    const [isSettingsOpen, setSettingsOpen] = useState(false);

    // --- Helpers to merge updates ---
    const setDesign = (updates: Partial<PageDesignState>) => setDesignState(prev => ({ ...prev, ...updates }));
    const setSeo = (updates: Partial<PageSeoState>) => setSeoState(prev => ({ ...prev, ...updates }));
    const setTracking = (updates: Partial<PageTrackingState>) => setTrackingState(prev => ({ ...prev, ...updates }));

    // --- Persistence (Mock) ---
    // In a real app, we'd sync this to a DB or LocalStorage
    useEffect(() => {
        // console.log('[PageControl] State Updated:', { design, seo, tracking });
    }, [design, seo, tracking]);

    const value = {
        design,
        seo,
        tracking,
        setDesign,
        setSeo,
        setTracking,
        isSettingsOpen,
        setSettingsOpen,
    };

    return (
        <PageControlContext.Provider value={value}>
            {children}
        </PageControlContext.Provider>
    );
}

export function usePageControl() {
    const context = useContext(PageControlContext);
    if (context === undefined) {
        throw new Error('usePageControl must be used within a PageControlProvider');
    }
    return context;
}
