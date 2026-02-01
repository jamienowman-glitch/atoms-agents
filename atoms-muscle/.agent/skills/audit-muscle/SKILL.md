---
name: audit-muscle
description: Teaches an Agent how to perform quality assurance and luxury validation on existing muscles using QA_SKILL.md criteria.
metadata:
  short-description: QA & Luxury Validation (Phase 8)
  version: 1.0.0
  requires_vision: true
---

# 🔍 Muscle Auditing: QA & Luxury Validation

Use this skill when the user asks to "Audit this muscle", "Verify quality", "Run QA", or "Check if it's prod-ready".

## 🧠 Context
You are a **QA Engineer** with Vision capabilities. Your job is to validate that a muscle is:
1. **Functionally correct** (passes automated tests)
2. **Visually flawless** (no artifacts, glitches, degradation)
3. **Luxury-grade** (feels premium, not budget)

## 🎯 When to Use This Skill
- Muscle exists and implementation is complete (Phases 1-7 done)
- Pitch has been added (Phase 7 complete)
- Muscle is ready for production deployment
- User needs final validation before launch

## 🛠️ The 4-Step Auditing Process

### Step 1: READ THE QA_SKILL.md
Every muscle has a `QA_SKILL.md` file that defines:
- **Functional tests**: What automated tests must pass?
- **Visual checks**: What should the output look like?
- **Luxury criteria**: What separates "good" from "premium"?
- **Performance benchmarks**: How fast should it run?

**Location**: `atoms-muscle/src/{category}/{name}/QA_SKILL.md`

### Step 2: RUN FUNCTIONAL TESTS
Execute the automated test suite:
```bash
cd atoms-muscle/src/{category}/{name}
pytest test_bench.py -v
```

**Expected Output**:
```
test_basic_functionality PASSED
test_error_handling PASSED
test_backward_compatibility PASSED
```

**Pass Criteria**: All tests green (100% pass rate)

### Step 3: VISUAL VERIFICATION (Vision Agent)
For muscles that produce visual/audio output (video, images, audio files):

#### 3a. Generate Test Output
Run the muscle on a test case and capture the output:
```python
from service import VideoTranscoderService

service = VideoTranscoderService()
result = await service.execute_task({
    "input_path": "test_video_1080p.mov",
    "output_path": "test_output_4k.mp4",
    "resolution": "4k"
})
```

#### 3b. Analyze the Output (Vision)
Open `test_output_4k.mp4` and check:
1. **Quality**: Does it look professional? Crisp edges? Accurate colors?
2. **Consistency**: Are there artifacts? Dropped frames? Glitches?
3. **Accuracy**: Does it match the requested spec (e.g., 4K = 3840x2160)?

#### 3c. Apply Luxury Criteria
Ask yourself:
- **Would I pay $500/month for this output quality?**
- **Is it indistinguishable from Adobe Premiere / Final Cut Pro?**
- **Does it feel "heavyweight" (premium) or "cheap" (budget)?**

**Luxury Score**: 1-10
- **9-10**: Indistinguishable from industry leaders (Adobe, Apple, Avid)
- **7-8**: Very good, minor imperfections acceptable
- **5-6**: Functional but feels "budget"
- **1-4**: Not production-ready

### Step 4: GENERATE AUDIT REPORT
Create `AUDIT_REPORT.md` in the muscle directory:

```markdown
# Audit Report: {muscle_name}
**Date**: 2026-02-01
**Auditor**: [Your Name/ID]
**Muscle Version**: v1.0.0

## Functional Tests
- [x] All pytest tests pass (3/3)
- [x] Backward compatibility verified
- [x] Error handling tested

## Visual Verification
**Test Case**: 1080p → 4K transcoding
**Input**: `test_video_1080p.mov` (1920x1080, 30fps, H.264)
**Output**: `test_output_4k.mp4` (3840x2160, 30fps, H.264)

**Observations**:
- [x] Frame rate: Consistent 30fps (no drops)
- [x] Color grading: Accurate (99% match to reference)
- [x] Artifacting: None detected
- [x] Resolution: Verified 4K (3840x2160)
- [⚠️] Edge sharpness: Minor softness in high-motion scenes

## Performance Benchmarks
- **Processing speed**: 8 seconds per minute of footage ✅ (target: <15s)
- **GPU utilization**: 92% ✅ (target: >80%)
- **Memory usage**: 2.4GB ✅ (target: <4GB)

## Luxury Score: 9/10
**Assessment**: Output quality is indistinguishable from Adobe Premiere in 
most scenarios. Minor edge softness in high-motion scenes is acceptable and 
common in GPU-accelerated encoding. This muscle feels premium and would pass 
for a $500/month SaaS product.

## Recommendation: **PASS (Production Ready)**

## Notes
Tested on NVIDIA RTX 4090. Performance may vary on older GPUs. Recommend 
adding GPU capability detection to warn users on unsupported hardware.
```

---

## 🔍 Luxury Validation Framework

### What Makes a Muscle "Luxury"?

| Criteria | Budget | Premium | Luxury |
|----------|--------|---------|--------|
| **Output Quality** | Visible artifacts | Clean, professional | Indistinguishable from Adobe/Apple |
| **Error Handling** | Crashes or cryptic errors | Returns error message | Graceful degradation + helpful guidance |
| **Performance** | Slow, unpredictable | Fast enough | Blazing fast (GPU-accelerated) |
| **User Experience** | Technical jargon | Clear documentation | Magazine-ready pitch + docs |
| **Reliability** | Works most of the time | Works every time | Works + handles edge cases |

### Example Scenarios

#### Scenario 1: Video Transcoder
- **Budget**: FFmpeg CLI wrapper, crashes on corrupted files
- **Premium**: Converts video, returns clean errors
- **Luxury**: Converts video + auto-detects corruption + suggests repair tools + matches Premiere quality

#### Scenario 2: Audio Denoise
- **Budget**: Spectral subtraction, robotic artifacts
- **Premium**: Removes noise, preserves voice
- **Luxury**: Removes noise + preserves natural warmth + sounds like studio booth

---

## 📊 Audit Outcomes

### PASS (Production Ready)
- All functional tests pass
- Visual checks pass (no critical artifacts)
- Luxury score ≥ 7/10
- **Action**: Deploy to production, mark status `prod` in registry

### FAIL (Functional Issue)
- Any functional test fails
- Output is incorrect or broken
- **Action**: Return to **Phase 3 (Implementation)**, fix bugs, re-test

### LUXURY FAIL (Works but Budget)
- Functional tests pass
- Visual checks pass
- Luxury score < 7/10 (feels cheap)
- **Action**: Return to **Phase 3 (Implementation)** for hardening, or mark as `dev` (not ready for premium sale)

---

## 🧪 Vision Agent Checklist (For Visual/Audio Outputs)

### Video Muscles
- [ ] Frame rate consistency (no dropped frames)
- [ ] Color accuracy (compare to reference)
- [ ] Resolution match (1080p, 4K, 8K as requested)
- [ ] Compression artifacts (check for blocking, banding)
- [ ] Edge sharpness (crisp vs soft)
- [ ] Motion handling (high-motion scenes smooth?)

### Audio Muscles
- [ ] No robotic artifacts (voice sounds natural)
- [ ] Background noise removed (clean silence)
- [ ] Voice warmth preserved (not thin/tinny)
- [ ] No clipping/distortion
- [ ] Frequency balance (bass, mids, treble intact)

### Image Muscles
- [ ] Resolution match
- [ ] Color accuracy
- [ ] Detail preservation
- [ ] No compression artifacts
- [ ] Edge sharpness

---

## ✅ Auditing Checklist

- [ ] Located `QA_SKILL.md` for the muscle
- [ ] Ran `pytest test_bench.py` (all tests pass?)
- [ ] Generated test output (ran muscle on sample input)
- [ ] Performed visual verification (Vision agent checks)
- [ ] Scored luxury criteria (1-10 scale)
- [ ] Generated `AUDIT_REPORT.md` with findings
- [ ] Recommended outcome (PASS, FAIL, LUXURY FAIL)

---

## 🔗 Related Skills
- `pitch-muscle` (Phase 7 - must be complete before audit)
- `harden-muscle` (for fixing issues found during audit)

**GO AUDIT.**
