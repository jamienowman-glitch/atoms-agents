
export interface AtomTraitProperty {
    id: string;
    label: string;
    type: 'slider' | 'select' | 'toggle' | 'color';
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
    responsive?: boolean; // If true, creates desktop/mobile variants automatically
    targetProp?: string; // If different from id
}

export interface AtomTrait {
    type: 'layout' | 'typography' | 'style' | 'content';
    properties: AtomTraitProperty[];
}

export interface AtomConfig {
    id: string;
    name: string;
    category: 'layout' | 'text' | 'media' | 'interaction';
    version: string;
    family: string[];
    traits: AtomTrait[];
}

export const MultiTileConfig: AtomConfig = {
    id: 'multi-tile',
    name: 'Universal Tile',
    category: 'layout',
    version: '1.0.0',
    family: ['multi21-web', 'multi21-seb', 'multi21-deck'],
    traits: [
        {
            type: 'layout',
            properties: [
                { id: 'cols', targetProp: 'grid.cols', label: 'Columns', type: 'slider', min: 1, max: 12, step: 1, responsive: true },
                { id: 'gap_x', targetProp: 'grid.gap_x', label: 'Gap X', type: 'slider', min: 0, max: 64, step: 4, responsive: true },
                { id: 'gap_y', targetProp: 'grid.gap_y', label: 'Gap Y', type: 'slider', min: 0, max: 64, step: 4, responsive: true },
                { id: 'radius', targetProp: 'grid.tile_radius', label: 'Radius', type: 'slider', min: 0, max: 32, step: 4, responsive: true },
                { id: 'aspect', targetProp: 'grid.aspect_ratio', label: 'Aspect', type: 'select', options: ['16:9', '4:3', '1:1', '9:16'] }
            ]
        },
        {
            type: 'typography',
            properties: [
                { id: 'size', targetProp: 'typo.size', label: 'Size', type: 'slider', min: 10, max: 96, step: 1, responsive: true },
                { id: 'family', targetProp: 'typo.family', label: 'Family', type: 'select', options: ['Roboto Flex', 'Serif', 'Slab', 'Mono'] },
                { id: 'weight', targetProp: 'typo.weight', label: 'Weight', type: 'slider', min: 100, max: 900, step: 100 },
                { id: 'width', targetProp: 'typo.width', label: 'Width', type: 'slider', min: 50, max: 150, step: 1 }
            ]
        },
        {
            type: 'style',
            properties: [
                { id: 'bg_color', targetProp: 'style.bg', label: 'Background', type: 'color' },
                { id: 'text_color', targetProp: 'style.text', label: 'Text', type: 'color' },
                { id: 'border_width', targetProp: 'style.border_width', label: 'Border', type: 'slider', min: 0, max: 20, step: 1 }
            ]
        }
    ]
};
