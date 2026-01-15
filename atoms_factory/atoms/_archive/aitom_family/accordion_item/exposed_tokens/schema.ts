export const SCHEMA = {
    meta: {
        atom_kind: 'accordion_item',
        version: '1.0.0'
    },
    content: {
        title: 'Is this a migrated atom?',
        body: 'Yes, it has been manually updated to show that we can recover legacy functionality.'
    },
    typography: {
        title: { size: '16px', weight: 600,
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            letter_spacing: '0px',
            width: 100,
            slant: 0, color: '#000' },
        body: { size: '14px', weight: 400,
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            letter_spacing: '0px',
            width: 100,
            slant: 0, color: '#444', line_height: '1.5' }
    },
    color: {
        background: '#ffffff',
        border: '#dddddd',
        expanded_bg: '#f9f9f9'
    },
    border: { width: '1px', color: '#dddddd', radius: '4px' },
    spacing: {
        padding: { top: '16px', right: '16px', bottom: '16px', left: '16px' }
    },
    size: { width: '100%' },
    layout: { status: 'NA', reason: 'Internal' },
    effects: { status: 'NA', reason: 'Internal' },
    media: { status: 'NA', reason: 'Internal' },
    interaction: { open_by_default: false },
    linking: { status: 'NA' },
    data_binding: { status: 'ENABLED' },
    tracking: { analytics_event_name: 'accordion_open' },
    accessibility: { role: 'button' },
    constraints: { status: 'NA' }
};