
import { AtomContract } from '@atoms/multi-tile/MultiTile.config';

export const BleedingHeroContract: AtomContract = {
    id: 'contract.bleeding_hero',
    label: 'Bleeding Hero',
    traits: [
        {
            id: 'trait.layout',
            type: 'layout',
            label: 'Layout & Bleed',
            properties: [
                {
                    id: 'layout.image_offset',
                    label: 'Image Offset',
                    type: 'slider',
                    min: -100,
                    max: 50,
                    step: 1,
                    defaultValue: -30,
                    targetProp: 'imageOffset',
                    subGroup: 'Bleed/Offset'
                },
                {
                    id: 'layout.text_width',
                    label: 'Text Column Width',
                    type: 'slider',
                    min: 20,
                    max: 100,
                    step: 5,
                    defaultValue: 70,
                    targetProp: 'textColumnWidth',
                    subGroup: 'Bleed/Offset'
                }
            ]
        },
        {
            id: 'trait.typography',
            type: 'typography',
            label: 'Typography',
            properties: [
                {
                    id: 'typo.weight',
                    label: 'Weight',
                    type: 'slider',
                    min: 100,
                    max: 900,
                    step: 10,
                    defaultValue: 400,
                    targetProp: 'axisWeight',
                    subGroup: 'Vario'
                },
                {
                    id: 'typo.slant',
                    label: 'Slant',
                    type: 'slider',
                    min: -10,
                    max: 0,
                    step: 1,
                    defaultValue: 0,
                    targetProp: 'axisSlant',
                    subGroup: 'Vario'
                }
            ]
        }
    ]
};
