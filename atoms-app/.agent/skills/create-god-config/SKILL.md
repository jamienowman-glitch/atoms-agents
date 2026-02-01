---
name: create-god-config
description: Teaches an Agent how to create a "God Config" page in atoms-app, enforcing the Flat UI standard, mandatory humans.md documentation, and alias-based routing.
metadata:
  short-description: Build a Standard Admin Config Page
  version: 1.0.0
---

# 🏛️ God Config Factory: Build Protocol

Use this skill when asked to "Create a config page", "Add an admin screen", or "Build a God View" in `atoms-app`.

## 1. The Location Law (Flat Is Better Than Nested)
*   **Target**: `atoms-app/src/app/_flat_config/{config_slug}/page.tsx`.
*   **Rule**: Do NOT nest configs deep in the file tree (e.g. `dashboard/settings/billing/advanced`). Keep them ALL in `_flat_config`.
*   **Naming**: Prefix with `god_config_` or `marketplace_` for clarity.

## 2. The Documentation Law (humans.md)
**MANDATORY**: Every config page MUST have a companion `humans.md` file.

*   **Location**: `atoms-app/src/app/_flat_config/{config_slug}/humans.md`.
*   **Audience**: The Boss (Non-Technical).
*   **Content**: Explain *what* the sliders do in plain English.
    *   *Bad*: "Updates `platform_fee_percent` column."
    *   *Good*: "Platform Fee Slider: Controls the cut we take from every transaction. Set to 30% to keep 3 Snax for every 10 Snax spent."

## 3. The Codebase Laws

### A. The "Phonebook" (Routing Aliases)
**NEVER** hardcode paths like `../../components/Slider`.
Use the **Alias Phonebook** (`atoms_core.config.aliases`) logic:

*   `@atoms/*` -> UI Atoms (Sliders, toggles).
*   `@harnesses/*` -> Harness Logic.
*   `@canvas/*` -> Canvas Components.

### B. The "Vault" (No `.env`)
**NEVER** use `process.env`. Use the Vault loader.

## 4. The Build Sequence

### Step 1: Create the Human Manual
Write `humans.md` FIRST. If you can't explain it to a human, you can't build the UI.

### Step 2: Scaffold the Page
Create `page.tsx` using the **Flat Config Layout**.
*   **Header**: Title + Link to `humans.md`.
*   **Body**: Sections (Cards) with Sliders/Toggles.
*   **Footer**: Status Indicators.

### Step 3: Wire the Data
*   **Read**: Fetch current config from Supabase (`public.system_config` or `public.pricing`).
*   **Write**: Update via RPC or Direct Update.

## 5. Quality Checklist
*   [ ] Is it flat in `_flat_config`?
*   [ ] Does `humans.md` exist and explain the logic simply?
*   [ ] Are all imports using aliases?
*   [ ] Does it look like the "43 Page" standard (Clean, Brutalist, High Visibility)?
