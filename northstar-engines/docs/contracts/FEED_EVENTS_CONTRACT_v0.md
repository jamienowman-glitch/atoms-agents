# Feed Events Contract v0

Defines the real-time events emitted by the Feed Engine via SSE (Server-Sent Events) and WebSocket channels.

## Transport
- **SSE**: `GET /sse/feeds/{source_kind}/{feed_id}`
- **WebSocket**: `GET /ws/feeds/{source_kind}/{feed_id}` (Future/Stub)

## Event Format
All events follow the CloudEvents-inspired envelope:
```json
{
  "id": "evt_uuid...",
  "type": "event.type",
  "source": "urn:northstar:engine:feed",
  "data": { ... },
  "time": "ISO8601"
}
```

## Events

### 1. Feed Updated
Emitted when a feed's items have been refreshed or changed. Clients should re-fetch items or merge the delta if provided.

- **Type**: `feed.updated`
- **Payload (`data`)**:
  ```json
  {
    "feed_id": "feed_yt_123",
    "source_kind": "youtube",
    "trigger": "manual_refresh", // or 'webhook', 'scheduled'
    "item_count": 50,
    "delta": {
        "added": ["item_id_1"],
        "removed": [],
        "updated": []
    } // Optional, if delta tracking is implemented
  }
  ```

### 2. Ingestion Started
Emitted when a long-running ingestion process begins.

- **Type**: `feed.ingestion.started`
- **Payload**:
  ```json
  {
    "feed_id": "feed_yt_123",
    "job_id": "job_456"
  }
  ```

### 3. Ingestion Failed
Emitted if ingestion fails.

- **Type**: `feed.ingestion.failed`
- **Payload**:
  ```json
  {
    "feed_id": "feed_yt_123",
    "reason": "API Quota Exceeded",
    "retry_in_ms": 3600000
  }
  ```
