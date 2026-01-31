export interface ControlDefinition {
    id: string;
    type: 'slider' | 'toggle' | 'select' | 'joystick'; // Added joystick for future
    label: string;
    targetVar: string;
    min?: number; max?: number;
}

export interface TraitDefinition {
    id: string; // Left Magnifier (e.g., 'Layout', 'Physics')
    subGroups: { id: string; controls: ControlDefinition[] }[]; // Right Magnifier
}

export interface AtomContract {
    id: string;
    traits: TraitDefinition[];
}
