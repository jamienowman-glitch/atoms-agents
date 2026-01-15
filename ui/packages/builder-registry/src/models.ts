export type SettingType = 'text' | 'textarea' | 'color' | 'number' | 'select' | 'image' | 'range' | 'alignment';

export interface AtomProps {
    id: string;
    properties: Record<string, any>;
    children?: React.ReactNode;
    isSelected?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    onUpdate?: (id: string, prop: string, value: any) => void;
}

export interface Setting {
    id: string;
    type: SettingType;
    label: string;
    default?: any;
    options?: { label: string; value: string }[]; // For select
    min?: number;
    max?: number;
    step?: number;
}

export interface ComponentSchema {
    id: string; // e.g. 'hero-section'
    name: string; // Human readable
    type: 'section' | 'block';
    settings: Setting[];
    allowedBlocks?: string[]; // If section, what blocks can it take?
    defaultChildren?: string[]; // Auto-create these on add
}

export const SCHEMAS: Record<string, ComponentSchema> = {
    'hero-section': {
        id: 'hero-section',
        name: 'Hero Banner',
        type: 'section',
        settings: [
            { id: 'background', type: 'color', label: 'Background Color', default: '#f4f4f4' },
            { id: 'image', type: 'image', label: 'Background Image', default: '' },
            { id: 'padding', type: 'range', label: 'Padding (px)', min: 20, max: 200, default: 60 },
            { id: 'height', type: 'range', label: 'Section Height (vh)', min: 20, max: 100, default: 50 },
            { id: 'alignment', type: 'alignment', label: 'Content Alignment', default: 'center' }
        ],
        allowedBlocks: ['text-block', 'button-block', 'image-block', 'headline-block']
    },
    'text-section': {
        id: 'text-section',
        name: 'Rich Text',
        type: 'section',
        settings: [
            { id: 'background', type: 'color', label: 'Background', default: '#ffffff' },
            {
                id: 'width', type: 'select', label: 'Width', default: 'narrow', options: [
                    { label: 'Wide', value: 'wide' },
                    { label: 'Narrow', value: 'narrow' }
                ]
            }
        ],
        allowedBlocks: ['headline-block', 'text-block', 'button-block']
    },
    'headline-block': {
        id: 'headline-block',
        name: 'Heading',
        type: 'block',
        settings: [
            { id: 'text', type: 'text', label: 'Heading Text', default: 'Talk about your brand' },
            {
                id: 'size', type: 'select', label: 'Size', default: 'medium', options: [
                    { label: 'Small', value: 'small' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' },
                    { label: 'Extra Large', value: 'xl' }
                ]
            },
            { id: 'color', type: 'color', label: 'Text Color', default: '#000000' },
            { id: 'background', type: 'color', label: 'Background Color', default: 'transparent' }
        ]
    },
    'text-block': {
        id: 'text-block',
        name: 'Text',
        type: 'block',
        settings: [
            { id: 'text', type: 'textarea', label: 'Body Text', default: 'Share information about your brand with your customers.' },
            { id: 'color', type: 'color', label: 'Text Color', default: '#4a4a4a' },
            { id: 'background', type: 'color', label: 'Background Color', default: 'transparent' }
        ]
    },
    'button-block': {
        id: 'button-block',
        name: 'Button',
        type: 'block',
        settings: [
            { id: 'label', type: 'text', label: 'Button Label', default: 'Shop Now' },
            { id: 'url', type: 'text', label: 'Button Link', default: '#' },
            { id: 'background', type: 'color', label: 'Button Color', default: '#000000' },
            { id: 'color', type: 'color', label: 'Label Color', default: '#ffffff' }
        ]
    },
    'image-block': {
        id: 'image-block',
        name: 'Image',
        type: 'block',
        settings: [
            { id: 'src', type: 'image', label: 'Image', default: '' },
            { id: 'alt', type: 'text', label: 'Alt Text', default: '' },
            { id: 'width', type: 'range', label: 'Image Width (%)', min: 10, max: 100, default: 100 }
        ]
    }
};

export const SECTION_TEMPLATES = [
    { id: 'hero-section', name: 'Hero Banner' },
    { id: 'text-section', name: 'Rich Text' }
];
