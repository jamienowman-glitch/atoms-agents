export const SCHEMA = {
    meta: {
        atom_kind: 'email_text',
        version: '1.0.0'
    },
    content: {
        text: 'Hello there, this is an email body.'
    },
    typography: {
        base: {
            family_preset: 'arial', // Email safe
            size: '16px',
            weight: 400,
            slant: 0,
            width: 100,
            letter_spacing: '0px',
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            line_height: '1.5',
            color: '#333333'
        }
    },
    color: { status: 'NA', reason: 'Typography' },
    border: { status: 'NA', reason: 'Text' },
    spacing: {
        padding: { top: '0', right: '0', bottom: '0', left: '0' },
        margin: { top: '0', right: '0', bottom: '16px', left: '0' },
        gap: '0'
    },
    size: { width: '100%' },
    layout: { display: 'block' },
    effects: { status: 'NA', reason: 'Email' },
    media: { status: 'NA', reason: 'Text' },
    interaction: { enabled: false },
    linking: { status: 'NA', reason: 'Text inline' },
    data_binding: { status: 'ENABLED', merge_tags: true },
    tracking: { status: 'NA', reason: 'Text' },
    accessibility: { role: 'article' },
    constraints: { email_safe: true, allowed_fonts: ['arial', 'verdana', 'georgia', 'times'] }
};
