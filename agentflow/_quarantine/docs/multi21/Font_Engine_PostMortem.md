# Multi 2¹ Font Engine & Tool Wiring Post-Mortem

**Date:** January 15, 2026
**Topic:** Typography Engine Debugging & Architecture Fixes
**Status:** Resolved

## 1. The "Ghost Slider" Issue (Tool Registry Disconnect)
**Symptom:** Sliders for Weight, Width, and Size were moving visually in the Toolbar but having zero effect on the Text Block.
**Root Cause:** The `tool-registry.ts` file acts as the "DNS" for the application's state. The typography tools (e.g., `typo.weight`, `typo.size_desktop`) were **not registered**.
**Mechanism of Failure:**
1.  toolbar component (`BottomControlsPanel`) tried to write to `typo.weight`.
2.  `ToolControlContext` checked the registry, found no definition, and likely treated the value as ephemeral or invalid.
3.  The consuming component (`ConnectedBlock`) subscribed to `typo.weight`, but since the write was rejected or lost, it never received the update.
**Fix:** Explicitly registered all typography and text content tools in `lib/multi21/tool-registry.ts`.

## 2. Google Fonts vs. Local Variable Files
**Symptom:** "Slant" and "Grade" axes were not responsive, even when using what appeared to be variable fonts.
**Root Cause:** We were relying on `next/font/google` imports. While high quality, the default Google logic often separates axes into different files or subsets, or didn't expose the specific custom axes (like `CASL` or experimental `slnt`) present in the customized local files provided in `public/fonts`.
**Fix:**
*   Replaced `next/font/google` in `layout.tsx` with `next/font/local`.
*   Directly wired `public/fonts/RobotoFlex-VariableFont...ttf` (and others) to the CSS variables.
*   This unlocked the full range of axes (`GRAD`, `XTRA`, `slnt`) supported by your specific font files.

## 3. The "Slant vs. Italic" Architecture
**Symptom:** The "Slant" slider worked beautifully for `Roboto Flex` (Sans) but did nothing for `Serif`, `Slab`, or `Mono`.
**Context:** `Roboto Flex` is a true "Variable" font where slant is a continuous axis (0 to -10 degrees). `Roboto Serif/Slab` are traditional families where "Italic" is a binary state (a separate font file), not a variable axis.
**Fix (The Hybrid Interface):**
*   **Logic:** We implemented a mapping layer in `Multi21_Text` and `Multi21`.
*   **If Sans (Flex):** Slider maps directly to the `slnt` axis.
*   **If Others:** Slider acts as a switch. If pulled past `-1`, it triggers `font-style: italic`.
*   **Implementation:** `layout.tsx` was configured to load the distinct Italic files for Serif and Mono, ensuring the browser has the asset when the switch flips.

## 4. Text Input Race Condition (Disappearing Text)
**Symptom:** User would type in a text block, click a tool (like "Bold"), and the text would instantly revert to its previous state.
**Root Cause:** React Reconciliation Conflict.
1.  User types into `contentEditable` div (DOM updates).
2.  User clicks a tool.
3.  Parent (`ConnectedBlock`) re-renders due to tool state change.
4.  React passes the *old* text prop down to `Multi21_Text`.
5.  React forces the DOM to match the prop, overwriting the user's unsaved typing.
**Fix (Manual DOM Sync):**
*   Removed `dangerouslySetInnerHTML`.
*   Implemented `useRef` to track the element.
*   Added a "Focus Guard": `useEffect` only updates the DOM from props if `document.activeElement !== ref.current`.
*   This prevents React from clobbering the text while the user is focused on it.

## 5. Media Block Synchronization
**Symptom:** Font updates worked on Text Blocks but Media Blocks (Titles) looked different.
**Root Cause:** `Multi21.tsx` (Media) had its own isolated styling logic that predated the Vario Engine upgrades.
**Fix:** Ported the `getVarStyle` generator (including the Italic mapping and local font variables) from `Multi21_Text` to `Multi21`. Now both components share the exact same typographic DNA.

---

## Action Items for Co-Architect
1.  **Registry First:** When adding ANY new tool (slider, toggle, input), it **MUST** be added to `tool-registry.ts` first. If it's not in the registry, it's not real.
2.  **Touch Points:** If changing font logic, ensure updates are applied to both `Multi21_Text.tsx` (Text) and `Multi21.tsx` (Media Cards).
3.  **Local Fonts:** Always prefer `next/font/local` pointing to `public/fonts` to ensure we control the exact version and axis availability of our typefaces.
