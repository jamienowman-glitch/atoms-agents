# Frozen Canvas Baseline
**Timestamp:** 2025-12-20
**Purpose:** Snapshots the exact code state before atomic modularization.

## 1. Directory Structure (Key Files)
```
/Users/jaynowman/dev/ui/
├── apps/studio/src/
│   ├── App.tsx                 # Main Logic, State, DnD, Transport
│   ├── components/
│   │   ├── Inspector.tsx       # Settings Panel
│   │   ├── Sidebar.tsx         # Layer Tree, Add Section
│   │   └── CanvasFrame.tsx
├── packages/ui-atoms/src/
│   ├── index.tsx               # Atom Components (Hero, Text, Button)
│   └── schemas.ts              # Data Schemas & Allowed Blocks
├── packages/projections/src/
│   └── index.tsx               # Renderer (Recursive AtomRenderer)
```

## 2. Key File Contents

### `apps/studio/src/App.tsx`
```tsx
import React, { useEffect, useState, useRef } from 'react';
import { CanvasKernel, CanvasState, initialState } from '@northstar/canvas-kernel';
import { CanvasTransport } from '@northstar/transport';
import { CanvasView } from '@northstar/projections';
import { CanvasOp, Atom } from '@northstar/contracts';
import { runScriptedAgent, AgentPlan } from '@northstar/agent-driver';
import { SCHEMAS } from '@northstar/ui-atoms/src/schemas';
import { Sidebar } from './components/Sidebar';
import { Inspector } from './components/Inspector';
import { CanvasFrame } from './components/CanvasFrame';

const CANVAS_ID = 'shopify-parity-demo';
const ACTOR_ID = 'user-' + Math.random().toString(36).substr(2, 9);

export const App = () => {
    // Top-Level State
    const [state, setState] = useState<CanvasState>(initialState);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [status, setStatus] = useState('disconnected');

    // Refs
    const kernelRef = useRef<CanvasKernel>(new CanvasKernel());
    const transportRef = useRef<CanvasTransport | null>(null);

    // ... (rest of App.tsx logic as read in previous steps)
    // NOTE: See actual file on disk for full 282 lines.
```

### `apps/studio/src/components/Sidebar.tsx`
```tsx
import React from 'react';
import { Reorder } from 'framer-motion';
import { SECTION_TEMPLATES, SCHEMAS } from '@northstar/ui-atoms/src/schemas';
import { Atom } from '@northstar/contracts';

interface SidebarProps {
    sections: Atom[];
    atoms: Record<string, Atom>;
    // ...
}

export const Sidebar: React.FC<SidebarProps> = ({ sections, atoms, selectedId, onSelect, onReorder, onAddSection, onAddBlock, onDelete }) => {
    const getAllowedBlocks = (sectionType: string) => {
        return SCHEMAS[sectionType]?.allowedBlocks || [];
    };
    // ... (rest of Sidebar logic)
```

### `packages/ui-atoms/src/schemas.ts`
```typescript
export const SCHEMAS: Record<string, ComponentSchema> = {
    'hero-section': {
        id: 'hero-section',
        name: 'Hero Banner',
        type: 'section',
        allowedBlocks: ['text-block', 'button-block', 'image-block', 'headline-block'],
        settings: [...]
    },
    // ...
};
```

### `packages/ui-atoms/src/index.tsx`
```tsx
export const HeadlineBlock: React.FC<AtomProps> = ({ id, properties, isSelected, onClick, onUpdate }) => {
    // ...
    return (
        <motion.h2
            // ...
            contentEditable={isEditing}
            onBlur={handleBlur}
            // ...
        >
            {properties.text || 'Heading'}
        </motion.h2>
    );
};
```

### `packages/projections/src/index.tsx`
```tsx
const AtomRenderer = (...) => {
    // ...
    const Component = AtomRegistry[atom.type] || AtomRegistry['box'];
    // ...
    return <Component ...>{children}</Component>;
}
```
