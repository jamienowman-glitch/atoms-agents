export const SCHEMA = {
    meta: {
        atom_kind: 'image_with_text',
        version: '1.0.0'
    },
    content: {
        text: {
            title: 'Feature Highlight',
            body: 'Descriptive text goes here.',
        },
        image: {
            src: 'https://via.placeholder.com/600x400',
            alt: 'Feature'
        }
    },
    typography: {
        title: { size: '24px', weight: 600,
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            letter_spacing: '0px',
            width: 100,
            slant: 0, },
        body: { size: '16px', weight: 400,
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            letter_spacing: '0px',
            width: 100,
            slant: 0, line_height: '1.5' }
    },
    color: {
        background: '#f8f8f8',
        text: '#222',
        image_bg: '#ddd'
    },
    border: { status: 'NA', reason: 'Feature block' },
    spacing: {
        padding: { top: '0', right: '0', bottom: '0', left: '0' },
        margin: { top: '0', right: '0', bottom: '20px', left: '0' },
        gap: '40px'
    },
    size: { width: '100%', height: 'auto' },
    layout: {
        display: 'flex',
        flex_direction: 'row', // or row-reverse
        align_items: 'center',
        stack_on_mobile: true
    },
    effects: { status: 'NA', reason: 'Feature' },
    media: { status: 'NA', reason: 'Using content.image' },
    interaction: { enabled: false },
    linking: { status: 'NA', reason: 'Usually static' },
    data_binding: { status: 'ENABLED' },
    tracking: { status: 'NA', reason: 'Static' },
    accessibility: { role: 'group', label: 'Feature' },
    constraints: { allowed_edits: ['content', 'layout', 'typography'] }
};
