import http, { IncomingMessage, ServerResponse } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import crypto from 'crypto';

const PORT = 8000;
const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Idempotency-Key',
};

// State
let revision = 0;
const clients: Set<ServerResponse> = new Set(); // SSE clients
// Hardening: Event History for Resume
const eventHistory: { id: string; event: any }[] = [];
const HISTORY_SIZE = 100;
const wsClients = new Set<WebSocket>();

// --- Server ---

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, HEADERS);
        res.end();
        return;
    }

    const url = new URL(req.url || '', `http://${req.headers.host}`);

    // 1. SSE
    if (req.method === 'GET' && url.pathname.startsWith('/sse/canvas/')) {
        res.writeHead(200, {
            ...HEADERS,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        // Handle Last-Event-ID for resume
        const lastEventId = req.headers['last-event-id'];
        if (lastEventId) {
            const lastId = parseInt(lastEventId as string, 10);
            const eventsToSend = eventHistory.filter(e => parseInt(e.id, 10) > lastId);
            eventsToSend.forEach(e => {
                res.write(`id: ${e.id}\ndata: ${JSON.stringify(e.event)}\n\n`);
            });
        }

        const client = { res };
        clients.add(client.res); // Store the raw ServerResponse

        // Send initial ping or state?
        res.write(`data: ${JSON.stringify({ type: 'system', data: { code: 'CONNECTED', message: 'Hello' } })}\n\n`);

        req.on('close', () => clients.delete(client.res));
        return;
    }

    // 2. Commands
    if (req.method === 'POST' && url.pathname.includes('/commands')) {
        let body = '';
        req.on('data', (chunk: Buffer) => body += chunk.toString());
        req.on('end', () => {
            try {
                const cmd = JSON.parse(body);

                // Conflict Simulation logic for testing
                // usage: send correlation_id = "test-conflict" to trigger 409
                if (cmd.correlation_id === 'test-conflict') {
                    // Simulate a conflict where server is ahead
                    const expectedRev = revision + 2;

                    // Generate a fake 'concurrent' op that caused the conflict
                    // e.g. someone else changed the background color of the first atom
                    const recoveryOps: any[] = [];
                    // If we have atoms, modify one. If not, create one.
                    // Since this is a test server, we can just fabricate an op.
                    // Let's assume there is at least one atom or we just add a "Server Box".
                    const conflictOp = {
                        kind: 'add',
                        actor_id: 'server-actor',
                        parent_id: null,
                        index: 0,
                        atom: {
                            id: 'server-conflict-box',
                            type: 'box',
                            parent_id: null,
                            properties: { background: 'red', padding: '10px' },
                            children: []
                        }
                    };
                    recoveryOps.push(conflictOp);

                    res.writeHead(409, HEADERS);
                    res.end(JSON.stringify({
                        code: 'REV_MISMATCH',
                        message: 'Simulated Conflict',
                        expected_rev: expectedRev,
                        recovery_ops: recoveryOps
                    }));

                    // Also actually APPLY this op to server state so subsequent syncs are valid?
                    // Ideally yes, but for this specific "force conflict" test, 
                    // we just want to prove the client handles the 409 response.
                    // We can skip updating actual server state since client rebase logic 
                    // depends on the response payload.
                    // BUT, if the client reconnects, it might fetch old state.
                    // Let's keep it simple: just return the error.
                    return;
                }

                // Apply
                revision++;

                // Broadcast via SSE
                const revId = revision.toString();
                const event = {
                    type: 'op_committed',
                    lastEventId: revId, // Standard SSE/EventSource field
                    data: {
                        rev: revision,
                        ops: cmd.ops,
                        actor_id: cmd.actor_id
                    }
                };

                // Store in history
                eventHistory.push({ id: revId, event });
                if (eventHistory.length > HISTORY_SIZE) eventHistory.shift();

                const eventString = `id: ${revId}\ndata: ${JSON.stringify(event)}\n\n`;
                clients.forEach(c => c.write(eventString));

                res.writeHead(200, HEADERS);
                res.end(JSON.stringify({ head_rev: revision }));
            } catch (e) {
                res.writeHead(400, HEADERS);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // 3. Artifacts/Audits (Stubs)
    if (req.method === 'POST' && (url.pathname.includes('/artifacts') || url.pathname.includes('/audits'))) {
        res.writeHead(200, HEADERS);
        res.end(JSON.stringify({ id: 'test-id', url: 'http://foo.com/bar', score: 100 }));
        return;
    }

    res.writeHead(404, HEADERS);
    res.end('Not Found');
});

// --- WebSocket ---

const wss = new WebSocketServer({ server, path: '/msg/ws' });

wss.on('connection', (ws: WebSocket) => {
    wsClients.add(ws);

    ws.on('message', (data: Buffer) => {
        // Echo gestures to all other clients
        try {
            const msg = JSON.parse(data.toString());
            if (msg === 'ping') {
                ws.send('pong');
                return;
            }

            if (msg.type === 'gesture') {
                // Fanout
                const forward = JSON.stringify(msg);
                wsClients.forEach(c => {
                    if (c !== ws && c.readyState === WebSocket.OPEN) {
                        c.send(forward);
                    }
                });
            }
        } catch (e) {
            // ignore
        }
    });

    ws.on('close', () => wsClients.delete(ws));
});

server.listen(PORT, () => {
    console.log(`Test Server running on port ${PORT}`);
});
