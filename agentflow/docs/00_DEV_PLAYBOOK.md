# Dev Playbook · Agentflow / Multi²¹

This repo is the **UI factory**, not the final product OS.

Core idea:
- We design **atomic UI elements** here (Multi²¹ grid, Chat Rail, Headers, Landing, Login).
- Each element is built to be:
  - 24-grid aware
  - Agent-friendly (no hardcoded copy)
  - Easy to lift into the NorthStar / Head Office repo later.

---

## Golden Rules

1. **24-grid first**
   - Layout decisions must align to a 24-unit grid (both axes).
   - When in doubt: think in **grid units** (“12 wide”, “6 high”) not pixels.

2. **No hardcoded copy**
   - No hardcoded headlines, button text, tooltips etc. in components.
   - Use props, config objects, or mock data clearly marked as placeholder.
   - The intention is: **agents or humans can inject copy later**.

3. **Roboto Flex everywhere**
   - Use Roboto Flex as the default UI font.
   - Prefer variable font axes over separate weights where possible.
   - Don’t introduce a second font unless explicitly documented in this file.

4. **Agent-safe components**
   - Components should be:
     - Small, composable, and focused on one concern.
     - Easy for an agent to understand and edit without breaking everything.
   - Avoid “god components” that mix layout, data fetching, and logic.

5. **Styling**
   - Global primitives (spacing, radius, colours) should live in:
     - `app/globals.css` or
     - A small design token file (to be added later).
   - No random magic numbers if a token / grid unit can be used.

6. **No surprise dependencies**
   - Don’t add new libraries without writing a short note in:
     - `docs/99_DEV_LOG.md` and
     - (if important) a section here under “Dependencies”.

---

## Roles (for tools / agents)

We assume three main “personas” working on this repo:

### 1. Architect (Gemini Pro in Antigravity)

- Writes **Implementation Plans**, not code.
- Updates:
  - `docs/10_MULTI21_PLAN.md` (plans + backlog)
  - Optionally adds notes to `docs/00_DEV_PLAYBOOK.md` when rules change.
- Never commits code without a plan section.

### 2. Implementer (ChatGPT 5 Codex Max / OSS model)

- Takes a specific plan step and edits only the files listed.
- Must:
  - Respect Golden Rules above.
  - Avoid renaming or relocating files unless the plan explicitly says so.
- If a change conflicts with this playbook, the plan is wrong – fix the plan first.

### 3. Human (Jay)

- Chooses **what to work on next**.
- Reviews plans + diffs.
- Maintains the **log** in `docs/99_DEV_LOG.md`.

---

## Current Surfaces in this repo

We will gradually add more, but right now the key ones are:

1. **Multi²¹ (Multi21)**
   - A grid + designer for repeatable tiles.
   - Capable of representing:
     - YouTube cards
     - KPI tiles
     - Product cards
     - Simple text / icon tiles
   - Controlled by sliders and a collapsible bottom panel.

2. **Chat Rail** (coming next)
   - Main conversational surface for the OS.
   - Needs multiple size presets (nano, micro, standard, full screen).
   - Must integrate:
     - Strategy Lock indicator + control
     - 3-wise LLM recap points
     - Mini action buttons under the chat.

3. **Headers / Toolbars**
   - Top-of-page bars for apps and landing pages.
   - Will share primitives (icons, spacing, behaviours).

4. **Landing + Login**
   - Simple, bold surfaces per tool family (YouTube, Snapchat, TikTok, Shopify, etc.).
   - Bright background colours, Roboto Flex, minimal content.

Each of these surfaces should eventually have its own `docs/XX_<NAME>_PLAN.md` file following the same shape as Multi²¹.

---

## Planning Template (for Gemini Architect)

When planning a new change, use this structure in the relevant `*_PLAN.md` file:

- **Task ID**: e.g. `M21-03`
- **Goal**: One or two sentences in plain language.
- **Files to touch**: Explicit list.
- **Steps**:
  1. …
  2. …
  3. …
- **Verification**:
  - How to verify visually.
  - Any responsive checks.
# Dev Playbook · Agentflow / Multi²¹
> Pre-flight:
> - Read `docs/constitution/00_CONSTITUTION.md`
> - Read `docs/constitution/01_FACTORY_RULES.md`
> - For overview and links, see `docs/MANIFESTO.md`
