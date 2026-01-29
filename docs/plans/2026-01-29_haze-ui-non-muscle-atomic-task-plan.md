---
title: HAZE UI (Non‑Muscle) — Atomic Task Plan
date: 2026-01-29
owner: antigravity-ui-agent
status: draft
scope: atoms-ui
---

# Goal
Finish HAZE UI (non‑muscle). Ensure ToolPop/ToolPill controls are wired and **every button works in browser**. No 3D engine yet.

# Non‑Negotiables
- **Do not touch atoms-muscle.**
- **No new backend routes.**
- **ToolPill is vertical lozenge only** (no boxes/panels) if a canvas‑scoped pill is needed.
- **Mobile‑first** interaction.
- **Check every button in the browser** and report results.

# Required Reads
1. `/Users/jaynowman/dev/AGENTS.md`
2. `/Users/jaynowman/dev/atoms-ui/agents.md`
3. `/Users/jaynowman/dev/atoms-ui/canvases/haze/contract.json`
4. `/Users/jaynowman/dev/atoms-ui/canvases/haze/tool-registry.ts`

# Atomic Tasks

## A. Recon (confirm current state)
1. Open and review: `atoms-ui/canvases/haze/HazeCanvas.tsx`.
2. Open and review: `atoms-ui/canvases/haze/blocks/ConnectedHaze.tsx`.
3. Open and review: `atoms-ui/canvases/haze/blocks/molecules/HazeWorld.tsx`.
4. Confirm tool IDs used by contract vs code.

## B. Tool ID Alignment
1. Resolve mismatch between contract tool keys and `useToolState` keys.
2. Update either contract or code so they are identical.

## C. ToolPill (optional, copy‑only if needed)
1. If HAZE needs custom ToolPill: copy global ToolPill into `atoms-ui/canvases/haze/blocks/HazeToolPill.tsx`.
2. Enforce **vertical lozenge only**. No boxes or panels.
3. Wire to HAZE‑specific actions if required.

## D. UI‑Only Movement Polish
1. Clamp speed/zoom for mobile safety.
2. Keep CSS 3D mock (no WebGL).
3. Ensure ToolPop sliders update live values and HUD reflects them.

## E. Browser Validation (required)
1. Open HAZE canvas in browser.
2. Verify ToolPop sliders update motion values.
3. Verify any ToolPill button works (if present).
4. Confirm mobile layout works and nothing is dead.

# Done Definition
- Tool IDs aligned with contract + registry.
- All UI buttons respond in browser.
- Mobile‑first polish in place.
