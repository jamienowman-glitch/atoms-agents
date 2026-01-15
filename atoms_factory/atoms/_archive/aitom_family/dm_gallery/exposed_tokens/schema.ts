export const SCHEMA = {
    meta: {
        atom_kind: 'dm_gallery',
        version: '1.0.0'
    },
    content: {
        cards: [
            { title: 'Item 1', image: 'https://via.placeholder.com/200' },
            { title: 'Item 2', image: 'https://via.placeholder.com/200' },
            { title: 'Item 3', image: 'https://via.placeholder.com/200' }
        ]
    },
    typography: {
        title: { size: '14px', weight: 600,
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            letter_spacing: '0px',
            width: 100,
            slant: 0, }
    },
    color: { background: 'transparent' },
    border: { status: 'NA', reason: 'Layout' },
    spacing: {
        padding: { top: '10px', right: '10px', bottom: '10px', left: '10px' },
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        gap: '12px'
    },
    size: { width: '100%', height: 'auto' },
    layout: {
        display: 'flex',
        overflow_x: 'scroll'
    },
    effects: { status: 'NA', reason: 'Layout' },
    media: { status: 'NA', reason: 'In cards' },
    interaction: { enabled: true },
    linking: { status: 'NA', reason: 'In cards' },
    data_binding: { status: 'ENABLED' },
    tracking: { status: 'NA', reason: 'Carousel' },
    accessibility: { role: 'list', label: 'Carousel' },
    constraints: { mobile_optimized: true }
};
