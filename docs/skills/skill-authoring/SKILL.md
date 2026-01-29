---
name: skill-authoring
description: The Standard Operating Procedure (SOP) for creating, structuring, and registering new Skills in the Northstar ecosystem.
---

# 🧠 SKILL: SKILL AUTHORING

## 1. The Standard (Agent Skills)
We follow the **Agent Skills** open standard.
*   **Structure:** A skill is a **Directory**, not a file.
*   **Filename:** The entry point MUST be named `SKILL.md` (all caps).
*   **Naming:** The directory name is the skill ID (kebab-case).

### Example
✅ `docs/skills/my-cool-skill/SKILL.md`
❌ `docs/skills/MyCoolSkill.md`
❌ `docs/skills/my-cool-skill/README.md`

## 2. Frontmatter Requirement
Every `SKILL.md` must start with YAML frontmatter:

```yaml
---
name: my-cool-skill
description: A short, one-line summary of what this skill teaches the agent.
---
```

## 2.1 Muscle SKILL.md Global Standard (2026)
Muscle skills are **prompt-injection contracts** for external buyers. They must include the following sections in the body:
- `# Tool Name`
- `## Capability` (one sentence)
- `## When to use` (explicit triggers)
- `## Schema` (JSON input/output)
- `## Cost` (Base Snax price)
- `## Brain/Brawn` (explicit local CLI note if required)

**Frontmatter (required for muscles):**
```yaml
---
name: muscle-{category}-{name}
description: One-line summary
metadata:
  type: mcp
  entrypoint: src/{category}/{name}/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
```

**Body template (required sections):**
```markdown
# Tool Name
## Capability
## When to use
## Schema
## Cost
## Brain/Brawn
```

Muscle location is **strict**: `atoms-muscle/src/{category}/{name}/SKILL.md`.

## 3. Registration Protocol
A skill does not exist until it is registered in `AGENTS.md`.

### Step 1: Create the Skill
1.  Target repo: `northstar-agents`, `northstar-engines`, or `agentflow`.
2.  Path: `path/to/repo/docs/skills/<skill-name>/SKILL.md`.

### Step 2: Index in Repo Constitution
Edit the local `AGENTS.md` (e.g., `northstar-agents/AGENTS.md`):

```markdown
## 🧠 LOADED SKILLS
* [agent-assembly](docs/skills/agent-assembly/SKILL.md)
* [connectivity-protocol](docs/skills/connectivity-protocol/SKILL.md)
```

### Step 3: Index in Monorepo Constitution
Edit the root `AGENTS.md` (if the skill is relevant globally):

```markdown
## 🌍 GLOBAL SKILL INDEX
* **Agent Assembly:** `northstar-agents/docs/skills/agent-assembly/SKILL.md`
```
