# Federation Card Schema

This schema defines the structure for a Northstar Federation Card. A federation describes a topology of agents and an orchestration pattern.

## Fields

*   **`CARD_ID`** (string, required)
    *   Unique identifier for this federation card.
*   **`SCOPE`** (string, required)
    *   Must be set to "federation".
*   **`LABEL`** (string, required)
    *   Short, human-readable name for the federation.
*   **`DESCRIPTION`** (string, required)
    *   2–4 lines explaining what this federation does and how it behaves.
*   **`PATTERN`** (string, required)
    *   The architectural pattern ID (e.g., `INTERPRETER_HUB_V1`, `ROUND_TABLE_V1`).
*   **`ORCHESTRATOR_PROFILE`** (object, required)
    *   **`allowed_backends`** (list of strings): List of backend IDs supported (e.g., `native_canvas_orch`, `langgraph_canvas_orch`).
    *   **`default_backend`** (string): The primary backend ID to use.
    *   **`experiment_backends`** (list of strings, optional): Backends available for experimental use.
*   **`AGENT_ROLES`** (mapping, required)
    *   Map of role specific keys to agent card IDs (e.g., `host: HostAgent_V1`).
*   **`OWNS_TOKENS`** (list of strings, required)
    *   List of token globs/patterns that this federation is authorised to modify.
*   **`EPISODE_TYPE`** (string, required)
    *   Short label for trace typing and analytics.
*   **`SAFETY_PROFILE`** (object, optional)
    *   **`firearms_required`** (list of strings): Safety firearms required for this federation.
    *   **`strategy_lock_required`** (boolean): Whether strategy lock is enforced.
    *   **`three_wise_required`** (boolean): Whether three-wise verification is required.
*   **`LIMITS`** (object, optional)
    *   Configuration limits, e.g., `max_agents_per_round` for chat federations.
*   **`NOTES`** (string, optional)
    *   Free text for additional context, distinct from the description.
