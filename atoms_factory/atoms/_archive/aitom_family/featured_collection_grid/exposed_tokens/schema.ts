export const SCHEMA = {
    meta: {
        atom_kind: 'featured_collection_grid',
        version: '1.0.0'
    },
    content: {
        title: 'New Arrivals',
        collection_source: 'frontpage'
    },
    typography: {
        heading: { size: '32px', weight: 700,
            letter_spacing: '0px',
            width: 100,
            slant: 0,
            animation: {
                animation_mode: 'OFF',
                animation_style: 'BREATHE_IN'
            },
            letter_spacing: '0px',
            width: 100,
            slant: 0, align: 'center' }
    },
    color: { background: 'transparent' },
    border: { status: 'NA', reason: 'Layout' },
    spacing: {
        padding: { top: '40px', right: '20px', bottom: '40px', left: '20px' },
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        gap: '20px'
    },
    size: { width: '100%' },
    layout: {
        display: 'grid',
        grid_template_columns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
    },
    effects: { status: 'NA', reason: 'Layout' },
    media: { status: 'NA', reason: 'Layout' },
    interaction: { enabled: false },
    linking: { status: 'NA', reason: 'Layout' },
    data_binding: { status: 'ENABLED', source: 'shopify_collection' },
    tracking: { status: 'NA', reason: 'Layout' },
    accessibility: { role: 'feed', label: 'Collection' },
    constraints: { allowed_children: ['featured_product_card'] }
};
