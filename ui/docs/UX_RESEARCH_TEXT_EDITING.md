# UX Research: Builder Text Editing Experiences

## Executive Summary
We analyzed **Shopify**, **Wix**, and **Klaviyo** to determine the best-in-class user experience for text editing in a page builder. The goal is to combine the structured, schema-driven approach of Shopify with the directness of Wix/Klaviyo inline editing.

## Competitive Analysis

### 1. Shopify Theme Editor
*   **Model**: **Sidebar-Driven**.
*   **Interaction**: Users select a section/block in the preview or sidebar. All editing (text content, color, size) happens in the **Sidebar**.
*   **Pros**: strict adherence to design system, clean preview, no broken layouts.
*   **Cons**: "Ping-pong" eye movement between sidebar and preview. Feels less "alive".

### 2. Wix Editor
*   **Model**: **Inline / On-Canvas**.
*   **Interaction**: Users **Double-Click** text to edit directly ("Work on the glass"). A **Floating Toolbar** appears for formatting (Bold, Italic, Color).
*   **Pros**: Highly intuitive, immediate feedback, feels like a document editor.
*   **Cons**: Can break design constraints if users paste bad HTML; floating toolbars can obscure content.

### 3. Klaviyo Email Builder
*   **Model**: **Hybrid**.
*   **Interaction**: Blocks are dragged from a sidebar. **Double-click** to edit text inline. Styles (Global vs Block) are managed in a **Sidebar/Panel**.
*   **Pros**: Best of both worlds. Direct manipulation for content, structured control for style.

---

## Recommended "Northstar" Behavior

We will target the **Hybrid Model** (closest to Klaviyo/Wix but with Shopify's data structure):

### 1. Structure (Shopify-like)
*   **Sections & Blocks**: The page is strictly a list of Sections, which contain Blocks.
*   **Sidebar**: Always shows the tree (Section -> Blocks). Allows reordering and adding new blocks.
*   **Inspector**: Handles "Settings" (Padding, Alignment) to enforce the design system.

### 2. Content Editing (Wix-like)
*   **Inline Interaction**: 
    *   **Single Click**: Selects the block (highlights blue). Inspector shows styles (Color/Background).
    *   **Double Click**: Enters "Edit Mode". Text becomes `contentEditable`. Keys are captured.
    *   **Blur**: Saves changes.
*   **Styles**: 
    *   Instead of a complex floating toolbar, we keep style controls in the **Inspector** (Right Panel) to match the Shopify mental model.
    *   **Colors**: Granular `Text Color` and `Background Color` pickers in the Inspector.

### 3. Missing Feature Gap Identified
*   **"Add Block"**: Currently, users can add Sections but cannot easily add *new blocks* to an existing section from the UI. 
*   **Action**: We must add an "**Add Block**" button inside each Sidebar Section to allow composing "Rich Text" sections with multiple paragraphs/headings.
