export interface Multi21Item {
    id: string;
    title: string;
    meta?: string;
    imageUrl?: string;
    videoUrl?: string;
    href?: string;
    badge?: string;
    price?: string;
    secondaryLink?: {
        href: string;
        label?: string;
    };
    variant?: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube' | 'events' | 'blogs';
}
