# Factory Rules · Agentflow / UI Factory

These rules apply to **every agent** (planner, implementer, or other) working in this repo.

## Rule 1 – Pre-flight & Roles

Before doing *anything* in this repo, every agent must:

1.  Read `docs/constitution/00_CONSTITUTION.md`
2.  Read `docs/constitution/02_ROLES_AND_MODELS.md`
3.  Read their specific role doc (`GEMINI_PLANS.md`, `01_DEV_CONCRETE.md`, `QA_TEAM_BLUE.md`, or `OSSIE_STYLE_GUIDE.md`).
4.  Read the relevant `*_PLAN.md` for the task.

## Rule 2 – Logging & Status

*   **Max (Implementer)** is responsible for:
    *   Updating logs (e.g. `docs/logs/MULTI21_LOG.md`).
    *   Marking phases as done in the plan.
    *   Moving tasks between Active / Completed as instructed.
*   **Gem (Architect)** must always include "Logging & Status (Max)" and "Task Completion Ritual (Max)" in plans.
*   **Claude (QA)** is responsible for QA stamps after implementation.

## Rule 2.1 – Logging & Evidence

*   **Max MUST** log each phase completion into `docs/logs/MULTI21_LOG.md` and nowhere else.
*   If any other dev log files exist (e.g. `99_DEV_LOG.md`), they are **read-only (legacy)**.

## Rule 2.2 – Public Surface UX Rules

For public surfaces (Signup, Marketing, Connectors):
*   **SEO**: Each page must have a meaningful `<title>` and meta description.
*   **Structure**: Exactly one `<h1>`, logical `<main>` and `<section>` elements.
*   **A11y**: All inputs must have `<label>` and `aria-*` attributes.
*   **Markup**: Keep HTML semantic; Engines will wrap JSON-LD later.

## Rule 3 – Planning agents must point back here

Any **planning / architect** agent (e.g. Gemini) must:

- At the start of any plan section or task block, explicitly remind the human:
  - “Please read the Constitution and Factory Rules.  
    If any part of this plan conflicts with them, surface it to the HITL (human-in-the-loop).”
- Treat conflicts with the Constitution / Factory Rules as **errors in the plan**, not as instructions to ignore the Constitution.

## Rule 3 – Implementers follow plans, not vibes

Any **implementer** agent (e.g. Codex / OSS models / MAX itself when coding) must:

- Only edit files listed in the relevant plan.
- Refuse to “re-plan” work if there is already an Architect plan; instead, ask for the plan to be updated.

## Rule 4 – Logs are sacred

- `docs/99_DEV_LOG.md` is the **single source of truth** for what has happened in this repo.
- No-one may delete past entries. New work gets *new* entries with timestamps.

## Rule 5 – Keep README, requirements, and logs in sync

- Before or after any significant change, agents must ensure:
  - `README.md` still describes the repo correctly.
  - `requirements.txt` still describes the tooling/runtime correctly.
  - `docs/99_DEV_LOG.md` has an entry for the work.
- If there is a conflict between code and docs:
  - Surface it to the human (HITL).
  - Propose a plan to bring them back into alignment.
