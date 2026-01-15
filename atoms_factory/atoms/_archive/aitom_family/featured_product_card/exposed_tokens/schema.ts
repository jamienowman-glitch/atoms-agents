export const SCHEMA = {
    meta: {
        atom_kind: 'featured_product_card',
        version: '1.0.0'
    },
    content: {
        product: {
            title: 'Classic T-Shirt',
            price: '$29.99',
            image_src: 'https://via.placeholder.com/300x400'
        },
        button_label: 'Add to Cart'
    },
    typography: {
        title: { size: '18px', weight: 600,
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
        price: { size: '16px', weight: 400,
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
    color: {
        background: '#fff',
        border: '#eee'
    },
    border: { width: '1px', radius: '8px', style: 'solid', color: 'current_color' }, // uses color.border
    spacing: {
        padding: { top: '16px', right: '16px', bottom: '16px', left: '16px' },
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        gap: '12px'
    },
    size: { width: '100%', height: 'auto' },
    layout: {
        display: 'flex',
        flex_direction: 'column',
    },
    effects: { shadow: 'none', hover_shadow: '0 4px 12px rgba(0,0,0,0.1)' },
    media: { status: 'NA', reason: 'Product Image' },
    interaction: { enabled: true },
    linking: { href: '/products/classic-t-shirt' },
    data_binding: { status: 'ENABLED', source: 'shopify_product' },
    tracking: { analytics_event_name: 'product_click', conversion_goal_id: 'add_to_cart' },
    accessibility: { role: 'article', label: 'Product Card' },
    constraints: { allowed_edits: ['typography', 'color', 'border'] }
};
