
# Smoke Test Guide

## Setup
1. **Start the server**:
   ```bash
   python main.py
   ```
   (Ensure you are in `northstar-muscle-demos` root)

2. **Generate Dummy Media** (if needed):
   ```bash
   mkdir -p examples
   ffmpeg -f lavfi -i testsrc=duration=5:size=640x360:rate=30 -f lavfi -i sine=frequency=440:duration=5 -c:v libx264 -c:a aac -y examples/dummy.mp4
   ```

## Running Tests

We have provided a python script to automate the full flow:
```bash
python3 smoke_test.py
```

## Manual Verification (cURL)

### 1. Upload
```bash
curl -X POST "http://localhost:8020/assets" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@examples/dummy.mp4"
```
**Returns**: `{"asset_id": "...", ...}`

### 2. Create Timeline
```bash
curl -X POST "http://localhost:8020/timeline/simple" \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": "<ASSET_ID>",
    "clips": [
      {
        "asset_id": "<ASSET_ID>",
        "start_ms": 0,
        "end_ms": 3000,
        "track": "primary"
      }
    ]
  }'
```
**Returns**: `{"project_id": "...", ...}`

### 3. Render
```bash
curl -X POST "http://localhost:8020/render/simple" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "<PROJECT_ID>",
    "profile": "social_4_3_h264"
  }'
```
**Returns**: `{"output_path": "data/renders/...", ...}`
