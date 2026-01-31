# Atomic Task Plan: Project-Wide Location Independence

**Goal**: Decouple file identity from file location. Enable "One-Click" programmatic UI via Supabase Registry.

## 1. The Alias System (`tsconfig.json`)
**Problem**: Relative paths (`../../`) break when files move.
**Solution**: Absolute Aliases (@Namespace).

### Proposed Aliases
*   `@dashboard/*`: `src/app/dashboard/*`
*   `@config/*`: `src/app/dashboard/config/*` (Legacy/Compat)
*   `@factories/*`: `src/app/dashboard/(factories)/*` (Virtual Grouping)
*   `@components/*`: `src/components/*`
*   `@lib/*`: `src/lib/*`
*   `@vault/*`: `src/lib/supabase/*`
*   `@hooks/*`: `src/hooks/*`
*   `@types/*`: `src/types/*`

## 2. The Barrel Registry Pattern
**Problem**: Imports constitute "Leaky Implementation Details".
**Solution**: `index.ts` files act as public APIs for folders.

*   **Rule**: Each main folder in `src/app/dashboard` must have an `index.ts`.
*   **Export**: `export * from './page';` (or specific named components).
*   **Usage**: `import { ConnectorConfig } from '@dashboard/connectors';`

## 3. The Supabase Registry (`registry_components`)
**Problem**: The Dashboard hardcodes links. It doesn't know what exists dynamically.
**Solution**: A Database Table that acts as the "Phonebook".

### Schema Proposal (`public.registry_components`)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `name` | Text | Human readable name (e.g., "Site Factory") |
| `slug` | Text | URL safe slug (e.g., "site-factory") |
| `family` | Text | Category (e.g., "factory", "config", "tool") |
| `alias_path` | Text | The TS Alias (e.g., `@dashboard/sites`) |
| `route_path` | Text | The Browser URL (e.g., `/dashboard/sites`) |
| `is_active` | Bool | Soft delete |

## 4. Execution Plan
1.  **TSConfig**: Update `atoms-app/tsconfig.json` with new paths.
2.  **Refactor**: Run script/agent to replace `../` with `@alias`.
3.  **Database**: Create `registry_components` table in Supabase.
4.  **Populate**: Script to scan the "42 Routes" and insert them into the DB.
