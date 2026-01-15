import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:8020';

function App() {
    const [assets, setAssets] = useState([]);
    // Timeline State: List of clips
    const [timelineClips, setTimelineClips] = useState([]); // Array of { id: uuid, assetId: str, start: 0, end: 5000, props: {...} }
    const [transitions, setTransitions] = useState([]); // Array of { fromIndex: 0, type: 'crossfade', duration: 500 }

    const [selectedClipIndex, setSelectedClipIndex] = useState(null); // Which clip on timeline is selected

    const [rendering, setRendering] = useState(false);
    const [renderUrl, setRenderUrl] = useState(null);
    const [status, setStatus] = useState('Idle');
    const [profile, setProfile] = useState('social_4_3_h264');
    const [projectId, setProjectId] = useState(null);

    useEffect(() => {
        fetchAssets();
    }, []);

    // Auto-Render Effect
    useEffect(() => {
        if (timelineClips.length === 0) return;

        // Debounce 1s
        const timer = setTimeout(() => {
            triggerAutoRender();
        }, 1000);

        return () => clearTimeout(timer);
    }, [timelineClips, transitions, profile]);

    const fetchAssets = async () => {
        try {
            const res = await fetch(`${API_BASE}/assets`);
            if (res.ok) {
                const data = await res.json();
                setAssets(data);
            }
        } catch (e) {
            console.error("Failed to fetch assets", e);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setStatus('Uploading...');
        try {
            const res = await fetch(`${API_BASE}/assets`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                await fetchAssets();
                setStatus('Uploaded');
            } else {
                const err = await res.text();
                setStatus('Error: ' + err);
                alert('Upload failed: ' + err);
            }
        } catch (e) {
            setStatus('Upload Error');
            console.error(e);
            alert('Upload Exception: ' + e.message);
        }
    };

    const handleDragStart = (e, assetId) => {
        e.dataTransfer.setData("assetId", assetId);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Allow drop
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const assetId = e.dataTransfer.getData("assetId");
        if (assetId) {
            // Append new clip
            const asset = assets.find(a => a.id === assetId);
            const defaultDuration = 5000; // Mock default

            const newClip = {
                id: Math.random().toString(36).substr(2, 9),
                assetId: assetId,
                assetName: asset ? asset.filename : 'Video',
                start: 0,
                end: defaultDuration,
                props: {
                    opacity: 1.0,
                    volume: 1.0,
                    speed: 1.0,
                    activeFilter: null
                }
            };

            const newClips = [...timelineClips, newClip];
            setTimelineClips(newClips);
            setSelectedClipIndex(newClips.length - 1);
        }
    };

    const updateSelectedClipProps = (newProps) => {
        if (selectedClipIndex === null) return;
        const newClips = [...timelineClips];
        newClips[selectedClipIndex].props = { ...newClips[selectedClipIndex].props, ...newProps };
        setTimelineClips(newClips);
    };

    const addTransition = (index, type) => {
        // Check if transition already exists at this index
        const existing = transitions.find(t => t.fromIndex === index);
        let newTrans = [...transitions];
        if (existing) {
            existing.type = type; // Update
        } else {
            newTrans.push({ fromIndex: index, type: type, duration: 1000 });
        }
        setTransitions(newTrans);
    };


    const triggerAutoRender = async () => {
        if (timelineClips.length === 0) return;

        setStatus('Syncing...');
        setRendering(true);

        try {
            // Build clips payload
            const apiClips = timelineClips.map(c => {
                const p = c.props;
                const filters = [];
                if (p.activeFilter === 'bw') filters.push({ type: 'color_grade', params: { saturation: 0.0 } });
                else if (p.activeFilter === 'warm') filters.push({ type: 'color_grade', params: { hue: 0.1, saturation: 1.2 } });
                else if (p.activeFilter === 'cool') filters.push({ type: 'color_grade', params: { hue: -0.1, saturation: 1.1 } });

                return {
                    asset_id: c.assetId,
                    start_ms: c.start,
                    end_ms: c.end,
                    track: 'primary',
                    opacity: parseFloat(p.opacity),
                    volume: parseFloat(p.volume),
                    speed: parseFloat(p.speed),
                    filters: filters
                };
            });

            const apiTrans = transitions.map(t => ({
                type: t.type,
                duration_ms: t.duration,
                from_index: t.fromIndex
            }));

            // 1. Create/Update Timeline
            const tlRes = await fetch(`${API_BASE}/timeline/simple`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clips: apiClips,
                    transitions: apiTrans,
                    aspect_profile: profile
                })
            });

            if (!tlRes.ok) throw new Error("Timeline creation failed");
            const tlData = await tlRes.json();
            const newPid = tlData.project_id;
            setProjectId(newPid);

            // 2. Render
            setStatus('Rendering...');
            const rRes = await fetch(`${API_BASE}/render/simple`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: newPid,
                    profile: profile
                })
            });

            if (!rRes.ok) throw new Error("Render failed");
            const rData = await rRes.json();

            const pathParts = rData.output_path.split('/');
            const filename = pathParts[pathParts.length - 1];

            setRenderUrl(`${API_BASE}/renders/${filename}?t=${Date.now()}`);
            setStatus('Idle');

        } catch (e) {
            console.error(e);
            setStatus('Error: ' + e.message);
        } finally {
            setRendering(false);
        }
    };

    const selectedClip = selectedClipIndex !== null ? timelineClips[selectedClipIndex] : null;

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <div className="logo">CapCut-lite</div>
                <div className="status">{status}</div>
            </header>

            <div className="main-area">
                {/* Left Sidebar */}
                <aside className="sidebar">
                    <div className="section">
                        <h3>Assets</h3>
                        <div className="upload-box">
                            <input type="file" id="file-upload" className="hidden" onChange={handleUpload} />
                            <label htmlFor="file-upload" className="upload-btn">+ Upload</label>
                        </div>
                        <div className="asset-list">
                            {assets.map(a => (
                                <div
                                    key={a.id}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, a.id)}
                                    className="asset-item"
                                >
                                    <div className="asset-icon">VIDEO</div>
                                    <div className="asset-name" title={a.filename}>{a.filename || a.id}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h3>Global Settings</h3>
                        <select value={profile} onChange={e => setProfile(e.target.value)}>
                            <option value="social_4_3_h264">Social 4:3</option>
                            <option value="social_1_1_h264">Social 1:1 (SD)</option>
                            <option value="youtube_16_9">YouTube 16:9</option>
                        </select>
                    </div>
                </aside>

                {/* Center Preview */}
                <main className="preview-area">
                    <div className="player-frame">
                        {rendering && (
                            <div className="spinner-overlay">
                                <div className="spinner"></div><div>Rendering...</div>
                            </div>
                        )}
                        {renderUrl ? (
                            <video src={renderUrl} controls loop autoPlay className="video-player" />
                        ) : (
                            <div className="placeholder">Drag assets to timeline</div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar - Inspector */}
                <aside className="inspector">
                    <div className="section">
                        <h3>Inspector</h3>
                        {selectedClip ? (
                            <>
                                <div className="control-group">
                                    <label>Clip: {selectedClip.assetName}</label>
                                </div>
                                <div className="control-group">
                                    <label>Opacity: {(selectedClip.props.opacity * 100).toFixed(0)}%</label>
                                    <input type="range" min="0" max="1" step="0.1"
                                        value={selectedClip.props.opacity}
                                        onChange={e => updateSelectedClipProps({ opacity: e.target.value })}
                                    />
                                </div>
                                <div className="control-group">
                                    <label>Volume: {(selectedClip.props.volume * 100).toFixed(0)}%</label>
                                    <input type="range" min="0" max="1" step="0.1"
                                        value={selectedClip.props.volume}
                                        onChange={e => updateSelectedClipProps({ volume: e.target.value })}
                                    />
                                </div>
                                <div className="control-group">
                                    <label>Speed: {selectedClip.props.speed}x</label>
                                    <input
                                        type="range" min="0.5" max="3" step="0.5"
                                        value={selectedClip.props.speed}
                                        onChange={e => updateSelectedClipProps({ speed: e.target.value })}
                                    />
                                </div>

                                <div className="control-group">
                                    <label>Filters</label>
                                    <div className="filter-buttons">
                                        <button className={selectedClip.props.activeFilter === null ? 'active' : ''} onClick={() => updateSelectedClipProps({ activeFilter: null })}>None</button>
                                        <button className={selectedClip.props.activeFilter === 'bw' ? 'active' : ''} onClick={() => updateSelectedClipProps({ activeFilter: 'bw' })}>B&W</button>
                                        <button className={selectedClip.props.activeFilter === 'warm' ? 'active' : ''} onClick={() => updateSelectedClipProps({ activeFilter: 'warm' })}>Warm</button>
                                        <button className={selectedClip.props.activeFilter === 'cool' ? 'active' : ''} onClick={() => updateSelectedClipProps({ activeFilter: 'cool' })}>Cool</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="empty-msg">Select a clip</div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Multi-Clip Operations Timeline */}
            <div className="timeline-area">
                <div className="timeline-header">Timeline</div>
                <div className="track-container" onDragOver={handleDragOver} onDrop={handleDrop}>
                    <div className="track flex-track">
                        {timelineClips.length === 0 ? (
                            <div className="empty-track-msg">Drag assets here</div>
                        ) : (
                            timelineClips.map((clip, idx) => (
                                <div key={clip.id} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div
                                        className={`clip-block ${selectedClipIndex === idx ? 'selected' : ''}`}
                                        onClick={() => setSelectedClipIndex(idx)}
                                    >
                                        {clip.assetName}
                                    </div>

                                    {/* Transition Button (between clips) */}
                                    {idx < timelineClips.length - 1 && (
                                        <div className="transition-slot">
                                            <button
                                                className="trans-btn"
                                                onClick={() => addTransition(idx, 'crossfade')}
                                                title="Add Crossfade"
                                            >
                                                {transitions.find(t => t.fromIndex === idx) ? '⋈' : '+'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// MinimalDraggable Clip
function TimelineClip({ start, end, onChange }) {
    // Assume rigid 10s total timeline width for demo simplicity
    // 0ms = 0%, 10000ms = 100%
    const MAX_DUR = 10000;

    const toPct = (ms) => Math.min(100, Math.max(0, (ms / MAX_DUR) * 100));

    const handleDrag = (type, e) => {
        e.preventDefault();
        const startX = e.clientX;
        const initialStart = start;
        const initialEnd = end;

        const onMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            // Convert px to ms. Assume track width ~ 100vw - sidebar. 
            // Simplified: Assume 1px = 10ms (roughly) for smoother feel? 
            // Or getting actual width is better.
            // Let's use % logic based on window width approx or just rigid px-to-ms scaling.
            const msDelta = deltaX * 20; // Sensitivity 

            let newStart = initialStart;
            let newEnd = initialEnd;

            if (type === 'left') {
                newStart = Math.min(newEnd - 500, Math.max(0, initialStart + msDelta));
            } else if (type === 'right') {
                newEnd = Math.max(newStart + 500, Math.min(MAX_DUR, initialEnd + msDelta));
            } else if (type === 'block') {
                const duration = initialEnd - initialStart;
                newStart = Math.max(0, initialStart + msDelta);
                newEnd = newStart + duration;
                if (newEnd > MAX_DUR) {
                    newEnd = MAX_DUR;
                    newStart = newEnd - duration;
                }
            }
            onChange(parseInt(newStart), parseInt(newEnd));
        };

        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    return (
        <div
            className="clip"
            style={{
                left: `${toPct(start)}%`,
                width: `${toPct(end - start)}%`
            }}
            onMouseDown={(e) => handleDrag('block', e)}
        >
            <div className="handle left" onMouseDown={(e) => { e.stopPropagation(); handleDrag('left', e); }} />
            <div className="label">Clip 1</div>
            <div className="handle right" onMouseDown={(e) => { e.stopPropagation(); handleDrag('right', e); }} />
        </div>
    );
}

export default App;
