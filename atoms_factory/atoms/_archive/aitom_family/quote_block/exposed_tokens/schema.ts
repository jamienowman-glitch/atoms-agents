export const SCHEMA = {
    meta: {
        atom_kind: 'quote_block',
        version: '1.0.0'
    },
    content: {
        quote: 'The best way to predict the future is to create it.',
        author: 'Peter Drucker'
    },
    typography: {
        quote: { size: '24px', weight: 400,
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            letter_spacing: '0px',
            width: 100,
            slant: 0, style: 'italic' },
        author: { size: '16px', weight: 600,
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            letter_spacing: '0px',
            width: 100,
            slant: 0, color: '#666' }
    },
    color: {
        border_left: '#000000',
        background: '#transparent',
        text: '#222222'
    },
    border: { width: '4px' }, // left border width
    spacing: {
        padding: { top: '10px', right: '0', bottom: '10px', left: '20px' },
        margin: { top: '20px', bottom: '20px' }
    },
    size: { width: '100%' },
    layout: { status: 'NA' },
    effects: { status: 'NA' },
    media: { status: 'NA' },
    interaction: { status: 'NA' },
    linking: { status: 'NA' },
    data_binding: { status: 'ENABLED' },
    tracking: { status: 'NA' },
    accessibility: { role: 'blockquote' },
    constraints: { status: 'NA' }
};