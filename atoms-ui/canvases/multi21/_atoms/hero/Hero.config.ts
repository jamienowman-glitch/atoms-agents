
import { AtomConfig } from '@atoms/multi-tile/MultiTile.config';

export const HeroConfig: AtomConfig = {
    id: 'hero',
    name: 'Hero Banner',
    category: 'layout',
    version: '1.0.0',
    family: ['multi21-web'],
    traits: [
        {
            type: 'layout',
            properties: [
                { id: 'height', label: 'Height (vh)', type: 'slider', min: 20, max: 100, step: 5, responsive: true },
                { id: 'padding', label: 'Padding', type: 'slider', min: 0, max: 120, step: 8, responsive: true },
                { id: 'alignment', label: 'Align', type: 'select', options: ['left', 'center', 'right'] }
            ]
        },
        {
            type: 'style',
            properties: [
                { id: 'overlayOpacity', label: 'Overlay Opacity', type: 'slider', min: 0, max: 1, step: 0.1 },
                { id: 'overlayColor', label: 'Overlay Color', type: 'color' },
                { id: 'textColor', label: 'Text Color', type: 'color' }
            ]
        },
        {
            type: 'content',
            properties: [
                // Content traits usually handled by inline edit, but properties here for defaults
            ]
        }
    ]
};
