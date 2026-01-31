/**
 * Muscle Registry (Mother Harness)
 * --------------------------------
 * This registry acts as the central lookup for all "Automated Muscles" available to the Harness.
 * Muscles are functional units (Color Grading, Auto-Layout, Text Summarization) 
 * that operate on Canvas Data but live in the Harness.
 */

export interface MuscleDefinition {
    id: string;
    name: string;
    description: string;
    version: string;
    capabilities: string[];
}

export const MuscleRegistry: Record<string, MuscleDefinition> = {
    'muscle.dracula': {
        id: 'muscle.dracula',
        name: 'Dracula Color Grade',
        description: 'Applies cinematic dark mode color grading to any surface.',
        version: '1.0.0',
        capabilities: ['color-shift', 'contrast-boost']
    },
    'muscle.vario': {
        id: 'muscle.vario',
        name: 'Vario Font Engine',
        description: 'Dynamic variable font axis controller.',
        version: '2.1.0',
        capabilities: ['weight-axis', 'slant-axis', 'optical-size-axis']
    }
    // Future muscles (Auto-Layout, SEO-Bot) will be registered here.
};
