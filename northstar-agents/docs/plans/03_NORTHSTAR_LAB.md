# Plan 03: The Northstar Lab (Proof of Life)

**Phase**: 3 - Connectivity & Truth Verification
**App**: `northstar-agents/src/northstar/lab`
**Tech**: Streamlit + HTTPX (SSE)
**Status**: DRAFT

## 1. The Mission
The Northstar Lab is a "Hardware Bench" for our AI Agents. It bypasses the complex Next.js frontend to verify the raw plumbing of our Atomic Cards.
It serves one purpose: **Truth Verification**.
Does the Agent speak? Does the Provider bill us? Does the Engine see it?

## 2. Architecture: The "Loop" Verification
The Lab is not just a chat client. It is a **Tele-Operational Console**.

**The Loop:**
1.  **Instantiation**: Lab imports `NodeExecutor` and a Registry Card (e.g., `brand_writer_v1`) locally.
2.  **Execution**: Lab executes the Node using the `LLMGateway`.
3.  **Telemetry**: The Execution Context is configured to "Write" events to `northstar-engines` (via API `POST /realtime/timeline/.../append`).
4.  **Verification**: The Lab simultaneously listens to `northstar-engines` (via `GET /sse/timeline`) to see its own thoughts reflected back.

If we see the thought in the X-Ray Panel, the **Connectivity Loop** is closed.

## 3. The Interface (Streamlit)

### 3.1 The Control Deck (Sidebar)
- **Provider Selector**: Dynamic dropdown (fetched via `provider.list_models()`).
- **Model Selector**: Dynamic dropdown.
- **Agent/Card Selector**: Load any YAML from the Registry.
- **Overrides**: Checkboxes for "Bypass Safety", "Mock Tools".

### 3.2 The Test Bench (Main Area)
- **Input**: Raw Prompt area.
- **Action**: "FIRE" button (Red).
- **Direct Output**: The immediate return value from `NodeExecutor` (Local verification).

### 3.3 The X-Ray Panel (Split View)
- **SSE Stream**: A rolling log displaying events received from the Backend (Remote verification).
- **Commerce Ticker**: A real-time display of `cost_usd` derived from the SSE events.
- **Raw JSON**: Expandable view of the full payload for debugging.

## 4. Engineering Requirements

### 4.1 Dynamic Model Listing
We must end the practice of hardcoding model lists.
**Task**: Add `list_models()` method to `LLMGateway` abstract base class.
- `OpenRouterGateway`: Call `GET /models`.
- `Azure/Vertex/Bedrock`: Return the list of "known/configured" models (since APIs often don't list available models easily without complex auth/filters, but we make a best effort or return config-defined ones).

### 4.2 The Listener (SSE Client)
The Lab must spawn a background thread using `httpx` to consume the SSE stream.
```python
async def sse_listener():
    async with httpx.AsyncClient() as client:
        async with client.stream("GET", "http://localhost:8000/realtime/sse/timeline") as response:
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    update_ui_state(json.loads(line[6:]))
```

### 4.3 Commerce Integration
The Lab must verify that `usage` and `cost_usd` are present in the response. If they are `null` or `0` (for paid models), the test FAILED.

## 5. Execution Steps
1.  **Scaffold**: Create `src/northstar/lab/app.py`.
2.  **Implement List Models**: Update Gateways.
3.  **Build UI**: Implement the Streamlit layout.
4.  **Connect the Loop**: Wire `NodeExecutor` to report to a `RemoteEventLogger` (to be created) that pushes to `northstar-engines`.

## 6. Success Criteria
- [ ] Can select "OpenRouter" -> "Google Gemini 2.0 Flash".
- [ ] Can load "Brand Writer" agent.
- [ ] "FIRE" sends prompt.
- [ ] Response appears in Main Area.
- [ ] Event appears in X-Ray Panel (via SSE).
- [ ] Cost is displayed (e.g., "$0.00004").
