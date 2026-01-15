export const SCHEMA = {
    meta: {
        atom_kind: 'section_hero_banner',
        version: '1.0.0'
    },
    content: {
        heading: 'Big Spring Sale',
        subheading: 'Up to 50% off everything.',
        cta_text: 'Shop Now',
        background_image: 'https://via.placeholder.com/1600x900'
    },
    typography: {
        heading: {
            size: '48px',
            weight: 800, // wght
            color: '#ffffff',
            slant: 0, // slnt
            width: 100, // wdth
            letter_spacing: '0px',
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            }
        },
        subheading: {
            size: '20px',
            weight: 400,
            color: '#f0f0f0',
            slant: 0,
            width: 100,
            letter_spacing: '0px',
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            }
        }
    },
    color: {
        overlay: 'rgba(0,0,0,0.4)',
        button_bg: '#ffffff',
        button_text: '#000000'
    },
    border: { status: 'NA', reason: 'Full width section' },
    spacing: {
        padding: { top: '100px', right: '20px', bottom: '100px', left: '20px' },
        margin: { status: 'NA', reason: 'Section' },
        gap: '24px'
    },
    size: { height: '600px', width: '100%' },
    layout: {
        align: 'center', // center, left, right
        justify: 'center'
    },
    effects: { status: 'NA', reason: 'Section' },
    media: { status: 'NA', reason: 'In content' },
    interaction: { enabled: true },
    linking: { cta_url: '#' },
    data_binding: { status: 'ENABLED' },
    tracking: { analytics_event_name: 'hero_click' },
    accessibility: { role: 'banner' },
    constraints: { allowed_blocks: [] }
};