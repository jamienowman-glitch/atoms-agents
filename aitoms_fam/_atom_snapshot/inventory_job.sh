#!/bin/bash

# Phase B code from prompt

mkdir -p _atom_snapshot

tree -L 2 > _atom_snapshot/00_repo_tree_L2.txt 2>/dev/null || true

find . -type d \( -name exposed_tokens -o -name views \) -print \
| sed 's#/exposed_tokens##; s#/views##' \
| sort -u > _atom_snapshot/01_atom_roots.txt

rm -f _atom_snapshot/02_atom_structure_L2.txt
while IFS= read -r atom; do
  echo "==== ATOM: $atom" >> _atom_snapshot/02_atom_structure_L2.txt
  find "$atom" -maxdepth 2 -print | sort >> _atom_snapshot/02_atom_structure_L2.txt
  echo "" >> _atom_snapshot/02_atom_structure_L2.txt
done < _atom_snapshot/01_atom_roots.txt

rm -f _atom_snapshot/03_bucket_files.txt
while IFS= read -r atom; do
  echo "==== ATOM: $atom" >> _atom_snapshot/03_bucket_files.txt
  for bucket in behaviour layout views typography colours icons data_schema tracking accessibility exposed_tokens; do
    if [ -d "$atom/$bucket" ]; then
      echo "-- $bucket/" >> _atom_snapshot/03_bucket_files.txt
      find "$atom/$bucket" -maxdepth 2 -type f -print | sort >> _atom_snapshot/03_bucket_files.txt
    else
      echo "-- $bucket/ (MISSING)" >> _atom_snapshot/03_bucket_files.txt
    fi
  done
  echo "" >> _atom_snapshot/03_bucket_files.txt
done < _atom_snapshot/01_atom_roots.txt

# Using printf for tabs to ensure portability if echo fails
# But sticking to prompt:
echo "atom_root	behaviour	layout	views	typography	colours	icons	data_schema	tracking	accessibility	exposed_tokens" > _atom_snapshot/04_bucket_coverage_summary.tsv
while IFS= read -r atom; do
  b1=0; [ -d "$atom/behaviour" ] && b1=1
  b2=0; [ -d "$atom/layout" ] && b2=1
  b3=0; [ -d "$atom/views" ] && b3=1
  b4=0; [ -d "$atom/typography" ] && b4=1
  b5=0; [ -d "$atom/colours" ] && b5=1
  b6=0; [ -d "$atom/icons" ] && b6=1
  b7=0; [ -d "$atom/data_schema" ] && b7=1
  b8=0; [ -d "$atom/tracking" ] && b8=1
  b9=0; [ -d "$atom/accessibility" ] && b9=1
  b10=0; [ -d "$atom/exposed_tokens" ] && b10=1
  echo "$atom	$b1	$b2	$b3	$b4	$b5	$b6	$b7	$b8	$b9	$b10" >> _atom_snapshot/04_bucket_coverage_summary.tsv
done < _atom_snapshot/01_atom_roots.txt

head -n 10 _atom_snapshot/01_atom_roots.txt > _atom_snapshot/_sample_atoms.txt
rm -f _atom_snapshot/05_sample_atoms_manifest.json
echo "[" >> _atom_snapshot/05_sample_atoms_manifest.json
first=1
while IFS= read -r atom; do
  if [ $first -eq 0 ]; then
    echo "," >> _atom_snapshot/05_sample_atoms_manifest.json
  fi
  first=0
  echo "  {\"atom_root\":\"$atom\",\"buckets\":{" >> _atom_snapshot/05_sample_atoms_manifest.json
  sep=0
  for bucket in behaviour layout views typography colours icons data_schema tracking accessibility exposed_tokens; do
    if [ $sep -eq 1 ]; then
      echo "," >> _atom_snapshot/05_sample_atoms_manifest.json
    fi
    sep=1
    if [ -d "$atom/$bucket" ]; then
      count=$(find "$atom/$bucket" -type f | wc -l | tr -d ' ')
      echo "    \"$bucket\":{\"present\":true,\"file_count\":$count}" >> _atom_snapshot/05_sample_atoms_manifest.json
    else
      echo "    \"$bucket\":{\"present\":false,\"file_count\":0}" >> _atom_snapshot/05_sample_atoms_manifest.json
    fi
  done
  echo "  }}" >> _atom_snapshot/05_sample_atoms_manifest.json
done < _atom_snapshot/_sample_atoms.txt
echo "" >> _atom_snapshot/05_sample_atoms_manifest.json
echo "]" >> _atom_snapshot/05_sample_atoms_manifest.json
