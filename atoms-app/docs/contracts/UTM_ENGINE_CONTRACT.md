# UTM Engine Contract

## Purpose
Generate normalized UTM strings using approved `utm_templates` while enforcing allowed variables and clean concatenation.

## File Location
`atoms-app/src/lib/engines/utm-engine.ts`

## Rules
- Pure function: no I/O, no side effects.
- Inputs include:
  - `utm_template` (from `public.utm_templates`)
  - user-selected variable values (limited to `allowed_variables`)
  - `static_params`
- Output is a normalized UTM string or parameter map.

## Required Behavior
- Only use variables listed in `allowed_variables`.
- If an allowed variable is missing/empty, drop its token cleanly so there are no double separators.
  - Example: `2024__summer` becomes `2024_summer`.
- `static_params` are immutable and must always be included.
