export const SCHEMA = {
    // Identity
    meta: {
        atom_kind: 'heading_block',
        version: '1.0.0'
    },

    // 1. Content (Text)
    content: {
        text: {
            content: 'Headline',
            placeholder: 'Enter headline',
            transform: 'none', // uppercase, lowercase, capitalize
            truncation: 'none'
        },
        bindings: { status: 'ENABLED' },
        merge_tags: { status: 'ENABLED' },
        conditional: { status: 'ENABLED' }
    },

    // 2. Typography
    typography: {
        base: {
            family_preset: 'roboto_flex',
            size: '32px',
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
            line_height: '1.2',
            text_align: 'left',
            text_decoration: 'none',
            
        },
        mobile: {
            size: '24px',
            slant: 0,
            width: 100,
            letter_spacing: '0px',
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            }, // responsive default
        },
        desktop: {}
    },

    // 3. Color
    color: {
        text: '#000000',
        background: 'transparent',
        border: 'transparent',
        // Gradients optional but NA for MVP default
        text_gradient: { status: 'NA', reason: 'MVP' }
    },

    // 4. Border (NA usually, but kept for strictness)
    border: {
        status: 'NA',
        reason: 'Headings traditionally do not have borders, handled by container'
    },

    // 5. Spacing
    spacing: {
        padding: { top: '0px', right: '0px', bottom: '16px', left: '0px' },
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        gap: '0px'
    },

    // 6. Size
    size: {
        width: '100%',
        height: 'auto'
    },

    // 7. Layout
    layout: {
        display: 'block',
        positioning: 'flow'
    },

    // 8. Effects
    effects: {
        opacity: 1,
        shadow: 'none'
    },

    // 9. Media (NA)
    media: {
        status: 'NA',
        reason: 'Text only'
    },

    // 10. Interaction (NA usually)
    interaction: {
        enabled: false,
        cursor: 'default',
        states: { status: 'NA', reason: 'Static text' }
    },

    // 11. Linking (Usually NA for headings, but can be linked)
    linking: {
        status: 'NA', // Enforcing section/link wrapper for entire blocks usually
        reason: 'Use Link Block or wrap in anchor'
    },

    // 12. Data Binding
    data_binding: {
        status: 'ENABLED',
        source: undefined,
        expr: undefined,
        fallback: 'Headline'
    },

    // 13. Tracking
    tracking: {
        status: 'NA',
        reason: 'Headings do not inherently track clicks'
    },

    // 14. Accessibility
    accessibility: {
        role: 'heading',
        level: 1, // h1-h6
        label: 'Headline',
        aria: {}
    },

    // 15. Constraints
    constraints: {
        allowed_edits: ['content', 'typography', 'color', 'spacing'],
        email_safe: true
    }
};
