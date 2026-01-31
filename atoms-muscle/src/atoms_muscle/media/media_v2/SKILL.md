---
name: muscle-media-media_v2
description: Media V2 asset management - upload, get, and list media assets for MAYBES UI.
metadata:
  type: mcp
  entrypoint: src/media/media_v2/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---

# Media V2

## Capability
Thin MCP wrapper over atoms_core media_v2 service. Provides upload, get, and list operations for media assets with clear error handling.

## When to Use
- Upload media files (audio/video/image) to S3
- Register media assets in database
- Query assets by ID or filters
- List assets for tenant

## Usage

### Endpoint
```
POST /muscle/media/media_v2/run
```

### Operations

#### 1. Upload Asset

**Request**:
```json
{
  "operation": "upload",
  "file_content": "string (base64-encoded file data)",
  "filename": "string (required)",
  "tenant_id": "string (required)",
  "env": "string (required: prod/staging/dev)",
  "kind": "string (optional: audio/video/image/other, default: other)",
  "user_id": "string (optional)",
  "tags": "array<string> (optional)",
  "source_ref": "string (optional)",
  "meta": "object (optional)"
}
```

**Response**:
```json
{
  "id": "string (asset ID)",
  "tenant_id": "string",
  "env": "string",
  "user_id": "string",
  "kind": "string",
  "source_uri": "string (S3 URI)",
  "duration_ms": "number (for audio/video)",
  "fps": "number (for video)",
  "audio_channels": "number (for audio)",
  "sample_rate": "number (for audio)",
  "codec_info": "string",
  "size_bytes": "number",
  "tags": "array<string>",
  "source_ref": "string",
  "meta": "object",
  "created_at": "string (ISO 8601)"
}
```

#### 2. Get Asset

**Request**:
```json
{
  "operation": "get",
  "asset_id": "string (required)"
}
```

**Response**:
Same as upload response, or:
```json
{
  "error": "not_found",
  "detail": "Asset not found"
}
```

#### 3. List Assets

**Request**:
```json
{
  "operation": "list",
  "tenant_id": "string (required)",
  "kind": "string (optional: audio/video/image/other)",
  "tag": "string (optional: filter by tag)",
  "source_ref": "string (optional: filter by source_ref)"
}
```

**Response**:
```json
{
  "assets": [
    {
      "id": "string",
      "tenant_id": "string",
      ...
    }
  ]
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
- `ValueError` - Missing required fields or invalid values
- `RuntimeError` - Upload/registration failed
- `payment_required` - Insufficient snax balance
- `not_found` - Asset not found (get operation)

### Example: Upload Audio File

**Request**:
```json
{
  "operation": "upload",
  "file_content": "UklGRiQAAABXQVZFZm10IBAAAAABAAEA...",
  "filename": "recording.wav",
  "tenant_id": "tenant_abc123",
  "env": "prod",
  "kind": "audio",
  "user_id": "user_xyz789",
  "tags": ["maybes", "recording"],
  "source_ref": "maybes_session_123"
}
```

**Response**:
```json
{
  "id": "a1b2c3d4e5f6",
  "tenant_id": "tenant_abc123",
  "env": "prod",
  "user_id": "user_xyz789",
  "kind": "audio",
  "source_uri": "s3://bucket/tenants/tenant_abc123/prod/media_v2/a1b2c3d4e5f6/recording.wav",
  "duration_ms": 5000,
  "audio_channels": 2,
  "sample_rate": 44100,
  "codec_info": "pcm_s16le",
  "size_bytes": 441000,
  "tags": ["maybes", "recording"],
  "source_ref": "maybes_session_123",
  "meta": {},
  "created_at": "2026-01-29T12:00:00Z"
}
```

### Example: Get Asset

**Request**:
```json
{
  "operation": "get",
  "asset_id": "a1b2c3d4e5f6"
}
```

**Response**: Same as upload response

### Example: List Assets

**Request**:
```json
{
  "operation": "list",
  "tenant_id": "tenant_abc123",
  "kind": "audio",
  "tag": "maybes"
}
```

**Response**:
```json
{
  "assets": [
    {
      "id": "a1b2c3d4e5f6",
      "kind": "audio",
      "tags": ["maybes", "recording"],
      ...
    },
    {
      "id": "b2c3d4e5f6a7",
      "kind": "audio",
      "tags": ["maybes", "capture"],
      ...
    }
  ]
}
```

## Validation Rules

### Upload
- `file_content`: Required, non-empty bytes
- `filename`: Required, non-empty string
- `tenant_id`: Required, not "t_unknown"
- `env`: Required, must be prod/staging/dev
- `kind`: Must be audio/video/image/other

### Get
- `asset_id`: Required, non-empty string

### List
- `tenant_id`: Required, not "t_unknown"
- `kind`: Optional, must be audio/video/image/other if provided
- `tag`: Optional, string
- `source_ref`: Optional, string

## Storage

**S3 Path**: `s3://{bucket}/tenants/{tenant_id}/{env}/media_v2/{asset_id}/{filename}`

**Database**: Firestore collection `media_assets_{tenant_id}`

## Cost
Base: 0.1 snax per operation

## Dependencies
- atoms_core.src.media.v2 (core service)
- S3 (storage)
- Firestore (database)

## Notes
- All uploads are tenant-scoped
- Assets are immutable once created
- Use tags for filtering and organization
- source_ref links assets to originating sessions/workflows
