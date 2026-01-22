# 🛠️ SKILL: UI FOUNDRY & ATOM ARCHITECTURE

> **THE GOLDEN RULE:** We do not build "Apps." We build **Cartridges** that plug into the **Workbench**.

## 1. THE IMMUTABLE FRAME (DO NOT TOUCH)
The following components are the **Surface** of the OS. They are carefully calibrated tools. You must **NEVER** refactor, redesign, or "collapse" them into your canvas.
* **The Workbench Shell:** The container that holds everything.
* **The Chat Rail:** (Bottom) The AI communication interface.
* **The Tool Pill:** (Floating) The specific `FloatingLauncher` component.
* **The Dual Magnifier:** The interaction model (Left Lens = Selection, Right Lens = Tokens).

## 2. THE CANVAS CARTRIDGE (YOUR PLAYGROUND)
When creating a new "Mother Canvas" (e.g., `Stigma`, `Aftertime`, `Mynx`), you are building a **Cartridge**.
A Cartridge consists strictly of:
1.  **The Canvas Surface:** The actual working area (Infinite Grid, Block List, Timeline).
2.  **The Top Controls:** The *specific* knobs for the Header (e.g., "Portrait/Landscape" for Studio, "Mobile/Desktop" for Web).
3.  **The Tool Map:** The specific list of UI Atoms available in the Tool Pill.

## 3. ATOMIC CONSISTENCY RULES
To ensure the ecosystem feels like **ONE** factory, these elements are **GLOBAL CONSTANTS**:

### 🔠 Typography (Strict)
* **Variable Fonts ONLY:** We use `Roboto Flex` and `Roboto Serif` variable fonts.
* **Why:** We map tokens to the `opsz`, `wght`, and `slnt` axes.
* **Rule:** Never introduce a static font file. All UI Atoms must expose typography tokens that map to these variable axes.

### 🎨 Color & Theming
* **System Tokens:** Use the shared CSS variables for interaction states (Hover, Active, Selected).
* **Consistency:** A "Primary Button" in the Video Editor must feel identical to a "Primary Button" in the Web Builder.

## 4. THE INTERACTION CONTRACT
Every UI Atom you build must adhere to the **Dual Magnifier** flow:
1.  **User Clicks Atom:** The **Left Magnifier** highlights the atom.
2.  **System Responds:** The **Right Magnifier** automatically loads the `TokenLens` for that atom.
3.  **Settings:** Deep configuration happens in the "Settings" overlay, never on the canvas surface itself.

## 5. SCALING & SURFACES
* **Web Family (`Multi21`):** Focus on Responsive Breakpoints (Mobile/Desktop views).
* **Studio Family (`Stigma`, `Fume`):** Focus on Fixed Aspect Ratios (1:1, 4:5, 9:16) and Canvas Size.
* **Video Family (`Aftertime`):** Focus on Time-based linearity (4:3 default).

> **VERIFICATION:** Before marking a task complete, ask: "Did I modify the Workbench Frame?" If yes, **REVERT IMMEDIATELY.**
