---
name: Wysiwyg Extension
description: How to safely extend the Wysiwyg system by adding new atoms or canvases without touching the locked production components
---

# Wysiwyg Extension Skill

> **⚠️ CRITICAL WARNING ⚠️**  
> **THE WYSIWYG CANVAS AND HARNESS ARE PRODUCTION-READY AND LOCKED.**  
> **DO NOT EDIT THESE FILES DIRECTLY.**  
> **This skill teaches you how to EXTEND the system safely.**

---

## 🔒 What You CANNOT Touch

The following files are **LOCKED** and must not be edited:

### Harness Files (The Brain)
- `harnesses/wysiwyg-builder/WysiwygBuilderHarness.tsx`
- `harnesses/wysiwyg-builder/shells/TopPill.tsx`
- `harnesses/wysiwyg-builder/shells/ChatRailShell.tsx`
- `harnesses/Mother/tool-areas/ToolPop/ToolPopGeneric.tsx`

### Canvas Files (The Product)
- `canvas/wysiwyg/WysiwygCanvas.tsx`
- `canvas/wysiwyg/ToolPill.tsx`
- `canvas/wysiwyg/LogicPop.tsx`

### Legacy Quarantine
- `canvases/multi21/MultiTile.tsx`
- `canvases/multi21/MultiTile.config.ts`

---

## ✅ How to Add a New Atom

### Step 1: Create the Atom Component

**Location**: `canvases/multi21/_atoms/YourAtom.tsx`

**Template**:
```tsx
"use client";

import React from 'react';

export interface YourAtomProps {
  id: string;
  // Add your prop types here
  textContent?: string;
  backgroundColor?: string;
  // Motion traits
  axisWeight?: number;
  axisSlant?: number;
}

export function YourAtom({ 
  id, 
  textContent = "Default text",
  backgroundColor = "#ffffff",
  axisWeight = 400,
  axisSlant = 0
}: YourAtomProps) {
  return (
    <div 
      id={id}
      style={{
        backgroundColor,
        fontVariationSettings: `"wght" ${axisWeight}, "slnt" ${axisSlant}`
      }}
    >
      {textContent}
    </div>
  );
}
```

### Step 2: Create the Atom Contract

**Location**: `canvases/multi21/_atoms/YourAtom.contract.ts`

**Template**:
```typescript
import { AtomContract } from '@types/AtomContract';

export const YourAtomContract: AtomContract = {
  id: 'your_atom',
  traits: [
    {
      id: 'content',
      subGroups: [
        {
          id: 'text',
          controls: [
            {
              id: 'content.text',
              type: 'text',
              label: 'Text Content',
              targetVar: 'content.text'
            }
          ]
        }
      ]
    },
    {
      id: 'style',
      subGroups: [
        {
          id: 'colors',
          controls: [
            {
              id: 'style.bg',
              type: 'color',
              label: 'Background',
              targetVar: 'style.bg'
            }
          ]
        }
      ]
    },
    {
      id: 'motion',
      subGroups: [
        {
          id: 'typography',
          controls: [
            {
              id: 'typo.weight',
              type: 'slider',
              label: 'Weight',
              targetVar: 'typo.weight',
              min: 100,
              max: 900,
              step: 10,
              axisLabels: {
                increase: 'Bulk Up',
                decrease: 'Slim Down'
              }
            },
            {
              id: 'typo.slant',
              type: 'slider',
              label: 'Slant',
              targetVar: 'typo.slant',
              min: -10,
              max: 0,
              step: 1,
              axisLabels: {
                increase: 'Stand Up',
                decrease: 'Lean Back'
              }
            }
          ]
        }
      ]
    }
  ]
};
```

### Step 3: Add to WysiwygCanvas Renderer

**⚠️ Exception**: This is the ONLY file you can edit for new atoms.

**File**: `canvas/wysiwyg/WysiwygCanvas.tsx`

**Find the renderBlock function and add your case**:

```tsx
case 'your_atom':
  return (
    <YourAtom
      key={block.id}
      id={block.id}
      textContent={block.textContent}
      backgroundColor={block.backgroundColor}
      axisWeight={block.axisWeight}
      axisSlant={block.axisSlant}
    />
  );
```

### Step 4: Add to ToolPill Categories

**File**: `canvas/wysiwyg/ToolPill.tsx`

**Find CATEGORY_CONFIG and add your atom**:

```tsx
const CATEGORY_CONFIG = {
  copy: {
    atoms: [
      { id: 'your_atom', type: 'your_atom', label: 'Y' },
      // ... existing atoms
    ]
  }
};
```

### Step 5: Wire Contract to ToolPopGeneric

**File**: `harnesses/wysiwyg-builder/WysiwygBuilderHarness.tsx`

**Find the ToolPopGeneric conditional and add your type**:

```tsx
{activeBlockType === 'your_atom' ? (
  <ToolPopGeneric
    activeAtomContract={YourAtomContract}
    toolState={toolState}
    onToolUpdate={handleToolUpdate}
    onClose={() => setShowTools(false)}
    isMobileView={isMobileView}
  />
) : activeBlockType === 'bleeding_hero' ? (
  // ... existing code
```

---

## ✅ How to Add a New Canvas Type

### Overview

The Wysiwyg system supports multiple canvas "cartridges":
- **WEB**: Responsive websites (current)
- **SEB**: Email (600px fixed-width)
- **DECK**: Presentations (16:9)
- **DM**: Messaging flows

### Step 1: Create the Canvas Component

**Location**: `canvas/your-canvas/YourCanvas.tsx`

**Template**:
```tsx
"use client";

import React from 'react';

export interface YourCanvasProps {
  blocks: Block[];
  activeBlockId: string | null;
  onBlockSelect: (id: string) => void;
}

export function YourCanvas({ blocks, activeBlockId, onBlockSelect }: YourCanvasProps) {
  return (
    <div className="your-canvas-container">
      {blocks.map(block => (
        <div 
          key={block.id}
          onClick={() => onBlockSelect(block.id)}
          className={activeBlockId === block.id ? 'active' : ''}
        >
          {/* Render block */}
        </div>
      ))}
    </div>
  );
}
```

### Step 2: Create a New Harness Route

**⚠️ Do NOT edit WysiwygBuilderHarness**

**Location**: `app/your-canvas/page.tsx`

**Template**:
```tsx
"use client";

import { useState } from 'react';
import { YourCanvas } from '@canvas/your-canvas/YourCanvas';
import { TopPill } from '@harnesses/wysiwyg-builder/shells/TopPill';
import { ChatRailShell } from '@harnesses/wysiwyg-builder/shells/ChatRailShell';
import { ToolPopGeneric } from '@harnesses/Mother/tool-areas/ToolPop/ToolPopGeneric';

export default function YourCanvasPage() {
  const [blocks, setBlocks] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [showTools, setShowTools] = useState(true);
  const [chatMode, setChatMode] = useState('nano');
  
  // Copy the state management patterns from WysiwygBuilderHarness
  // but DO NOT import or extend it directly
  
  return (
    <div className="relative h-screen">
      <TopPill 
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
      />
      
      <YourCanvas 
        blocks={blocks}
        activeBlockId={activeBlockId}
        onBlockSelect={setActiveBlockId}
      />
      
      <ChatRailShell 
        mode={chatMode}
        onModeChange={setChatMode}
        showTools={showTools}
        onToggleTools={() => setShowTools(!showTools)}
      />
      
      <ToolPopGeneric 
        activeAtomContract={activeContract}
        toolState={toolState}
        onToolUpdate={handleToolUpdate}
      />
    </div>
  );
}
```

### Step 3: Reuse Existing Shells

**✅ You CAN reuse these components**:
- `TopPill` - Top navigation
- `ChatRailShell` - Chat interface
- `ToolPopGeneric` - Contract-driven tools
- `LogicPop` - Agent brain interface

**Copy the patterns, don't modify the originals.**

---

## 🎯 Key Principles

### 1. Contract-Driven Development

**Never wire props manually**. Always define controls in the `.contract.ts` file.

```typescript
// ❌ WRONG
<Slider onChange={(val) => atom.setProp(val)} />

// ✅ RIGHT
// Define in YourAtom.contract.ts
{
  id: 'prop.name',
  type: 'slider',
  label: 'Prop Name',
  targetVar: 'prop.name',
  min: 0,
  max: 100
}
```

### 2. Trait Inheritance

For typography atoms, support trait inheritance:

```typescript
// In handleAddBlock
if (type === 'your_text_atom') {
  base.axisWeight = lastUsedTypographyState.weight;
  base.axisSlant = lastUsedTypographyState.slant;
}
```

### 3. Path Aliases

Always use aliases:
- `@atoms/*` → `canvases/*/\_atoms/*`
- `@harnesses/*` → `harnesses/*`
- `@canvas/*` → `canvas/*`
- `@types/*` → `types/*`

---

## 🚫 What NOT to Do

1. **Do NOT edit locked files** listed at the top of this skill
2. **Do NOT create relative imports** (`../`) - use aliases
3. **Do NOT touch MultiTile** - it's quarantined legacy code
4. **Do NOT modify WysiwygBuilderHarness** for new canvases - create a new page route instead
5. **Do NOT wire sliders manually** - always use contracts
6. **Do NOT create fixed heights** - use `h-auto` and let content determine size

---

## ✅ Safe Extension Checklist

Before starting work:
- [ ] Read this skill completely
- [ ] Confirm you're NOT editing locked files
- [ ] Verify you're using path aliases
- [ ] Check if a contract file exists for your atom

During development:
- [ ] Create contract before building UI
- [ ] Use ToolPopGeneric for all controls
- [ ] Test trait inheritance for typography
- [ ] Follow accordion sync pattern (auto-nano mode)

After completion:
- [ ] Verify tools appear above chat rail
- [ ] Test contract-driven sliders work
- [ ] Confirm no manual prop wiring exists
- [ ] Run the mandatory regression check from AGENTS.md

---

## 📚 Reference Files

- **Main Architecture**: `agents.md`
- **Contract Interface**: `types/AtomContract.ts`
- **Example Contract**: `canvases/multi21/_atoms/BleedingHero.contract.ts`
- **ToolPill Pattern**: `canvas/wysiwyg/ToolPill.tsx` (read-only reference)
- **Harness Pattern**: `harnesses/wysiwyg-builder/WysiwygBuilderHarness.tsx` (read-only reference)
