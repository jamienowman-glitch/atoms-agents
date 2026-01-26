---
name: console-extend
description: Teaches an Agent how to register new tools in the God Console II.
version: 1.0.0
---

# Console Extend Skill

This skill allows an Agent to add new items to the "God Console" Dashboard in `atoms-app`.

## usage
Use this skill when the user asks to "add a new tool", "register a surface", or "link a page" to the main console.

## instructions
The Console configuration is centralized in `atoms-app/src/app/page.tsx` within the `GOD_TOOLS` constant.

### 1. Locate the Definition
Find `const GOD_TOOLS` in `src/app/page.tsx`.

### 2. Append the Item
Add a new object to the array:
```typescript
{
  id: 'new-tool-id', // Unique, kebab-case
  title: 'Tool Name', // Display Title
  description: 'Short description for the user.',
  path: '/target-route', // The Next.js route
  locked: false // usually false
}
```

### 3. Verify Route Exists
Ensure the `path` points to a valid page. If the page does not exist, you MUST create it (e.g., `src/app/target-route/page.tsx`).

## example
**User**: "Add a link to the User Management page."
**Agent**: 
1. Edits `src/app/page.tsx`.
2. Adds:
```typescript
{
  id: 'users',
  title: 'User Management',
  description: 'Manage tenants and roles.',
  path: '/admin/users',
  locked: false
}
```
3. Creates `src/app/admin/users/page.tsx` if missing.
