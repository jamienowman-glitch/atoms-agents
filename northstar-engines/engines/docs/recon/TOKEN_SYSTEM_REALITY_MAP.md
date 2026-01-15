# Token System Reality Map (Strict Provenance)

## 1. Canonical Vocabulary
**DO NOT deviations from this list.**

*   **TokenSchema (Definition)**: A versioned definition of token paths, types, defaults, and controls.
    *   *Implementation*: Maps to `AtomSpec` (which exists in `engines.registry`).
*   **TokenCatalog (Resolved Instance)**: The merged result of schemas + resolved values for a specific canvas.
    *   *Implementation*: **Does not exist yet**. Needs a new adapter service.
*   **TokenLens (Permission/Exposure)**: Logic defining which actor can read/write which tokens.
    *   *Implementation*: Future logic (reserved).
*   **LenS**: Reserved strictly for “Views/Filters” (SafetyLens, GraphLens, etc.). **Not** for schema storage.

## 2. Registry Usage & Proof Table

We adhere to the strict rule: **No repurposing without proof of intent.**

| Kind String | Defined In | Docstring / Intent | Current Usage (Production) | Status |
| :--- | :--- | :--- | :--- | :--- |
| `component` | `registry/service.py` | "Lightweight descriptor for a registered component" | **Active**. Used by `workbench/publisher.py` for MCP Connectors. | **OCCUPIED** |
| `atom` | `registry/service.py` | "Definition of a registered atom **with token surfaces**" | **Empty**. No production calls to `save_atom`. | **AVAILABLE & MATCHING** |
| `lens` | `registry/service.py` | "Full descriptor ... kind=lens" | **Empty**. Reserved for future View logic. | **RESERVED (Do Not Touch)** |

**Conclusion**: `kind="atom"` is explicitly designed for Token Schemas ("with token surfaces"). We will use it *exactly* as intended. We will not touch `lens`.

## 3. Where Token Schemas Live (The "Atom" Domain)
*   **Existing Domain**: `engines.registry` ALREADY has typed endpoints for this:
    *   `GET /registry/atoms` (Returns `AtomsPayload`)
    *   `Code`: `service.get_atoms()` returns `AtomSpec`.
*   **Recommendation**: Use this existing domain.
    *   Store "Feature Token Schemas" as Atoms (e.g. `id="feature.chat_bubble"`).
    *   Store "Global Design Tokens" as a special Atom (e.g. `id="system.design_tokens"`) instead of inventing a new kind.

## 4. Where Token Values Live
*   **Location**: `engines/canvas_commands` -> `CanvasSnapshot`.
*   **State**: Raw JSON state. No validation currently.

## 5. The Exact Gap: "Catalog Adapter"
*   **Missing System**: A bridge that:
    1.  Fetches `AtomSpec` (Schema) from `engines.registry`.
    2.  Fetches `CanvasSnapshot` (State) from `engines.canvas_commands`.
    3.  Merges them (Defaults + Overrides).
    4.  Serves `GET /canvas/{id}/token_catalog`.

## 6. Agents Consumption
*   **Current**: No client code exists.
*   **Requirement**: Agents need a client to:
    *   Read `AtomSpec` (to know what tokens exist).
    *   Read `TokenCatalog` (to know current values).
    *   Send `set_token` commands (validating against the Spec).

## 7. Reuse Recommendation (Minimal Safe Approach)
1.  **Registry**: Use existing `get_atoms` / `save_atom` for Schemas. **Do not define new kinds.**
2.  **Domain**: Treat `/registry/atoms` as the "Token Schema Domain".
3.  **Canvas**: Implement the **Catalog Adapter** inside `engines.canvas_commands` (or a neighbor `engines.canvas.catalog`).
4.  **UI**: Wire `TokenEditor` to the new Catalog Adapter endpoint.
