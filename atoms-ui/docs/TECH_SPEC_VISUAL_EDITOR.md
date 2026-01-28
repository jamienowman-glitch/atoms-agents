# Tech Spec: MCP-Powered Visual Editor

> **Note (2026-01-27)**: The legacy file-based `atoms-registry/` directory is deprecated/quarantined. Treat any references to file YAML registries as historical; the authoritative source is the DB registry (Supabase / `atoms-core` APIs).

## 1. Objective
Build a Visual Contract Editor (Contract Builder) that consumes Muscles as **MCP Connectors** via the real `northstar-engines` API.
-   **No Mocks**: Data comes from `/tools/list` (MCP Gateway) or `/registries/entries` (System Registry).
-   **Muscles as Tools**: Each Muscle in the DB registry is an MCP Server/Scope that agents can pay to use.

## 2. Architecture
The `atoms-ui` Harness connects to the Engine Factory via the existing `CanvasTransport` (HTTP/SSE).

### A. The Registry API (Existing)
Verified endpoints in `northstar-engines`:
-   `GET /registries/entries?namespace=muscles`: Lists declared muscles (`id`, `name`, `config`).
-   `POST /tools/list`: Lists active MCP tools (`id`, `scopes`, `inputSchema`).

### B. The Loader (`harness/registry/api.ts`)
Instead of a file-system loader, we implement an API Client.
-   `fetchMuscles()`: Calls `/registries/entries` to get the menu of available capabilities.
-   `fetchToolDefinitions()`: Calls `/tools/list` to get the technical input schema for the generated code.

### C. The Visual Editor (`ContractBuilderCanvas`)
-   **UI**: 3-Column Layout (Chat, Graph, Properties).
-   **Library**: Populated by the `fetchMuscles()` API call.
-   **Graph**: Nodes represent Atoms.
-   **Properties**:
    -   When a Muscle is selected (e.g. "Video Engine"), we fetch its `inputSchema` from `/tools/list`.
    -   The Property Panel auto-generates fields based on that Schema (JSON Schema Form).

## 3. The Production workflow
1.  **Boot**: `ContractBuilderCanvas` mounts (Contract Builder UI).
    -   `useEffect(() => api.fetchMuscles())`.
2.  **User Action**: Drag "Video Muscle" onto canvas.
3.  **App Logic**:
    -   Fetch `/tools/list` to find `video_muscle` tool.
    -   Display its available scopes (e.g., `render_clip`, `transcribe`).
    -   User selects "Render Clip".
4.  **Build**: Agent generates code that calls `mcp.callTool('video_muscle', 'render_clip', ...)`.

## 4. Why This is Better
-   **Single Truth**: The Editor sees exactly what the Backend sees.
-   **Schema-Driven**: If `atoms-muscle` updates the Video API, the Frontend Form updates automatically.
-   **Monetization Ready**: Since it uses the MCP Gateway, every usage is tracked/billed via the standard engine paths (`gate_chain`, `firearms`).
