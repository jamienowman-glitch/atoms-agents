# ChatRail Handover Pack

This document contains the assets, logic, and styling patterns required to rebuild the ChatRail component in another repository.

## 1. Icon Asset Pack
Use these SVG components for the agent's action row and rail controls.

```tsx
// icons.tsx

export const IconPadlock = ({ locked, onClick }: { locked: boolean; onClick?: () => void }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" onClick={onClick} style={{ cursor: 'pointer' }}>
        {locked ? (
            <>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </>
        ) : (
            <>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </>
        )}
    </svg>
);

export const IconScales = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" />
        <path d="M8 3H3v5" />
        <path d="M12 3v10" />
        <path d="M6.3 8.3a4 4 0 0 0-4.6 4.6" />
        <path d="M17.7 8.3a4 4 0 0 1 4.6 4.6" />
        <path d="M12 21a6 6 0 0 0 6-6" />
        <path d="M12 21a6 6 0 0 1-6-6" />
    </svg>
);

export const IconNight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

export const IconAlarm = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2 2" />
        <path d="M5 3 2 6" />
        <path d="m22 6-3-3" />
    </svg>
);

export const IconTodo = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
);

export const IconForward = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 5l7 7-7 7" />
        <path d="M5 12h15" />
    </svg>
);

export const IconMiniAgent = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
    </svg>
);

export const IconSend = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);
```

## 2. Typography & Animation Logic
The font weight and opacity interpolate based on the "recency" of the message. Newest messages are boldest; older messages fade out and become thinner using `Roboto Flex`.

**Required Font:** `Roboto Flex` (Variable Font)

**Logic:**
```typescript
const interpolateWeight = (indexFromBottom: number) => {
    // indexFromBottom: 0 is the newest message
    // Fades over the last 5 messages
    const t = Math.min(indexFromBottom, 5) / 5;
    // Ranges from 900 (Bold) down to 200 (Thin)
    return Math.round(900 - (700 * t));
};

// React Component Usage (Framer Motion)
<motion.div
    style={{
        fontFamily: "'Roboto Flex', sans-serif",
        fontVariationSettings: "'wdth' 100" // Standard width
    }}
    animate={{
        // Dynamically animate weight based on position
        fontVariationSettings: `'wght' ${interpolateWeight(indexFromBottom)}, 'wdth' 100`,
        // Fade out older messages
        opacity: Math.max(0.4, 1 - (indexFromBottom * 0.1)),
    }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
>
    {message.text}
</motion.div>
```

## 3. Interaction Modes
The rail has 4 distinct height modes.

| Mode | Height | Description | Controls |
| :--- | :--- | :--- | :--- |
| **Nano** | `48px` | Just the status line. Shows 1 truncated agent message. | Open Tools, Expand |
| **Micro** | `140px` | Shows composer + ~1 recent message. | Open Tools, Cycle Mode |
| **Half** | `50vh` | Half screen history. Standard chat view. | Open Tools, Cycle Mode |
| **Full** | `90vh` | Full screen history. | Open Tools, Cycle Mode |

**Logic:**
```typescript
const getHeightVariant = (mode: 'full' | 'half' | 'micro' | 'nano') => {
    switch (mode) {
        case 'full': return { height: '90vh' };
        case 'half': return { height: '50vh' };
        case 'micro': return { height: '140px' };
        case 'nano': return { height: '48px' };
    }
};

// Nano Mode Special Render
// When in Nano, we do NOT render the list or composer. 
// We render a single line representative of the agent's last state.
{mode === 'nano' ? (
    <div className="NanoMessage">
        <span style={{ fontWeight: 600 }}>AI</span> {lastAgentMessage}
    </div>
) : (
    // Render standard list
)}
```

## 4. Mobile Text Input Styling
The specific styling for the mobile text input and its "Mini Agent" icon wrapper.

```css
/* Container at bottom */
.ChatRail-composer {
    padding: 12px 16px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom)); /* Safe area for iOS Home bar */
    background: #000;
    display: flex;
    gap: 8px;
    align-items: center;
}

/* White capsule wrapper */
.ChatRail-input-wrapper {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 4px 8px;
}

/* The actual input */
.ChatRail-input {
    border: none;
    outline: none;
    background: transparent;
    flex: 1;
    padding: 8px;
    font-family: inherit;
    font-size: 14px;
    color: #000;
}

/* Send Button */
.ChatRail-send-btn {
    background: #fff;
    border: none;
    border-radius: 8px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
```
