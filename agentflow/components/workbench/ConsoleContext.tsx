"use client";

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { RequestContext, TransportConfig } from '@/lib/gate3/transport';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

type BaseRequestContext = Omit<RequestContext, 'request_id' | 'surface_id'> & {
    request_id?: string;
    surface_id?: string;
};

export interface ConsoleContextValue {
    baseContext: BaseRequestContext;
    transportConfig: Pick<TransportConfig, 'httpHost' | 'wsHost' | 'token' | 'useFetchSSE' | 'wsAuthMode'>;
    connectionStatus: { sse: ConnectionStatus; ws: ConnectionStatus };
    setConnectionStatus: React.Dispatch<React.SetStateAction<{ sse: ConnectionStatus; ws: ConnectionStatus }>>;
}

const ConsoleContext = createContext<ConsoleContextValue | undefined>(undefined);

export function ConsoleProvider({ children }: { children: React.ReactNode }) {
    const baseContext = useMemo<BaseRequestContext>(() => ({
        tenant_id: process.env.NEXT_PUBLIC_TENANT_ID || 't_demo',
        project_id: process.env.NEXT_PUBLIC_PROJECT_ID || 'p_demo',
        app_id: process.env.NEXT_PUBLIC_APP_ID || 'agentflow.ui',
        mode: (process.env.NEXT_PUBLIC_MODE as 'saas' | 'enterprise' | 'lab') || 'lab',
        user_id: process.env.NEXT_PUBLIC_USER_ID || undefined,
    }), []);

    const transportConfig = useMemo<ConsoleContextValue['transportConfig']>(() => ({
        httpHost: process.env.NEXT_PUBLIC_GATE3_HTTP_HOST || '/api',
        wsHost: process.env.NEXT_PUBLIC_GATE3_WS_HOST || 'ws://localhost:8000/api',
        token: process.env.NEXT_PUBLIC_GATE3_TOKEN || 'stub-token',
        useFetchSSE: true,
    }), []);

    const [connectionStatus, setConnectionStatus] = useState<{ sse: ConnectionStatus; ws: ConnectionStatus }>({
        sse: 'disconnected',
        ws: 'disconnected'
    });

    const value = useMemo(() => ({
        baseContext,
        transportConfig,
        connectionStatus,
        setConnectionStatus,
    }), [baseContext, transportConfig, connectionStatus]);

    return (
        <ConsoleContext.Provider value={value}>
            {children}
        </ConsoleContext.Provider>
    );
}

export function useConsoleContext() {
    const ctx = useContext(ConsoleContext);
    if (!ctx) throw new Error('useConsoleContext must be used within a ConsoleProvider');
    return ctx;
}
