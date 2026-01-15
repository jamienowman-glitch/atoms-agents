# Atoms Factory QA Checklist

## Acceptance Criteria per Atom

### Structure
- [ ] Atom folder exists in `atoms/aitom_family/`
- [ ] All 10 buckets exist as subdirectories
- [ ] No empty buckets (files or valid placeholder present)

### Schema & Tokens
- [ ] `exposed_tokens/schema.ts` exists and exports typed schema
- [ ] `exposed_tokens/default.ts` exists and matches schema
- [ ] All 15 Required Token Groups are present or marked NA
    - Content, Typography, Color, Border, Spacing, Size, Layout, Effects, Media, Interaction, Linking, Data Binding, Tracking, Accessibility, Constraints
- [ ] NA groups use explicit format: `{ "status": "NA", "reason": "..." }`

### Functionality
- [ ] `views/View.tsx` renders without error using ONLY tokens
- [ ] Responsive wrappers (`base`, `mobile`, `desktop`) respected
- [ ] Typography uses Roboto Flex variable axes correctly
- [ ] Colors map to theme tokens where applicable

### Integration
- [ ] Tracking events defined
- [ ] Accessibility roles/labels correct
- [ ] Layout constraints defined (allowed children, etc.)

### Agent Readiness
- [ ] TokenSurface allowlist defined (in metadata or schema)
- [ ] Patch-safe (JSON Patch OPs verified)
