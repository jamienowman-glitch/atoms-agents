import { useMemo } from 'react';
import { Multi21Item } from '../types';
import { SEED_FEEDS, FeedItem } from '../../../../lib/data/seed-feeds'; // We need to move this lib!

// Temporary: Since we don't have the lib folder migrated yet, we'll inline a mock or need to migrate seed-feeds.
// To keep it clean, let's create a local mock if the file isn't there, or better, 
// let's assume the user wants me to migrate the seed-data too? 
// The prompt said "Lift good bits". Seed data is good bits.
// I will assume for now I should copy SEED_FEEDS logic here or import it if I move it.
// For now, I'll define types here to break dependency on old repo.

export interface FeedConfig {
    source: 'kpi' | 'retail' | 'news' | 'youtube' | 'events' | null;
    limit: number;
    initialItems: Multi21Item[];
}

// Mock Seed Data (To be replaced by real backend)
const MOCK_SEEDS: Record<string, any[]> = {
    news: [
        { id: 'n1', title: 'Global Launch', subtitle: '10:00 AM', image: 'https://picsum.photos/seed/n1/400/300' },
        { id: 'n2', title: 'Market Update', subtitle: '11:30 AM', image: 'https://picsum.photos/seed/n2/400/300' },
    ],
    kpi: [
        { id: 'k1', title: '24%', subtitle: 'Growth', badge: '+2.4%' },
        { id: 'k2', title: '890', subtitle: 'Active Users', badge: '+12%' },
    ],
    retail: [
        { id: 'p1', title: 'Pro Board', type: 'product', price: '$299', image: 'https://picsum.photos/seed/p1/400/300' },
    ],
    youtube: [],
    events: []
};


export function useFeedMapper({ source, limit, initialItems }: FeedConfig) {
    return useMemo(() => {
        if (!source || !MOCK_SEEDS[source]) {
            return initialItems.slice(0, limit);
        }

        const rawFeed = MOCK_SEEDS[source];
        const limitedFeed = rawFeed.slice(0, limit);

        return limitedFeed.map((item: any): Multi21Item => {
            // Polymorphic Mapping
            let mappedVariant: Multi21Item['variant'] = 'generic';

            if (item.type === 'product') mappedVariant = 'product';
            else if (item.type === 'video') mappedVariant = 'youtube';
            else if (source === 'kpi') mappedVariant = 'kpi';
            else if (source === 'events') mappedVariant = 'events';
            else if (source === 'news') mappedVariant = 'blogs';

            return {
                id: item.id,
                title: item.title,
                meta: item.subtitle,
                imageUrl: item.image,
                videoUrl: item.videoUrl,
                badge: item.badge,
                price: item.price,
                secondaryLink: item.cta ? { href: '#', label: item.cta } : undefined,
                variant: mappedVariant,
            };
        });
    }, [source, limit, initialItems]);
}
