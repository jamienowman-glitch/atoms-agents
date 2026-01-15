import React, { useEffect, useState } from 'react';
import { FeedPicker } from '../../apps/workbench/src/components/FeedPicker'; // Assuming we link this component
// Note: In real setup, atoms might be decoupled from workbench src, 
// using an adapter pattern. For P0, we import directly or define interfaces.

interface Multi21Props {
    // These props come from the Engines/Token State
    feedMode: 'feed' | 'manual';
    sourceKind: string;
    feedId: string;

    gridColsMobile: number;
    gridColsDesktop: number;
    gridGapX: string;
    tileRadius: string;
    aspectRatio: string;

    // Callbacks
    onFeedChange: (feedId: string, kind: string) => void;
}

export const Multi21Block: React.FC<Multi21Props> = (props) => {
    const [items, setItems] = useState<any[]>([]);

    // Fetch Items & SSE
    useEffect(() => {
        if (props.feedMode === 'feed' && props.feedId) {
            // 1. Fetch Items (Mock for P0 UI if no real engine connected yet)
            fetch(`/feeds/${props.sourceKind}/${props.feedId}/items`)
                .then(res => res.json())
                .then(data => setItems(data))
                .catch(err => console.error("Failed to load items", err));

            // 2. SSE Subscription
            const evtSource = new EventSource(`/sse/feeds/${props.sourceKind}/${props.feedId}`);
            evtSource.onmessage = (e) => {
                const payload = JSON.parse(e.data);
                if (payload.type === 'feed.updated') {
                    // Refresh items
                    fetch(`/feeds/${props.sourceKind}/${props.feedId}/items`)
                        .then(res => res.json())
                        .then(data => setItems(data));
                }
            };
            return () => evtSource.close();
        }
    }, [props.feedId, props.sourceKind, props.feedMode]);

    return (
        <div className="multi21-block">
            {/* Feed Selector (Edit Mode Only) */}
            <div className="feed-controls">
                <FeedPicker
                    selectedFeedId={props.feedId}
                    onChange={props.onFeedChange}
                />
            </div>

            {/* Grid Renderer */}
            <div
                className="grid-container"
                style={{
                    display: 'grid',
                    // Responsive column logic usually handled via CSS media queries + CSS vars
                    gridTemplateColumns: `repeat(${props.gridColsDesktop}, 1fr)`,
                    gap: props.gridGapX,
                }}
            >
                {items.map((item: any) => (
                    <div
                        key={item.item_id}
                        className="tile"
                        style={{ aspectRatio: props.aspectRatio.replace(':', '/'), borderRadius: props.tileRadius }}
                    >
                        {item.image_url && <img src={item.image_url} alt={item.title} />}
                        <div className="tile-content">
                            <h3>{item.title}</h3>
                            {/* Tile variants logic here */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
