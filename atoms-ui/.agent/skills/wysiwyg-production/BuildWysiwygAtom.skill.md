---
name: build-wysiwyg-atom
description: Standard operating procedure for building "Bleeding Layout" UI Atoms for the Wysiwyg Canvas.
---

# SKILL: Build Wysiwyg Atom (Bleeding Layout)

> **Context**: This skill defines how to build high-fidelity UI Block Atoms that support "Bleeding" layouts (elements breaking the grid) and Variable Fonts.

## 1. Input Capability (The Contract)
Every Wysiwyg Atom must start with a defined Contract.
- **Bleeding Support**: The atom must handle negative margins or absolute positioning to allow media to bleed off the edge.
- **Contract Type**: `AtomContract` from `@atoms/multi-tile/MultiTile.config`.

## 2. Typography (Variable Fonts)
- **Engine**: MUST use `useVarioEngine` hook. 
- **Sliders**: The font weight and slant must be controlled by `axisWeight` and `axisSlant` props mapping to the variable font axes.

## 3. Mapping Strategy (The Magnifiers)
The ToolPop has two magnifiers. You must map your atom's contract to them:
- **Left Magnifier (Category)**: Typically `'layout'` or `'typography'`.
- **Right Magnifier (Sub-Group)**: Used for fine-tuning. For Bleeding Atoms:
    - **Target**: `'Bleed/Offset'`
    - **Controls**: `imageOffset`, `textColumnWidth`, `overlap`.

## 4. Implementation Steps
1.  **Define Contract**: Create `[AtomName].contract.ts`. Define traits for `layout` (sliders for offset/width) and `typography` (sliders for weight/grade).
2.  **Scaffold Component**: Create `[AtomName].tsx`.
3.  **Wire Props**: Destructure props to match Contract IDs (snake_case from Tool Control, usually camelCase in prop interface after mapping).
4.  **Implement Bleed**: Use Tailwind arbitrary values `-[30px]` or percentage based widths `w-[130%]` combined with `overflow-visible` on containers.
5.  **Verify**: Check Slider 1 moves the image. Check Slider 2 adjusts the text width.

## 5. Output Verification
- [ ] Atom renders without crashing.
- [ ] "Layout" Slider 1 adjusts the Image Bleed.
- [ ] "Layout" Slider 2 adjusts the Text Width.
- [ ] Typography sliders change the font weight/slant smoothly.
