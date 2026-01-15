export const SCHEMA = {
    meta: {
        atom_kind: 'email_image',
        version: '1.0.0'
    },
    content: {
        src: 'https://via.placeholder.com/600x200',
        alt: 'Header Image'
    },
    typography: { status: 'NA', reason: 'Image' },
    color: { status: 'NA', reason: 'Image' },
    border: { width: '0px', radius: '0px' },
    spacing: {
        padding: { top: '0', right: '0', bottom: '20px', left: '0' },
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        gap: '0'
    },
    size: { width: '100%', max_width: '600px', height: 'auto' },
    layout: { display: 'block', align: 'center' },
    effects: { status: 'NA', reason: 'Email' },
    media: { status: 'NA', reason: 'Using content' },
    interaction: { enabled: true },
    linking: { href: '#' },
    data_binding: { status: 'ENABLED' },
    tracking: { analytics_event_name: 'email_click' },
    accessibility: { role: 'img', label: 'Image' },
    constraints: { email_safe: true, max_width: '600px' }
};
