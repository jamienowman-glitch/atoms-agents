# Atomic Task Plan: Legacy Dependency Migration (The "Deep Recon" Fix)

**Goal**: Eradicate all dependencies on `northstar-engines` (now quarantined in `_legacy/`) from `atoms-core` and `atoms-muscle`. Ensure all logic is explicitly ported to `atoms-muscle`.

## 1. The Breakage Report (What is currently broken)
The following files in `atoms-core` import from `engines.*` and are now **dead**:

### A. Audio Subsystem (Critical)
*   `src/audio/audio_core/runner.py` (Imports `preprocess_basic_clean`, `beat_features`)
*   `src/audio/audio_hits/service.py`
*   `src/audio/audio_voice_enhance/service.py`
*   `src/audio/audio_normalise/service.py`
*   `src/audio/audio_fx_chain/service.py`
*   `src/audio/audio_macro_engine/service.py`
*   `src/audio/audio_semantic_timeline/service.py`
*   `src/audio/audio_voice_phrases/service.py`
*   `src/audio/audio_loops/service.py`
*   `src/audio/audio_separation/service.py`
*   `src/audio/audio_service/service.py`
*   `src/audio/core/asr_whisper/engine.py`

### B. CAD/Video (Minor)
*   `src/cad/viewer/service.py`
*   `src/video/core/extensions.py`

## 2. The Plan: Port & Repoint
We must not just change the import; we must often *move the code* if it doesn't exist in V2.

### Step 1: Port "Heavy Engines" to `atoms-muscle`
*   **Audio Engines**: The logic in `engines.audio.*` needs to be moved to `atoms-muscle/src/audio/*`.
    *   `preprocess_basic_clean` -> `atoms-muscle/src/audio/basic_clean`
    *   `beat_features` -> `atoms-muscle/src/audio/beat_features`
    *   `asr_whisper` -> `atoms-muscle/src/audio/asr_whisper`
*   **Action**: Copy the implementation files from `_legacy/northstar-engines/engines/audio/*` to the new `atoms-muscle` locations.

### Step 2: Update `atoms-core` Imports
*   Refactor `atoms-core/src/audio/audio_core/runner.py`:
    *   `from engines.audio...` -> `from atoms_muscle.src.audio...` (or better, use the Muscle Service abstraction).

### Step 3: Verify No "engines" Text Remains
*   Run `grep -r "from engines" src/` in `atoms-core` until empty.

## 3. Atomic Tasks (For the "Fixer" Agent)
- [ ] Port `engines.audio.preprocess_basic_clean` to `atoms-muscle`.
- [ ] Port `engines.audio.beat_features` to `atoms-muscle`.
- [ ] Port `engines.audio.asr_whisper` to `atoms-muscle`.
- [ ] Fix imports in `atoms-core/src/audio/*`.
- [ ] Verify `atoms-ui` has NO imports (passed in Recon).
