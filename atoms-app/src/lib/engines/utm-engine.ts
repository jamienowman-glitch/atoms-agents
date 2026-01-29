export type UtmTemplateRecord = {
    provider_id: string;
    first_touch_template?: string | null;
    last_touch_template?: string | null;
    content_type_template?: string | null;
    custom_rules?: Record<string, unknown> | null;
};

export type NormalizedUtmTemplates = {
    providerId: string;
    firstTouchTemplate: string;
    lastTouchTemplate: string;
    contentTypeTemplate: string;
    customRules: Record<string, unknown>;
};

/**
 * Produces normalized UTM templates for a single provider.
 *
 * @param providerId - The connector_providers.provider_id being examined.
 * @param utmTemplates - Raw rows from public.utm_templates for this provider.
 */
export function normalizeUtmTemplates(
    providerId: string,
    utmTemplates: UtmTemplateRecord[]
): NormalizedUtmTemplates {
    const candidate = utmTemplates.find((template) => template.provider_id === providerId);
    const firstTouch = (candidate?.first_touch_template ?? '').trim();
    const lastTouch = (candidate?.last_touch_template ?? '').trim();
    const contentType = (candidate?.content_type_template ?? '').trim();
    const customRules = candidate?.custom_rules ?? {};

    return {
        providerId,
        firstTouchTemplate: firstTouch,
        lastTouchTemplate: lastTouch,
        contentTypeTemplate: contentType,
        customRules
    };
}
