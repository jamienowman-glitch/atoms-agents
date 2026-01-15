export const SCHEMA = {
    meta: { atom_kind: 'divider', version: '1.0.0' },
    content: { status: 'NA', reason: 'Divider' },
    typography: { status: 'NA', reason: 'Divider' },
    color: { border: '#e5e5e5' },
    border: { width: '1px', style: 'solid', color: 'current_color' }, // color refers to token group above
    spacing: {
        padding: { top: '20px', right: '0px', bottom: '20px', left: '0px' },
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        gap: '0px'
    },
    size: { width: '100%', height: '1px' },
    layout: { display: 'block' },
    effects: { opacity: 1 },
    media: { status: 'NA', reason: 'Divider' },
    interaction: { enabled: false },
    linking: { status: 'NA', reason: 'Divider' },
    data_binding: { status: 'NA', reason: 'Divider' },
    tracking: { status: 'NA', reason: 'Divider' },
    accessibility: { role: 'separator' },
    constraints: { allowed_edits: ['spacing', 'color', 'border'] }
};
