# Naming Engine Contract

## Purpose
Provide a deterministic, pure naming function that converts a platform name into a standardized key string using a rule template.

## File Location
`atoms-app/src/lib/engines/naming-engine.ts`

## Function Contract
`formatProviderKey(platformName: string, rule: string): string`

### Rules
- Pure function: no I/O, no side effects.
- Basic, deterministic formatting:
  - slugify `platformName`
  - uppercase
  - replace separators with underscores
- Apply `rule` as a token template.

### Supported Token(s)
- `{PLATFORM}`: the formatted platform slug.

### Example
- Input: `platformName="TikTok Ads"`, `rule="PROVIDER_{PLATFORM}_KEY"`
- Output: `PROVIDER_TIKTOK_ADS_KEY`
