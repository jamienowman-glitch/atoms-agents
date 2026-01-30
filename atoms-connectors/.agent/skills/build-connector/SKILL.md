# Skill: Build Connector

**Description**: This skill guides the agent through the process of building, implementing, and registering a new SaaS connector in the Connector Factory.

## 🛑 THE LAWS (Critical)
1.  **Schema First Law**: The `manifest.yaml` is the Source of Truth. Never hardcode metadata in Python.
2.  **Sentinel Law**: NEVER write SQL manually. Always run `python3 scripts/sentinel.py` to register your connector.
3.  **Vault Law**: NEVER hardcode secrets. Use `atoms_core.vault` to retrieve keys (e.g., `PROVIDER_SHOPIFY_API_KEY`).
4.  **No Nesting**: Create your connector at `src/{slug}/` (e.g., `src/shopify/`, NOT `src/connectors/shopify/`).

## 🏗️ THE PROTOCOL

### Phase 1: Research & Discovery
1.  **Search API Documentation**: Find the official API docs for the provider.
2.  **Identify Auth Mode**: Is it OAuth2 or API Key (BYOK)?
3.  **List Scopes**: Identify the permissions needed (e.g., `read_orders`, `write_products`).
    *   *Note*: Determine if a scope allows "dangerous" actions (money/data destruction) -> requires firearm.
4.  **List Metrics**: Identify raw metrics available (e.g., `total_sales`, `follower_count`).

### Phase 2: The Manifest (Schema First)
Create `src/{slug}/manifest.yaml`. This MUST be done before writing code.

```yaml
provider_slug: "provider_name_snake_case"
display_name: "Provider Name"
auth_mode: "oauth" # or "byok"
scopes:
  - name: "read_something"
    description: "Explanation of scope"
    requires_firearm: false
  - name: "write_money"
    description: "Allows spending"
    requires_firearm: true
kpis:
  - raw: "provider_metric_name"
    standard: "core_metric_slug" # Map to closest standard if known, else ask user
utm_capabilities: # Optional: if provider supports UTMs
  - "email"
  - "social"
```

### Phase 3: The Logic
Create `src/{slug}/service.py`.
*   **Imports**: Use `atoms_core` for utilities.
*   **Secrets**: Use `atoms_core.vault` to retrieve credentials.
    *   Naming Convention: `PROVIDER_{SLUG}_CLIENT_ID`, `PROVIDER_{SLUG}_API_KEY`.
*   **Structure**: Implement the necessary service class or functions required by the factory interface.

### Phase 4: The Factory Run
1.  **Run Sentinel**: Execute the registration script.
    ```bash
    python3 scripts/sentinel.py
    ```
2.  **Verify Output**: Ensure the script logs "Registered {slug}" and generates `mcp.py` if missing.

### Phase 5: Verification
1.  **Check Logs**: Confirm no errors in Sentinel output.
2.  **Check Database**: (If possible) Verify the provider exists in `connector_providers` via `scripts/sentinel.py` logs or a check.
