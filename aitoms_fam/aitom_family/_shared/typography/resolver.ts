
import { robotoFlexPresets, RobotoFlexAxes } from './presets';

export interface TypographyTokens {
    preset?: string;
    axes?: Partial<RobotoFlexAxes>;
    // Support legacy distinct tokens if needed
    wght?: number;
    wdth?: number;
    slnt?: number;
    ital?: number;
    opsz?: number;
    // Standard CSS props
    fontSize?: string;
    lineHeight?: string;
    letterSpacing?: string;
}

export interface ResolvedTypography {
    fontFamily: string;
    fontVariationSettings: string;
    fontSize?: string;
    lineHeight?: string;
    letterSpacing?: string;
}

export function resolveRobotoFlexVariation(tokens: TypographyTokens = {}): ResolvedTypography {
    const presetName = tokens.preset || 'Regular';
    const baseAxes = robotoFlexPresets[presetName] || robotoFlexPresets['Regular'];

    // Merge overrides
    // Priority: explicit axes map > distinct legacy tokens > preset defaults
    const mergedAxes: any = { ...baseAxes };

    if (tokens.axes) {
        Object.assign(mergedAxes, tokens.axes);
    }

    // Legacy individual tokens override everything if present
    if (tokens.wght !== undefined) mergedAxes['wght'] = tokens.wght;
    if (tokens.wdth !== undefined) mergedAxes['wdth'] = tokens.wdth;
    if (tokens.slnt !== undefined) mergedAxes['slnt'] = tokens.slnt;
    if (tokens.ital !== undefined) mergedAxes['ital'] = tokens.ital;
    if (tokens.opsz !== undefined) mergedAxes['opsz'] = tokens.opsz;

    // Construct string
    const settingsParts: string[] = [];
    for (const [axis, value] of Object.entries(mergedAxes)) {
        settingsParts.push(`"${axis}" ${value}`);
    }

    return {
        fontFamily: '"Roboto Flex", sans-serif',
        fontVariationSettings: settingsParts.join(', '),
        fontSize: tokens.fontSize,
        lineHeight: tokens.lineHeight,
        letterSpacing: tokens.letterSpacing
    };
}
