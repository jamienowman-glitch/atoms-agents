import React, { useState } from 'react';
import { useToolControl } from '../../../../context/ToolControlContext';
import { SEED_FEEDS } from '../../../../lib/data/seed-feeds';

// Types mapping for the UI
const CONTENT_TYPES = [
    { id: 'product', label: 'Product 🛍️', available: true },
    { id: 'video', label: 'Video 📺', available: true },
    { id: 'kpi', label: 'KPI 📊', available: true },
    { id: 'image', label: 'Image 🖼️', available: false }, // Placeholder
];

export const ContentConfigurationPanel = () => {
    const { useToolState } = useToolControl();

    // Bind to the feed source (Phase 10 output)
    // Note: The BottomControlsPanel uses feed_source_index usually, but here we might want string or index.
    // Let's check BottomPanel logic. It binds index to feed string. 
    // Ideally we update the feed string directly or the index if that's the master.
    // The previous implementation mapped index 0->Static, 1->Creative etc.
    // We want MORE flexibility now. Let's assume we can set a STRING ID if we update the registry?
    // Actually, let's stick to the existing "feedSource" prop on Multi21 which takes a string.
    // But the ToolRegistry might be binding an integer index. 
    // Let's use a specialized tool state or just use the callback if passed down?
    // Better: This component is inside BottomControlsPanel, maybe we pass a setFeedSource handler?
    // OR we use the registry 'content.feed_source_index' and map our selection to it?
    // Problem: The index logic was generic (0=Static, 1=Creative, 2=Retail).
    // Now we want "Retail -> Sneakers" or "Retail -> Summer".
    // We should probably Upgrade the tool to support string IDs or just use a direct state lift relative to the parent?
    // Given the prompt: "Connect the output of this picker to updateTool('content.feed_source', selectedFeedId)."
    // This implies a new tool key 'content.feed_source' that accepts a STRING.

    const [activeFeedId, setActiveFeedId] = useToolState<string>({
        target: { surfaceId: 'multi21.designer', toolId: 'content.feed_source' },
        defaultValue: 'retail'
    });

    const [selectedType, setSelectedType] = useState<string>('product');
    const [mode, setMode] = useState<'upload' | 'feed'>('feed');

    // Get available feeds for the selected type
    // We scan SEED_FEEDS keys. 
    // In seed-feeds.ts we exported SEED_FEEDS = { 'retail': [...], 'news': [...] }
    // We need to know which feed key belongs to which "Type".
    // For now, based on the seed data:
    // retail -> Product
    // creative -> Image/Creative
    // news -> News (Text?)
    // youtube -> Video
    // kpi -> kpi

    const getFeedsForType = (type: string) => {
        const feeds = [];
        if (type === 'product') {
            feeds.push({ id: 'retail', label: 'Retail (Sneakers)' });
            // Add mocks for more options
            feeds.push({ id: 'retail_summer', label: 'Summer Sale (Mock)' });
        } else if (type === 'video') {
            feeds.push({ id: 'youtube', label: 'YouTube Grid' });
        } else if (type === 'kpi') {
            feeds.push({ id: 'kpi', label: 'Q4 Performance' });
        } else if (type === 'image') {
            feeds.push({ id: 'creative', label: 'Creative Assets' });
        }
        return feeds;
    };

    const availableFeeds = getFeedsForType(selectedType);

    return (
        <div className="flex flex-col gap-4 w-full h-full text-sm">
            {/* Level 1: Type Selection */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Content Type</span>
                <div className="flex gap-1">
                    {CONTENT_TYPES.map(type => (
                        <button
                            key={type.id}
                            disabled={!type.available}
                            onClick={() => setSelectedType(type.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedType === type.id
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                } ${!type.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Level 2: Mode Switch */}
            <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-fit self-center">
                <button
                    onClick={() => setMode('upload')}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'upload'
                        ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-700'
                        }`}
                >
                    Manual Upload
                </button>
                <button
                    onClick={() => setMode('feed')}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'feed'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-700'
                        }`}
                >
                    Live Feed
                </button>
            </div>

            {/* Level 3: Feed Selection */}
            {mode === 'feed' ? (
                <div className="flex flex-col gap-2 animate-fadeIn">
                    <span className="text-xs font-medium text-neutral-500 ml-1">Select Feed Source</span>
                    <div className="grid grid-cols-2 gap-2">
                        {availableFeeds.map(feed => (
                            <button
                                key={feed.id}
                                onClick={() => {
                                    // Only trigger if valid in seed
                                    if (SEED_FEEDS[feed.id as keyof typeof SEED_FEEDS] || feed.id === 'retail_summer') {
                                        // For mock 'retail_summer', we fallback to retail for now or handle logic?
                                        // Phase 9.5 added seed support. 
                                        // If we pass 'retail_summer' and it's not in SEED_FEEDS, Multi21 handles it gracefully (returns slice of existing?)
                                        // Let's just pass real IDs for now.
                                        const actualId = feed.id === 'retail_summer' ? 'retail' : feed.id;
                                        setActiveFeedId(actualId);
                                    }
                                }}
                                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${activeFeedId === (feed.id === 'retail_summer' ? 'retail' : feed.id)
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                                    }`}
                            >
                                <span className="font-medium">{feed.label}</span>
                                {activeFeedId === (feed.id === 'retail_summer' ? 'retail' : feed.id) && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                            </button>
                        ))}
                        {availableFeeds.length === 0 && (
                            <div className="col-span-2 p-4 text-center text-neutral-400 text-xs italic border border-dashed border-neutral-200 rounded-xl">
                                No feeds available for this type.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-400 gap-2">
                    <svg className="w-6 h-6 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <span className="text-xs">Drag and drop files here</span>
                </div>
            )}
        </div>
    );
};
