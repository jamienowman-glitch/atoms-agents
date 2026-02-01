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
                            id: 'position.x',
                            type: 'slider',
                            label: 'X Position',
                            targetVar: 'position.x',
                            min: 0,
                            max: 600
                        },
                        {
                            id: 'position.y',
                            type: 'slider',
                            label: 'Y Position',
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
                            max: 900,
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
                        }
                    ]
                }
            ]
        }
    ]
};
