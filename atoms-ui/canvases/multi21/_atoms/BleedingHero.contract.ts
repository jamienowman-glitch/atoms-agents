export const BleedingHeroContract = {
    name: 'Bleeding Hero',
    type: 'HERO_BLOCK',
    // Slider 1: Image Offset (Bleed)
    slider1: {
        label: 'Image Bleed',
        min: -50, // Negative margin/offset (px or %)
        max: 0,
        default: -30,
        step: 1,
        unit: 'px' // or %
    },
    // Slider 2: Text Column Width
    slider2: {
        label: 'Text Width',
        min: 30,
        max: 100,
        default: 70,
        step: 5,
        unit: '%'
    },
    // Typography is handled via global Vario Engine (Weight/Slant), 
    // so no specific contract needed here unless overriding defaults.
    typography: {
        useVario: true
    }
} as const;
