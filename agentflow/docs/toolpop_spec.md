# Toolpop Surface & ChatRail Interaction Design

## Overview
The **Toolpop Surface** is the primary "heads-up display" for editing and manipulation in the Multi-21 system. It operates as a distinct layer that "pops" above the **ChatRail**, replacing the potential interaction space with focused, context-aware visual controls.

---

## 1. Toolpop <-> ChatRail Relationship
- **ChatRail**: The foundational communication layer at the bottom of the screen. Always present (unless hidden), serving as the user's primary text input and command center.
- **Toolpop Surface**: An editing overlay that slides up *from* the ChatRail position when an object is selected or a specific editing mode is triggered.
    - **Visual Metaphor**: It "extrudes" from the rail, temporarily taking over the bottom interaction zone.
    - **Interaction State**: When Toolpop is active, direct text entry might be suspended or contextualized to the selected item (e.g., editing text content of a block).
    - **Hierarchy**: ChatRail = Infrastructure/Communication; Toolpop = Manipulation/Action.

---

## 2. The Dual Magnifier System
The core navigation interaction of the Toolpop is the **Dual Magnifier**: two floating control wheels that determine the active editing context.

### A. Left Magnifier: Context (Atom / Frame)
The Left Magnifier is **context-aware**. It changes based on *what* is selected on the canvas. It represents the "Subject" of the edit.
- **Current Default**: `LAYOUT` (Frame).
- **Purpose**: Defines the container, structure, or specific atom type being manipulated (e.g., Frame, Video Atom, Text Block).
- **Behavior**: This wheel's options are dynamic. If you select a Video, it shows Video tools. If you select a Text Frame, it shows Layout tools.

### B. Right Magnifier: Global Tools (The "Lenses")
The Right Magnifier provides the "Verbs" or "Lenses" through which you manipulate the subject. These are generally stable and consistent across different atoms.
- **Categories**: `FONT`, `TYPE`, `STYLE` (Color).
- **Purpose**: Applies universal properties like typography, color, and spacing to the context defined by the Left Magnifier.

---

## 3. Interaction Map & Slider Logic (X/Y Axis)
For every tool selected in the Right Magnifier, the Toolpop exposes up to two primary analog sliders.
- **Top Slider (X-Axis)**: Generally maps to horizontal attributes, primary values, or "Quantity".
- **Bottom Slider (Y-Axis)**: Generally maps to vertical attributes, secondary values, or "Quality".

### LEFT MAGNIFIER: LAYOUT (Frame)
| Tool ID | Label | Top Slider (X-Axis) | Bottom Slider (Y-Axis) | Canvas Effect |
| :--- | :--- | :--- | :--- | :--- |
| **density** | **Grid** | **Columns** (1-12) | **Max Items** (1-50) | Changes CSS Grid definition (`grid-template-columns`). |
| **spacing** | **Space** | **Gap X** (Horizontal Gap) | **Gap Y** (Vertical Gap) | Sets `column-gap` and `row-gap` on the grid container. |
| **geometry** | **Shape** | **Aspect Ratio** (1:1, 16:9, etc.) | **Corner Radius** (0-50px) | Enforces aspect ratio on tiles; applies `border-radius`. |

### RIGHT MAGNIFIER: FONT (Design)
| Tool ID | Label | Top Slider (X-Axis) | Bottom Slider (Y-Axis) | Canvas Effect |
| :--- | :--- | :--- | :--- | :--- |
| **identity** | **Font** | **Font Family** (Index Select) | **Casual Vibe** (0% - 100%) | Switches variable font family; interpolates "Casual" axis (`CASL`). |
| **body** | **Tune** | **Weight** (100 - 1000) | **Width** (50 - 150) | Interpolates Variable Font Weight (`wght`) and Width (`wdth`). |
| **scale** | **Size** | **Base Size** (10px - 64px) | *(None / Context)* | Sets CSS `--base-size` or `font-size`. |

### RIGHT MAGNIFIER: TYPE (Setting)
| Tool ID | Label | Top Slider (X-Axis) | Bottom Slider (Y-Axis) | Canvas Effect |
| :--- | :--- | :--- | :--- | :--- |
| **align** | **Align** | *(Buttons)* L / C / R / Justify | *(None)* | Sets `text-align`. |
| **vert** | **Vert** | *(Buttons)* Top / Mid / Bot / Just | **Stack Gap** (Paragraph Spacing) | Sets Flex alignment (vertical) and `gap` between text elements. |
| **space** | **Space** | **Tracking** (Letter Spacing) | **Leading** (Line Height) | Sets `letter-spacing` (em) and `line-height` (unitless). |
| **words** | **Words** | **Word Spacing** | *(None)* | Sets `word-spacing` (em). |
| **case** | **Case** | *(Buttons)* -- / AA / aa / Aa | *(None)* | Sets `text-transform` (uppercase, lowercase, capitalize). |
| **decor** | **Decor** | *(Buttons)* -- / Under / Strike | *(None)* | Sets `text-decoration` (underline, line-through). |

### RIGHT MAGNIFIER: STYLE (Color & FX)
*Note: Color logic ("Palette") has a unique interaction model.*

| Tool ID | Label | Interaction Model | Canvas Effect |
| :--- | :--- | :--- | :--- |
| **palette** | **Color** | **Target Selector**: Block / Bg / Text<br>**Mode**: Fill / Outline<br>**Spectrum**: Color Selection | Applies `background-color`, `color`, `border-color`, or `-webkit-text-stroke`. |
| **effects** | **FX** | **Top Slider (X)**: **Opacity** (0-100%)<br>**Bottom Slider (Y)**: **Blur** (0-20px) | Sets `opacity` and `filter: blur()`. |

---

## 4. Multi-21 Tile Atom Specifics
The **Multi-21 Tile Atom** is the primary consumer of these controls currently.
- It "catches" all these props via the `ConnectedBlock` wrapper.
- It maps them to CSS Variables (e.g., `--line-height`, `--gap-x`).
- **Internal Logic**: The atom itself decides *how* to use "Grid Columns" (e.g., switching layout modes) or "Aspect Ratio" (forcing image containers).

---

## 5. Secondary Settings Mode (Content Context)
Triggered by the **Settings Button** (Far Left in Header), this mode fundamentally shifts the Toolpop from "Design Mode" (How it looks) to "Content Mode" (What it is).

### A. The Context Switch
When `showSettings` is active, the Dual Magnifier re-binds its data sources to be **UI Atom Context Aware**.
- **Design Mode (Default)**: Left = Frame, Right = Design Tools (Font/Color).
- **Content Mode (Active)**: Left = **Category**, Right = **Strategy**.

### B. Left Magnifier: Content Category
Defines the *Domain* of the content processing.
- **YouTube**: Video feeds, playlists, single videos.
- **Product**: Retail collections, single products.
- **KPI**: Data viz, 6-core metrics.
- **Image/Video**: Atomic media assets (uploaded/generated).
- **Events**: Schedules, upcoming lists.
- **Blogs**: Article feeds.

### C. Right Magnifier: Strategy
Defines the *Method* of retrieval or display for that category.
| Category | Strategy Options (Right Wheel) |
| :--- | :--- |
| **YouTube** | **Playlist** (List), **Feed** (Algorithmic), **Video** (Single) |
| **Product** | **Collection** (Category), **Feed** (Recs), **Product** (Single) |
| **KPI** | **6-Core** (Grid), **Feed** (Stream), **Focused** (Hero) |
| **Image** | **Album** (Gallery), **Feed** (Stream), **Image** (Single) |

### D. The "Pickers" (Body Top)
Instead of Sliders, the body displays a **Content Picker** relevant to the Strategy.
- **MediaPicker**: Used for `Image` / `Video`. Shows grid of assets + Upload/Gen buttons.
- **ContentPicker**: Used for `YouTube`, `Product`, etc. Shows list of available feeds/collections (currently mocked via `SEED_FEEDS`).

### E. Contextual Settings (Body Bottom)
A matrix of toggles specific to the Multi-21 Tile's needs. These are Boolean flags (Tick Boxes) that turn internal atom elements on/off.

| Label (Contextual) | State Variable | Description |
| :--- | :--- | :--- |
| **Title** | `tileShowTitle` | Toggles the main headline/title text. |
| **Meta / Subtitle** | `tileShowMeta` | *YouTube*: Views/Date<br>*Product*: Price<br>*Events*: Date/Loc |
| **Badge** | `tileShowBadge` | *YouTube*: Duration<br>*Product*: Status Tag (Sale/New)<br>*Generic*: Category Tag |
| **Action (CTA)** | `tileShowCtaLabel` | Toggles the call-to-action button text. |
| **Arrow** | `tileShowCtaArrow` | Toggles the directional arrow icon. |

*Note: There is a known issue with checkbox hit areas/state updates currently slated for repair.*
