---
name: atom-production-line
description: Automated factory process for building and registering new UI Atoms (Hero, Product Card, etc.) into the Supabase Registry.
version: 1.0.0
---

# Atom Production Line Skill

This skill allows an Agent to function as an **Atom Factory Worker**. It takes a high-level request (e.g., "Build a Testimonial Slider") and outputs a production-ready, registry-synced UI Atom.

## usage
To use this skill, provide a **Goal** (e.g., "Create a Newsletter Signup Atom") and a **Family** target (default: `multi21-web`).

## prerequisites
-   **Knowledge**: You must have read `atoms-ui/ui-atoms/multi-tile/MultiTile.config.ts` (The Standard).
-   **Access**: You must have access to `atoms-core/scripts/sync_ui_atoms.py` (The Registrar).

## process

### 1. Scaffold The Component (`ui-atoms/{name}/{Name}.web.tsx`)
-   **Structure**: Must be a pure React functional component.
-   **Props**: Must accept visual traits (layout, style, typography) as optional props with defaults.
    -   *Example*: `height`, `alignment`, `overlayColor`.
-   **Styling**: Use Tailwind CSS.
-   **Content**: Accept content string/data props (e.g., `title`, `imageSrc`).

### 2. Define The Configuration (`ui-atoms/{name}/{Name}.config.ts`)
-   **Schema**: Must export a const `{Name}Config` of type `AtomConfig`.
-   **ID**: Lowercase, hyphenated (e.g., `newsletter-signup`).
-   **Category**: Primary role (e.g., `layout`, `commerce`, `social`).
-   **Traits**: Define sliding scales and toggles for the harness.
    -   **Layout**: Height, Padding, Columns, Gap.
    -   **Style**: Colors, Opacity, Border.
    -   **Typography**: Size, Family, Weight.
    -   *Note*: Use `responsive: true` for traits that differ on Desktop/Mobile.

### 3. Register The Atom
-   **Action**: Run the python sync script.
    ```bash
    python3 atoms-core/scripts/sync_ui_atoms.py
    ```
-   **Verification**: Ensure the script outputs `✨ Upserted {name}`.

### 4. Wire The Harness
-   **Update**: `atoms-ui/harnesses/wysiwyg-builder/WysiwygBuilderHarness.tsx`.
-   **Logic**: Import the new Config and conditionally pass it to `ToolPop` based on `activeBlockType`.
-   **Update**: `atoms-ui/canvas/wysiwyg/WysiwygCanvas.tsx`.
-   **Logic**: Import the new Component and conditionally render it in `renderBlock`.

## example
**Goal**: Build 'Hero Banner'

1.  **Create**: `atoms-ui/ui-atoms/hero/Hero.web.tsx`
2.  **Create**: `atoms-ui/ui-atoms/hero/Hero.config.ts`
3.  **Run**: `python3 atoms-core/scripts/sync_ui_atoms.py`
4.  **Edit**: `WysiwygBuilderHarness.tsx` -> `atomConfig={activeType === 'hero' ? HeroConfig : ...}`

## missing atoms (The Gap Analysis)
Use this list to guide your next production run:
1.  **Hero Banner** (✅ Done)
2.  **Rich Text**
3.  **Image with Text**
4.  **Multi-Column Features**
5.  **Grid Collage**
6.  **Product Card**
7.  **Featured Collection**
8.  **Collection List**
9.  **Price Table**
10. **Variant Picker**
11. **Testimonials**
12. **Logo Cloud**
13. **Accordion/FAQ**
14. **Newsletter**
15. **Contact Form**
16. **Video Player**
17. **Gallery**
18. **Before/After**
19. **Countdown Timer**
20. **Map**
