# Gate3 Transport Contract

This document describes the transport modes for the UI, supporting both the legacy "Repo-Sandbox" path and the new "Gate3 Contract" path (Engines).

## Modes

### 1. SSE Mode
Controlled by `TransportConfig.useFetchSSE`.

-   **Legacy (`false`)**: Uses browser `EventSource` API. Authentication via `?token=` query parameter. No custom headers.
-   **Contract (`true` - Default)**: Uses `fetch` with `ReadableStream`. Authenticated via `Authorization: Bearer ...` header. Injects rich context headers (`X-Tenant-Id`, `X-Mode`, etc.).

### 2. WebSocket Auth Mode
Controlled by `TransportConfig.wsAuthMode`.

-   **`legacy_query` (Default)**: Sends token in query parameter `?token=`.
-   **`hello_handshake`**: Connects without token. Sends immediate `{"type":"hello", ...}` message with auth and context on open.

## Configuration
In `packages/builder-core`, the transport is initialized with:

```typescript
transportRef.current = new CanvasTransport({
    httpHost: '/api', // Proxied to backend
    wsHost: 'ws://localhost:3000/api', // Proxied to backend
    token: '...',
    context: { ... },
    wsAuthMode: 'legacy_query', // Change to 'hello_handshake' when backend is ready
    useFetchSSE: true // Defaulting to Gate3 path
});
```

## Development Proxy
To support local development with custom headers (avoiding CORS preflight issues), `apps/studio` uses a Vite proxy:
-   `/api` -> `http://localhost:8000`
