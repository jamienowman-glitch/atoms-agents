---
title: MAYBES UI (Non‑Muscle) — Atomic Task Plan
date: 2026-01-29
owner: antigravity-ui-agent
status: draft
scope: atoms-ui + atoms-app
---

# Goal
Finish MAYBES UI as a ToolPill‑first, mobile‑first canvas with working buttons, weather, and forward actions. **No muscle work.**

# Non‑Negotiables
- **Do not touch atoms-muscle.**
- **Do not overwrite global ToolPill.** Copy only into MAYBES scope.
- **ToolPill must be vertical lozenge only** (no boxes, no panels). Extensions must also be lozenge.
- **Mobile‑first** interaction.
- **Check every button in the browser** and report results.
- **No new backend routes**; use existing transport.

# Required Reads
1. `/Users/jaynowman/dev/AGENTS.md`
2. `/Users/jaynowman/dev/atoms-ui/agents.md`
3. `/Users/jaynowman/dev/atoms-ui/canvases/maybes/contract.json`
4. `/Users/jaynowman/dev/atoms-ui/muscles/ToolPill/ToolPill.tsx`

# Atomic Tasks

## A. Recon (confirm current state)
1. Open and review: `atoms-ui/canvases/maybes/MaybesCanvas.tsx`.
2. Open and review: `atoms-ui/canvases/maybes/blocks/ConnectedMaybes.tsx`.
3. Open and review: `atoms-ui/canvases/maybes/blocks/molecules/MaybesCity.tsx`.
4. Open and review: `atoms-ui/canvases/maybes/blocks/atoms/MaybesNode.tsx`.
5. Confirm the contract ToolPill entries match what you’ll emit (`canvas_mode`).

## B. Canvas‑Scoped ToolPill (copy‑only)
1. Copy `atoms-ui/muscles/ToolPill/ToolPill.tsx` to `atoms-ui/canvases/maybes/blocks/MaybesToolPill.tsx`.
2. Strip UI down to **vertical lozenge only**. No boxes, no panels.
3. Implement three actions: `TEXT`, `VOICE`, `CAMERA (disabled)`. Must emit `canvas_mode`.
4. If global ToolPill is rendered by harness, hide it for MAYBES and render `MaybesToolPill` inside the MAYBES canvas only.

## C. ToolPill → Node Creation
1. Ensure `ConnectedMaybes` listens to `canvas_mode` and calls `addNode`.
2. Confirm `camera` is disabled (UI tooltip or toast).
3. Reset `canvas_mode` after action so the tool acts like a momentary button.

## D. Forward Button (every button must work)
1. Add a visible **Forward** button to `MaybesNode` UI.
2. On click, call `transport.sendCommand` with payload.
3. Confirm click works in browser and logs the command.

## E. Weather Layer (mobile‑first)
1. Extend `WeatherLayer` to fetch geolocation (with safe fallback).
2. Call Open‑Meteo and compute a gradient background (day/night/rain).
3. Keep particles optional; must not block interaction.

## F. Browser Validation (required)
1. Open MAYBES canvas in browser.
2. Verify ToolPill actions create nodes.
3. Verify Forward button emits command on click.
4. Verify camera is disabled and shows tooltip/toast.
5. Verify weather layer does not block interaction.
6. Confirm mobile layout (small viewport) works.

# Done Definition
- MAYBES ToolPill is canvas‑scoped and vertical‑lozenge only.
- All buttons work in browser (documented results).
- Weather layer behaves with fallback and does not block UI.
