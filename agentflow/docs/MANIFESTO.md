# Manifesto · Agentflow / UI Factory

This is the **human entry point** for this repo.

If you only remember four files, remember:

1. `docs/constitution/00_CONSTITUTION.md` – the laws.
2. `docs/constitution/01_FACTORY_RULES.md` – how agents must behave.
3. `docs/MANIFESTO.md` – this map.
4. `docs/99_DEV_LOG.md` – what actually happened.

Everything else hangs off these.

## 0. Top-level files

At the repo root:

- `README.md` – quick orientation and standard structure.
- `requirements.txt` – high-level runtime/tooling requirements.
- `BOSSMAN.txt` – Jay’s personal checklist; agents may read but must not edit automatically.

These three must always match the reality of the repo. If they drift, fix them first.

## 1. Laws & Rules

- Constitution: `docs/constitution/00_CONSTITUTION.md`
- Factory Rules: `docs/constitution/01_FACTORY_RULES.md`

Read these *first*.

## 2. Role Playbooks

These are manuals for specific agent roles:

- **Dev Playbook (humans + all agents)**  
  `docs/00_DEV_PLAYBOOK.md`
- **Implementer Playbook (MAX / Codex)**  
  `docs/01_DEV_CONCRETE.MD`
- **Gemini Architect Playbook (planning only)**  
  `docs/GEMINI_PLANS.MD`

Each of these should internally assume the Constitution + Factory Rules have already been read.

## 3. Multi²¹ Surface

Multi²¹ is the current primary surface in this repo.

- Spec / API: `docs/multi21.md`
- Plans & backlog: `docs/10_MULTI21_PLAN.md`

Any work on Multi²¹ must:

- Follow the Constitution & Factory Rules.
- Follow the relevant playbook (Gemini Architect or Implementer).
- Log notable changes in `docs/99_DEV_LOG.md`.

## 4. Dev Log

- `docs/99_DEV_LOG.md` is the **only** log of work.
- Append new entries; never delete previous ones.
