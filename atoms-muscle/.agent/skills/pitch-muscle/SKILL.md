---
name: pitch-muscle
description: Teaches an Agent how to generate editorial pitches and AEO metadata for existing muscles.
metadata:
  short-description: Add Marketing Pitch & AEO (Phase 7)
  version: 1.0.0
---

# 📣 Muscle Pitching: Marketing & AEO Layer

Use this skill when the user asks to "Add a pitch", "Make this muscle sellable", "Generate marketing copy", or "Prepare this for the magazine".

## 🧠 Context
You are a **Marketing Copywriter** for a luxury SaaS brand. Your job is to transform technical capabilities into compelling stories that sell to:
- **Shopify store owners** (non-technical)
- **Agency creatives** (design-focused)
- **Athletes** (performance-focused)
- **Developers** (API consumers)

## 🎯 When to Use This Skill
- Muscle exists and is functional (Phases 1-6 complete)
- `SKILL.md` has technical documentation
- `service.py` implementation is solid
- Muscle needs marketing polish before launch

## 🛠️ The 3-Step Pitching Process

### Step 1: READ THE MUSCLE
Open and understand:
- `SKILL.md` → What does it do?
- `service.py` → How does it work? (implementation details)
- Muscle category → Who is theaudience?

**Example**: `video_transcoder`
- **Capability**: Converts video files to H.264
- **Implementation**: Uses FFmpeg + GPU acceleration
- **Audience**: Filmmakers, content creators, video editors

### Step 2: WRITE THE PITCH
Create a 2-3 paragraph editorial story following this formula:

#### Paragraph 1: The Problem
Start with the user's pain point:
> "Managing raw 4K footage from your shoot day is chaos. Files are massive, formats are inconsistent, and your editing software chokes on playback."

#### Paragraph 2: The Solution
Introduce the muscle as the hero:
> "Our GPU-accelerated transcoding muscle handles this in seconds. Drop your MOV, AVI, or MKV files, select your target resolution (1080p, 4K, or 8K), and walk away. Behind the scenes, it's leveraging NVENC hardware encoding to process hours of footage faster than real-time."

#### Paragraph 3: The Outcome
Paint the picture of success:
> "You get broadcast-ready H.264 files optimized for web delivery or Premiere import. No artifacts. No dropped frames. Just clean, professional output that clients won't question."

### Step 3: EXTRACT AEO KEYWORDS
Identify 3-5 SEO-friendly keywords from the pitch:
- **Category keyword**: `video transcoding`, `audio processing`, `CAD rendering`
- **Technical keyword**: `GPU-accelerated`, `H.264 encoding`, `4K video`
- **Outcome keyword**: `professional export`, `broadcast-ready`, `web delivery`

---

## 📝 Update SKILL.md Frontmatter

### Before (Technical Only)
```yaml
---
name: muscle-video-video_transcoder
description: Transcode video files to H.264 format
category: video
---
```

### After (Marketing-Ready)
```yaml
---
name: muscle-video-video_transcoder
description: Professional 4K video transcoding with GPU acceleration
category: video
aeo_keywords:
  - 4K video transcoding
  - GPU-accelerated encoding
  - H.264 professional export
  - broadcast-ready video
author_identity: Media Architect
pitch: |
  Managing raw 4K footage from your shoot day is chaos. Files are massive, 
  formats are inconsistent, and your editing software chokes on playback.
  
  Our GPU-accelerated transcoding muscle handles this in seconds. Drop your 
  MOV, AVI, or MKV files, select your target resolution (1080p, 4K, or 8K), 
  and walk away. Behind the scenes, it's leveraging NVENC hardware encoding 
  to process hours of footage faster than real-time.
  
  You get broadcast-ready H.264 files optimized for web delivery or Premiere 
  import. No artifacts. No dropped frames. Just clean, professional output 
  that clients won't question.
---
```

---

## 🎨 Pitch Writing Guidelines

### Tone & Voice
- **Confident**: "This muscle handles..." (not "This might help...")
- **Outcome-focused**: What the user gets, not how it works
- **Luxury**: Premium language ("broadcast-ready", "professional", "precision")
- **Concise**: 2-3 paragraphs max

### Avoid
- ❌ Jargon without context (e.g., "Uses FFmpeg" → "Leverages industry-standard encoding")
- ❌ Implementation details (e.g., "Calls ffmpeg.run()" → not needed)
- ❌ Apologetic language (e.g., "should work", "might be useful")
- ❌ Technical specs (e.g., "Uses H.264 CRF 23" → not in pitch, save for docs)

### Include
- ✅ User pain point (what sucks right now?)
- ✅ Transformation (what changes after using this muscle?)
- ✅ Proof of quality (what makes this "luxury"?)

---

## 🔍 AEO Keyword Strategy

### Formula
`[Category] + [Technology] + [Outcome]`

### Examples by Category
| Muscle | Category Keyword | Technology Keyword | Outcome Keyword |
|--------|------------------|-------------------|----------------|
| `video_transcoder` | Video transcoding | GPU-accelerated | Broadcast-ready export |
| `audio_denoise` | Audio processing | AI-powered noise reduction | Studio-quality clarity |
| `cad_renderer` | CAD rendering | Ray-traced visualization | Photorealistic 3D previews |

### Best Practices
- **Specific over generic**: "4K video transcoding" > "video processing"
- **Technology callouts**: "GPU-accelerated", "AI-powered", "Hardware-encoded"
- **Outcome-driven**: "broadcast-ready", "professional-grade", "studio-quality"

---

## 💡 Author Identity Assignment

Match the muscle category to an identity:

| Category | Author Identity |
|----------|----------------|
| `video` | Media Architect |
| `audio` | Sound Engineer |
| `cad` | Precision Designer |
| `image` | Visual Technician |
| `text` | Content Strategist |
| `construction` | Build Coordinator |

Custom identities are allowed (e.g., "GPU Specialist", "Rendering Engineer").

---

## ✅ Pitching Checklist

- [ ] Read `SKILL.md` and `service.py` to understand the muscle
- [ ] Identified the target audience (Shopify owner, filmmaker, etc.)
- [ ] Wrote 2-3 paragraph pitch following the formula:
  - [ ] Paragraph 1: The Problem
  - [ ] Paragraph 2: The Solution
  - [ ] Paragraph 3: The Outcome
- [ ] Extracted 3-5 AEO keywords (category + technology + outcome)
- [ ] Assigned `author_identity` based on category
- [ ] Updated `SKILL.md` frontmatter with `aeo_keywords`, `author_identity`, `pitch`
- [ ] Verified tone is confident, outcome-focused, and luxury-grade

---

## 📊 Example: Before & After

### Before (Technical)
```markdown
---
name: muscle-audio-denoise
description: Remove background noise from audio files
category: audio
---

# Audio Denoise Skill

## Overview
Removes background noise from audio files using spectral subtraction.
```

### After (Magazine-Ready)
```markdown
---
name: muscle-audio-denoise
description: AI-powered audio noise reduction for studio-quality clarity
category: audio
aeo_keywords:
  - audio noise reduction
  - AI-powered denoising
  - studio-quality audio
  - professional audio cleanup
author_identity: Sound Engineer
pitch: |
  Recording in less-than-perfect environments? Background hum, HVAC noise, 
  and room echo sabotage your podcast, interview, or voice-over quality.
  
  Our AI-powered denoising muscle strips out unwanted background noise while 
  preserving the natural warmth of your voice. Upload your raw audio, and the 
  muscle applies adaptive spectral subtraction to isolate and eliminate noise 
  without the robotic artifacts of traditional filters.
  
  The result? Studio-grade clarity that sounds like you recorded in a $10,000 
  booth, not your bedroom closet. Clean, professional, broadcast-ready.
---
```

---

## 🔗 Related Skills
- `create-muscle` (for building muscles from scratch)
- `audit-muscle` (for QA validation after pitching)

**GO PITCH.**
