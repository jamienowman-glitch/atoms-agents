# Video Canvas Contract

**Route**: `/labs/video-canvas`
**State Management**: `useVideoCanvasStore`
**Engine Dependencies**: `media_v2`, `video_timeline`, `video_render`

---

## 1. Token Model (Agent State)
Agents interact with the canvas by reading/writing these tokens.

### Project Token
```typescript
interface VideoProjectToken {
    projectId: string;
    sequences: VideoSequenceToken[];
    activeSequenceId: string;
}
```

### Sequence Token
```typescript
interface VideoSequenceToken {
    sequenceId: string;
    name: string;
    durationMs: number;
    tracks: VideoTrackToken[];
}
```

### Clip Token
```typescript
interface VideoClipToken {
    clipId: string;
    assetId: string;
    startMs: number;
    endMs: number;
    trimInMs: number;
    trimOutMs: number;
    speed: number;
    trackId: string;
}
```

## 2. Selection Envelope (Inter-Agent Selection)
When an agent or user selects an item, this envelope is broadcast.

```typescript
interface VideoSelectionToken {
    surface: "video_timeline";
    projectId: string;
    sequenceId: string;
    trackId: string;
    clipId?: string;
    atMs?: number;
}
```

## 3. Engine Wiring
| UI Action | Engine Endpoint | Fallback (Dev) |
| :--- | :--- | :--- |
| **Upload** | `POST /media/v2/assets/upload` | Local Blob URL |
| **Sync** | `PUT /video_timeline/projects/:id` | No-op (Console Log) |
| **Export** | `POST /video_render/jobs` | Mock MP4 URL |

## 4. Invariants
1.  **Mobile First**: Layout MUST stack vertically on small screens.
2.  **No Dead Tools**: Every button calls an `engineClient` method.
3.  **Token Truth**: The UI renders *only* from Tokens. State updates happen via Reducer -> Tokens -> UI.
