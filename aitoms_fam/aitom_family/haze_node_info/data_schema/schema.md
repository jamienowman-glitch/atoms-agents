# Haze Node Info - Data Schema

## Props

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `node` | `NodeItem` | Yes | The node object to display. |
| `visible` | `boolean` | No | Controls visibility transition (fade in/out). |

## Content Mapping

*   `node.meta.title` -> **Header**.
*   `node.meta.tags` -> **Tag List** (Cap at 3, +N more).
*   `node.meta.metrics` -> **Stats Display** (Show top 3 non-zero metrics).
*   `node.meta.height_score` -> Display as "Elevation" or "Importance" bar.
