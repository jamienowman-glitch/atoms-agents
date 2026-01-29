/**
 * UTM Engine
 * Pure function to generate normalized UTM outputs.
 */

interface UtmTemplate {
  allowed_variables: string[];
  pattern_structure: string; // e.g., "{{year}}_{{content_pool}}_{{season}}_{{campaign_name}}"
  static_params?: Record<string, string>;
}

export function generateUtmString(
  template: UtmTemplate,
  inputs: Record<string, string | number | null | undefined>
): string {
  let result = template.pattern_structure;

  // 1. Process each allowed variable
  // We scan the pattern for tokens like {{variable}}
  // For each token, we check if it is in allowed_variables AND present in inputs.

  // Helper to escape regex special characters in variable names if needed,
  // but we assume simple variable names.

  template.allowed_variables.forEach((variable) => {
    const token = `{{${variable}}}`;
    const value = inputs[variable];

    // Check if value is valid (non-empty string or number)
    const isValid = value !== null && value !== undefined && String(value).trim() !== "";

    if (isValid) {
      result = result.replace(token, String(value).trim());
    } else {
      // If not valid or not provided, remove the token
      result = result.replace(token, "");
    }
  });

  // 2. Clean up artifacts (Double underscores, leading/trailing separators)
  // This approach assumes the separator is usually '_', but we should be robust.
  // The example specifically mentions avoiding "2024__summer".

  // Replace multiple underscores with a single underscore
  result = result.replace(/_+/g, "_");

  // Remove leading and trailing underscores
  result = result.replace(/^_+|_+$/g, "");

  return result;
}

/**
 * Returns the full URL parameters including static params.
 * e.g. ?utm_source=tiktok&utm_medium=social&utm_campaign=...
 */
export function generateUtmParams(
  template: UtmTemplate,
  inputs: Record<string, string | number | null | undefined>
): Record<string, string> {
  const campaignValue = generateUtmString(template, inputs);

  const params: Record<string, string> = {
    ...template.static_params,
  };

  // Usually the pattern structure corresponds to utm_campaign, but sometimes others.
  // The prompt implies the pattern_structure is THE result.
  // Often this is assigned to 'utm_campaign' or 'utm_content'.
  // For this engine, we will just return the params object with a 'generated_id' or similar?
  // Re-reading instructions: "produces normalized UTM outputs."
  // "pattern_structure (String): The recipe for the final concatenation."

  // Implicitly, this usually maps to `utm_campaign`.
  // But let's just return the `utm_campaign` (or main value) and the static params.
  // Since I don't know EXACTLY which param the pattern maps to (it might be in metadata?),
  // I will assume for now this engine just returns the raw string from pattern
  // AND a helper to merge it with static params if the caller knows where to put it.

  // For safety, I will return the pure string in `generateUtmString`.
  // This helper `generateUtmParams` will assume it goes to `utm_campaign` if not specified,
  // but strictly speaking the prompt asked for "normalized UTM outputs".

  if (campaignValue) {
      params['utm_campaign'] = campaignValue;
  }

  return params;
}
