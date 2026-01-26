import { CSSProperties } from 'react';

// Hardcoded for now, but conceptually global
const PRESETS = [
    { name: 'Roboto Flex', axes: { wght: 400, wdth: 100, slnt: 0, GRAD: 0, CASL: 0 } }, // 0
    { name: 'Roboto Serif', axes: { wght: 400, wdth: 100, GRAD: 0 } }, // 1
    { name: 'Roboto Slab', axes: { wght: 400, wdth: 100, GRAD: 0 } }, // 2
    { name: 'Roboto Mono', axes: { wght: 400, wdth: 100, slnt: 0, GRAD: 0 } }, // 3
];

const FAMILIES = [
    'var(--font-roboto-flex)', // 0
    'var(--font-roboto-serif)', // 1
    'var(--font-roboto-slab)', // 2
    'var(--font-roboto-mono)', // 3
];

export interface VarioProps {
    fontFamily?: number; // Index 0-3
    weight?: number | null;
    width?: number | null;
    slant?: number;
    casual?: number;
    grade?: number;
    // Optical Size logic can be internal or passed
    size?: number;
}

export function useVarioEngine(props: VarioProps) {
    const {
        fontFamily = 0,
        weight = null,
        width = null,
        slant = 0,
        casual = 0,
        grade = 0,
        size = 16
    } = props;

    // 1. Resolve Family Variable
    const activeFontVar = FAMILIES[fontFamily] || FAMILIES[0];
    const isFlex = fontFamily === 0;

    // 2. Resolve Axes Defaults
    const preset = PRESETS[fontFamily] || PRESETS[0];
    const defaultAxes = preset.axes;

    // 3. Compute Axis Values
    // If explicit prop is passed (and not null/-1), use it. Else use default.
    const wght = (weight !== null && weight !== -1) ? weight : (defaultAxes.wght || 400);
    const wdth = (width !== null && width !== -1) ? width : (defaultAxes.wdth || 100);
    const grd = grade || 0;

    // Slant & Casual only apply to Flex (0)
    const slnt = isFlex ? (slant || 0) : 0;
    const casl = isFlex ? (casual || 0) : 0;

    // Optical Size (Auto-calculated based on font size)
    const opsz = Math.min(144, Math.max(8, size));

    // 4. Compute Font Style (Italic Fallback)
    // If non-flex font has aggressive slant request, fallback to font-style: italic
    const forceItalic = !isFlex && (slant || 0) <= -5;

    // 5. Construct Settings String
    const fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'CASL' ${casl}, 'GRAD' ${grd}, 'opsz' ${opsz}`;

    // 6. Return Style Object
    const style: CSSProperties = {
        fontFamily: `${activeFontVar}, sans-serif`,
        fontVariationSettings,
        fontStyle: forceItalic ? 'italic' : 'normal',
        fontWeight: 'normal', // Let Variable Axis handle weight
    };

    return {
        style,
        // Expose raw values if needed for debugging
        values: { family: activeFontVar, wght, wdth, slnt, casl, grd, opsz }
    };
}
