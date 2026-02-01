
import { RobotoAxes } from '@/lib/fonts/roboto-presets';

export interface FontDefinition {
    name: string;
    type: 'Variable' | 'Static';
    source: string;
    weights: string;
    variable_name: string;
    presets: { name: string; axes: RobotoAxes }[];
}

// Helper to generate standard weight presets for a font family
const generateStandardPresets = (baseName: string, slant = 0): { name: string; axes: RobotoAxes }[] => [
    { name: 'Thin', axes: { opsz: 14, wght: 100, GRAD: 0, wdth: 100, slnt: slant } },
    { name: 'Light', axes: { opsz: 14, wght: 300, GRAD: 0, wdth: 100, slnt: slant } },
    { name: 'Regular', axes: { opsz: 14, wght: 400, GRAD: 0, wdth: 100, slnt: slant } },
    { name: 'Medium', axes: { opsz: 14, wght: 500, GRAD: 0, wdth: 100, slnt: slant } },
    { name: 'Bold', axes: { opsz: 14, wght: 700, GRAD: 0, wdth: 100, slnt: slant } },
    { name: 'Black', axes: { opsz: 14, wght: 900, GRAD: 0, wdth: 100, slnt: slant } },
];

export const SYSTEM_FONTS: FontDefinition[] = [
    {
        name: 'Roboto Flex',
        type: 'Variable',
        source: 'Google Fonts',
        weights: '100-900',
        variable_name: '--font-roboto-flex',
        presets: generateStandardPresets('Roboto Flex')
    },
    {
        name: 'Roboto Serif',
        type: 'Variable',
        source: 'Google Fonts',
        weights: '100-900',
        variable_name: '--font-roboto-serif',
        presets: generateStandardPresets('Roboto Serif')
    },
    {
        name: 'Roboto Slab',
        type: 'Variable',
        source: 'Google Fonts',
        weights: '100-900',
        variable_name: '--font-roboto-slab',
        presets: generateStandardPresets('Roboto Slab')
    },
    {
        name: 'Roboto Mono',
        type: 'Variable',
        source: 'Google Fonts',
        weights: '100-700',
        variable_name: '--font-roboto-mono',
        presets: generateStandardPresets('Roboto Mono')
    }
];
