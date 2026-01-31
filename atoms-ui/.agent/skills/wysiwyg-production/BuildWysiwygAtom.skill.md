---
description: Standard operating procedure for building Wysiwyg UI Atoms (Bleeding Layouts, Variable Fonts).
---

# SKILL: Build Wysiwyg Atom

## 1. The Standard
All UI Atoms built for the Wysiwyg Canvas must adhere to the **Bleeding Hero Protocol**.
This ensures that atoms can break the grid while maintaining typographic integrity.

### A. Input Capability (Bleed)
*   **Requirement**: The Atom MUST handle an image/container that "bleeds" off the canvas edge.
*   **Implementation**: Use negative margins or absolute positioning based on a `bleed` prop.
    *   *Example*: `margin-left: -30px` (or dynamic percentage).

### B. Typography (Variable Fonts)
*   **Requirement**: Typography MUST natively support Variable Fonts.
*   **Hook**: Use `useVarioEngine(weight, slant, ...)`.
*   **Forbidden**: Do NOT import static font weights (400, 700). Always use the hook.

### C. Control Mapping (The Contract)
The Atom's contract must map the `ToolPop` controls to specific visual properties.

*   **Left Magnifier (Slider 1)** -> **Layout / Ratio**
    *   *Behavior*: Controls the split between image and text (e.g., 30/70 vs 50/50).
*   **Right Magnifier (Slider 2)** -> **Bleed / Offset**
    *   *Behavior*: Controls how far the element bleeds off the edge.

## 2. The Step-by-Step

1.  **Define Contract**: Create `[Name].contract.ts`. Define the schema for `layout` and `bleed`.
2.  **Scaffold Component**: Create `[Name].tsx`. Import `useVarioEngine`.
3.  **Wire Props**: Connect the Contract props to the CSS variables / styles.
4.  **Verify**: Ensure the Left Magnifier adjusts layout, Right Magnifier adjusts bleed.

## 3. Output
*   A `.tsx` file that is purely visual (no logic).
*   A `.contract.ts` file that definitions the inputs.
