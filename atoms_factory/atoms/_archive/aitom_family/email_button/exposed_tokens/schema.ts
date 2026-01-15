export const SCHEMA = {
    meta: {
        atom_kind: 'email_button',
        version: '1.0.0'
    },
    content: { label: 'Click Me' },
    typography: { family: 'arial', size: '16px',
            slant: 0,
            width: 100,
            letter_spacing: '0px',
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            }, weight: 'bold', color: '#ffffff' },
    color: { background: '#007bff' },
    border: { radius: '4px' },
    spacing: {
        padding: { top: '12px', right: '24px', bottom: '12px', left: '24px' },
        margin: { top: '0', right: '0', bottom: '20px', left: '0' },
        gap: '0'
    },
    size: { width: 'auto' },
    layout: { display: 'inline-block', align: 'center' },
    effects: { status: 'NA', reason: 'Email' },
    media: { status: 'NA', reason: 'Button' },
    interaction: { enabled: true },
    linking: { href: '#' },
    data_binding: { status: 'ENABLED' },
    tracking: { analytics_event_name: 'email_cta_click' },
    accessibility: { role: 'button' },
    constraints: { email_safe: true, vml_support: false }
};
