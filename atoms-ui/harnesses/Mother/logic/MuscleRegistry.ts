// Muscle Registry (Mother Harness)
// This file acts as the central lookup for all available "Muscle" capabilities
// that can be plugged into the Harness LogicPop.

export type MuscleId = 'DRACULA_GRADING' | 'AUTO_LAYOUT' | 'CONTENT_GEN';

export interface MuscleDefinition {
    id: MuscleId;
    name: string;
    description: string;
    enabled: boolean;
}

export const MuscleRegistry: Record<MuscleId, MuscleDefinition> = {
    DRACULA_GRADING: {
        id: 'DRACULA_GRADING',
        name: 'Dracula',
        description: 'Automated color grading and contrast enhancement for dark mode aesthetics.',
        enabled: false // Coming soon
    },
    AUTO_LAYOUT: {
        id: 'AUTO_LAYOUT',
        name: 'Auto-Layout',
        description: 'Intelligent rearrangement of blocks based on content density.',
        enabled: false
    },
    CONTENT_GEN: {
        id: 'CONTENT_GEN',
        name: 'Copywriter',
        description: 'AI-assisted generation of headlines and body text.',
        enabled: false
    }
};

export function getAvailableMuscles(): MuscleDefinition[] {
    return Object.values(MuscleRegistry).filter(m => m.enabled);
}
