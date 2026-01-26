# 🏋️ LEGACY MUSCLE INVENTORY
> **Status**: Verified on Disk
> **Count**: 61 Distinct Muscles (Folders)

The previous report of 414 was incorrect (likely counted all sub-files). Here are the 61 targets for wrapping:

## 📹 Video Domain (21)
| Name | Description | Status |
| :--- | :--- | :--- |
| `video_render` | **[CRITICAL]** Main render engine. Timeline -> FFmpeg. | ⚠️ Raw |
| `video_slowmo` | Optical Flow slow motion. | ⚠️ Raw |
| `video_captions` | Transcribes audio to subtitles. | ⚠️ Raw |
| `video_anonymise` | Face blurring service. | ⚠️ Raw |
| `video_regions` | Face/Object detection. | ⚠️ Raw |
| `video_stabilise` | 2-Pass Stabilization. | ⚠️ Raw |
| `video_text` | Text-to-Image for overlays. | ⚠️ Raw |
| `video_edit_templates`| Apply predefined edits. | ⚠️ Raw |
| `video_focus_automation`| Auto-crop based on speakers. | ⚠️ Raw |
| `video_multicam` | Audio-sync multiple angles. | ⚠️ Raw |
| `video_360` | Equirectangular projection. | ⚠️ Raw |
| `video_visual_meta` | Shot detection. | ⚠️ Raw |
| *(Plus 9 more utility muscles)* | |

## 🔊 Audio Domain (24)
| Name | Description | Status |
| :--- | :--- | :--- |
| `audio_separation` | **[CRITICAL]** Stems (Vocal, Drum, Bass). | ⚠️ Raw |
| `audio_normalise` | Loudness Normalization (EBU R128). | ⚠️ Raw |
| `audio_voice_enhance` | AI Noise Removal. | ⚠️ Raw |
| `audio_analysis` | BPM, Key detection. | ⚠️ Raw |
| `audio_render` | Mixes audio timeline. | ⚠️ Raw |
| `audio_timeline` | Semantic timeline logic. | ⚠️ Raw |
| *(Plus 18 more mixing/sample engines)* | |

## 📐 CAD & Image (16)
| Name | Description | Status |
| :--- | :--- | :--- |
| `cad_viewer` | Gantt/Overlay viewer for CAD. | ⚠️ Raw |
| `cad_diff` | Computes geometry diffs. | ⚠️ Raw |
| `image_core` | Composition & Layer engine. | ⚠️ Raw |
| `boq_quantities` | Bill of Quantities calculator. | ⚠️ Raw |

---
**Action**: Jules has been instructed to wrap these 61 folders using the new `factory.py`.
