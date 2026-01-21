import {
    Command,
    CommandResponse,
    SafetyDecisionEvent,
    StreamEvent,
    GestureEvent,
    StreamEnvelopeBase,
} from '@/lib/gate3/contracts';

export interface RequestContext {
    tenant_id: string;
    mode: 'saas' | 'enterprise' | 'lab';
    project_id: string;
    request_id: string;
    app_id?: string;
    surface_id?: string;
    user_id?: string;
    membership_role?: string;
}

export interface TransportConfig {
    httpHost: string; // e.g., "http://localhost:8000/api" or "/api" via proxy
    wsHost: string;   // e.g., "ws://localhost:3000/api" (must include /api path)
    token: string;
    context: RequestContext;
    // Gate3 Flags
    wsAuthMode?: 'legacy_query' | 'hello_handshake';
    useFetchSSE?: boolean;
}

export interface SafetyDecisionSummary {
    streamId: string;
    action: string;
    result: 'PASS' | 'BLOCK';
    reason: string;
    gate: string;
}

export class SafetyResponseError extends Error {
    public status: number;
    public payload: unknown;

    constructor(status: number, payload: unknown) {
        super(`Safety block ${status}`);
        this.status = status;
        this.payload = payload;
    }
}

export type StreamHandler = (event: StreamEvent) => void;

export class CanvasTransport {
    private config: TransportConfig;
    private sse: EventSource | null = null;
    private ws: WebSocket | null = null;
    private canvasId: string | null = null;
    private handlers: Set<StreamHandler> = new Set();
    private safetyDecisions: Map<string, SafetyDecisionSummary> = new Map();

    // Hardening: Connection State
    private sseStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
    private wsStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
    private sseRetryCount = 0;
    private wsRetryCount = 0;
    private lastEventId?: string;

    constructor(config: TransportConfig) {
        // Runtime Assertions
        if (!config.context.mode) console.warn('Transport Warning: Missing context.mode');
        if (config.context.mode && !['saas', 'enterprise', 'lab'].includes(config.context.mode)) {
            throw new Error(`Transport Error: Invalid context.mode "${config.context.mode}"`);
        }
        if (!config.context.tenant_id) console.warn('Transport Warning: Missing context.tenant_id');
        if (!config.context.project_id) console.warn('Transport Warning: Missing context.project_id');
        if (!config.context.request_id) {
            console.warn('Transport Warning: Missing context.request_id. Generating one.');
            // Polyfill for insecure contexts (HTTP mobile) where crypto.randomUUID is undefined
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                config.context.request_id = crypto.randomUUID();
            } else {
                config.context.request_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
        }

        this.config = config;
    }

    // --- Helpers ---

    private getHeaders(extra?: Record<string, string>): HeadersInit {
        const h: Record<string, string> = {
            'Authorization': `Bearer ${this.config.token}`,
            'X-Mode': this.config.context.mode,
            'X-Request-Id': this.config.context.request_id,
            ...extra
        };

        if (this.config.context.tenant_id) h['X-Tenant-Id'] = this.config.context.tenant_id;
        if (this.config.context.project_id) h['X-Project-Id'] = this.config.context.project_id;
        if (this.config.context.app_id) h['X-App-Id'] = this.config.context.app_id;
        if (this.config.context.surface_id) h['X-Surface-Id'] = this.config.context.surface_id;
        if (this.config.context.user_id) h['X-User-Id'] = this.config.context.user_id;
        if (this.config.context.membership_role) h['X-Membership-Role'] = this.config.context.membership_role;

        return h;
    }

    private async getTicket(): Promise<string> {
        try {
            const res = await fetch(`${this.config.httpHost}/auth/ticket`, {
                method: 'POST',
                headers: this.getHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(this.config.context)
            });
            if (!res.ok) throw new Error(`Ticket fetch failed: ${res.status}`);
            const data = await res.json();
            return data.ticket;
        } catch (e) {
            console.error('Failed to get auth ticket', e);
            throw e;
        }
    }

    // --- Connection Management ---

    async connect(canvasId: string, lastEventId?: string) {
        if (!this.config.context.project_id) {
            console.warn('[CanvasTransport] project_id missing; delaying connection until provided');
            return;
        }
        if (!this.config.context.tenant_id) {
            console.warn('[CanvasTransport] tenant_id missing; delaying connection until provided');
            return;
        }
        if (!this.config.context.app_id) {
            console.warn('[CanvasTransport] app_id missing; delaying connection until provided');
            return;
        }
        if (this.canvasId === canvasId && (this.sseStatus === 'connected' || this.sseStatus === 'connecting')) return;

        this.canvasId = canvasId;
        if (lastEventId) this.lastEventId = lastEventId;

        // Fetch ticket if needed for Legacy/WS
        // For Fetch SSE we don't strictly need a ticket as we have headers, but for WS we do.
        // We can let each connect method handle its own ticket needs.

        if (this.config.useFetchSSE) {
            this.connectSSE_Fetch();
        } else {
            this.connectSSE_Legacy();
        }
        this.connectWS();
    }

    disconnect() {
        // Close SSE (Reader or EventSource)
        this.abortController?.abort();
        this.abortController = null;

        this.sse?.close();
        this.sse = null;

        this.ws?.close();
        this.ws = null;
        this.sseStatus = 'disconnected';
        this.wsStatus = 'disconnected';
        this.dispatch({ type: 'system', data: { code: 'DISCONNECTED', message: 'Manual disconnect' } });
    }

    getStatus() {
        return { sse: this.sseStatus, ws: this.wsStatus };
    }

    getSafetyDecision(streamId: string): SafetyDecisionSummary | null {
        return this.safetyDecisions.get(streamId) ?? null;
    }

    onEvent(handler: StreamHandler) {
        this.handlers.add(handler);
        return () => this.handlers.delete(handler);
    }

    private dispatch(event: StreamEvent) {
        this.handlers.forEach(h => h(event));
    }

    private isSafetyDecisionEvent(event: StreamEvent): event is SafetyDecisionEvent & StreamEnvelopeBase {
        return event.type === 'safety_decision';
    }

    private recordSafetyDecision(event: SafetyDecisionEvent) {
        const streamId = event.routing?.canvas_id || event.routing?.thread_id;
        if (!streamId) return;
        const summary: SafetyDecisionSummary = {
            streamId,
            action: event.data.action,
            result: event.data.result,
            reason: event.data.reason,
            gate: event.data.gate,
        };
        this.safetyDecisions.set(streamId, summary);
    }

    private processEvent(event: StreamEvent) {
        if (this.isSafetyDecisionEvent(event)) {
            this.recordSafetyDecision(event);
        }
        this.dispatch(event);
    }

    // --- SSE (Committed Ops) ---

    private abortController: AbortController | null = null;

    // Contract Mode: Fetch + ReadableStream
    private async connectSSE_Fetch() {
        if (!this.canvasId) return;

        this.sseStatus = 'connecting';
        this.abortController = new AbortController();
        const signal = this.abortController.signal;

        try {
            const url = `${this.config.httpHost}/sse/canvas/${this.canvasId}`;
            // NOTE: Headers are fully supported here!
            const headers: Record<string, string> = this.getHeaders({
                'Accept': 'text/event-stream'
            }) as Record<string, string>;

            if (this.lastEventId) {
                headers['Last-Event-ID'] = this.lastEventId;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers,
                signal
            });

            if (!response.ok) throw new Error(`SSE Fetch Error: ${response.status}`);
            if (!response.body) throw new Error('SSE Fetch Error: No body');

            this.sseStatus = 'connected';
            this.sseRetryCount = 0;
            this.dispatch({ type: 'system', data: { code: 'CONNECTED', message: 'SSE Connected (Fetch)' } });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (signal.aborted) return; // Cleanup handled in disconnect

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split('\n');
                // Keep the last partial line in buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        try {
                            const event = JSON.parse(dataStr) as StreamEvent;
                            this.processEvent(event);
                        } catch (e) {
                            console.error('SSE Parse Error (Fetch)', e);
                        }
                    } else if (line.startsWith('id: ')) {
                        this.lastEventId = line.slice(4);
                    }
                    // Handle 'event:' or retry if needed, but 'data' is main payload
                }
            }

        } catch (e: any) {
            if (signal.aborted) return;
            console.warn('SSE Fetch Loop Error:', e);
            this.sseStatus = 'disconnected';
            const timeout = Math.min(1000 * (2 ** this.sseRetryCount++), 30000);
            setTimeout(() => this.connectSSE_Fetch(), timeout);
        }
    }

    // Legacy Mode: EventSource
    private connectSSE_Legacy() {
        if (!this.canvasId) return;

        this.sseStatus = 'connecting';
        const url = new URL(`${this.config.httpHost}/sse/canvas/${this.canvasId}`);
        // Legacy: Token in query param
        url.searchParams.append('token', this.config.token);

        // Interim: Context in query params for Legacy Mode (EventSource cannot send headers)
        url.searchParams.append('mode', this.config.context.mode);
        url.searchParams.append('tenant_id', this.config.context.tenant_id);
        url.searchParams.append('project_id', this.config.context.project_id);
        url.searchParams.append('request_id', this.config.context.request_id);
        if (this.config.context.app_id) url.searchParams.append('app_id', this.config.context.app_id);
        if (this.config.context.user_id) url.searchParams.append('user_id', this.config.context.user_id);

        if (this.lastEventId) {
            url.searchParams.append('last_event_id', this.lastEventId);
        }

        // Relative path fix for EventSource if httpHost is relative (e.g. /api)
        // EventSource constructor handles relative URLs against window.location, which is fine.
        this.sse = new EventSource(url.toString());

        this.sse.onopen = () => {
            this.sseStatus = 'connected';
            this.sseRetryCount = 0;
            this.dispatch({ type: 'system', data: { code: 'CONNECTED', message: 'SSE Connected (Legacy)' } });
        };

        this.sse.onmessage = (msg) => {
            try {
                const event = JSON.parse(msg.data) as StreamEvent;

                // Capture Last-Event-ID if present in standard field (or via custom data)
                if (msg.lastEventId) {
                    this.lastEventId = msg.lastEventId;
                }

                this.processEvent(event);
            } catch (e) {
                console.error('SSE Parse Error', e);
            }
        };

        this.sse.onerror = () => {
            this.sse?.close();
            this.sseStatus = 'disconnected';
            const timeout = Math.min(1000 * (2 ** this.sseRetryCount++), 30000);
            console.warn(`SSE Error, retrying in ${timeout}ms...`);
            setTimeout(() => this.connectSSE_Legacy(), timeout);
        };
    }

    // --- WebSocket (Gestures) ---

    private async connectWS() {
        this.wsStatus = 'connecting';

        try {
            const ticket = await this.getTicket();
            const url = `${this.config.wsHost}/msg/ws?ticket=${ticket}`;

            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                console.log('WS Connected');
                this.wsStatus = 'connected';
                this.wsRetryCount = 0;

                // Gate3 Contract: Hello Handshake
                if (this.config.wsAuthMode === 'hello_handshake') {
                    const hello = {
                        type: 'hello',
                        context: this.config.context,
                        last_event_id: this.lastEventId
                    };
                    this.ws?.send(JSON.stringify(hello));
                }
            };

            this.ws.onmessage = (msg) => {
                try {
                    // Handle Heartbeat
                    if (msg.data === 'ping') {
                        this.ws?.send('pong');
                        return;
                    }
                    const event = JSON.parse(msg.data) as StreamEvent;
                    this.processEvent(event);
                } catch (e) {
                    console.error('WS Parse Error', e);
                }
            };

            this.ws.onclose = () => {
                this.wsStatus = 'disconnected';
                const timeout = Math.min(1000 * (2 ** this.wsRetryCount++), 30000);
                setTimeout(() => this.connectWS(), timeout);
            };

            this.ws.onerror = () => {
                // ws.onclose will be called
            };

        } catch (e) {
            console.error('WS Connect Failed (Ticket)', e);
            this.wsStatus = 'disconnected';
            // Retry logic handled by caller? Or just retry ticket fetch?
            // Simple exponential backoff retry for now
            const timeout = Math.min(1000 * (2 ** this.wsRetryCount++), 30000);
            setTimeout(() => this.connectWS(), timeout);
        }
    }

    sendGesture(gesture: GestureEvent['data']) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const event: GestureEvent = { type: 'gesture', data: gesture };
            this.ws.send(JSON.stringify(event));
        }
    }

    sendCanvasReady(payload: { canvas_type: string; tools: string[] }) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const event = {
                type: 'CANVAS_READY',
                data: payload
            };
            this.ws.send(JSON.stringify(event));
        } else {
            console.warn('[CanvasTransport] Cannot emit CANVAS_READY; WS not open');
        }
    }

    sendSpatialUpdate(event: {
        atom_id: string;
        bounds: { x: number; y: number; w: number; h: number; z?: number; d?: number };
        atom_metadata?: Record<string, unknown>;
        media_payload?: { sidecars: { uri?: string; object_id?: string; artifact_id?: string; mime_type?: string; size_bytes?: number; checksum?: string; metadata?: Record<string, unknown> }[] };
    }) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const envelope = {
                type: 'SPATIAL_UPDATE',
                data: event,
                atom_metadata: event.atom_metadata,
                media_payload: event.media_payload
            };
            this.ws.send(JSON.stringify(envelope));
        } else {
            console.warn('[CanvasTransport] Cannot emit SPATIAL_UPDATE; WS not open');
        }
    }

    // --- Commands (Mutations) ---

    async sendCommand(canvasId: string, command: Command): Promise<CommandResponse> {
        const res = await fetch(`${this.config.httpHost}/canvas/${canvasId}/commands`, {
            method: 'POST',
            headers: this.getHeaders({
                'Content-Type': 'application/json',
                'X-Idempotency-Key': command.correlation_id,
            }),
            body: JSON.stringify(command),
        });

        if (res.status === 409) {
            // Conflict
            const data = await res.json();
            return { success: false, error: data, head_rev: data.actual_head_rev };
        }

        if (res.status === 403) {
            let payload: unknown = null;
            try {
                payload = await res.json();
            } catch {
                payload = null;
            }
            throw new SafetyResponseError(res.status, payload);
        }

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Command failed: ${res.status} ${text}`);
        }

        // Success calls usually return the committed op or just 200 OK.
        // Assuming backend returns { head_rev: ... }
        const data = await res.json();
        return { success: true, head_rev: data.head_rev };
    }

    // --- Artifacts ---

    async uploadArtifact(canvasId: string, file: File): Promise<{ id: string; url: string; mime_type: string }> {
        const formData = new FormData();
        formData.append('file', file);

        // Note: Content-Type is set automatically by fetch when body is FormData
        const headers = this.getHeaders() as Record<string, string>;
        // Do NOT set Content-Type here, let browser boundary handle it

        const res = await fetch(`${this.config.httpHost}/canvas/${canvasId}/artifacts`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        if (!res.ok) throw new Error('Artifact upload failed');
        return await res.json();
    }

    // --- Audits ---

    async requestAudit(canvasId: string, ruleset: string = 'standard'): Promise<{ score: number; findings: any[]; artifact_ref_id: string }> {
        const res = await fetch(`${this.config.httpHost}/canvas/${canvasId}/audits`, {
            method: 'POST',
            headers: this.getHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ ruleset }),
        });

        if (!res.ok) throw new Error('Audit request failed');
        return await res.json();
    }
}
