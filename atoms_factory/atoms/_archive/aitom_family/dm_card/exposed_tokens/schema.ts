export const SCHEMA = {
    meta: {
        atom_kind: 'dm_card',
        version: '1.0.0'
    },
    content: {
        title: 'Order Update',
        subtitle: 'Your package has shipped!',
        image: 'https://via.placeholder.com/400x200',
        buttons: [
            { label: 'Track Package', action: 'track' },
            { label: 'View Receipt', action: 'view' }
        ]
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
            slant: 0, },
        subtitle: { size: '14px', weight: 400,
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
    color: { background: '#ffffff', border: '#e0e0e0' },
    border: { width: '1px', radius: '12px', style: 'solid', color: 'current_color' },
    spacing: {
        padding: { top: '0', right: '0', bottom: '0', left: '0' }, // Inner padding handled by layout
        margin: { top: '8px', right: '0', bottom: '8px', left: '0' },
        gap: '8px'
    },
    size: { width: '280px' },
    layout: { display: 'flex', flex_direction: 'column' },
    effects: { shadow: '0 2px 8px rgba(0,0,0,0.1)' },
    media: { status: 'NA', reason: 'In content' },
    interaction: { enabled: true },
    linking: { status: 'NA', reason: 'Buttons' },
    data_binding: { status: 'ENABLED' },
    tracking: { analytics_event_name: 'card_view' },
    accessibility: { role: 'article' },
    constraints: { mobile_optimized: true }
};
