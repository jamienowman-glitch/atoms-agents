export const SCHEMA = {
    meta: {
        atom_kind: 'hero_image_banner',
        version: '1.0.0'
    },
    content: {
        text: {
            title: 'Welcome',
            subtitle: 'Start your journey',
            button_label: 'Shop Now'
        },
        image: {
            src: 'https://via.placeholder.com/1200x600',
            alt: 'Hero Banner'
        }
    },
    typography: {
        title: {
            family_preset: 'roboto_flex',
            size: '48px',
            weight: 700,
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
            
        },
        subtitle: {
            family_preset: 'roboto_flex',
            size: '20px',
            weight: 400,
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
        text: '#ffffff',
        background: '#000000',
        overlay_opacity: 0.3
    },
    border: { status: 'NA', reason: 'Hero' },
    spacing: {
        padding: { top: '80px', right: '40px', bottom: '80px', left: '40px' },
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        gap: '24px'
    },
    size: { width: '100%', height: '600px' },
    layout: {
        display: 'flex',
        flex_direction: 'column',
        align_items: 'center',
        justify_content: 'center'
    },
    effects: { status: 'NA', reason: 'Hero' },
    media: { status: 'NA', reason: 'Using content.image' },
    interaction: { enabled: true },
    linking: { href: '#' },
    data_binding: { status: 'ENABLED' },
    tracking: { analytics_event_name: 'hero_click', conversion_goal_id: 'view_hero' },
    accessibility: { role: 'banner', label: 'Hero' },
    constraints: { allowed_edits: ['content', 'color', 'spacing', 'typography'] }
};
