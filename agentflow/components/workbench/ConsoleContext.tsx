"use client";

import React, { createContext, useContext, useMemo, useState, useEffect, useRef } from 'react';
import type { RequestContext, TransportConfig } from '@/lib/gate3/transport';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

type BaseRequestContext = Omit<RequestContext, 'request_id' | 'surface_id'> & {
    request_id?: string;
    surface_id?: string;
};

type RunVisibility = 'public' | 'internal' | 'system';

interface RunStreamMessage {
    id: string;
    type: string;
    text: string;
    ts: string;
    visibility: RunVisibility;
    actor?: string;
    provenance?: {
        agent_id?: string;
        node_id?: string;
        run_id?: string;
        edge_id?: string;
    };
}

interface MemoryRecord {
    key: string;
    edgeId: string;
    version?: number;
    sourceNodeId?: string;
    eventId: string;
    ts: string;
    data: Record<string, unknown>;
}

const RUN_MESSAGE_LIMIT = 120;

const generateRequestId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `req-${Date.now().toString(16)}-${Math.floor(Math.random() * 0xffff).toString(16)}`;
};

const normalizeVisibility = (value?: unknown): RunVisibility => {
    if (value === 'internal') return 'internal';
    if (value === 'system') return 'system';
    return 'public';
};

const formatRunMessageText = (eventType: string, data: Record<string, any>): string => {
    if (typeof data?.message === 'string') return data.message;
    if (typeof data?.text === 'string') return data.text;
    if (typeof data?.delta === 'string') return data.delta;
    if (typeof data?.key === 'string') return `${eventType}: ${data.key}`;
    const serialized = JSON.stringify(data ?? {});
    if (!serialized || serialized === '{}') return `${eventType} event`;
    return serialized.length > 200 ? `${serialized.slice(0, 197)}…` : serialized;
};

export interface ConsoleContextValue {
    baseContext: BaseRequestContext;
    transportConfig: Pick<TransportConfig, 'httpHost' | 'wsHost' | 'token' | 'useFetchSSE' | 'wsAuthMode'>;
    connectionStatus: { sse: ConnectionStatus; ws: ConnectionStatus };
    setConnectionStatus: React.Dispatch<React.SetStateAction<{ sse: ConnectionStatus; ws: ConnectionStatus }>>;
    runId?: string;
    runConnectionStatus: ConnectionStatus;
    runMessages: RunStreamMessage[];
    whiteboardWrites: Record<string, MemoryRecord>;
    blackboardWrites: Record<string, Record<string, MemoryRecord>>;
}

const ConsoleContext = createContext<ConsoleContextValue | undefined>(undefined);

export function ConsoleProvider({ children }: { children: React.ReactNode }) {
    const baseContext = useMemo<BaseRequestContext>(() => ({
        tenant_id: process.env.NEXT_PUBLIC_TENANT_ID || 't_demo',
        project_id: process.env.NEXT_PUBLIC_PROJECT_ID || 'p_demo',
        app_id: process.env.NEXT_PUBLIC_APP_ID || 'agentflow.ui',
        mode: (process.env.NEXT_PUBLIC_MODE as 'saas' | 'enterprise' | 'lab') || 'lab',
        user_id: process.env.NEXT_PUBLIC_USER_ID || undefined,
        request_id: generateRequestId(),
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
    const [runConnectionStatus, setRunConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [runMessages, setRunMessages] = useState<RunStreamMessage[]>([]);
    const [whiteboardWrites, setWhiteboardWrites] = useState<Record<string, MemoryRecord>>({});
    const [blackboardWrites, setBlackboardWrites] = useState<Record<string, Record<string, MemoryRecord>>>({});

    const runControllerRef = useRef<AbortController | null>(null);
    const reconnectTimerRef = useRef<number | null>(null);
    const retryCountRef = useRef(0);
    const lastEventIdRef = useRef<string | undefined>(undefined);

    const runId = process.env.NEXT_PUBLIC_RUN_ID || baseContext.request_id;

    useEffect(() => {
        if (typeof window === 'undefined' || !runId) return;
        let active = true;

        const clearReconnectTimer = () => {
            if (reconnectTimerRef.current) {
                window.clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
        };

        const buildHeaders = () => {
            const headers: Record<string, string> = {
                'Accept': 'text/event-stream',
                'X-Mode': baseContext.mode,
                'X-Request-Id': baseContext.request_id || '',
            };
            if (transportConfig.token) headers['Authorization'] = `Bearer ${transportConfig.token}`;
            if (baseContext.tenant_id) headers['X-Tenant-Id'] = baseContext.tenant_id;
            if (baseContext.project_id) headers['X-Project-Id'] = baseContext.project_id;
            if (baseContext.surface_id) headers['X-Surface-Id'] = baseContext.surface_id;
            if (baseContext.app_id) headers['X-App-Id'] = baseContext.app_id;
            if (baseContext.user_id) headers['X-User-Id'] = baseContext.user_id;
            if (baseContext.membership_role) headers['X-Membership-Role'] = baseContext.membership_role;
            headers['X-Run-Id'] = runId;
            if (lastEventIdRef.current) {
                headers['Last-Event-ID'] = lastEventIdRef.current;
            }
            return headers;
        };

        const buildUrl = () => {
            const host = transportConfig.httpHost.startsWith('http')
                ? transportConfig.httpHost
                : `${window.location.origin}${transportConfig.httpHost}`;
            return `${host.replace(/\/+$/, '')}/sse/run/${runId}`;
        };

        const updateMessageList = (message: RunStreamMessage) => {
            setRunMessages(prev => {
                const next = [...prev, message];
                if (next.length > RUN_MESSAGE_LIMIT) {
                    next.splice(0, next.length - RUN_MESSAGE_LIMIT);
                }
                return next;
            });
        };

        const pushWhiteboard = (record: MemoryRecord) => {
            setWhiteboardWrites(prev => ({
                ...prev,
                [record.key]: record,
            }));
        };

        const pushBlackboard = (record: MemoryRecord) => {
            setBlackboardWrites(prev => {
                const edgeGroup = prev[record.edgeId] ?? {};
                return {
                    ...prev,
                    [record.edgeId]: {
                        ...edgeGroup,
                        [record.key]: record,
                    }
                };
            });
        };

        const handleMemoryEvent = (payloadData: Record<string, any>, type: string, eventId: string, ts: string) => {
            const key = typeof payloadData.key === 'string' ? payloadData.key : undefined;
            if (!key) return;
            const edgeId = (payloadData.edge_id || payloadData.edgeId || 'global') as string;
            const record: MemoryRecord = {
                key,
                edgeId,
                version: typeof payloadData.version === 'number' ? payloadData.version : undefined,
                sourceNodeId: typeof payloadData.source_node_id === 'string' ? payloadData.source_node_id : payloadData.sourceNodeId,
                eventId,
                ts,
                data: payloadData,
            };
            if (type === 'whiteboard.write') {
                pushWhiteboard(record);
            } else if (type === 'blackboard.write') {
                pushBlackboard(record);
            }
        };

        const handlePayload = (payload: any, sseEventName?: string, sseEventId?: string) => {
            if (!active) return;
            const eventType = typeof payload?.type === 'string' ? payload.type : sseEventName ?? 'run_event';
            const eventId = typeof payload?.event_id === 'string'
                ? payload.event_id
                : sseEventId ?? `run-${Date.now().toString(16)}`;
            const data = typeof payload?.data === 'object' && payload.data ? payload.data : {};
            const visibility = normalizeVisibility(data.visibility);
            const ts = typeof payload?.ts === 'string' ? payload.ts : new Date().toISOString();
            if (visibility !== 'system') {
                const actor = payload?.routing?.actor_id ?? data.provenance?.agent_id;
                updateMessageList({
                    id: eventId,
                    type: eventType,
                    text: formatRunMessageText(eventType, data),
                    ts,
                    visibility,
                    actor,
                    provenance: typeof data.provenance === 'object' ? data.provenance : undefined,
                });
            }
            if (eventType === 'whiteboard.write' || eventType === 'blackboard.write') {
                handleMemoryEvent(data, eventType, eventId, ts);
            }
            lastEventIdRef.current = eventId;
        };

        const scheduleReconnect = () => {
            if (!active) return;
            clearReconnectTimer();
            const delay = Math.min(1000 * (2 ** retryCountRef.current), 30000);
            retryCountRef.current += 1;
            reconnectTimerRef.current = window.setTimeout(() => {
                if (!active) return;
                connect();
            }, delay);
        };

        const connect = async () => {
            if (!active) return;
            runControllerRef.current?.abort();
            const controller = new AbortController();
            runControllerRef.current = controller;
            const signal = controller.signal;
            setRunConnectionStatus('connecting');
            try {
                const response = await fetch(buildUrl(), {
                    method: 'GET',
                    headers: buildHeaders(),
                    signal,
                });
                if (!response.ok) {
                    throw new Error(`Run stream failed (${response.status})`);
                }
                if (!response.body) {
                    throw new Error('Run stream response missing body');
                }
                setRunConnectionStatus('connected');
                retryCountRef.current = 0;
                clearReconnectTimer();

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let currentData: string[] = [];
                let currentId: string | undefined;
                let currentEventName: string | undefined;

                const flushEvent = () => {
                    if (!currentData.length) return;
                    const payloadStr = currentData.join('\n');
                    try {
                        const payload = JSON.parse(payloadStr);
                        handlePayload(payload, currentEventName, currentId);
                    } catch (err) {
                        console.error('[ConsoleContext] Failed to parse run event', err);
                    }
                    currentData = [];
                    currentId = undefined;
                    currentEventName = undefined;
                };

                while (active) {
                    const { done, value } = await reader.read();
                    if (done || signal.aborted) break;
                    buffer += decoder.decode(value, { stream: true });
                    let newlineIndex: number;
                    while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
                        const line = buffer.slice(0, newlineIndex).replace(/\r$/, '');
                        buffer = buffer.slice(newlineIndex + 1);
                        if (!line) {
                            flushEvent();
                            continue;
                        }
                        if (line.startsWith('data:')) {
                            currentData.push(line.slice(5).trim());
                        } else if (line.startsWith('id:')) {
                            currentId = line.slice(3).trim();
                        } else if (line.startsWith('event:')) {
                            currentEventName = line.slice(6).trim();
                        }
                    }
                }
                if (buffer.trim()) {
                    currentData.push(buffer.trim());
                    flushEvent();
                }
            } catch (error) {
                if (signal.aborted || !active) {
                    return;
                }
                console.warn('[ConsoleContext] Run stream error', error);
                setRunConnectionStatus('disconnected');
                scheduleReconnect();
            }
        };

        connect();

        return () => {
            active = false;
            runControllerRef.current?.abort();
            runControllerRef.current = null;
            clearReconnectTimer();
            setRunConnectionStatus('disconnected');
        };
    }, [
        runId,
        transportConfig.httpHost,
        transportConfig.token,
        baseContext.tenant_id,
        baseContext.project_id,
        baseContext.mode,
        baseContext.app_id,
        baseContext.surface_id,
        baseContext.user_id,
        baseContext.membership_role,
    ]);

    const value = useMemo(() => ({
        baseContext,
        transportConfig,
        connectionStatus,
        setConnectionStatus,
        runId,
        runConnectionStatus,
        runMessages,
        whiteboardWrites,
        blackboardWrites,
    }), [
        baseContext,
        transportConfig,
        connectionStatus,
        runConnectionStatus,
        runMessages,
        whiteboardWrites,
        blackboardWrites,
        runId,
    ]);

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
