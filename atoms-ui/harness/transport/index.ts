import {
    Command,
    CommandResponse,
    SafetyDecisionEvent,
    StreamEvent,
    GestureEvent,
    StreamEnvelopeBase,
} from './contracts';

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
    httpHost: string;
    wsHost: string;
    token: string;
    context: RequestContext;
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

    private sseStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
    private wsStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
    private sseRetryCount = 0;
    private wsRetryCount = 0;
    private lastEventId?: string;
    private abortController: AbortController | null = null;

    constructor(config: TransportConfig) {
        // Config validation...
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
        // Add optional
        if (this.config.context.tenant_id) h['X-Tenant-Id'] = this.config.context.tenant_id;
        if (this.config.context.project_id) h['X-Project-Id'] = this.config.context.project_id;
        if (this.config.context.user_id) h['X-User-Id'] = this.config.context.user_id;
        return h;
    }

    async connect(canvasId: string, lastEventId?: string) {
        if (this.canvasId === canvasId && (this.sseStatus === 'connected' || this.sseStatus === 'connecting')) return;
        this.canvasId = canvasId;
        if (lastEventId) this.lastEventId = lastEventId;

        // Simplify to Fetch SSE for modern browsers
        this.connectSSE_Fetch();
        this.connectWS();
    }

    disconnect() {
        this.abortController?.abort();
        this.abortController = null;
        this.sse?.close();
        this.sse = null;
        this.ws?.close();
        this.ws = null;
        this.sseStatus = 'disconnected';
        this.wsStatus = 'disconnected';
    }

    onEvent(handler: StreamHandler) {
        this.handlers.add(handler);
        return () => { this.handlers.delete(handler); }; // void return for React cleanup
    }

    private dispatch(event: StreamEvent) {
        this.handlers.forEach(h => h(event));
    }

    private processEvent(event: StreamEvent) {
        // Handle Safety
        if (event.type === 'safety_decision') {
            // Record Logic
        }
        this.dispatch(event);
    }

    // --- SSE ---
    private async connectSSE_Fetch() {
        if (!this.canvasId) return;
        this.sseStatus = 'connecting';
        this.abortController = new AbortController();
        const signal = this.abortController.signal;

        try {
            const url = `${this.config.httpHost}/sse/canvas/${this.canvasId}`;
            const headers = this.getHeaders({ 'Accept': 'text/event-stream' }) as Record<string, string>;
            if (this.lastEventId) headers['Last-Event-ID'] = this.lastEventId;

            const response = await fetch(url, { method: 'GET', headers, signal });
            if (!response.ok) throw new Error(`SSE Error ${response.status}`);
            if (!response.body) throw new Error('No body');

            this.sseStatus = 'connected';
            this.dispatch({ type: 'system', data: { code: 'CONNECTED', message: 'SSE Connected' } } as any);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (signal.aborted) return;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const event = JSON.parse(line.slice(6));
                            this.processEvent(event);
                        } catch (e) { console.error('Parse Error', e); }
                    }
                }
            }

        } catch (e: any) {
            if (signal.aborted) return;
            console.warn('SSE Error', e);
            this.sseStatus = 'disconnected';
            setTimeout(() => this.connectSSE_Fetch(), 2000);
        }
    }

    // --- WS ---
    private async connectWS() {
        // Simplified WS connection
        try {
            // Need ticket fetch logic here usually, stubbing for simplicity of this artifact
            const ticket = 'mock_ticket';
            const url = `${this.config.wsHost}/msg/ws?ticket=${ticket}`;
            this.ws = new WebSocket(url);
            this.ws.onopen = () => { this.wsStatus = 'connected'; };
            this.ws.onmessage = (msg) => {
                try {
                    const event = JSON.parse(msg.data);
                    this.processEvent(event);
                } catch (e) { }
            };
            this.ws.onclose = () => { this.wsStatus = 'disconnected'; setTimeout(() => this.connectWS(), 2000); };
        } catch (e) {
            this.wsStatus = 'disconnected';
        }
    }

    // --- Commands ---
    async sendCommand(canvasId: string, command: Command): Promise<CommandResponse> {
        // Standard REST Command
        const res = await fetch(`${this.config.httpHost}/canvas/${canvasId}/commands`, {
            method: 'POST',
            headers: this.getHeaders({ 'Content-Type': 'application/json' }) as any,
            body: JSON.stringify(command)
        });
        return await res.json();
    }

    sendGesture(gesture: GestureEvent['data']) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'gesture', data: gesture }));
        }
    }

    // --- Artifacts ---
    async uploadArtifact(canvasId: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const headers = this.getHeaders() as any;
        // Do not set content-type for FormData
        const res = await fetch(`${this.config.httpHost}/canvas/${canvasId}/artifacts`, {
            method: 'POST',
            headers,
            body: formData
        });
        if (!res.ok) throw new Error('Upload Failed');
        return await res.json();
    }

    // --- Chat ---
    async postMessage(threadId: string, text: string) {
        // Should match engines/chat/service/sse_transport.py endpoint
        const res = await fetch(`${this.config.httpHost}/sse/chat/${threadId}`, {
            method: 'POST',
            headers: this.getHeaders({ 'Content-Type': 'application/json' }) as any,
            body: JSON.stringify({
                text,
                sender: { id: this.config.context.user_id }
            })
        });
        return await res.json();
    }
}
