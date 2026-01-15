export const SCHEMA = {
    meta: {
        atom_kind: 'dm_message_text',
        version: '1.0.0'
    },
    content: {
        text: 'Hello, how can I help you today?',
        sender: 'bot' // or 'user'
    },
    typography: {
        base: {
            family_preset: 'system',
            size: '15px',
            weight: 400,
            slant: 0,
            width: 100,
            letter_spacing: '0px',
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            line_height: '1.4',
            color: '#000000'
        }
    },
    color: {
        background: '#e0e0e0', // bot bg
        user_background: '#0084ff',
        user_text: '#ffffff'
    },
    border: { radius: '18px' },
    spacing: {
        padding: { top: '10px', right: '16px', bottom: '10px', left: '16px' },
        margin: { top: '4px', right: '0', bottom: '4px', left: '0' },
        gap: '0'
    },
    size: { max_width: '75%' },
    layout: { display: 'flex' },
    effects: { status: 'NA', reason: 'Mobile UI' },
    media: { status: 'NA', reason: 'Text' },
    interaction: { enabled: false },
    linking: { status: 'NA', reason: 'Text' },
    data_binding: { status: 'ENABLED' },
    tracking: { status: 'NA', reason: 'Text' },
    accessibility: { role: 'log' },
    constraints: { mobile_optimized: true }
};
