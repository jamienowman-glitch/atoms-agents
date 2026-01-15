# Atoms Factory Atomic Task Breakdown

## 1. Infrastructure

### AF-TASK-001: Implement Scaffold Script
*   **Type:** DX
*   **Files:** `scripts/scaffold_atom.py`
*   **Description:** Script to generate the 10-bucket folder structure with valid placeholder/template files for a new atom.
*   **Acceptance:** Running script with atom name creates full structure.

## 2. Unification / Remediation

### AF-TASK-002: Retrofit Core Atoms (Batch A)
*   **Type:** QUALITY
*   **Files:** `atoms/aitom_family/cta_button`, `atoms/aitom_family/heading_block`
*   **Description:** Ensure `cta_button` and `heading_block` fully comply with `UI_ATOM_TOKEN_CONTRACT.md` (Max Superset). Add missing `schema.ts`. Verify 10 buckets.
*   **Acceptance:** Pass `ATOMS_FACTORY_QA_CHECKLIST.md`.

### AF-TASK-003: Retrofit Layout Atoms (Batch B)
*   **Type:** QUALITY
*   **Files:** `atoms/aitom_family/section_hero_banner`, `atoms/aitom_family/multi_feed_grids` (etc.)
*   **Description:** Ensure layout atoms expose `layout.flow`, `layout.grid` tokens properly. Remove placeholders.
*   **Acceptance:** Pass QA Checklist.

## 3. New Capabilities

### AF-TASK-004: Implement Freeform Container Atom
*   **Type:** FEATURE
*   **Files:** `atoms/aitom_family/freeform_frame`
*   **Description:** Create a new `Frame` atom supporting absolute positioning children.
*   **Acceptance:** Logic exists for `layout.positioning="absolute"`.

### AF-TASK-005: Implement Email/DM Specific Atoms
*   **Type:** FEATURE
*   **Description:** Create/Update atoms for Email (Klaviyo) and DM (Manychat) with correct constraints.
*   **Acceptance:** Atoms have `email` and `dm` token buckets active.
