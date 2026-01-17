# YouTube Feed Engine Contract v0

## Overview
This contract defines the API and data model for the YouTube Feed Engine, which provides durable, per-tenant feed management and item persistence.

## Data Model

### Feed Definition
Scoping: `tenant_id`, `project_id`, `surface_id` (optional)

```json
{
  "feed_id": "feed_yt_...",
  "name": "My Tech Feed",
  "channels": [
    "https://www.youtube.com/@GoogleDeepMind", 
    "UC_x5XG1OV2P6uZZ5FSM9Ttw" 
  ],
  "filters": {
    "longform_only": true
  },
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

### Feed Item
Durable persistence of video metadata.

```json
{
  "video_id": "abc12345",
  "feed_id": "feed_yt_...",
  "title": "AlphaCode 2 Technical Report",
  "description": "...",
  "published_at": "ISO8601",
  "channel_id": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
  "channel_title": "Google DeepMind",
  "cover_image_url": "https://i.ytimg.com/vi/abc12345/hqdefault.jpg",
  "watch_url": "https://www.youtube.com/watch?v=abc12345",
  "embed_url": "https://www.youtube.com/embed/abc12345",
  "duration_seconds": 345,
  "ingested_at": "ISO8601"
}
```

## API Endpoints

### Feed Management

#### `POST /feeds/youtube`
Create a new feed.
**Body:**
```json
{
  "name": "My Tech Feed",
  "channels": ["..."],
  "filters": { "longform_only": true }
}
```

#### `PUT /feeds/youtube/{feed_id}`
Update an existing feed.

#### `GET /feeds/youtube`
List all feeds for the scoped tenant/project.

#### `GET /feeds/youtube/{feed_id}`
Get a specific feed definition.

### Feed Items

#### `GET /feeds/youtube/{feed_id}/items`
Get items for a feed, newest first.
**Parameters:**
- `limit`: int (default 20)
- `cursor`: string (pagination cursor)

### Refresh & Realtime

#### `POST /feeds/youtube/{feed_id}:refresh`
Trigger immediate ingestion from YouTube API.

#### `GET /sse/feeds/youtube/{feed_id}`
Server-Sent Events stream for feed updates.
**Events:**
- `youtube_feed.updated`:
  ```json
  {
    "feed_id": "feed_yt_...",
    "change_summary": "Ingested 5 new videos",
    "head_rev": "..."
  }
  ```

#### `GET /ws/feeds/youtube/{feed_id}`
WebSocket stream (parity with SSE).
