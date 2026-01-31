# The Atom Production Line (V1)

## Mission
To automate the creation of **20+ High-Quality UI Atoms** that rival Shopify Dawn and Klaviyo, utilizing the **Supabase Registry** for instant availability.

## 1. The Gap Analysis (The Missing 20)
*What Shopify/Klaviyo have that we need.*

### 🟢 Phase 1: Core Layout (The Skeleton)
1.  **Hero Banner**: Full-height, background video/image, overlay text.
2.  **Rich Text**: Narrow container, h1/h2/body, centered.
3.  **Image with Text**: 50/50 split, customizable side (Left/Right).
4.  **Multi-Column**: (We have `MultiTile`, but need specialized variants like "Features").
5.  **Grid Collage**: Masonry layout for mixed media.

### 🔵 Phase 2: Commerce (The Money)
6.  **Product Card**: Thumbnail, Title, Price, Quick Add.
7.  **Featured Collection**: Carousel of Product Cards.
8.  **Collection List**: Grid of Category Images.
9.  **Price Table**: Comparison columns.
10. **Variant Picker**: Color swatches / Size pills.

### 🟣 Phase 3: Engagement (The Trust)
11. **Testimonials**: Slider of quotes + avatars.
12. **Logo Cloud**: "Trusted By" grey-scale grid.
13. **Accordion/FAQ**: Collapsible text rows.
14. **Newsletter**: Email capture form.
15. **Contact Form**: Name, Email, Message inputs.

### 🟠 Phase 4: Media (The Vibe)
16. **Video Player**: Native or Youtube with custom controls.
17. **Gallery**: Lightbox-enabled image grid.
18. **Before/After**: Slider comparing two images.
19. **Countdown Timer**: Urgency tickers.
20. **Map**: Location pin.

---

## 2. The Production Line (The Agent)
An automated workflow to build these atoms.

### The Input
*   **Prompt**: "Build a Testimonial Slider".
*   **Family**: `multi21-web` (React/Tailwind) or `multi21-seb` (Email Table).

### The Standard (Source of Truth)
The Agent **MUST** read:
1.  `MultiTile.tsx` -> For code style, props pattern, and tailwind usage.
2.  `MultiTile.config.ts` -> For the Trait Schema structure.

### The Process
The Agent performs 3 actions:
1.  **Scaffold**: Creates `ui-atoms/{name}/{Name}.tsx` (The Component).
2.  **Define**: Creates `ui-atoms/{name}/{Name}.config.ts` (The Traits).
3.  **Register**: Runs `python3 atoms-core/scripts/sync_ui_atoms.py`.

### The Output
*   **Result**: The Atom appears in Supabase.
*   **Effect**: The `WysiwygBuilderHarness` (via `ToolPop`) **automatically** renders the correct sliders because it reads the new config.

---

## 3. The Polymorphic Strategy
*How to handle Web vs Email vs Deck.*

**Separation of Concerns**:
*   **Web Atoms** (`wysiwyg`): `<div>` based, Framer Motion, Interactive.
*   **Email Atoms** (`seb`): `<table>` based, inline styles, rigid.
*   **Deck Atoms** (`deck`): Absolute positioning, 16:9 fixed.

**Structure**:
```text
ui-atoms/
├── multi-tile/          # The Universal Generic
├── hero/
│   ├── Hero.web.tsx     # React
│   ├── Hero.email.tsx   # MJML/Table
│   ├── Hero.deck.tsx    # Slide
│   └── Hero.config.ts   # Shared Traits (Title, Image, Overlay)
```

**Recommendation**:
Start with **Web (`wysiwyg`)** to fill the Harness.
Use the **same config** to drive future email/deck versions (Shared Truth).

## 4. Next Step
Shall I initialize the **Atom Factory Skill** (a prompt/instruction set for me/other agents) and build the first atom (`Hero`) to prove the line?
