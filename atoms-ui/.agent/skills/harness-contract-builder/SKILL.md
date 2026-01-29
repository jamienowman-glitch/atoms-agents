---
name: harness-contract-builder
description: Build or update a harness contract and scaffold to lock ToolPop/ToolPill/TopPill/ChatRail behavior for canvases.
version: 1.0.0
---

# Harness Contract Builder Skill

Use this skill when you need to lock harness tool surfaces and generate or update canvases without reinventing UI controls.

## Read First
- `atoms-ui/agents.md`
- `atoms-ui/docs/HARNESS_TOOL_SURFACES_SPEC.md`
- `atoms-ui/.agent/skills/realtime-harness/SKILL.md` (realtime rules)

## Input
Provide:
- Target harness name (existing or new).
- Any explicit exceptions (e.g., HAZE wheel selectors).
- The canvas or UI atom to map into the harness slots.

## Output
1) A contract update (JSON) that declares harness tool surfaces and allowed overrides.
2) A harness scaffold or update that reuses existing muscles (no duplicates).
3) A canvas wiring plan that maps tool IDs to the harness slots.

## Non‑negotiables
- Do not create new tool surfaces; reuse canonical ToolPop/ToolPill/TopPill/ChatRail.
- ToolPop must attach to the ChatRail top curvature (mobile).
- ToolPill is icon-only and collapsible (vertical lozenge).
- TopPill controls editing viewport, export, and settings drawers.
- Use `CanvasTransport` (SSE truth). No new routes.

## Workflow
1) **Inventory** the current harness muscles and tool IDs.
2) **Map** the new canvas/tools to existing slots.
3) **Update contract** (or draft one if missing).
4) **Wire** canvas to harness via tool IDs and `useToolState`.
5) **Verify** in mobile view: ChatRail full-screen + ToolPop attachment.

