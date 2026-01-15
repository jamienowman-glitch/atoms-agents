# Phase 02: Registry & History

## 1. Connector Registry (Templates)
**Storage**: Git-based (YAML files) in `northstar-connectors/registry`.
**Structure**:
```text
registry/
  └── <provider_slug>/
      ├── 1.0.0.yaml
      ├── 1.1.0.yaml
      └── latest.yaml  (symlink or pointer)
```

**Immutability Rules**:
- Once a version file (e.g., `1.0.0.yaml`) is merged to `main`, it is **READ-ONLY**.
- Fixes require a new version (e.g., `1.0.1.yaml`).
- "Hotfixes" on existing versions are FORBIDDEN to ensure deterministic behavior across tenants.

## 2. Connector Instances
**Storage**: Database (e.g., Postgres `connector_instances` table).
**Scoping**:
- `tenant_id` (Primary Partition Key)
- `env` (Secondary Partition Key)

**Schema**:
```sql
CREATE TABLE connector_instances (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  env TEXT NOT NULL,
  provider_slug TEXT NOT NULL,
  template_version TEXT NOT NULL,
  config JSONB NOT NULL, -- Encrypted at rest
  state JSONB NOT NULL,
  revision INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  UNIQUE(tenant_id, env, id)
);
```

## 3. Versioning & Rollback
### Template Versioning
- Semantic Versioning (Major.Minor.Patch).
- Breaking changes (e.g., new required input) MUST bump Major version.

### Instance Revisions
- Every update to a `ConnectorInstance` (config change, version upgrade) creates a **Revision History** entry (Audit Log).
- **Rollback**:
  - Reverting an instance simply applies the `config` and `template_version` from a previous revision as a *new* revision.
  - This ensures linear history (no "deleting" history).
