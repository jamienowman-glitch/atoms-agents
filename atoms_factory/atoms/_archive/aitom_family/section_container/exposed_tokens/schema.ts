export const SCHEMA = {
    meta: {
        atom_kind: 'section_container',
        version: '1.0.0'
    },
    // Required Groups
    content: { status: 'NA', reason: 'Layout only' },
    typography: { status: 'NA', reason: 'Layout only' },
    color: {
        background: 'transparent',
        text: 'inherit', // inherited by children
        border: 'transparent'
    },
    border: { width: '0px', radius: '0px', style: 'none', color: 'transparent' },
    spacing: {
        padding: { top: '40px', right: '20px', bottom: '40px', left: '20px' },
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        gap: '20px'
    },
    size: {
        width: '100%',
        height: 'auto',
        max_width: '1200px'
    },
    layout: {
        display: 'flex',
        flex_direction: 'column',
        align_items: 'stretch',
        justify_content: 'flex-start'
    },
    effects: { opacity: 1, shadow: 'none' },
    media: { status: 'NA', reason: 'Layout only' },
    interaction: { enabled: false },
    linking: { status: 'NA', reason: 'Container' },
    data_binding: { status: 'ENABLED' }, // Can bind visibility
    tracking: { status: 'NA', reason: 'Container' }, // Usually contents are tracked
    accessibility: { role: 'region', label: 'Section' },
    constraints: { allowed_children: ['columns_grid', 'rich_text_block', 'hero_image_banner', 'image_with_text'], allowed_edits: ['spacing', 'color'] }
};
