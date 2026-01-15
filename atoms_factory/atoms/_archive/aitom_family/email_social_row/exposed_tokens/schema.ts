export const SCHEMA = {
    meta: {
        atom_kind: 'email_social_row',
        version: '1.0.0'
    },
    content: {
        networks: [
            { id: 'fb', icon: 'https://via.placeholder.com/24', url: '#' },
            { id: 'tw', icon: 'https://via.placeholder.com/24', url: '#' },
            { id: 'ig', icon: 'https://via.placeholder.com/24', url: '#' }
        ]
    },
    typography: { status: 'NA', reason: 'Icons' },
    color: { status: 'NA', reason: 'Icons' },
    border: { status: 'NA', reason: 'Icons' },
    spacing: {
        padding: { top: '20px', right: '0', bottom: '20px', left: '0' },
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        gap: '12px'
    },
    size: { icon_size: '24px',
            weight: 400,
            slant: 0,
            width: 100,
            letter_spacing: '0px',
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            }, },
    layout: { display: 'flex', justify: 'center' },
    effects: { status: 'NA', reason: 'Email' },
    media: { status: 'NA', reason: 'Using content' },
    interaction: { enabled: true },
    linking: { status: 'NA', reason: 'Per icon' },
    data_binding: { status: 'ENABLED' },
    tracking: { analytics_event_name: 'social_click' },
    accessibility: { role: 'group', label: 'Social Links' },
    constraints: { email_safe: true }
};
