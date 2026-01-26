# 🌍 NEXUS INFRASTRUCTURE MAP
> The Definitive Guide to the "Domains of Life" Architecture.

## 1. Compute Strategy (The "Hybrid Edge")
We minimize cloud costs by using the User's Device for heavy lifting (decoding) and Cloud Run for smarts (embedding).

| Component | Responsibility | Infrastructure | Cost Tier |
| :--- | :--- | :--- | :--- |
| **Client (Edge)** | Video Decoding, Keyframe Extraction (`<canvas>`) | **User CPU (Browser)** | $0 (Local) |
| **Server (Brain)** | Text/Image Embedding (CLIP/Mistral), Orchestration | **Google Cloud Run** | Free Tier (2M req/mo) |
| **Muscles** | FFmpeg (Audio extraction), Whisper (Transcription) | **Container (Local/C-Run)** | Included in Compute |

## 2. Storage Strategy (The "Vaults")
We separate Metadata (fast) from Media (heavy).

| Data Type | Storage Location | Bucket / Table | Provider |
| :--- | :--- | :--- | :--- |
| **Registry** | Configuration, Pointers, Domain Logic | `public.services`, `public.domains` | **Supabase (Postgres)** |
| **Heavy Media** | Raw Videos, High-Res Images, Audio Files | `northstar-media-dev` | **AWS S3** |
| **Memory** | Vector Embeddings (The Brain) | `northstar-vectors-dev` (LanceDB) | **AWS S3 + LanceDB** |

## 3. Intelligence Stack (The "Muscles")
The engines that create meaning.

| Capability | Engine / Model | Location | Provider |
| :--- | :--- | :--- | :--- |
| **Vision** | **OpenCLIP** (ViT-B-32) | Local / Container | Open Source (runs on CPU) |
| **Hearing** | **Faster-Whisper** (`base`) | Local / Container | Open Source (runs on CPU) |
| **Meaning** | **Mistral Embed** | API Call | Mistral AI (Free Tier) |
| **Mapping** | **UMAP** | Local / Container | Open Source |

## 4. Connectivity (The Pipes)
*   **Frontend**: Uploads Media directly to S3 (via Presigned URL).
*   **Frontend**: Sends Extracted Keyframes (Base64/Blob) to `atoms-core`.
*   **Core**: Pulls Audio from S3 (if needed) or receives chunks from client.

---
**Verified Date**: 2026-01-26
**Status**: Architecture Defined. Implementation in Progress.
