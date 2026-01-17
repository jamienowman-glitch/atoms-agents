# Monorepo Creation Plan

**Status**: Planning
**Goal**: unify 5 separate repositories into a single `northstar-monorepo` while preserving git history.

## User Review Required
> [!IMPORTANT]
> **Repo Creation**: You will need to create a **NEW empty repository** on GitHub named `northstar-monorepo` (or similar) so we can push the final result.

> [!NOTE]
> **Migration Method**: I will use `git subtree add` to import your existing repos. This is better than copying files because it **preserves the commit history** of all work we just aligned.

## Step-by-Step Plan

### 1. New Clean Home
-   Create `~/dev/northstar-monorepo`
-   `git init`

### 2. Import "The One Truth" (Subtree Merge)
I will import each repo into a reserved `packages/` directory:

| Original Repo | Destination Path | Current Remote |
| :--- | :--- | :--- |
| `northstar-engines` | `packages/engines` | `jamienowman-glitch/engine` |
| `northstar-agents` | `packages/agents` | `jamienowman-glitch/agents` |
| `ui` | `packages/ui` | `jamienowman-glitch/northstar-studio` |
| `agentflow` | `packages/agentflow` | `jamienowman-glitch/AgentFlow` |
| `atoms_factory` | `packages/atoms` | *(Local Only)* |

### 3. Verification
-   Verify all files exist in new structure.
-   Verify `git log` shows history from original repos.

### 4. Push
-   `git remote add origin <NEW_GITHUB_URL>`
-   `git push -u origin main` (Force push initial state).

## Why not use `northstar-core`?
I inspected `~/dev/northstar-core`. It contains mixed logs, legacy partials (`graveyard_v1`), and seems to be a previous failed experiment. Starting fresh is safer.
