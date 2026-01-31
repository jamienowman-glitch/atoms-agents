---
name: muscle-audio-audio_capture_normalize
description: Normalize audio captures from MAYBES UI for waveform display and playback.
metadata:
  type: mcp
  entrypoint: src/audio/audio_capture_normalize/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---

# Audio Capture Normalize

## Capability
Normalizes audio captures (microphone recordings, uploaded audio blobs) for MAYBES UI. Resamples to standard sample rate, normalizes loudness, extracts waveform data, and registers in media_v2.

## When to Use
- User uploads audio file in MAYBES UI
- User records audio via microphone
- Need waveform visualization for audio playback
- Need consistent audio levels for playback

## Usage

### Endpoint
```
POST /muscle/audio/audio_capture_normalize/run
```

### Request Schema
```json
{
  "audio_blob": "string (base64-encoded audio data)",
  "tenant_id": "string (required)",
  "env": "string (optional, default: 'prod')",
  "user_id": "string (optional)",
  "filename": "string (optional, default: 'capture.wav')"
}
```

### Response Schema
```json
{
  "asset_id": "string (media_v2 asset ID)",
  "uri": "string (S3 URI)",
  "duration_ms": "number",
  "sample_rate": "number (44100)",
  "waveform": "array<number> (100 samples for UI visualization)",
  "lufs": "number (integrated loudness)",
  "size_bytes": "number"
}
```

### Error Responses
```json
{
  "error": "string",
  "error_type": "string"
}
```

**Common errors**:
- `ValueError` - Missing tenant_id, env, or audio_blob
- `subprocess.CalledProcessError` - FFmpeg processing failed
- `payment_required` - Insufficient snax balance

### Example Request
```json
{
  "audio_blob": "UklGRiQAAABXQVZFZm10IBAAAAABAAEA...",
  "tenant_id": "tenant_abc123",
  "env": "prod",
  "user_id": "user_xyz789",
  "filename": "my_recording.wav"
}
```

### Example Response
```json
{
  "asset_id": "a1b2c3d4e5f6",
  "uri": "s3://bucket/tenants/tenant_abc123/prod/media_v2/a1b2c3d4e5f6/capture_12345678.wav",
  "duration_ms": 5000,
  "sample_rate": 44100,
  "waveform": [0.1, 0.3, 0.5, 0.4, 0.2, ...],
  "lufs": -14.2,
  "size_bytes": 441000
}
```

## Processing Pipeline

1. **Decode** audio blob (supports WAV, MP3, OGG, etc.)
2. **Resample** to 44100 Hz stereo
3. **Normalize** loudness to -14 LUFS (two-pass loudnorm)
4. **Extract** waveform data (100 samples for UI)
5. **Upload** to S3 via media_v2
6. **Register** asset in media_v2 database
7. **Return** asset ID + metadata

## Differences from audio_normalise

| Feature | audio_capture_normalize | audio_normalise |
|---------|------------------------|-----------------|
| Input | Raw bytes | Asset/Artifact ID |
| Output | Asset ID + waveform | Artifact ID |
| Use case | MAYBES UI captures | Production audio |
| Speed | Fast (single-pass option) | Accurate (two-pass) |
| Features | Waveform extraction | Advanced audio features |

## Cost
Base: 1 snax per second of audio processed

## Dependencies
- FFmpeg 6.0+ (required)
- atoms_core.src.media.v2 (S3 upload + registration)

## Notes
- Target sample rate: 44100 Hz (CD quality)
- Target loudness: -14 LUFS (streaming standard)
- Waveform: 100 samples (max absolute value per chunk)
- All uploads tagged with `["capture", "normalized", "maybes"]`
