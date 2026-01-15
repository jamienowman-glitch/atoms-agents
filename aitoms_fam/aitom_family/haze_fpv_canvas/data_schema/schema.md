# Haze FPV Canvas - Data Schema

The `haze_fpv_canvas` atom is the core 3D viewport for the explorer. It accepts a normalized `scene` object from the host app.

## Props

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `scene` | `SceneData` | Yes | The complete scene definition including all nodes and landscape data. |
| `activeNodeId` | `string` | No | ID of the currently selected/focused node. |
| `cameraOverride` | `CameraState` | No | Optional override for camera position/orientation (e.g. for scripted tours). |

## Data Shapes

### `SceneData`
This shape is strictly contract-bound to the backend response.

```typescript
interface SceneData {
  sceneId: string;
  nodes: NodeItem[];
  worldPosition: Vector3; // Base offset if needed
  gridBox3D: {
    x: number;
    y: number;
    z: number;
    w: number;
    h: number;
    d: number;
  };
  // Landscape shaping hints
  meta: {
    title: string;
    description?: string;
    [key: string]: any;
  };
}
```

### `NodeItem`
```typescript
interface NodeItem {
  id: string;
  kind: "vector_item"; // Extensible strings
  worldPosition: { x: number; y: number; z: number };
  meta: {
    title: string; // Label
    tags: string[];
    source_ref: string; // Asset ID
    vector_ref: string; // Vector DB ID
    metrics: Record<string, number>; // Usage stats
    similarity_score?: number;
    height_score: number; // Mapped to terrain elevation (0.0 - 1.0)
    cluster_id?: string; // Grouping ID for ridge formation
    [key: string]: any;
  };
}
```

## Events

*   `onNodeSelect(nodeId: string)`: Emitted when a node is clicked or actively selected.
*   `onNodeFocus(nodeId: string)`: Emitted when the reticle rests on a node.
*   `onCameraMove(cameraState: CameraState)`: Throttled updates of camera position.
