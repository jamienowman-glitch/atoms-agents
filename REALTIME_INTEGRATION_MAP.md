# REALTIME INTEGRATION MAP

This document maps the new realtime infrastructure found in `atoms-core` and `atoms-ui`.

## 1. The Canvas State Engine (Server-Side)
**Role**: The "Realtime Gateway" serving as the single source of truth.
**Location**: `atoms-core`
**Protocol**: SSE for Downstream Truth, WebSocket for Ephemeral Data (Presence/Cursors).

| Component | Path | Description |
| --- | --- | --- |
| **SSE Engine** | `atoms-core/src/realtime/sse.py` | Handles `/sse/chat/{thread_id}` (Truth) and `/ws/chat/{thread_id}` (Ephemeral). |
| **Contracts** | `atoms-core/src/realtime/contracts.py` | Defines `StreamEvent`, `RoutingKeys`, `EventType`. |

## 2. The Agent Transport (Client-Side)
**Role**: The client-side connection layer handling SSE and WS connections.
**Location**: `atoms-ui`

| Component | Import Path | Usage |
| --- | --- | --- |
| **Transport Provider** | `import { TransportProvider } from '@/harness/transport/provider';` | Wrap your application root. |
| **Transport Hook** | `import { useCanvasTransport } from '@/harness/transport/provider';` | Use to get the `CanvasTransport` instance. |
| **Transport Class** | `import { CanvasTransport } from '@/harness/transport';` | The underlying class managing connections. |
| **Types** | `import { TransportConfig, RequestContext } from '@/harness/transport';` | Configuration types. |

> **Note**: `src` alias (`@`) or relative paths should be used depending on your specific tsconfig setup. The paths above assume `atoms-ui` root or `@fs` mapping.
> Absolute Path: `/Users/jaynowman/dev/atoms-ui/harness/transport/`

## 3. The Video Sidecar (UI Components)
**Role**: displaying video content and presence.
**Location**: `atoms-ui`

| Component | Import Path | Description |
| --- | --- | --- |
| **MultiTile** | `import { MultiTile } from '@/ui-atoms/multi-tile/MultiTile';` | Main grid component handling various content types including video. |
| **Video Thumb** | `import { VideoThumb } from '@/ui-atoms/multi-tile/VideoThumb';` | Simple video thumbnail component. |

## 4. Wiring Diagram (Mental Model)

```mermaid
graph TD
    Client[FlowHarness (atoms-ui)] -->|useCanvasTransport| TransportProvider
    TransportProvider -->|CanvasTransport| Gateway[Realtime Gateway (atoms-core)]
    Gateway -->|SSE /sse/chat| SSE[State Engine (sse.py)]
    Gateway -->|WS /ws/chat| WS[Ephemeral Service]
    SSE -->|StreamEvent| Client
    Client -->|Render| MultiTile[Video/Content Sidecar]
```
