export const SCHEMA = {
    meta: {
        atom_kind: 'columns_grid',
        version: '1.0.0'
    },
    content: { status: 'NA', reason: 'Layout only' },
    typography: { status: 'NA', reason: 'Layout only' },
    color: { background: 'transparent', border: 'transparent', text: 'inherit' },
    border: { width: '0px', radius: '0px', style: 'none', color: 'transparent' },
    spacing: {
        padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        gap: '20px'
    },
    size: { width: '100%', height: 'auto' },
    layout: {
        display: 'grid',
        grid_template_columns: '1fr 1fr', // Two columns default
        align_items: 'start',
        stack_on_mobile: true
    },
    effects: { opacity: 1 },
    media: { status: 'NA', reason: 'Layout' },
    interaction: { enabled: false },
    linking: { status: 'NA', reason: 'Layout' },
    data_binding: { status: 'ENABLED' },
    tracking: { status: 'NA', reason: 'Layout' },
    accessibility: { role: 'group', label: 'Columns' },
    constraints: { allowed_children: ['rich_text_block', 'image_with_text', 'video_block', 'cta_button'], allowed_edits: ['layout', 'spacing'] }
};
