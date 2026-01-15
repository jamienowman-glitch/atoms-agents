# Atoms Factory Atomic Tasks

- **Task ID:** AF-CONTRACT-01  
  **Type:** BLOCKER  
  **Files/Locations:** all `atoms/aitom_family/*/exposed_tokens/`, `docs/factory/UI_ATOM_TOKEN_CONTRACT.md`  
  **Preconditions:** Contract frozen (this doc).  
  **Acceptance:** Each atom’s `exposed_tokens/schema.ts` + defaults reflect full token groups with Responsive wrapper and explicit NA reasons; no placeholder `{}` buckets.  
  **Unblocks:** Registry generation, UI token-surface editing.

- **Task ID:** AF-RESPONSIVE-02  
  **Type:** QUALITY  
  **Files/Locations:** `atoms/aitom_family/*/layout|typography|colours/exposed_tokens`  
  **Preconditions:** Responsive type definition shared.  
  **Acceptance:** Visual tokens adopt `Responsive<T>` shape; mobile/desktop overrides supported; NA where not applicable; views consume responsive tokens.  
  **Unblocks:** Mobile/desktop parity, freeform positioning.

- **Task ID:** AF-TRACK-03  
  **Type:** QUALITY  
  **Files/Locations:** `atoms/aitom_family/*/tracking`, `exposed_tokens/tracking`  
  **Preconditions:** Tracking token schema finalized in contract.  
  **Acceptance:** Clickable atoms include tracking + utm tokens with defaults; NA reasons documented for non-clickables; events mapped to actions.  
  **Unblocks:** Analytics coverage across UI.

- **Task ID:** AF-ACCESS-04  
  **Type:** QUALITY  
  **Files/Locations:** `atoms/aitom_family/*/accessibility`  
  **Preconditions:** Accessibility token schema from contract.  
  **Acceptance:** Accessibility bucket filled (role/label/tab_index/aria/focus order); alt text required for media; NA reasons recorded only when truly not applicable.  
  **Unblocks:** Compliance, agent-safe edits.

- **Task ID:** AF-CONSTRAINTS-05  
  **Type:** DX  
  **Files/Locations:** `atoms/aitom_family/*/behaviour` (constraints), `data_schema/`  
  **Preconditions:** Slot/children rules per atom defined.  
  **Acceptance:** `constraints.allowed_children`, `constraints.allowed_edits`, numeric min/max set; token_surface_hints provided for agents; slot rules documented.  
  **Unblocks:** UI inspector/agent enforcement.

- **Task ID:** AF-REGISTRY-06  
  **Type:** INTEGRATION  
  **Files/Locations:** new registry generator script (root), `docs/factory/ATOMS_FACTORY_BULK_BUILD_SPEC.md`  
  **Preconditions:** AF-CONTRACT-01 complete.  
  **Acceptance:** Generates registry JSON (type_id, version, schema, defaults, controls_metadata, slots, capabilities_flags) consumable by UI; validates NA rule; versioning stored.  
  **Unblocks:** UI registry fetch + palette.

- **Task ID:** AF-VIEWS-07  
  **Type:** QUALITY  
  **Files/Locations:** `atoms/aitom_family/*/views`  
  **Preconditions:** Tokens finalized.  
  **Acceptance:** Views render strictly from token inputs (no hidden props, no local defaults); support flow + freeform layout tokens; respect Responsive overrides; email-safe table wrapping where required.  
  **Unblocks:** Consistent rendering across surfaces.

- **Task ID:** AF-QA-08  
  **Type:** QUALITY  
  **Files/Locations:** new lint/test suite under `scripts/`  
  **Preconditions:** Contract schema available.  
  **Acceptance:** Automated checks for 10-bucket presence, NA enforcement, responsive token usage, Roboto Flex axes, tracking/accessibility filled; CI gating.  
  **Unblocks:** Reliable bulk atom delivery.

- **Task ID:** AF-PRIORITY-09  
  **Type:** BLOCKER  
  **Files/Locations:** atoms for top set (text, button, image, section/frame, columns/grid, chat message)  
  **Preconditions:** Contract + priority list from final summary.  
  **Acceptance:** First 20 atom types rebuilt to contract spec with registry entries; coverage includes web/email/dm/freeform variants where applicable.  
  **Unblocks:** UI Super Canvas MVP.
