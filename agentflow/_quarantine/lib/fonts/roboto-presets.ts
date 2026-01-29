export interface RobotoAxes {
    opsz: number;
    wght: number;
    GRAD: number;
    wdth: number;
    slnt: number;
}

export interface RobotoPreset {
    name: string;
    axes: RobotoAxes;
}

export const ROBOTO_PRESETS: RobotoPreset[] = [
    { name: 'Thin', axes: { opsz: 14.0, wght: 100.0, GRAD: 0.0, wdth: 100.0, slnt: 0.0 } },
    { name: 'ExtraLight', axes: { opsz: 14.0, wght: 200.0, GRAD: 0.0, wdth: 100.0, slnt: 0.0 } },
    { name: 'Light', axes: { opsz: 14.0, wght: 300.0, GRAD: 0.0, wdth: 100.0, slnt: 0.0 } },
    { name: 'Regular', axes: { opsz: 14.0, wght: 400.0, GRAD: 0.0, wdth: 100.0, slnt: 0.0 } },
    { name: 'Medium', axes: { opsz: 14.0, wght: 500.0, GRAD: 0.0, wdth: 100.0, slnt: 0.0 } },
    { name: 'SemiBold', axes: { opsz: 14.0, wght: 600.0, GRAD: 0.0, wdth: 100.0, slnt: 0.0 } },
    { name: 'Bold', axes: { opsz: 14.0, wght: 700.0, GRAD: 0.0, wdth: 100.0, slnt: 0.0 } },
    { name: 'ExtraBold', axes: { opsz: 14.0, wght: 800.0, GRAD: 0.0, wdth: 100.0, slnt: 0.0 } },
    { name: 'Black', axes: { opsz: 14.0, wght: 900.0, GRAD: 0.0, wdth: 100.0, slnt: 0.0 } },
    { name: 'ExtraBlack', axes: { opsz: 14.0, wght: 1000.0, GRAD: 0.0, wdth: 100.0, slnt: 0.0 } },
    { name: 'Thin Italic', axes: { opsz: 14.0, wght: 100.0, GRAD: 0.0, wdth: 100.0, slnt: -10.0 } },
    { name: 'ExtraLight Italic', axes: { opsz: 14.0, wght: 200.0, GRAD: 0.0, wdth: 100.0, slnt: -10.0 } },
    { name: 'Light Italic', axes: { opsz: 14.0, wght: 300.0, GRAD: 0.0, wdth: 100.0, slnt: -10.0 } },
    { name: 'Regular Italic', axes: { opsz: 14.0, wght: 400.0, GRAD: 0.0, wdth: 100.0, slnt: -10.0 } },
    { name: 'Medium Italic', axes: { opsz: 14.0, wght: 500.0, GRAD: 0.0, wdth: 100.0, slnt: -10.0 } },
    { name: 'SemiBold Italic', axes: { opsz: 14.0, wght: 600.0, GRAD: 0.0, wdth: 100.0, slnt: -10.0 } },
    { name: 'Bold Italic', axes: { opsz: 14.0, wght: 700.0, GRAD: 0.0, wdth: 100.0, slnt: -10.0 } },
    { name: 'ExtraBold Italic', axes: { opsz: 14.0, wght: 800.0, GRAD: 0.0, wdth: 100.0, slnt: -10.0 } },
    { name: 'Black Italic', axes: { opsz: 14.0, wght: 900.0, GRAD: 0.0, wdth: 100.0, slnt: -10.0 } },
    { name: 'ExtraBlack Italic', axes: { opsz: 14.0, wght: 1000.0, GRAD: 0.0, wdth: 100.0, slnt: -10.0 } },
];
