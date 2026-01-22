# 02 UI Foundry Refactor: The Workbench Shift

## 🛡️ CRITICAL GUARDRAILS (READ FIRST)
> **WARNING:** You are performing structural surgery on the "Mother Frame".
- [ ] **SCOPE:** Keep changes strictly inside `agentflow`.
- [ ] **NO REDESIGN:** You are moving code, NOT redesigning it. Do not change CSS, layout logic, or animations of the Toolbars, Pills, or Chat Rail.
- [ ] **THE FRAME:** The `Workbench` owns the Frame (Shell, Header, Chat Rail, Dock) + Transport Context.
- [ ] **THE CARTRIDGE:** Canvases (`Multi21`, `Stigma`) are plugins. They own only their internal content surface.
- [ ] **UNIVERSAL INTERACTION:** The `DualMagnifier` (Left/Right lens) belongs to the **Workbench Frame**. It must NOT be hidden inside a cartridge.
- [ ] **TRANSPORT ONLY:** `ConsoleContext` replaces ad-hoc env reads for **SSE/WS Transport Only**. Do not implement Nexus/Memory logic yet.

## 🏗️ TARGET ARCHITECTURE
**1. The Workbench (The Frame)**
- `components/workbench/WorkbenchShell.tsx` (Was `BuilderShell`)
- `components/workbench/WorkbenchHeader.tsx` (Was `TopPill`)
- `components/workbench/WorkbenchHeaderLozenge.tsx` (Was `TopControlLozenge`)
- `components/workbench/WorkbenchDock.tsx` (Was `FloatingControlsDock`)
- `components/workbench/ConsoleContext.tsx` (New: Transport & Connection State)

**2. The Cartridges (The Content)**
- `components/workbench/cartridges/multi21.tsx` (Configuration for Web Builder)
- `components/workbench/cartridges/stigma.tsx` (Configuration for Freeform Canvas)

## 🧩 CARTRIDGE INTERFACE SPECIFICATION
```typescript
export interface CanvasCartridge {
  id: string;
  logoIcon: React.ReactNode;
  TopControls: React.ComponentType; // Specific knobs for the header (e.g., Mobile/Desktop toggles)
  ToolMap: ToolDefinition[];        // Specific UI Atoms available in the Tool Pill
  // optional: overlays, initialToolState
} 

EXECUTION CHECKLIST (The "To-Do" List)
Phase 1: Workbench Extraction (The Lift)
[ ] Create types.ts for CanvasCartridge and slot props.

[ ] Extract BuilderShell -> WorkbenchShell.tsx.

[ ] CRITICAL: Ensure DualMagnifier remains in WorkbenchShell (The Frame), effectively wrapping the Cartridge.

[ ] Extract TopPill -> WorkbenchHeader.tsx.

[ ] Add slots for logoIcon and RightControls (injected by Cartridge).

[ ] Move TopControlLozenge -> WorkbenchHeaderLozenge.tsx.

[ ] Replace FloatingControlsDock -> WorkbenchDock.tsx.

Phase 2: Transport Context (Connectivity)
[ ] Create components/workbench/ConsoleContext.tsx.

[ ] Provider + Hook for SSE/WS connection state.

[ ] Update useWorkbenchTransport.ts to consume ConsoleContext.

[ ] Update CanvasLens.tsx to use ConsoleContext (Stop building process.env logic inline).

Phase 3: Multi21 Cartridge (Wiring the First Child)
[ ] Create components/workbench/cartridges/multi21.tsx.

[ ] Define the specific Logo, TopControls (Mobile/Desktop toggles), and ToolMap.

[ ] Refactor Multi21Designer.tsx:

[ ] Export a pure canvas body.

[ ] REMOVE BuilderShell wrapper (it will be provided by the page).

[ ] Update app/multi21/page.tsx:

[ ] Render WorkbenchShell with cartridge={Multi21Cartridge}.

Phase 4: Stigma Cartridge (Wiring the Second Child)
[ ] Create components/workbench/cartridges/stigma.tsx.

[ ] Define the Stigma Logo and specific TopControls.

[ ] Refactor StigmaCanvas.tsx:

[ ] REMOVE TopPill and ChatRailShell imports (It inherits them from Workbench now).

[ ] Update app/stigma/page.tsx:

[ ] Render WorkbenchShell with cartridge={StigmaCartridge}.

Phase 5: Cleanup & Verification
[ ] Update root Workbench.tsx to stop importing multi21/BuilderShell.

[ ] Verify tool-registry.ts keys are intact (Do not rename them).

[ ] Verify DualMagnifier interaction works on both Multi21 and Stigma.