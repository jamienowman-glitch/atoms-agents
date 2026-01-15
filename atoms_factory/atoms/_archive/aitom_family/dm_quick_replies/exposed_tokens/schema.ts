export const SCHEMA = {
    meta: {
        atom_kind: 'dm_quick_replies',
        version: '1.0.0'
    },
    content: {
        options: ['Yes', 'No', 'Maybe']
    },
    typography: {
        base: { size: '14px', weight: 600,
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            letter_spacing: '0px',
            width: 100,
            slant: 0, color: '#0084ff' }
    },
    color: {
        background: '#ffffff',
        border: '#0084ff',
        active_background: '#0084ff',
        active_text: '#ffffff'
    },
    border: { width: '1px', radius: '16px', style: 'solid', color: 'current_color' },
    spacing: {
        padding: { top: '8px', right: '16px', bottom: '8px', left: '16px' },
        margin: { top: '8px', right: '0', bottom: '8px', left: '0' },
        gap: '8px'
    },
    size: { width: 'auto' },
    layout: { display: 'flex', wrap: 'wrap' },
    effects: { status: 'NA', reason: 'Mobile' },
    media: { status: 'NA', reason: 'Text' },
    interaction: { enabled: true },
    linking: { status: 'NA', reason: 'Action' },
    data_binding: { status: 'ENABLED' },
    tracking: { analytics_event_name: 'quick_reply_click' },
    accessibility: { role: 'group' },
    constraints: { mobile_optimized: true }
};
