/**
 * Naming Engine
 * Pure function to format provider keys based on rules.
 */

export function formatProviderKey(platformName: string, rule: string): string {
  if (!platformName || !rule) {
    return "";
  }

  // 1. Slugify the platform name (basic: alphanumeric only, spaces to underscores)
  const slug = platformName
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special chars
    .replace(/\s+/g, "_")            // Replace spaces with underscores
    .toUpperCase();                  // Uppercase

  // 2. Apply the rule (replace {PLATFORM} token)
  // We handle {PLATFORM} as the main token.
  return rule.replace("{PLATFORM}", slug);
}
