import { CanvasTransport, TransportConfig } from './index';

// Mock Fetch
global.fetch = jest.fn();
// Mock EventSource
global.EventSource = class {
    onopen: any;
    onmessage: any;
    onerror: any;
    close() { }
    constructor(url: string) { }
} as any;
// Mock WebSocket
global.WebSocket = class {
    onopen: any;
    onmessage: any;
    onclose: any;
    onerror: any;
    send = jest.fn();
    close() { }
    constructor(url: string) {
        setTimeout(() => this.onopen?.(), 10);
    }
} as any;

describe('CanvasTransport Gate3', () => {
    const config: TransportConfig = {
        httpHost: 'http://test-api',
        wsHost: 'ws://test-ws',
        token: 'TEST_TOKEN',
        context: {
            tenant_id: 'test-tenant',
            mode: 'lab',
            project_id: 'test-project',
            request_id: 'test-req-123',
            user_id: 'test-user-456'
        },
        useFetchSSE: true,
        wsAuthMode: 'hello_handshake'
    };

    let transport: CanvasTransport;

    beforeEach(() => {
        transport = new CanvasTransport(config);
        (global.fetch as jest.Mock).mockReset();

        // Smart Mock Implementation
        (global.fetch as jest.Mock).mockImplementation((url) => {
            if (typeof url === 'string' && url.includes('/auth/ticket')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ ticket: 'MOCKED_TICKET' })
                });
            }
            // Default success for commands/SSE
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ head_rev: 1 }),
                body: {
                    getReader: () => ({
                        read: () => Promise.resolve({ done: true, value: new Uint8Array() })
                    })
                }
            });
        });
    });

    test('getHeaders includes all required Gate3 context headers', async () => {
        await transport.sendCommand('canvas-1', {
            kind: 'noop',
            actor_id: 'test',
            correlation_id: 'corr-1'
        } as any);

        const call = (global.fetch as jest.Mock).mock.calls.find(c => c[0] && c[0].includes && c[0].includes('/commands'));
        expect(call).toBeDefined();
        const headers: any = call[1].headers;

        expect(headers['Authorization']).toBe('Bearer TEST_TOKEN');
        expect(headers['X-Tenant-Id']).toBe('test-tenant');
        expect(headers['X-Mode']).toBe('lab');
        expect(headers['X-Project-Id']).toBe('test-project');
    });

    test('WS connect logic uses ticket and proper hello payload', async () => {
        transport.connect('canvas-1', 'last-id-123');

        // Wait for connection (ticket fetch + ws connect)
        await new Promise(r => setTimeout(r, 50));

        // Verify ticket call
        const ticketCall = (global.fetch as jest.Mock).mock.calls.find(c => c[0] && typeof c[0] === 'string' && c[0].includes('/auth/ticket'));
        expect(ticketCall).toBeDefined();

        // Get WS instance
        const ws = (transport as any).ws;
        expect(ws).toBeDefined();

        // Check send
        expect(ws.send).toHaveBeenCalled();
        const msg = JSON.parse(ws.send.mock.calls[0][0]);

        expect(msg.type).toBe('hello');
        expect(msg.context.tenant_id).toBe('test-tenant');
        expect(msg.last_event_id).toBe('last-id-123');
        expect(msg.authorization).toBeUndefined();
    });

    test('SSE Fetch mode uses headers', async () => {
        transport.connect('canvas-1');
        await new Promise(r => setTimeout(r, 20));

        const call = (global.fetch as jest.Mock).mock.calls.find(c => c[0] && c[0].includes && c[0].includes('/sse/canvas/'));
        expect(call).toBeDefined();
        const headers: any = call[1].headers;
        expect(headers['Authorization']).toBe('Bearer TEST_TOKEN');
        expect(headers['Accept']).toBe('text/event-stream');
    });
});
