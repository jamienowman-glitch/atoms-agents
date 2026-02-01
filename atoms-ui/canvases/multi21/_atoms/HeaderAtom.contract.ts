import { AtomContract } from '@ui-types/AtomContract';

export const HeaderAtomContract: AtomContract = {
    id: 'header',
    family: 'wysiwyg',
    category: 'copy',
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
            id: 'typography',
            subGroups: [
                {
                    id: 'details',
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
            // NEW: The 4th Category (Motion)
            id: 'motion',
            subGroups: [
                {
                    id: 'entrance',
                    controls: [
                        {
                            id: 'typewriter',
                            type: 'toggle',
                            label: 'Typewriter',
                            targetVar: 'motion.typewriter'
                        },
                        {
                            id: 'vario_scroll',
                            type: 'slider',
                            label: 'Vario-Scroll',
                            targetVar: 'motion.scroll_speed',
                            min: 0,
                            max: 100,
                            axisLabels: {
                                increase: 'Fast',
                                decrease: 'Slow'
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
