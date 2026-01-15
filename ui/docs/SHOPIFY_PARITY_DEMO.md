# Shopify Parity Demo Steps

Follow this script to verify the "Shopify-like" Page Builder MVP.

## 1. Setup
```bash
npm run dev --workspace=apps/studio
# Open http://localhost:3000
```
*Note: Ensure `npx tsx scripts/test_server.ts` is running for sync.*

## 2. Core Workflow Verification

### A. Add & Organize Sections
1.  **Look at Sidebar (Left)**.
2.  Click **`+ Hero Banner`**. A generic hero section appears on the canvas.
3.  Click **`+ Rich Text`**. A text section appears below.
4.  **Drag Reorder**: In the sidebar, drag "Rich Text" *above* "Hero Banner".
    *   *Pass Criteria*: The items swap positions in the sidebar + on the canvas.

### B. Inspector Editing (Right Panel)
1.  **Select the "Hero Banner"** (click in sidebar or canvas).
2.  **Edit Background**: In the Inspector (Right), change the color picker to `#e3f2fd`.
    *   *Pass Criteria*: Canvas updates instantly.
3.  **Edit Padding**: Drag the "Vertical Padding" slider.
    *   *Pass Criteria*: The section grows/shrinks vertically.

### C. Blocks & Inheritance
*(Note: For MVP, blocks are simplified as child actions or hardcoded children in the Hero, but let's test properties)*
1.  **Select the "Heading"** inside the Hero section (click directly on text "Empty Hero..." or whatever text is there).
2.  **Change Text**: Type "Welcome to My Store".
3.  **Change Alignment**: In the Inspector (if parent selected), change Alignment to "Left".

### D. Inline "Human" Editing
1.  **Double-click** directly on a Heading or Text Block in the canvas.
2.  *Criteria*: It becomes an editable text box (white background/blue outline).
3.  **Type** some text (e.g., "Human Edit!").
4.  **Click away** (Blur).
5.  *Pass Criteria*: The text updates in the canvas AND the Inspector updates to reflect the new text.

### E. Responsive Preview
1.  **Click "Mobile"** in the Top Bar.
    *   *Pass Criteria*: The canvas viewport shrinks to 375px width.
2.  **Click "Tablet"**, then **"Desktop"**.
    *   *Pass Criteria*: Resizes smoothly.

### F. Image Upload
1.  **Add an "Image" Block** (if available) or create a section with an Image setting.
2.  **Click "Choose File"** in the Inspector.
3.  **Select an image** from your computer.
    *   *Pass Criteria*: The local image renders immediately on the canvas (using Blob URL).

### F. Persistence (Autosave)
1.  **Make changes** (colors, text).
2.  **Reload the page** (Cmd+R).
    *   *Pass Criteria*: The page returns exactly as you left it (Sections, Order, styles).

## 3. Checklist
| Feature | Status |
| :--- | :--- |
| **Shell Layout** (Sidebar/Canvas/Inspector) | ✅ |
| **Add Section** | ✅ |
| **Inspector Controls** (Color, Text, Slider) | ✅ |
| **Drag Reorder** | ✅ |
| **Live Preview** | ✅ |
| **Responsive Mode** | ✅ |
| **Autosave** | ✅ |
