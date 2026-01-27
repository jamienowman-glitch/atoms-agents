# Atomic Plan: Harvest & Mount

**Objective**: Populate `atoms-registry` and make `northstar-engines` serve it.

> **Status (2026-01-27)**: Deprecated. Registries are DB-first (Supabase) and the legacy `atoms-registry/` directory is quarantined.

## Phase 1: The Harvester (Populate Registry)
- [ ] **Create `scripts/harvest_muscles.py`** (in `northstar-engines`):
    -   Scan `../atoms-muscle/src/**/spec.yaml`.
    -   Parse YAML.
    -   Write to `../atoms-registry/muscle/{id}.yaml`.
- [ ] **Run Harvester**: Verify `atoms-registry` is populated.

## Phase 2: The Mount (Update Engine)
- [ ] **Update `engines/common/config.py`**:
    -   Add `EXTERNAL_REGISTRY_PATH` env var.
- [ ] **Update `engines/registry/repository.py`**:
    -   Modify `list_entries` to scan the external directory if configured.
    -   Merge external entries with internal defaults.

## Phase 3: Verification
- [ ] **Manual Test**:
    -   Run Harvester.
    -   Restart Engine.
    -   `curl localhost:8000/registries/entries?namespace=muscles` -> Expect to see "Video Render" etc.
