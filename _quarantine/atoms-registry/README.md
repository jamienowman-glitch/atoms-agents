# Deprecated: atoms-registry (File-Based Registries)

This directory is deprecated and quarantined to prevent new work from landing in the legacy file-based registry.

## Source of truth
- Registry/config entries now live in **Supabase** (database tables / config UI).
- Legacy YAML harvesting/sync scripts may still reference `atoms-registry` in docs, but should not be used to author new configuration.

## Why this exists
Agents repeatedly recreated/extended file registries here, causing drift and duplication while the production system moved to DB-backed registries.

## If you think you still need this
Search for `atoms-registry` references and migrate the caller to the DB-backed registry API/table instead of writing YAML files.

