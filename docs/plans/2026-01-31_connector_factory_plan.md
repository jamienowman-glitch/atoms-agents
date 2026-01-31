# Atomic Task Plan: The Connector Factory & God Config

**Goal**: A unified factory for "Printing" Connectors (MCPs) and a Secure "God Config" UI for managing their secrets.

## 1. The Connector Factory (`atoms-connectors`)
**Current State**: Good logic in `sentinel.py`, but `_template` uses `spec.yaml` while Sentinel expects `manifest.yaml`.
**The Fix**:
*   Renaming `_template/spec.yaml` -> `manifest.yaml`.
*   Unify strict schema: `provider_slug`, `scopes`, `kpis` (Firearms included).

## 2. The Secret Management (Vault Writer)
**The Missing Link**: We have the Vault (Read), but no secure way for the UI to *Write* to it without exposing keys to the LLM/Logs.
**The Solution**: A Dedicated "Vault Writer" Muscle/API.

### A. The "Vault Writer" Muscle (`atoms-muscle/src/system/vault_writer`)
*   **Concept**: A local-only tool that accepts a Key Name + Value and writes it to the `northstar-keys` directory.
*   **Security**:
    *   Input: `secret_name` (e.g., `PROVIDER_SHOPIFY_API_KEY`), `secret_value`.
    *   Action: Writes file `/Users/jaynowman/northstar-keys/{secret_name}.txt`.
    *   **Output**: Success/Fail (NEVER returns the key).
*   **Registry**: Manually registered as `system-vault-writer`.

### B. The God Config UI (`atoms-app/dashboard/config/connectors`)
*   **List View**: Pulls from `connector_providers` table.
*   **Detail View**:
    *   Shows Scopes (from `connector_scopes`).
    *   Shows KPI Mappings.
    *   **"Authentication" Card**:
        *   Lists required keys from `manifest.yaml` (Schema).
        *   **"Set Key" Button**: Triggers `vault_writer` (via API proxy to keep it opaque).

## 3. The Production Line
1.  **Scaffold**: Agent copies `_template` to `src/{slug}`.
2.  **Define**: Agent fills `manifest.yaml` (Scopes, KPIs, Firearms).
3.  **Register**: Agent runs `scripts/sentinel.py` -> Upserts to DB.
4.  **Configure**: User goes to UI -> Enters Secrets -> `vault_writer` saves them.
5.  **Use**: Agent uses Connector -> Connector loads secret from Vault.

## 4. Atomic Tasks (The Connector Architect)
- [ ] **Fix**: Rename `_template/spec.yaml` to `manifest.yaml`.
- [ ] **Muscle**: Build `atoms-muscle/src/system/vault_writer`.
    *   Must be secure. Local file write only.
- [ ] **UI**: Build `atoms-app/src/app/dashboard/connectors/page.tsx`.
    *   The "God Config" interface.
- [ ] **Verify**: Full loop with a dummy connector (e.g., `dummy_service`).
