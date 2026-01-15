# GitHub Alignment & Merge Plan

**Status**: Planning
**Goal**: Consolidate all outstanding work in 5 repositories into a clean "One Truth" state on `main` branch for GitHub upload.

## User Review Required
> [!IMPORTANT]
> **Atoms Factory** is currently **NOT a git repository**.
> **Plan**: I will run `git init`, `git add .`, `git commit` to create a new repository history for it.

> [!WARNING]
> **Northstar UI** is on branch `chat-rail-recon`.
> **Plan**: I will commit the current work to `chat-rail-recon`, then checkout `main` and **MERGE** `chat-rail-recon` into it. This preserves the Chat Rail work as the "New Truth".

## Proposed Changes per Repository

### 1. northstar-engines
**Current Status**: Dirty (Connectors, Masterplan Docs, Tests)
**Action**:
-   `git add .`
-   `git commit -m "chore: snapshot masterplan docs and connector updates"`
-   `git push origin main`

### 2. northstar-agents
**Current Status**: Dirty (Client Boundary, TSV)
**Action**:
-   `git add .`
-   `git commit -m "feat: update engines boundary client and atomic tasks"`
-   `git push origin main`

### 3. agentflow
**Current Status**: Dirty (Multi21 Components)
**Action**:
-   `git add .`
-   `git commit -m "feat: update Multi21 component state"`
-   `git push origin main`

### 4. ui
**Current Status**: Branch `chat-rail-recon` (Dirty)
**Action**:
-   `git add .`
-   `git commit -m "feat: chat rail recon implementation"`
-   `git checkout main`
-   `git merge chat-rail-recon`
-   `git push origin main`

### 5. atoms_factory
**Current Status**: No Git
**Action**:
-   `git init`
-   `git branch -M main`
-   `git add .`
-   `git commit -m "initial: atoms factory codebase"`
-   (Note: You will need to set a remote for this manually later if one doesn't exist).

## Verification Plan
### Automated Tests
-   After commits, run `git status` in each repo to verify "clean" working tree.
-   Run `git log -n 1` to confirm commit message.

### Manual Verification
-   User checks GitHub (or local git log) to see the unified state.
