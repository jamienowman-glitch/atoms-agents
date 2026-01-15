export const SCHEMA = {
    meta: {
        atom_kind: 'video_block',
        version: '1.0.0'
    },
    content: { status: 'NA', reason: 'Using media group' },
    typography: { status: 'NA', reason: 'Video' },
    color: { status: 'NA', reason: 'Video' },
    border: { width: '0px', radius: '8px' },
    spacing: {
        padding: { top: '0', right: '0', bottom: '0', left: '0' },
        margin: { top: '0', right: '0', bottom: '20px', left: '0' },
        gap: '0'
    },
    size: { width: '100%', aspect_ratio: '16/9' },
    layout: { display: 'block' },
    effects: { shadow: '0 4px 12px rgba(0,0,0,0.1)' },
    media: {
        kind: 'video',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        poster: '',
        controls: true,
        autoplay: false,
        loop: false
    },
    interaction: { enabled: true },
    linking: { status: 'NA', reason: 'Video controls' },
    data_binding: { status: 'ENABLED' },
    tracking: { analytics_event_name: 'video_play' },
    accessibility: { role: 'application', label: 'Video Player' },
    constraints: { allowed_edits: ['media', 'size', 'border'] }
};
