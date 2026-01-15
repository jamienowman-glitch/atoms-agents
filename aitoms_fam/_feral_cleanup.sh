#!/bin/bash
set -e

# Phase A — DISCOVER

echo "Phase A: Discovery"
pwd
ls -F
mkdir -p _atom_move_ready_report

find ./aitom_family -maxdepth 2 -type d \( -name exposed_tokens -o -name views \) -print \
| grep -v '/haze_' \
| sed 's#/exposed_tokens##; s#/views##' \
| sort -u > _atom_move_ready_report/01_atom_roots.txt

find . -type f \
! -path './_atom_move_ready_report/*' \
-print0 \
| xargs -0 shasum -a 256 \
> _atom_move_ready_report/before_sha256.txt


# Phase B — EXECUTE

echo "Phase B: Execute"

# 1) Quarantine placeholders (noise) safely

echo "1) Quarantining placeholders..."

mkdir -p _atoms_inactive
rm -f _atom_move_ready_report/03_quarantined.txt
rm -f _atom_move_ready_report/04_created_files.txt

while IFS= read -r atom; do
  if echo "$atom" | grep -q '/haze_'; then
    continue
  fi

  total=$(find "$atom" -type f | wc -l | tr -d ' ')
  v=0
  d=0
  e=0
  [ -d "$atom/views" ] && v=$(find "$atom/views" -type f | wc -l | tr -d ' ')
  [ -d "$atom/data_schema" ] && d=$(find "$atom/data_schema" -type f | wc -l | tr -d ' ')
  [ -d "$atom/exposed_tokens" ] && e=$(find "$atom/exposed_tokens" -type f | wc -l | tr -d ' ')

  if [ "$v" -eq 0 ] && [ "$d" -eq 0 ] && [ "$e" -eq 0 ] && [ "$total" -le 2 ]; then
    base=$(echo "$atom" | sed 's#^\./##')
    mkdir -p "_atoms_inactive/$(dirname "$base")"
    mv "$atom" "_atoms_inactive/$base"
    echo "$atom -> _atoms_inactive/$base" >> _atom_move_ready_report/03_quarantined.txt
  fi
done < _atom_move_ready_report/01_atom_roots.txt

# Re-run root finding after move to ensure we don't process moved atoms
find ./aitom_family -maxdepth 2 -type d \( -name exposed_tokens -o -name views \) -print \
| grep -v '/haze_' \
| sed 's#/exposed_tokens##; s#/views##' \
| sort -u > _atom_move_ready_report/01_atom_roots_active.txt


# 2) Make every remaining atom MOVE-READY (RENDER_READY or SYSTEM_READY)

echo "2) Making atoms MOVE-READY..."

echo -e "atom_root\tclass\tviews\tdata_schema\texposed_tokens\ttracking\taccessibility\tcreated_files" > _atom_move_ready_report/02_atom_status.tsv

while IFS= read -r atom; do
  if echo "$atom" | grep -q '/haze_'; then
    continue
  fi
  if [ ! -d "$atom" ]; then
    continue
  fi

  mkdir -p "$atom/tracking"
  mkdir -p "$atom/accessibility"

  v=0
  d=0
  e=0
  t=0
  a=0
  b=0
  l=0

  [ -d "$atom/views" ] && v=$(find "$atom/views" -type f | wc -l | tr -d ' ')
  [ -d "$atom/data_schema" ] && d=$(find "$atom/data_schema" -type f | wc -l | tr -d ' ')
  [ -d "$atom/exposed_tokens" ] && e=$(find "$atom/exposed_tokens" -type f | wc -l | tr -d ' ')
  [ -d "$atom/tracking" ] && t=$(find "$atom/tracking" -type f | wc -l | tr -d ' ')
  [ -d "$atom/accessibility" ] && a=$(find "$atom/accessibility" -type f | wc -l | tr -d ' ')
  [ -d "$atom/behaviour" ] && b=$(find "$atom/behaviour" -type f | wc -l | tr -d ' ')
  [ -d "$atom/layout" ] && l=$(find "$atom/layout" -type f | wc -l | tr -d ' ')

  created=""

  if [ "$t" -eq 0 ]; then
    if [ ! -f "$atom/tracking/NA.md" ]; then
      echo "N/A: This atom does not currently emit trackable events (or tracking not yet defined)." > "$atom/tracking/NA.md"
      echo "$atom/tracking/NA.md" >> _atom_move_ready_report/04_created_files.txt
      created="${created} tracking/NA.md"
    fi
  fi

  if [ "$a" -eq 0 ]; then
    if [ ! -f "$atom/accessibility/NA.md" ]; then
      echo "N/A: Accessibility rules not specified here yet, or not applicable for this atom’s role. Define when promoted to interactive UI." > "$atom/accessibility/NA.md"
      echo "$atom/accessibility/NA.md" >> _atom_move_ready_report/04_created_files.txt
      created="${created} accessibility/NA.md"
    fi
  fi

  name=$(basename "$atom")
  system_only=0

  echo "$name" | grep -Eiq 'blackboard|wireframe_canvas|^theme_|nexus|settings|_canvas$' && system_only=1
  # Heuristic: No views but has behaviour/layout -> likely a controller
  if [ "$v" -eq 0 ] && [ "$system_only" -eq 0 ] && [ "$b" -gt 0 ] && [ "$l" -gt 0 ]; then
    system_only=1
  fi
  
  # New heuristic: if explicit system marker exists (self-healing from previous runs)
  if [ -f "$atom/views/SYSTEM_ONLY.md" ]; then
    system_only=1
  fi

  class="PARTIAL"
  # RENDER_READY check: needs REAL files in v, d, e
  # If we just created NA/SYSTEM_ONLY files, they might count as files in find, but we need to check if they are the ONLY files.
  # "find ... -type f" counts all files.
  
  # Re-count to be sure
  v_final=$(find "$atom/views" -type f | grep -v 'SYSTEM_ONLY.md' | wc -l | tr -d ' ')
  d_final=$(find "$atom/data_schema" -type f | grep -v 'SYSTEM_ONLY.md' | wc -l | tr -d ' ')
  e_final=$(find "$atom/exposed_tokens" -type f | grep -v 'SYSTEM_ONLY.md' | wc -l | tr -d ' ')
  
  if [ "$v_final" -gt 0 ] && [ "$d_final" -gt 0 ] && [ "$e_final" -gt 0 ]; then
    class="RENDER_READY"
  else
    if [ "$system_only" -eq 1 ]; then
      class="SYSTEM_READY"

      mkdir -p "$atom/views"
      v_curr=$(find "$atom/views" -type f | wc -l | tr -d ' ')
      if [ "$v_curr" -eq 0 ] && [ ! -f "$atom/views/SYSTEM_ONLY.md" ]; then
        echo "SYSTEM_ONLY: This atom is a controller/root/surface. It does not render a standalone view in the atom library." > "$atom/views/SYSTEM_ONLY.md"
        echo "$atom/views/SYSTEM_ONLY.md" >> _atom_move_ready_report/04_created_files.txt
        created="${created} views/SYSTEM_ONLY.md"
      fi

      mkdir -p "$atom/data_schema"
      d_curr=$(find "$atom/data_schema" -type f | wc -l | tr -d ' ')
      if [ "$d_curr" -eq 0 ] && [ ! -f "$atom/data_schema/SYSTEM_ONLY.md" ]; then
        echo "SYSTEM_ONLY: No standalone props schema. This atom is configured/used by higher-level surfaces." > "$atom/data_schema/SYSTEM_ONLY.md"
        echo "$atom/data_schema/SYSTEM_ONLY.md" >> _atom_move_ready_report/04_created_files.txt
        created="${created} data_schema/SYSTEM_ONLY.md"
      fi

      mkdir -p "$atom/exposed_tokens"
      e_curr=$(find "$atom/exposed_tokens" -type f | wc -l | tr -d ' ')
      if [ "$e_curr" -eq 0 ] && [ ! -f "$atom/exposed_tokens/SYSTEM_ONLY.md" ]; then
        echo "SYSTEM_ONLY: No public editable token surface defined yet for this atom." > "$atom/exposed_tokens/SYSTEM_ONLY.md"
        echo "$atom/exposed_tokens/SYSTEM_ONLY.md" >> _atom_move_ready_report/04_created_files.txt
        created="${created} exposed_tokens/SYSTEM_ONLY.md"
      fi
    fi
  fi
  
  # Final re-check to ensure we classify correctly based on the files we validly have
  # We know what we just did. 
  
  echo -e "$atom\t$class\t$v\t$d\t$e\t$t\t$a\t$created" >> _atom_move_ready_report/02_atom_status.tsv
done < _atom_move_ready_report/01_atom_roots_active.txt


# 3) Write the move-ready Atom Standard

cat > ATOM_STANDARD_CANVAS_READY.md <<'EOF'
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
EOF


# Phase C — VERIFY + REPORT

echo "Phase C: Verify & Report"

find . -type f \
! -path './_atom_move_ready_report/*' \
-print0 \
| xargs -0 shasum -a 256 \
> _atom_move_ready_report/05_after_sha256.txt

wc -l _atom_move_ready_report/02_atom_status.tsv
