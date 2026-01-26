# Strategy: The Great Registry Migration

**Objective**: Bridge the gap between the Legacy Engine (`northstar-engines`) and the New World (`atoms-registry`, `atoms-muscle`) without breaking production.

## 1. The Conflict
-   **Engine**: `northstar-engines` currently looks at its internal `engines/registry` JSON files.
-   **Data**: The new muscles live in `atoms-muscle/src/.../spec.yaml`.
-   **Goal**: The visual editor needs to see the *new* muscles via the *old* engine API.

## 2. The Solution: "The Hybrid Bridge"
We will not rewrite the Engine yet. We will **Repoint** its eyes.

### Step A: The Harvester (Extraction)
We create a script `harvest_muscles.py` in `northstar-engines` (or `atoms-core`).
-   **Input**: Scans `/atoms-muscle/src/**/spec.yaml`.
-   **Process**: Validates the spec against the MCP Tool Schema.
-   **Output**: Writes a standardized YAML entry to `/atoms-registry/muscle/{muscle_id}.yaml`.
-   **Result**: `atoms-registry` is now the Source of Truth/Backup.

### Step B: The Symlink (Mounting)
We configure `northstar-engines` to read from `atoms-registry` instead of its internal JSON.
-   Currently: `ComponentRegistryRepository` loads `engine_registry.json`.
-   Change: Update `repository.py` to *also* scan the `/atoms-registry` directory (via ENV var `NORTHSTAR_REGISTRY_PATH`).

### Step C: The Consumption
-   `atoms-ui` calls `GET /registries/entries`.
-   `northstar-engines` reads the YAMLs from Step A.
-   `atoms-ui` sees the new muscles.

## 3. The Migration Path (Future Proofing)
1.  **Now**: Legacy Engine serves New Data.
2.  **Next**: `atoms-core` implements a lightweight FastAPI server that *only* serves Registry/Connectors.
3.  **Finally**: `atoms-ui` switches its `TRANSPORT_CONFIG.httpHost` from Legacy to Core.

## 4. Immediate Actions (The Plan)
1.  **Harvest**: Create the harvester script. Run it to populate `atoms-registry`.
2.  **Mount**: Update `northstar-engines/engines/registry/repository.py` to support "Hybrid Mode" (reading external YAMLs).
3.  **Verify**: Hit `/registries/entries` and see the new muscles.
