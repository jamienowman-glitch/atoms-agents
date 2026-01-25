# REGISTRY BLUEPRINT
## MISSION: SURGICAL INSPECTION OF THE TRIAD

### 1. THE MECHANISM (northstar-engines)
**Location:** `northstar-engines/engines/registry`
**Protocol:** Explicit Service Layer backed by `TabularStoreService`.
- **Mechanism:** The Engine **does not** scan files. It provides a REST/Service API (`ComponentRegistryService`) to store and retrieve items.
- **Persistence:** Items are stored in a Key-Value store (DynamoDB/Mock) via `TabularStoreService`. Tables include `component_registry_atoms`, `component_registry_specs`, `component_registry_surfaces`.
- **Seeding:** `SystemRegistryService` contains hardcoded "seed" logic for default connectors (Shopify, YouTube) and firearms, but this is limited to system defaults.

### 2. THE ATOMS (northstar-agents)
**Location:** `northstar-agents/src/northstar/registry/schemas`
**Shape:** Python `dataclasses` (NOT Pydantic Models).
- **Discriminator:** Uses `card_type` field (e.g., `model`, `persona`, `capability`).
- **Key Classes:**
  - `ModelCard`
  - `ProviderConfigCard`
  - `PersonaCard`
  - `CapabilityCard`
  - `TenantCard`
- **Loading:** `RegistryLoader` scans YAML files, matches `card_type`, and instantiates these dataclasses. This loader is the "Bridge" that must push data to the Engine.

### 3. THE UI SOURCE (agentflow)
**Location:** `agentflow`
**Structure:** Next.js 16 (App Router).
- **Surfaces:** Defined as Top-Level Routes in `app/` (e.g., `/stigma`, `/workbench`, `/multi21`).
- **Canvases:** Defined as React Components in `components/canvases/` (e.g., `StigmaCanvas.tsx`, `VideoCanvas`).
- **The Gap:** There is **NO** manifest or registry file in the UI that the Backend reads. The "Registry" in the Engine has no knowledge of "StigmaCanvas" unless explicitly told.

### SUMMARY OF FINDINGS
The system is **Decoupled**.
1. **Agents** are defined in YAML/Dataclasses.
2. **Engine** waits for data to be pushed to its Tables.
3. **UI** exists as a separate React App with no compile-time link to the Engine's Registry.
4. **Universal Gap:** We have the "Atoms" (Agents) and the "Mechanism" (Engine), but we lack the **"Link"** that tells the Engine about the UI Surfaces/Canvases.
