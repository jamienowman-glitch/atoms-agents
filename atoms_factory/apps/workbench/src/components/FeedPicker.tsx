import React, { useEffect, useState } from 'react';

// Shared component, possibly should live in workbench/components but imported by Atom
// For P0, placing in workbench/components per plan.

interface FeedSummary {
    feed_id: string;
    name: string;
    source_kind: string;
}

interface FeedPickerProps {
    selectedFeedId: string;
    onChange: (feedId: string, kind: string) => void;
}

export const FeedPicker: React.FC<FeedPickerProps> = ({ selectedFeedId, onChange }) => {
    const [feeds, setFeeds] = useState<FeedSummary[]>([]);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        fetch('/feeds/summary')
            .then(res => res.json())
            .then(data => {
                // Flatten or use sources. For now flatten.
                // data.feeds is the list.
                setFeeds(data.feeds || []);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="feed-picker">
            <select
                value={selectedFeedId || ''}
                onChange={(e) => {
                    const fid = e.target.value;
                    const feed = feeds.find(f => f.feed_id === fid);
                    if (feed) onChange(fid, feed.source_kind);
                }}
            >
                <option value="">Select a Feed...</option>
                {feeds.map(f => (
                    <option key={f.feed_id} value={f.feed_id}>
                        {f.name} ({f.source_kind})
                    </option>
                ))}
            </select>
            <button onClick={() => setShowCreate(true)}>+ New Feed</button>

            {showCreate && (
                <div className="modal">
                    {/* Stub for Creation Modal */}
                    <h3>Create Feed</h3>
                    {/* ... Form Logic ... */}
                    <button onClick={() => setShowCreate(false)}>Close</button>
                </div>
            )}
        </div>
    );
};
