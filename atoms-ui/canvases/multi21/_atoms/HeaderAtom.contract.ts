import { AtomContract } from '../../../types/AtomContract';

export const HeaderAtomContract: AtomContract = {
    id: 'header',
    traits: [
        {
            id: 'position',
            subGroups: [
                {
                    id: 'placement',
                    controls: [
                        {
                            id: 'x_axis',
                            type: 'slider',
                            label: 'X Axis',
                            targetVar: 'position.x',
                            min: 0,
                            max: 600
                        },
                        {
                            id: 'y_axis',
                            type: 'slider',
                            label: 'Y Axis',
                            targetVar: 'position.y',
                            min: 0,
                            max: 2000
                        }
                    ]
                }
            ]
        },
        {
            id: 'motion',
            subGroups: [
                {
                    id: 'typography',
                    controls: [
                        {
                            id: 'typo.weight',
                            type: 'slider',
                            label: 'Weight',
                            targetVar: 'typo.weight',
                            min: 100,
                            max: 1000,
                            axisLabels: {
                                increase: 'Bulk Up',
                                decrease: 'Slim Down'
                            }
                        },
                        {
                            id: 'typo.slant',
                            type: 'slider',
                            label: 'Slant',
                            targetVar: 'typo.slant',
                            min: -10,
                            max: 0,
                            step: 1,
                            axisLabels: {
                                increase: 'Stand Up',
                                decrease: 'Lean Back'
                            }
                        },
                        {
                            id: 'typo.width',
                            type: 'slider',
                            label: 'Width',
                            targetVar: 'typo.width',
                            min: 25,
                            max: 151,
                            // Roboto Flex: 25 (Compressed) -> 151 (Expanded)
                            axisLabels: {
                                increase: 'Wide',
                                decrease: 'Tight'
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: 'appearance',
            subGroups: [
                {
                    id: 'colour',
                    controls: [
                        {
                            id: 'bg_color',
                            type: 'color_ribbon',
                            label: 'Background',
                            targetVar: 'style.block_bg',
                        },
                        {
                            id: 'text_color',
                            type: 'color_ribbon',
                            label: 'Text',
                            targetVar: 'style.text',
                        }
                    ]
                }
            ]
        }
    ]
};
