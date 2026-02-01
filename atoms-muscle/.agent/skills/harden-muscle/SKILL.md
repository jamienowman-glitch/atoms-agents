---
name: harden-muscle
description: Teaches an Agent how to upgrade/harden an existing Muscle's core implementation without touching wrappers or packaging.
metadata:
  short-description: Upgrade a Muscle (Add 4K, GPU, etc.)
  version: 1.0.0
---

# 🔧 Muscle Hardening: Surgical Upgrade Protocol

Use this skill when the user asks to "Upgrade this muscle", "Add 4K support", "Make it faster", or "Harden the video transcoder".

## 🧠 Context
You are a **Muscle Surgeon**. An existing muscle works but needs enhancement. You edit **only the core implementation** (`service.py`) and leave all wrappers, packaging, and registration untouched.

## 🎯 When to Use This Skill
- Muscle already exists (scaffolding complete)
- MCP wrapper and SKILL.md are already in place
- The muscle works but needs:
  - **New capability** (e.g., 1080p → 4K)
  - **Performance boost** (e.g., CPU → GPU)
  - **Production hardening** (error handling, logging, metrics)
  - **Bug fixes**

## 🧭 The Golden Rule
> **ONLY edit `service.py` and the muscle-level `AGENTS.md`.**
> 
> Do NOT touch:
> - `mcp.py` (MCP wrapper)
> - `SKILL.md` (unless capabilities fundamentally change)
> - Root `AGENTS.md`
> - Any packaging/scaffold scripts

## 🛠️ The 4-Step Surgical Upgrade Process

### Step 1: LOCATE THE MUSCLE
Find the muscle directory:
```bash
# Example: Upgrading video_transcoder
cd atoms-muscle/src/video/video_transcoder
```

Confirm the structure:
```
video_transcoder/
├── service.py          # ← EDIT THIS
├── mcp.py              # ← DO NOT TOUCH
├── SKILL.md            # ← DO NOT TOUCH (unless adding new params)
└── AGENTS.md           # ← EDIT THIS (track progress)
```

### Step 2: READ CURRENT IMPLEMENTATION
Open `service.py` and understand what it does now:
```python
# Example current state (1080p only)
class VideoTranscoderService:
    async def execute_task(self, params: Dict[str, Any]) -> Dict[str, Any]:
        input_path = params.get("input_path")
        output_path = params.get("output_path", "output.mp4")
        
        # Current limitation: hardcoded to 1080p
        stream = ffmpeg.input(input_path)
        stream = ffmpeg.output(stream, output_path, 
                               vcodec='libx264',
                               video_bitrate='5M',
                               s='1920x1080')  # ← Limited to 1080p
        ffmpeg.run(stream)
        
        return {"status": "success", "output_path": output_path}
```

### Step 3: UPGRADE THE IMPLEMENTATION
Edit `service.py` to add the new capability:
```python
# Upgraded implementation (supports 1080p, 4K, 8K)
class VideoTranscoderService:
    async def execute_task(self, params: Dict[str, Any]) -> Dict[str, Any]:
        input_path = params.get("input_path")
        output_path = params.get("output_path", "output.mp4")
        resolution = params.get("resolution", "1080p")  # ← New param
        
        # Resolution mapping
        resolutions = {
            "1080p": "1920x1080",
            "4k": "3840x2160",
            "8k": "7680x4320"
        }
        
        # Dynamic resolution selection
        stream = ffmpeg.input(input_path)
        stream = ffmpeg.output(stream, output_path, 
                               vcodec='libx264',
                               video_bitrate='5M',
                               s=resolutions.get(resolution, "1920x1080"))  # ← Upgraded
        ffmpeg.run(stream)
        
        return {"status": "success", "output_path": output_path, "resolution": resolution}
```

**Upgrade Patterns**:
- **Add parameters**: New inputs like `resolution`, `quality`, `gpu_enabled`
- **Add logic**: Conditional branches, optimization paths
- **Add dependencies**: Import new libraries if needed
- **Add error handling**: Try/catch blocks, validation
- **Add logging**: Track performance, errors

### Step 4: DOCUMENT THE UPGRADE
Edit the muscle-level `AGENTS.md` to track progress:
```markdown
## Development Status
- [x] Pass 1: Scaffolding complete (Basic 1080p transcoding)
- [x] Pass 2: Added 4K and 8K support
- [ ] Pass 3: GPU acceleration (NVENC)
- [ ] Pass 4: Production hardening (metrics, retry logic)

## Recent Upgrades
### 2026-02-01: 4K/8K Support
- Added `resolution` parameter to `execute_task()`
- Supports: `1080p`, `4k`, `8k`
- Maintained backward compatibility (defaults to 1080p)
```

---

## 🧪 Testing Your Upgrade

### Local Test (Manual)
```python
# Test script
from service import VideoTranscoderService

async def test_upgrade():
    service = VideoTranscoderService()
    
    # Test 1080p (existing)
    result = await service.execute_task({
        "input_path": "test.mov",
        "output_path": "test_1080p.mp4",
        "resolution": "1080p"
    })
    print("1080p:", result)
    
    # Test 4K (new)
    result = await service.execute_task({
        "input_path": "test.mov",
        "output_path": "test_4k.mp4",
        "resolution": "4k"
    })
    print("4K:", result)
```

### Verify No Breaking Changes
- Ensure existing calls (without new params) still work
- Test backward compatibility
- Check error handling for invalid inputs

---

## 📝 When to Update SKILL.md

**Update SKILL.md if**:
- You added new **required** parameters
- You changed the **output schema**
- You added a fundamentally **new capability** (e.g., "Now supports HDR")

**Example SKILL.md update**:
```markdown
## Schema
**Input**:
```json
{
  "input_path": "string (required)",
  "output_path": "string (optional)",
  "resolution": "string (optional: 1080p|4k|8k, default: 1080p)"  // ← NEW
}
```

**DO NOT update SKILL.md if**:
- You just improved performance (internal optimization)
- You fixed bugs
- You added optional parameters with safe defaults

---

## 🔄 When to Re-Sync

Run `python3 scripts/sync_muscles.py` **only if**:
- You updated `SKILL.md` (new schema, new capabilities)
- You want to change the muscle status from `dev` to `prod`

**Do NOT re-sync if**:
- You only edited `service.py` (internal changes)
- You didn't touch `SKILL.md`

---

## 📊 Multi-Pass Development Tracking

Use the muscle-level `AGENTS.md` to track development passes:

```markdown
## Muscle Development Roadmap

### Pass 1: MVP (Shipped)
- [x] Basic 1080p transcoding
- [x] H.264 output
- [x] MCP wrapper + SKILL.md

### Pass 2: Resolution Upgrade (Current)
- [x] 4K support
- [x] 8K support
- [x] Dynamic resolution selection

### Pass 3: GPU Acceleration (Planned)
- [ ] NVENC hardware encoding
- [ ] Detect GPU availability
- [ ] Fallback to CPU if no GPU

### Pass 4: Production Hardening (Future)
- [ ] Retry logic for failed encodes
- [ ] Progress tracking (% complete)
- [ ] Cost estimation per resolution
- [ ] Metrics logging (Prometheus)
```

---

## 🚫 What NOT to Touch

| File | Touch? | Why Not? |
|------|--------|----------|
| `service.py` | ✅ YES | This is what you're upgrading |
| `AGENTS.md` (muscle-level) | ✅ YES | Track your progress |
| `mcp.py` | ❌ NO | Wrapper is standardized, auto-generated |
| `SKILL.md` | ⚠️ MAYBE | Only if schema/capabilities change |
| Root `AGENTS.md` | ❌ NO | Factory-level rules, not muscle-specific |
| Scaffold scripts | ❌ NO | Already ran during Pass 1 |

---

## 💡 Common Upgrade Scenarios

### Scenario 1: Add GPU Support
```python
# Before: CPU-only
stream = ffmpeg.output(stream, output_path, vcodec='libx264')

# After: GPU with fallback
gpu_enabled = params.get("gpu_enabled", True)
vcodec = 'h264_nvenc' if gpu_enabled else 'libx264'
stream = ffmpeg.output(stream, output_path, vcodec=vcodec)
```

### Scenario 2: Add Quality Presets
```python
# Add quality parameter
quality = params.get("quality", "medium")
presets = {
    "low": {"bitrate": "2M", "crf": 28},
    "medium": {"bitrate": "5M", "crf": 23},
    "high": {"bitrate": "10M", "crf": 18}
}
config = presets[quality]
stream = ffmpeg.output(stream, output_path, video_bitrate=config["bitrate"])
```

### Scenario 3: Add Error Handling
```python
# Add try/catch and logging
import logging
logger = logging.getLogger(__name__)

try:
    ffmpeg.run(stream, capture_stdout=True, capture_stderr=True)
    logger.info(f"Successfully transcoded {input_path}")
    return {"status": "success", "output_path": output_path}
except ffmpeg.Error as e:
    logger.error(f"FFmpeg error: {e.stderr.decode()}")
    return {"status": "error", "error": str(e)}
```

---

## ✅ Upgrade Checklist

- [ ] Located the muscle in `src/{category}/{name}/`
- [ ] Read and understood current `service.py` implementation
- [ ] Identified specific upgrade (4K, GPU, error handling, etc.)
- [ ] Edited ONLY `service.py` with new logic
- [ ] Tested upgrade locally (backward compatibility confirmed)
- [ ] Updated muscle-level `AGENTS.md` (documented the pass)
- [ ] Updated `SKILL.md` **only if** schema or capabilities changed
- [ ] Re-synced **only if** `SKILL.md` changed

---

## 🔗 Related Skills
- `create-muscle` (for building new muscles from scratch)
- [Muscle Creation Walkthrough](file:///Users/jaynowman/.gemini/antigravity/brain/4fa0cb4c-7682-47d1-8dca-d34f79000638/muscle_creation_walkthrough.md) (full lifecycle)

**GO HARDEN.**
