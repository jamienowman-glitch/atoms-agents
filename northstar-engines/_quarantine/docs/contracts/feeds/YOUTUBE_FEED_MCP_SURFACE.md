# YouTube Feed MCP Surface

This document defines the MCP tools exposed to agents for interacting with the YouTube Feed Engine.

## Tools

### `youtube.list_feeds`
List configured YouTube feeds.
- **Input**: None (scope inferred from context)
- **Output**:
  ```json
  [
    {
      "feed_id": "feed_yt_...",
      "name": "Tech News",
      "channels": ["..."]
    }
  ]
  ```

### `youtube.refresh_feed`
Trigger a refresh for a specific feed.
- **Input**:
  - `feed_id`: string
- **Output**:
  ```json
  {
    "status": "success",
    "items_new_count": 5
  }
  ```

### `youtube.get_items`
Get items from a feed.
- **Input**:
  - `feed_id`: string
  - `limit`: int (optional, default 10)
  - `page`: int (optional, default 1)
- **Output**:
  ```json
  [
    {
      "video_id": "...",
      "title": "...",
      "published_at": "..."
    }
  ]
  ```

### `youtube.resolve_channel` (Optional)
Resolve a Channel URL/Handle to ID.
- **Input**:
  - `query`: string (URL or handle)
- **Output**:
  ```json
  {
    "channel_id": "UC...",
    "title": "Channel Name"
  }
  ```
