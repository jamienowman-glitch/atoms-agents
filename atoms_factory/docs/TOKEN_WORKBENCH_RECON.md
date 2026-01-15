# Token Workbench Reconnaissance

## Token Definitions
- **Location**: `atoms/aitom_family/<atom>/exposed_tokens/schema.ts`
- **Format**: TypeScript object export `SCHEMA`.
- **Structure**: Nested objects (sections) containing primitives or `{ status: 'NA', reason: '...' }` objects.

## Current Persistence
- **Status**: None found (Source code only).
- **Plan**: Implement local Node.js server writing to `docs/TOKEN_CATALOG.json`.

## Token Editor Analysis
- **Location**: `apps/workbench/src/components/TokenEditor.tsx`
- **Behavior**: Recursively renders inputs based on value types.
- **NA Support**: Renders "NA" badge if `value.status === 'NA'`.

## In-Canvas Editing
- **Current State**: `View.tsx` renders static text from tokens.
- **Requirement**: "Double click / long press... updates underlying node state".
- **Plan**:
    - Identify text nodes in `View.tsx`.
    - Make them `contentEditable` or replace with `<input>` on interaction.
    - Since we have many atoms, we'll target the active/valid ones.

## Animation System
- **Status**: None found.
- **Plan**: Add `animation_spec` object to token definitions (persisted in Catalog).

## Paths
- **Schema**: `atoms/aitom_family/*/exposed_tokens/schema.ts`
- **Views**: `atoms/aitom_family/*/views/View.tsx`
- **Workbench App**: `apps/workbench/src/App.tsx`
