export const SCHEMA = {
    meta: {
        atom_kind: 'rich_text_block',
        version: '1.0.0'
    },
    content: {
        html: '<p>Start typing...</p>'
    },
    typography: {
        base: {
            family_preset: 'roboto_flex',
            size: '16px',
            weight: 400,
            slant: 0,
            width: 100,
            letter_spacing: '0px',
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            line_height: '1.6',
            color: '#333'
        }
    },
    color: { status: 'NA', reason: 'Handled in typography' },
    border: { status: 'NA', reason: 'Text' },
    spacing: {
        padding: { top: '0', right: '0', bottom: '0', left: '0' },
        margin: { top: '0', right: '0', bottom: '16px', left: '0' },
        gap: '0'
    },
    size: { width: '100%', height: 'auto' },
    layout: { display: 'block' },
    effects: { status: 'NA', reason: 'Text' },
    media: { status: 'NA', reason: 'Text' },
    interaction: { enabled: false },
    linking: { status: 'NA', reason: 'Inline links' },
    data_binding: { status: 'ENABLED' },
    tracking: { status: 'NA', reason: 'Text' },
    accessibility: { role: 'article' },
    constraints: { allowed_edits: ['content', 'typography'] }
};
