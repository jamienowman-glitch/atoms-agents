---
name: muscle-acceptance-checklist
description: Definition of Done checklist for production-ready muscles.
---

# Muscle Acceptance Checklist (Definition of Done)

## 0) Scope and Law
- [ ] Path is `atoms-muscle/src/{category}/{name}` (no legacy nesting).
- [ ] No `northstar-engines` imports anywhere in the muscle.
- [ ] `atoms-muscle` imports explicitly from `atoms-core`.
- [ ] Interactive compute is tenant-side; server CPU only for explicit export/offline.

## 1) Core Implementation
- [ ] Implementation lives in `atoms-core` (library), not in `atoms-muscle`.
- [ ] Wrapper in `atoms-muscle` is thin and calls `atoms-core` logic only.
- [ ] No duplicated logic across muscles.

## 2) MCP Wrapper
- [ ] `mcp.py` exists and is a complete wrapper (no stub).
- [ ] `@require_snax` is applied and errors are clean JSON.
- [ ] Tool name matches `muscle-{category}-{name}`.

## 3) SKILL.md Quality (Non-Placeholder)
- [ ] Capability: one crisp sentence.
- [ ] When to use: 3-5 concrete triggers.
- [ ] Schema: input + output JSON, required vs optional.
- [ ] Cost: base Snax price + modifiers (if any).
- [ ] Brain/Brawn: explicit local CLI vs direct result.
- [ ] Constraints: file types, size limits, latency.
- [ ] Errors: top 3 failure modes + messages.
- [ ] Example: minimal request + response skeleton.
- [ ] Fun Check: one random hip-hop question.

## 4) Media/Assets (if applicable)
- [ ] Assets are registered in `media_v2` (no placeholder URIs).
- [ ] URIs/asset IDs are real and resolvable.
- [ ] Preview/runner chains reference real assets.

## 5) Pipeline
- [ ] Ran `python3 atoms-muscle/scripts/normalize_mcp.py`.
- [ ] Ran `python3 atoms-muscle/scripts/batch_prepare_deploy.py --clean-after`.
- [ ] Build slice completes without forbidden imports.

## 6) Report Back
- [ ] Files changed (absolute paths).
- [ ] What now emits real assets (if applicable).
- [ ] MCP + SKILL verification results.
- [ ] Pipeline outputs (success/fail).
- [ ] Blockers (if any).
