# Agentflow / UI Factory

> Pre-flight for humans & agents:
> - Read `docs/constitution/00_CONSTITUTION.md`
> - Read `docs/constitution/01_FACTORY_RULES.md`
> - Skim `docs/MANIFESTO.md` to know where everything lives
> - Make sure `docs/99_DEV_LOG.md` is up-to-date

This repo is the **UI factory**: we build atomic, agent-safe UI elements (like Multi²¹) that can later be lifted into the main OS.

## Standard Repo Structure (must stay in sync)

Every Agentflow-style UI repo must keep these files present and up-to-date:

- `README.md` – human + agent entry point for this repo.
- `requirements.txt` – high-level runtime/tooling requirements.
- `BOSSMAN.txt` – Jay’s personal checklist when starting or resuming work.
- `docs/MANIFESTO.md` – map of all important docs.
- `docs/constitution/00_CONSTITUTION.md` – repo laws.
- `docs/constitution/01_FACTORY_RULES.md` – behaviour rules for agents.
- `docs/99_DEV_LOG.md` – single dev log; append-only.

If any of these drift out of sync, **fix them before doing further work**.

## Governance & Rules

*   **Constitution**: `docs/constitution/00_CONSTITUTION.md`
*   **Factory Rules**: `docs/constitution/01_FACTORY_RULES.md`
*   **Roles & Models**: `docs/constitution/02_ROLES_AND_MODELS.md`
*   **Role Guides**:
    *   **Gem (Architect)**: `docs/GEMINI_PLANS.md`
    *   **Max (Implementer)**: `docs/01_DEV_CONCRETE.md`
    *   **Claude (QA)**: `docs/QA_TEAM_BLUE.md`
    *   **Ossie (Styling)**: `docs/OSSIE_STYLE_GUIDE.md`

## Apps & Plans

*   **Multi²¹ Grid**:
    *   Spec: `docs/multi21.md`
    *   Plan: `docs/10_MULTI21_PLAN.md`
    *   Log: `docs/logs/MULTI21_LOG.md`

### Agents: How to Start
*   **Gem**: Read `GEMINI_PLANS.md` + Active Plan.
*   **Max**: Read `01_DEV_CONCRETE.md` + Active Plan.
*   **Claude**: Read `QA_TEAM_BLUE.md`.
*   **Ossie**: Read `OSSIE_STYLE_GUIDE.md`.

---

## Existing Notes

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
