# Handoff: atoms-app Workbench & atoms-agents API

## Context
I have built the "Atomic Agents" Workbench, which consists of two parts:
1.  **`atoms-agents`**: A Python/FastAPI backend that serves the Agent Registry and provides a WebSocket endpoint for chat.
2.  **`atoms-app`**: A Next.js frontend with a `/workbench` page that consumes the registry and connects to the chat WebSocket.

## Current State
- **Repo Structure**:
  - `atoms-agents/` contains the new Python runtime, registry, and server.
  - `atoms-app/src/app/workbench/` contains the new React UI.
- **API**: Running locally on port `8000`. Verified via `curl`.
- **Frontend**: Running locally on port `3001`. Builds successfully.

## The Blocking Issue (Sandbox Networking)
The frontend (`atoms-app`) is unable to fetch the registry from the backend (`atoms-agents`) within the current sandbox environment.
- **Error**: `TypeError: fetch failed` with `ECONNREFUSED` when Next.js (server-side) tries to hit `http://localhost:8000/registry/index`.
- **Diagnosis**: This is likely a sandbox-specific restriction or IPv6/IPv4 mismatch where `localhost` in Node.js does not resolve to the interface where FastAPI is listening.

## Instructions for Local Worker
Since you are running in a real environment, this networking issue should resolve itself. Please follow these steps to verify and finish the integration:

1.  **Start the API**:
    ```bash
    cd atoms-agents
    ./start_api.sh
    # Verify it's up: curl http://localhost:8000/registry/index
    ```

2.  **Start the Frontend**:
    ```bash
    cd atoms-app
    # Ensure WORKBENCH_API_URL points to your local API
    export WORKBENCH_API_URL="http://localhost:8000"
    npm run dev
    ```

3.  **Verify UI**:
    - Open `http://localhost:3001/workbench`.
    - You should see dropdowns populated with models/providers (from the API).
    - If dropdowns are empty, check the Next.js server logs for fetch errors.

4.  **Verify Chat**:
    - Select a Provider (e.g., "Jules Virtual Provider") and Model ("jules_default").
    - Type a message and hit Send.
    - The chat should connect via WebSocket (`ws://localhost:8000/workbench/ws`) and stream a response.

## Files of Interest
- **API Server**: `atoms-agents/src/atoms_agents/server/main.py`
- **Registry Loader**: `atoms-agents/src/atoms_agents/registry/loader.py`
- **Frontend Page**: `atoms-app/src/app/workbench/page.tsx`
- **Chat Component**: `atoms-app/src/app/workbench/components/ChatWindow.tsx`
