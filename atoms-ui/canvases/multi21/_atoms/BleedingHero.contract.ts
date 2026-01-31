
import { AtomContract } from '../../../../types/AtomContract';

export const BleedingHeroContract: AtomContract = {
    id: 'bleeding_hero',
    traits: [
        {
            id: 'layout',
            subGroups: [
                {
                    id: 'bleed',
                    controls: [
                        {
                            id: 'layout.image_offset',
                            type: 'slider',
                            label: 'Image Offset',
                            targetVar: 'layout.image_offset',
                            min: -100,
                            max: 50,
                            step: 1
                        },
                        {
                            id: 'layout.text_width',
                            type: 'slider',
                            label: 'Text Column Width',
                            targetVar: 'layout.text_width',
                            min: 20,
                            max: 100,
                            step: 5
                        }
                    ]
                }
            ]
        },
        {
            id: 'typography',
            subGroups: [
                {
                    id: 'vario',
                    controls: [
                        {
                            id: 'typo.weight',
                            type: 'slider',
                            label: 'Weight',
                            targetVar: 'typo.weight',
                            min: 100,
                            max: 900,
                            step: 10
                        },
                        {
                            id: 'typo.slant',
                            type: 'slider',
                            label: 'Slant',
                            targetVar: 'typo.slant',
                            min: -10,
                            max: 0,
                            step: 1
                        }
                    ]
                }
            ]
        }
    ]
};
