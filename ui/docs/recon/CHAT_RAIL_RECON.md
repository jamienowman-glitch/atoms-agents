# Chat Rail Reconnaissance

## 1. Implementation Location
The Chat Rail implementation is fully contained within `apps/studio/src/components/ChatRail` and mounted in the main App component.

*   **Primary Component**: `ChatRail.tsx` (`apps/studio/src/components/ChatRail/ChatRail.tsx`)
    *   Main functional component `ChatRail`
    *   Sub-components: `MessageRow`, `NanoMessage`, `IconWithState`
*   **Styling**: `ChatRail.css` (`apps/studio/src/components/ChatRail/ChatRail.css`)
    *   Uses standard CSS with `framer-motion` for transitions.
    *   Uses `Roboto Flex` variable font.
*   **Icons**: `icons.tsx` (`apps/studio/src/components/ChatRail/icons.tsx`)
    *   Contains SVG definitions for all ChatRail-specific icons.

## 2. Modes (Nano/Micro/Mid/Full)
The 4 modes exist and are implemented in `ChatRail.tsx` using local React state.

*   **State**: `const [mode, setMode] = useState<RailMode>('half');`
*   **Definitions**: `type RailMode = 'full' | 'half' | 'micro' | 'nano';`
*   **Persistence**: None. Height is determined dynamically by `getHeightVariant(mode)` which returns:
    *   `full`: `90vh`
    *   `half`: `50vh`
    *   `micro`: `140px`
    *   `nano`: `48px`
*   **Transitions**:
    *   Triggered via chevron buttons calling `cycleMode('up' | 'down')`.
    *   Animated via `framer-motion` spring transition (`stiffness: 300, damping: 30`).

## 3. Mount + Wiring
*   **Mount Point**: `apps/studio/src/App.tsx` renders `<ChatRail />` at the root level (line 138), positioned with `position: fixed` and `z-index: 9999` to overlay content.
*   **State Consumption**: The component currently consumes **no external state**.
    *   **Scope**: Agnostic/Global. It does not know about tenants, projects, or canvases.
    *   **Messages**: Local `useState` with mock data initiated in `ChatRail.tsx`.
    *   **Data Source**: purely local; no API client calls.
*   **Assumptions**: Assumes it is a singleton, omnipresent component.

## 4. Realtime Plumbing
*   **Current State**: **None**.
*   **SSE**: Not implemented. No EventSource connections.
*   **WebSocket**: Not implemented.
*   **Status**: The component uses `setTimeout` to simulate agent replies 600ms after a user sends a message.
*   **Requirements for 2-Way**:
    *   Needs `WebSocket` or `SSE` wiring to `agent-driver` or a similar backend service.
    *   Needs a proper localized message store (e.g., connected to a specific `thread_id` or `session_id`).

## 5. Buttons + Icons
All icons are defined in `apps/studio/src/components/ChatRail/icons.tsx`.

### Header Icons
*   **ChevronDown**: `ChatRail.tsx` (Line 94).
    *   Handler: `cycleMode('down')`.
    *   Trigger: Transitions mode towards Nano.
*   **ChevronUp**: `ChatRail.tsx` (Line 97 & 107).
    *   Handler: `cycleMode('up')`.
    *   Trigger: Transitions mode towards Full.

### Composer Icons
*   **IconMiniAgent**: `ChatRail.tsx` (Line 136).
    *   Handler: None (decorative placeholder).
*   **IconSend**: `ChatRail.tsx` (Line 146).
    *   Handler: `handleSend()`.
    *   Trigger: Appends user message to local state and triggers mock reply timeout.

### Message Row Icons
Located in `ChatRail-icons` container (Line 193). All are currently **stubs** that toggle local `active` state or do nothing.

*   **IconPadlock**: Line 194. Toggleable (visual only).
*   **IconScales**: Line 195. Clickable stub.
*   **IconNight**: Line 196. Clickable stub.
*   **IconAlarm**: Line 197. Clickable stub.
*   **IconTodo**: Line 198. Clickable stub.
*   **IconForward**: Line 199. Clickable stub.

## 6. Variable-Font Focus Animation
This is the core "focus" visualization logic.

*   **What is animated**: The `font-variation-settings` specifically the `'wght'` (Weight) axis.
    *   `'wdth'` (Width) axis is fixed at 100.
*   **Target**: The implementation targets the **message text content** (`ChatRail-message-content`).
*   **Focus Determination**: "Focus" is determined by **recency**.
    *   Newest message (bottom) = Max focus (Black weight).
    *   Older messages (moving up) = Less focus (Fading to ExtraLight).
*   **Logic Location**: `ChatRail.tsx` -> `interpolateWeight` function and `MessageRow` component.
    *   `const indexFromBottom = messages.length - 1 - idx;`
    *   `interpolateWeight` maps `indexFromBottom` (0 to 5) to `wght` (900 to 200).
*   **Font Details**:
    *   **Font**: `Roboto Flex` (loaded locally from `/public/fonts/RobotoFlex.ttf` via `index.css`).
    *   **Axes Used**: `'wght'` (100-1000).
*   **Coupling**: Currently coupled only to the *local message list index*. It is **not** coupled to canvas state, selection, or agent thought process.

## 7. Future Wiring Needs (Gap Analysis)
To enable Toolpop and full functionality, the following connections are missing:

*   **Agent Connection**:
    *   Connect to `agent-driver` for real message exchange.
    *   Subscribe to agent "thought" events (streamed tokens).
*   **Context Passing**:
    *   Pass `canvasId` or `selectionContext` to the ChatRail so the agent knows what the user is looking at.
*   **Tool Surfaces Entry**:
    *   The icon row (Scales, Night, etc.) needs to trigger actual tool surface panels (e.g. popping up a "Policy" or "Schedule" tool).
*   **Publishing**:
    *   No "Publish" button exists in the current ChatRail UI.
*   **Focus Expansion**:
    *   The variable font animation currently only reflects *message recency*. Future integration should likely map this to *agent attention* (e.g., text gets heavier when the agent is "thinking" about that specific message or context).
