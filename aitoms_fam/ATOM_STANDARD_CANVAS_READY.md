# Atom Standard — Canvas Ready

## Purpose
Defines the minimum standard an atom must meet to be move-ready into the collaborative canvas + builder system, without creating placeholder noise.

## Buckets (10 DNA folders)
behaviour/
layout/
views/
typography/
colours/
icons/
data_schema/
tracking/
accessibility/
exposed_tokens/

## Move-Ready Classes
### RENDER_READY
Renderable atoms:
- views/ has real render/template files
- data_schema/ has real props/schema contract files
- exposed_tokens/ has real editable token surface files
- tracking/accessibility either implemented OR explicitly N/A via NA.md

### SYSTEM_READY
System/controller/root atoms (non-renderable as standalone components):
- views may be empty, but must include views/SYSTEM_ONLY.md explaining why
- data_schema/exposed_tokens may be empty, but must include SYSTEM_ONLY.md notes
- tracking/accessibility must include NA.md when not implemented

### PLACEHOLDER
Empty shells with no meaningful implementation.
These are quarantined into _atoms_inactive/ (never deleted).

## No Noise Rule
We do not create fake schema, fake views, or fake exposed token files.
We only:
- preserve real work
- quarantine placeholders
- add explicit N/A / SYSTEM_ONLY notes so tooling can reason about readiness.

## Haze
Atoms under haze_* are excluded from this standard and are not modified.
