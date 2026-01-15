export const SCHEMA = {
    // Identity
    meta: {
        atom_kind: 'cta_button',
        version: '1.0.0'
    },

    // 1. Content (Label)
    content: {
        text: {
            content: 'Click me', // default
            placeholder: 'Button text',
        },
        // NA fields
        bindings: { status: 'NA', reason: 'Basic CTA' },
        merge_tags: { status: 'NA', reason: 'Basic CTA' },
        conditional: { status: 'NA', reason: 'Basic CTA' }
    },

    // 2. Typography
    typography: {
        base: {
            family_preset: 'roboto_flex',
            size: '16px',
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
            line_height: '1.2',
            text_align: 'center',
            text_decoration: 'none',
            
        },
        mobile: {},
        desktop: {}
    },

    // 3. Color
    color: {
        background: '#000000',
        text: '#FFFFFF',
        border: 'transparent',
        // Optional extensions
        hover_background: '#333333',
        hover_text: '#FFFFFF'
    },

    // 4. Border
    border: {
        width: '0px',
        radius: '4px',
        style: 'solid',
        color: 'transparent'
    },

    // 5. Spacing
    spacing: {
        padding: { top: '12px', right: '24px', bottom: '12px', left: '24px' },
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        gap: '8px' // icon gap
    },

    // 6. Size
    size: {
        width: 'auto',
        height: 'auto',
        min_width: '0px',
        max_width: '100%'
    },

    // 7. Layout (Flex participation)
    layout: {
        display: 'inline-flex',
        align_self: 'auto',
        justify_content: 'center'
    },

    // 8. Effects
    effects: {
        opacity: 1,
        shadow: 'none'
    },

    // 9. Media (Icon support optional, but NA for core MVP if no assets)
    // Marking NA for now to be strict, or we could add icon support
    media: {
        status: 'NA',
        reason: 'Icon slot handled via children or separate atom for now'
    },

    // 10. Interaction
    interaction: {
        enabled: true,
        cursor: 'pointer',
        states: {
            hover: {},
            pressed: {},
            focus: {}
        }
    },

    // 11. Linking
    linking: {
        mode: 'href', // or 'action'
        href: '#',
        target: '_self',
        rel: 'noopener',
        action_type: 'navigate',
        action_payload: {}
    },

    // 12. Data Binding
    data_binding: {
        status: 'ENABLED',
        source: undefined,
        expr: undefined,
        fallback: undefined
    },

    // 13. Tracking
    tracking: {
        analytics_event_name: 'cta_click',
        conversion_goal_id: '',
        experiment_id: '',
        impression_event: false,
        click_event: true,
        utm_defaults: {}
    },

    // 14. Accessibility
    accessibility: {
        role: 'button',
        label: 'Click me', // defaults to content.text.content usually
        tab_index: 0,
        keyboard_nav: true
    },

    // 15. Constraints
    constraints: {
        allowed_edits: ['content', 'typography', 'color', 'border', 'spacing', 'linking'],
        email_safe: true
    }
};
