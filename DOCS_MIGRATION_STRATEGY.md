# DOCS_MIGRATION_STRATEGY

## Scope
- Target repos: `/dev` (monorepo root), `/northstar-engines`, `/agentflow`, `/northstar-agents`.
- Read-only recon; no files changed except this report.

## Current Inventory
| Repo | Doc count (md/MD) | Key locations | Notable docs | Notes |
| --- | --- | --- | --- | --- |
| `/dev` (root, excluding target repos) | 4 | `/` and `mcp-repo-connector/` | `THE_NORTHSTAR.MD`, `ROUTING_EVENT_INFRASTRUCTURE_INVENTORY.md`, `mcp-repo-connector/README.md`, `mcp-repo-connector/CLOUDFLARE_SETUP_INSTRUCTIONS.md` | `docs/` exists but empty; no `.github` docs found |
| `/northstar-engines` | 437 | `/`, `engines/docs/`, `ui/docs/`, `northstar-engines/`, `_quarantine/docs/` | `Agent.md`, `MUSCLE_HEALTH.md`, `Skill.md`, `northstar-engines/DOCUMENTATION_INDEX.md`, extensive `_quarantine/docs/**` | Very large legacy archive under `_quarantine/docs/_quarantine/OLD_MD` and `engines_legacy` |
| `/agentflow` | 41 | `/`, `docs/`, `docs/atom_flow/`, `_quarantine/docs/` | `Agent.md`, `Skill.md`, `docs/toolpop_spec.md`, `docs/toolmap.md`, `docs/production_line.md`, `docs/building_agent_flows.md`, `docs/atom_flow/AGENTS.md` | Atom Flow already has AGENTS and SKILLs; no repo root AGENTS |
| `/northstar-agents` | 20 | `/`, `src/northstar/registry/cards/`, `_quarantine/docs/` | `Agent.md`, `Skill.md`, `forensic_report.md`, `research_findings.md`, `src/northstar/registry/cards/README.md`, `_quarantine/docs/CONSTITUTION.md` | Only CONTRIBUTING found is `_quarantine/CONTRIBUTING.md` |

### Non-doc rule/role/architecture signals in code or config
- `mcp-repo-connector/src/security.py` describes safety rules for path validation.
- `northstar-agents/src/northstar/registry/cards/README.md` defines registry card rules.
- `northstar-agents/src/northstar/registry/loader.py` documents GraphLens architecture and rules parsing.
- `northstar-agents/src/northstar/registry/schemas/__init__.py` notes new GraphLens architecture.
- `northstar-agents/src/northstar/registry/cards/framework_modes/bedrock/bedrock.guardrails.yaml` documents guardrail rules.
- `northstar-engines/engines/security/pii.py` encodes PII rules and patterns.

## Analysis: Mapping to the New Standard

### Blackboard candidates (static rules, vision, architecture)
- `/Users/jaynowman/dev/THE_NORTHSTAR.MD` (canonical vision and principles).
- `/Users/jaynowman/dev/ROUTING_EVENT_INFRASTRUCTURE_INVENTORY.md` (systemwide routing/event spine architecture).
- `/Users/jaynowman/dev/northstar-engines/Agent.md` (repo laws and system-level constraints).
- `/Users/jaynowman/dev/northstar-engines/engines/registry/Agent.md` (registry rules and role).
- `/Users/jaynowman/dev/northstar-engines/engines/muscle/Agent.md` (muscle engineering pattern).
- `/Users/jaynowman/dev/northstar-engines/MUSCLE_HEALTH.md` (durability status and constraints).
- `/Users/jaynowman/dev/agentflow/Agent.md` (frontend principles).
- `/Users/jaynowman/dev/agentflow/docs/building_agent_flows.md` (graph/lens architecture).
- `/Users/jaynowman/dev/agentflow/docs/toolpop_spec.md` (core UI interaction architecture).
- `/Users/jaynowman/dev/agentflow/docs/production_line.md` (process rules for stable tools).
- `/Users/jaynowman/dev/agentflow/docs/atom_flow/AGENTS.md` (existing safety rules).
- `/Users/jaynowman/dev/northstar-agents/Agent.md` (repo architecture and data flow).
- `/Users/jaynowman/dev/northstar-agents/_quarantine/docs/CONSTITUTION.md` (non-negotiables).
- `/Users/jaynowman/dev/northstar-agents/_quarantine/docs/foundational/NORTHSTAR_AGENTS_BLACKBOARD_AUDIT.md` (blackboard contract).

### Skill candidates (how-to, setup, operational steps)
- `/Users/jaynowman/dev/mcp-repo-connector/CLOUDFLARE_SETUP_INSTRUCTIONS.md`.
- `/Users/jaynowman/dev/northstar-engines/northstar-engines/DOCUMENTATION_INDEX.md` plus linked Gate1 ModeCTX docs (integration and merge steps).
- `/Users/jaynowman/dev/northstar-engines/engines/docs/workbench/**` (workbench and registry operating procedures).
- `/Users/jaynowman/dev/northstar-engines/engines/docs/contracts/**` (operational contracts for canvas and MCP).
- `/Users/jaynowman/dev/northstar-engines/engines/docs/mcp_workbench/**` (MCP setup and recon).
- `/Users/jaynowman/dev/northstar-engines/engines/connectors/Skill.md` (connector integration, draft).
- `/Users/jaynowman/dev/northstar-engines/engines/muscle/Skill.md` (muscle engineering, draft).
- `/Users/jaynowman/dev/northstar-engines/engines/registry/Skill.md` (registry management, draft).
- `/Users/jaynowman/dev/agentflow/docs/toolmap.md` and `/Users/jaynowman/dev/agentflow/docs/toolmap_template.md` (tool wiring reference).
- `/Users/jaynowman/dev/agentflow/docs/atom_flow/skills/ARCHITECT_SKILL.md` and `/Users/jaynowman/dev/agentflow/docs/atom_flow/skills/WORKER_SKILL.md`.
- `/Users/jaynowman/dev/northstar-agents/Skill.md` (agent assembly, draft).

### Legacy/obsolete candidates (archive first, then review)
- `_quarantine/**` in all three target repos (large historical corpus, includes `OLD_MD` and legacy plans).
- `/Users/jaynowman/dev/northstar-engines/_quarantine/docs/_quarantine/OLD_MD/**` (multiple historical variants).
- `/Users/jaynowman/dev/agentflow/_quarantine/**` (historical logs, manifest, recovery reports).
- `/Users/jaynowman/dev/northstar-agents/_quarantine/**` (older constitutions, reports, plans).
- `/Users/jaynowman/dev/northstar-engines/northstar-engines/**` (nested documentation set; likely a prior snapshot).
- Root-level reports such as `/Users/jaynowman/dev/northstar-agents/forensic_report.md` and `/Users/jaynowman/dev/northstar-agents/research_findings.md` (time-bound research outputs).

## Preservation Strategy
- Create a snapshot archive tree before any migration: `/_archive/<repo>/<YYYY-MM-DD>/...`.
- Move legacy documents (especially `_quarantine/**` and nested snapshots) into the archive, preserving original paths under the archive root.
- Leave a short pointer file in the original location for any moved doc that was referenced by code or tooling.
- Maintain a single `/_archive/README.md` index with a date, scope, and reason for archival.
- Do not delete anything; only mark as deprecated or move into the archive.

## Migration Map
| Source | Destination | Notes |
| --- | --- | --- |
| `/Users/jaynowman/dev/THE_NORTHSTAR.MD` | `/Users/jaynowman/dev/AGENTS.md` | Canonical vision and system-wide principles |
| `/Users/jaynowman/dev/ROUTING_EVENT_INFRASTRUCTURE_INVENTORY.md` | `/Users/jaynowman/dev/AGENTS.md` and `/Users/jaynowman/dev/northstar-engines/AGENTS.md` | Split global policy from engine-specific implementation details |
| `/Users/jaynowman/dev/northstar-engines/Agent.md` | `/Users/jaynowman/dev/northstar-engines/AGENTS.md` | Primary repo laws and architecture anchors |
| `/Users/jaynowman/dev/northstar-engines/engines/registry/Agent.md` | `/Users/jaynowman/dev/northstar-engines/AGENTS.md` (Registry section) | Keep sub-system rules close to repo law |
| `/Users/jaynowman/dev/northstar-engines/engines/muscle/Agent.md` | `/Users/jaynowman/dev/northstar-engines/AGENTS.md` (Muscle section) | Preserve strict pattern in root law |
| `/Users/jaynowman/dev/northstar-engines/MUSCLE_HEALTH.md` | `/Users/jaynowman/dev/northstar-engines/AGENTS.md` (Durability appendix) | Keep operational guardrails visible |
| `/Users/jaynowman/dev/northstar-engines/Skill.md` | `/Users/jaynowman/dev/northstar-engines/skills/system-architecture/SKILL.md` | Replace placeholder with actionable steps |
| `/Users/jaynowman/dev/northstar-engines/engines/connectors/Skill.md` | `/Users/jaynowman/dev/northstar-engines/skills/connectors/SKILL.md` | Expand draft into real how-to |
| `/Users/jaynowman/dev/northstar-engines/engines/muscle/Skill.md` | `/Users/jaynowman/dev/northstar-engines/skills/muscle/SKILL.md` | Expand draft into real how-to |
| `/Users/jaynowman/dev/northstar-engines/engines/registry/Skill.md` | `/Users/jaynowman/dev/northstar-engines/skills/registry/SKILL.md` | Expand draft into real how-to |
| `/Users/jaynowman/dev/northstar-engines/northstar-engines/DOCUMENTATION_INDEX.md` | `/Users/jaynowman/dev/northstar-engines/skills/request-context/SKILL.md` | Gate1 ModeCTX operational steps |
| `/Users/jaynowman/dev/agentflow/Agent.md` | `/Users/jaynowman/dev/agentflow/AGENTS.md` | Frontend law and architecture |
| `/Users/jaynowman/dev/agentflow/docs/production_line.md` | `/Users/jaynowman/dev/agentflow/AGENTS.md` (Process rules) | Stable tool protection rules |
| `/Users/jaynowman/dev/agentflow/docs/toolpop_spec.md` | `/Users/jaynowman/dev/agentflow/AGENTS.md` (UI architecture) | Canonical interaction model |
| `/Users/jaynowman/dev/agentflow/docs/toolmap.md` | `/Users/jaynowman/dev/agentflow/skills/toolmap/SKILL.md` | Detailed wiring guide |
| `/Users/jaynowman/dev/agentflow/docs/toolmap_template.md` | `/Users/jaynowman/dev/agentflow/skills/toolmap/SKILL.md` | Template section |
| `/Users/jaynowman/dev/agentflow/docs/atom_flow/AGENTS.md` | `/Users/jaynowman/dev/agentflow/AGENTS.md` (Atom Flow appendix) | Merge or reference as sub-scope |
| `/Users/jaynowman/dev/agentflow/docs/atom_flow/skills/ARCHITECT_SKILL.md` | `/Users/jaynowman/dev/agentflow/skills/atom_flow/ARCHITECT_SKILL.md` | Preserve existing skill |
| `/Users/jaynowman/dev/agentflow/docs/atom_flow/skills/WORKER_SKILL.md` | `/Users/jaynowman/dev/agentflow/skills/atom_flow/WORKER_SKILL.md` | Preserve existing skill |
| `/Users/jaynowman/dev/agentflow/Skill.md` | `/Users/jaynowman/dev/agentflow/skills/frontend-craft/SKILL.md` | Replace placeholder |
| `/Users/jaynowman/dev/northstar-agents/Agent.md` | `/Users/jaynowman/dev/northstar-agents/AGENTS.md` | Repo architecture law |
| `/Users/jaynowman/dev/northstar-agents/src/northstar/registry/cards/README.md` | `/Users/jaynowman/dev/northstar-agents/AGENTS.md` (Registry rules) | Keep rules centralized |
| `/Users/jaynowman/dev/northstar-agents/_quarantine/docs/CONSTITUTION.md` | `/Users/jaynowman/dev/northstar-agents/AGENTS.md` | Extract non-negotiables |
| `/Users/jaynowman/dev/northstar-agents/Skill.md` | `/Users/jaynowman/dev/northstar-agents/skills/agent-assembly/SKILL.md` | Replace placeholder |
| `/Users/jaynowman/dev/northstar-agents/forensic_report.md` | `/_archive/northstar-agents/<date>/forensic_report.md` | Historical report |
| `/Users/jaynowman/dev/northstar-agents/research_findings.md` | `/_archive/northstar-agents/<date>/research_findings.md` | Historical report |

## Gap Analysis
- No repo-root `AGENTS.md` exists in `/northstar-engines`, `/agentflow`, or `/northstar-agents`.
- Multiple `Skill.md` files are placeholders with no actionable steps.
- Large volumes of docs live in `_quarantine/**` with no current index or ownership.
- Nested doc snapshot at `/Users/jaynowman/dev/northstar-engines/northstar-engines/**` looks like a prior export; needs consolidation or archival.
- `docs/` at monorepo root is empty; no canonical cross-repo index exists.
- Only CONTRIBUTING file found is `/Users/jaynowman/dev/northstar-agents/_quarantine/CONTRIBUTING.md`.
- IDE-referenced files not found on disk: `docs/mcp_recon/MCP_RECON_00_EXECUTIVE_MAP.md`, `docs/factory/ATOMS_FACTORY_BULK_BUILD_SPEC.md`, `docs/engines/ENGINES_DURABILITY_TODO_BREAKDOWN.md`, `docs/engines/ENGINES_DURABILITY_HANDOFF.md`.
