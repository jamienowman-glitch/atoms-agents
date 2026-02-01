export interface AxisLabel {
    increase: string;  // e.g., "Bulk Up"
    decrease: string;  // e.g., "Slim Down"
}

export interface ControlDefinition {
    id: string;
    type: 'slider' | 'toggle' | 'select' | 'joystick' | 'trigger' | 'panel_pop' | 'color_ribbon'; // Added color_ribbon
    label: string;
    targetVar: string;
    min?: number; max?: number;
    step?: number;
    axisLabels?: AxisLabel;  // For motion axes
}

export interface TraitDefinition {
    id: string; // Left Magnifier (e.g., 'Layout', 'Physics')
    subGroups: { id: string; controls: ControlDefinition[] }[]; // Right Magnifier
}

export interface AtomContract {
    id: string;
    traits: TraitDefinition[];
}
