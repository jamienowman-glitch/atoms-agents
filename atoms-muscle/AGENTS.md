# 🏋️ THE MUSCLE FACTORY: Production Line Standard
> **Mission**: Build 100+ GPU-Accelerated Tools (Muscles) for Nexus and External Sale.

## 🛑 THE GOLDEN RULE
**A Muscle does not exist until it is:**
1.  **Implemented** (Python)
2.  **Exposed** (API)
3.  **Registered** (Database)
4.  **Packaged** (SKILL.md)

---

## 🏗️ THE 5-STEP PRODUCTION LINE
Any Agent building a Muscle MUST follow this exact sequence:

### STEP 1: THE CORE LOGIC (Python)
Create the implementation in `src/muscle/{category}/{name}/service.py`.
*   **Style**: Pure Python. Class-based.
*   **Deps**: Import `ffmpeg`, `torch`, `numpy` etc. locally.

### STEP 2: THE API EXPOSURE (FastAPI)
You MUST expose the logic in `src/muscle/main.py`.
*   **Method**: `POST`.
*   **Route**: `/muscle/{category}/{action}`.

### STEP 3: THE SKILL PACKAGING (SKILL.md)
You MUST create a `SKILL.md` file in `src/muscle/{category}/{name}/SKILL.md`.
This allows Codex/Agents to "install" this muscle as a capability.

**Format**:
```markdown
---
name: muscle-{category}-{name}
description: [Short description for Implicit Invocation]
metadata:
  short-description: [User Facing description]
  mcp-endpoint: https://connect.atoms.fam/mcp/{name}
---

# Instructions
How to use this muscle.
1. Call API: `POST /muscle/{category}/{name}`
2. Payload: `{ "bucket": "...", "key": "..." }`
```

### STEP 4: THE REGISTRY (Cash Register)
You MUST create a SQL Migration (`atoms-core/sql/9XX_muscle_{name}.sql`) to register the tool in `public.muscles`.

```sql
INSERT INTO public.muscles (key, name, description_human, description_tech, mcp_endpoint, api_endpoint, status)
VALUES (
    'muscle_video_wobble',
    'Video Wobble',
    'Adds a dynamic wobble transition.',
    'FFmpeg filter_complex "wobble".',
    'https://connect.atoms.fam/mcp/video-wobble',
    '/muscle/video/wobble',
    'ready'
) ON CONFLICT (key) DO UPDATE SET status = 'ready';
```

### STEP 5: THE VERIFICATION
1.  Run the Migration.
2.  Check `http://localhost:3001/dashboard/infra/muscles`.

---

## 📋 STANDARD FOLDER STRUCTURE
```text
atoms-muscle/
├── src/
│   ├── muscle/
│   │   ├── video/
│   │   │   ├── extractor/          # <--- Subfolder per Muscle
│   │   │   │   ├── service.py      # Implementation
│   │   │   │   └── SKILL.md        # Agent Definition
│   │   ├── audio/
│   │   ├── vision/
│   │   └── main.py                 # The API Gateway
├── pyproject.toml
```

## 🧠 AGENT INSTRUCTION (Copy-Paste)
> "You are a Muscle Builder. Your job is to create a new feature: **[FEATURE NAME]**.
> 1. Write the Python logic in `src/muscle/{category}/{name}/service.py`.
> 2. Create `SKILL.md` with semantic instructions.
> 3. Expose it in `main.py`.
> 4. Create the SQL Registry Entry.
> 5. Verify it appears in the Dashboard.
>
> GO."
