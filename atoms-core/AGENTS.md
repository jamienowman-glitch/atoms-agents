# AGENTS.md — Atoms Core (The OS)

## 🏗️ CONTEXT: THE FLEET OF 7
*   **atoms-core:** The OS (Identity, Routing, Safety). **[YOU ARE HERE]**
*   **atoms-agents:** The Brain (Logic, Personas).
*   **atoms-flow:** The UI (Console).
*   **atoms-muscle:** The Power (GPU, Video).
*   **atoms-connectors:** The Tools (MCP Servers).
*   **atoms-site:** The Face (Marketing).
*   **atoms-tuning:** The Lab (Optimization).

## Mission
This is the Operating System. High stability, zero hallucinations.

## The Stack
- **Runtime:** Python (uv)
- **Framework:** FastAPI
- **Auth:** Supabase Auth (atoms-fam-core)

## 🛑 THE LAWS
1.  **Identity is King:** All routes must pass `IdentityMiddleware`. We rely on Supabase and the `t_system` System Key.
2.  **God Mode:** `t_system` is hardcoded in constants; do not query DB for it.
3.  **No Heavy Lifting:** If it requires a GPU, send it to `atoms-muscle`.
4.  **Isolation from Engines:** You must NOT import from `northstar-engines`. You are the new OS.

## 🔐 SECURITY: VAULT ONLY
1.  **Vault Only:** Secrets are read from `/Users/jaynowman/northstar-keys/`. `src/core/config.py` is the Source of Truth.
2.  **Status Endpoint:** `/api/v1/config/status` is the only way to check health. Never print secrets to logs.
3.  **Testing:** Tests run against the Vault. Do not mock auth unless unit testing logic.
