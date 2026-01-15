# Multi-21 Restoration Report

## Locations
- **Multi-21 Components**: `components/multi21/`
- **Demo Route**: `app/workbench/multi21/page.tsx` (New)
- **Floating Toolbar**: `components/multi21/mobile/FloatingToolbar.tsx` (Managed by `MobileFloatingManager.tsx`)
- **Sliders**: `components/multi21/BottomControlsPanel.tsx`
- **Chat Rail**: **MISSING** (References found in docs, but files absent).

## Status
- **Enabled**:
    - Multi-21 Canvas (Desktop/Mobile)
    - Bottom Controls (Sliders)
    - Mobile Floating Toolbar
    - Toggles (Title, Meta, Badge, CTA)
    - Variants (Generic, Product, KPI, Text)
- **Disabled/Missing**:
    - **ChatRail**: Component files not found.
    - **Video**: `VideoThumb` component exists but is unwired in `Multi21`. skipped to avoid illegal refactoring.

## Instructions
Access the demo at:
`http://<host>:3000/workbench/multi21`

## Mobile / LAN Access

To access the demo from your phone on the same network:

1.  **Start the server binding to all interfaces:**
    ```bash
    npm run dev -- -H 0.0.0.0
    ```

2.  **Find your computer's local IP address:**
    ```bash
    ipconfig getifaddr en0
    ```
    *(If that returns nothing, try `ifconfig | grep "inet " | grep -v 127.0.0.1`)*

3.  **Open on your phone:**
    Visit: `http://<YOUR_IP_ADDRESS>:3000/workbench/multi21`

