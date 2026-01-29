/**
 * Builds a deterministic provider key using the configured naming rule.
 * The rule can reference {{platform}}, {{platform_name}}, {{platform_slug}}, or {{slug}}.
 */
function normalizePlatform(component: string): string {
    return component
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const PLACEHOLDER_MAP = ['platform', 'platform_name', 'platform_slug', 'slug'];

export function formatProviderKey(platformName: string, rule: string): string {
    const normalizedPlatform = normalizePlatform(platformName || '');
    const safeRule = rule || '{{platform}}';

    const replacements: Record<string, string> = {
        platform: normalizedPlatform,
        platform_name: platformName.trim(),
        platform_slug: normalizedPlatform,
        slug: normalizedPlatform
    };

    const formatted = safeRule.replace(/\{\{\s*([^}]+)\s*}}/g, (_, key) => {
        const normalizedKey = key.trim().toLowerCase();
        if (PLACEHOLDER_MAP.includes(normalizedKey) && replacements[normalizedKey]) {
            return replacements[normalizedKey];
        }
        return replacements.platform;
    });

    return formatted.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
}
