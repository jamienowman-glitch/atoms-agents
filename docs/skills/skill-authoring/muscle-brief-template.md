---
name: muscle-brief-template
description: Structured brief for building a new muscle end-to-end.
---

# Muscle Brief Template (Fill-In)

## 1) Identity
- **Category:** (video/audio/cad/image/text/media/timeline/etc)
- **Muscle name (folder):** `snake_case` (example: `video_slowmo`)
- **One-line summary:** (what this muscle does)
- **Primary customer:** (internal agents / external developers / both)

## 2) Inputs
- **Input types:** (file paths, URIs, raw text, JSON)
- **Required fields:** (list)
- **Optional fields:** (list)
- **Max file size / length:** (limits)
- **Expected formats:** (e.g., .mp4, .wav, .dxf)

## 3) Outputs
- **Return type:** (JSON, artifact IDs, CLI plan, etc.)
- **Artifacts produced:** (media_v2 asset/artifact types)
- **Output schema:** (short JSON skeleton)

## 4) Compute Model (Brain/Brawn)
- **Interactive path:** (tenant device / server)
- **Export/offline path:** (server CPU ok?)
- **Is CLI plan returned?** (yes/no)
- **Any GPU dependency?** (yes/no)

## 5) Dependencies
- **atoms-core modules needed:** (list)
- **External libs/tools:** (ffmpeg, torch, opencv, etc.)
- **Media services:** (media_v2, timeline, focus, etc.)
- **Security constraints:** (Vault only, no .env)

## 6) Pricing
- **Base Snax price:** (integer)
- **Modifiers:** (per minute, per MB, per frame)
- **Coupons/discounts:** (if applicable)

## 7) Error Handling
- **Top 3 failure modes:** (list)
- **Expected error payloads:** (JSON format)

## 8) SKILL.md Draft Content
- **Capability:** (1 sentence)
- **When to use:** (3-5 bullets)
- **Schema:** (input/output)
- **Cost:** (price)
- **Brain/Brawn:** (explicit instruction)
- **Constraints:** (file types, size, time)
- **Example:** (request/response skeleton)
- **Fun Check:** (random hip-hop question)

## 9) Acceptance Checklist
- Use `docs/skills/skill-authoring/muscle-acceptance-checklist.md`.

## 10) Automation Steps
- Run: `python3 atoms-muscle/scripts/normalize_mcp.py`
- Run: `python3 atoms-muscle/scripts/batch_prepare_deploy.py --clean-after`
