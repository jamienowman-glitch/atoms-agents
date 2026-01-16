# Multi21 System Audit & Dependency Map

## 1. The Control Component
**File Path:** `/Users/jaynowman/dev/agentflow/components/multi21/BottomControlsPanel.tsx`

*   **Type:** Sub-component (Imported into `Multi21Designer.tsx`).
*   **Definition:** Exported as `BottomControlsPanel`.
*   **Props Interface:**
    ```typescript
    interface BottomControlsPanelProps {
        settingsContent?: React.ReactNode;
    }
    ```
*   **Usage:** It is *not* hard-coded in the loop. It is rendered once at the bottom of the `Multi21Designer` component.

## 2. The "Ghost" Toolbar
**File Path:** `/Users/jaynowman/dev/agentflow/components/multi21/mobile/FloatingToolbar.tsx`

*   **Status:** Exists.
*   **Imports:**
    ```typescript
    import React, { useMemo } from 'react';
    import { Corner } from './FloatingIcon';
    ```
*   **Context Dependency:** **None.** It is a pure UI component. It does not use `useContext`.
*   **Risk:** It relies on `anchorIconRect` (DOMRect) passed as a prop. If the anchor element is missing or not measured correctly, it will either stay hidden (`display: none`) or position incorrectly.

## 3. The State Flow (Critical Path)
**File Path:** `/Users/jaynowman/dev/agentflow/context/ToolControlContext.tsx`

*   **Mechanism:** React Context (`createContext`).
*   **Store:** Local `useState` inside `ToolControlProvider`.
    ```typescript
    const [state, setState] = useState<ToolControlState>(initialState);
    ```
*   **Mode Detection:** "Mode" (Desktop/Mobile) is stored as a standard value in the state map.
    *   Key: `multi21.designer:global:global:previewMode`
*   **Hypothesis Check:** **FALSE.** The control panel does *not* rely on loop data. It relies purely on the `ToolControlContext`. It gets its values (columns, gap, radius) via `useToolState` hooks which access the global context state.

## 4. The Environment
**File Path:** `/Users/jaynowman/dev/agentflow/app/layout.tsx`

*   **Global Providers:** **None.** The root layout only renders `<html>` and `<body>` with fonts.
*   **Local Provider:** `Multi21Designer.tsx` wraps itself:
    ```tsx
    export function Multi21Designer() {
        return (
            <ToolControlProvider initialState={initialToolState}>
                <Multi21DesignerInner />
            </ToolControlProvider>
        );
    }
    ```
*   **Implication:** If you move `BottomControlsPanel` outside of `Multi21Designer`, it **will crash** because `useToolControl` will fail to find the Context provider.

## Summary of File Paths
1.  **Controls:** `/Users/jaynowman/dev/agentflow/components/multi21/BottomControlsPanel.tsx`
2.  **Designer (Parent):** `/Users/jaynowman/dev/agentflow/components/multi21/Multi21Designer.tsx`
3.  **Context Definition:** `/Users/jaynowman/dev/agentflow/context/ToolControlContext.tsx`
4.  **Ghost Toolbar:** `/Users/jaynowman/dev/agentflow/components/multi21/mobile/FloatingToolbar.tsx`
