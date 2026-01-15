export const SCHEMA = {
    meta: {
        atom_kind: 'nav_bar',
        version: '1.0.0'
    },
    content: {
        links: [
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' }
        ]
    },
    typography: {
        base: {
            family_preset: 'roboto_flex',
            size: '14px',
            weight: 500,
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            
        }
    },
    color: {
        background: '#ffffff',
        text: '#000000',
        border: '#e5e5e5'
    },
    border: { width: '1px', style: 'solid', color: 'current_color' },
    spacing: {
        padding: { top: '16px', right: '20px', bottom: '16px', left: '20px' },
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        gap: '24px'
    },
    size: { width: '100%', height: 'auto' },
    layout: {
        display: 'flex',
        justify_content: 'space-between',
        align_items: 'center'
    },
    effects: { shadow: '0 2px 4px rgba(0,0,0,0.05)' },
    media: { logo_url: '' }, // Optional logo
    interaction: { enabled: true },
    linking: { status: 'NA', reason: 'Use content.links' },
    data_binding: { status: 'ENABLED' },
    tracking: { status: 'NA', reason: 'Nav' },
    accessibility: { role: 'navigation', label: 'Main Menu' },
    constraints: { allowed_edits: ['content', 'color', 'typography'] }
};
