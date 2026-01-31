import React, { useState, useEffect } from 'react';

export interface MultiTileBackProps {
    variant: 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube' | 'events' | 'blogs';
    onFlipBack: () => void;
    onUtmChange: (utm: { source: string; medium: string; campaign: string }) => void;
}

export const MultiTileBack: React.FC<MultiTileBackProps> = ({ variant, onFlipBack, onUtmChange }) => {
    const [activeTab, setActiveTab] = useState<'seo' | 'utm'>('seo');
    const [utmSource, setUtmSource] = useState('');
    const [utmMedium, setUtmMedium] = useState('');
    const [utmCampaign, setUtmCampaign] = useState('');
    const [keywords, setKeywords] = useState('');

    // Schema Defaults Logic
    const getSchemaType = () => {
        switch (variant) {
            case 'product': return 'Product';
            case 'video':
            case 'youtube': return 'VideoObject';
            case 'kpi': return 'Dataset';
            case 'text':
            case 'blogs': return 'Article';
            case 'events': return 'Event';
            default: return 'WebPage';
        }
    };

    const generateJsonLd = () => {
        const type = getSchemaType();
        const base = {
            "@context": "https://schema.org",
            "@type": type,
            "keywords": keywords || "dynamic, feed, react"
        };
        // Add variant specific fields for preview
        if (type === 'Product') {
            return JSON.stringify({ ...base, "name": "Dynamic Product", "offers": { "@type": "Offer", "price": "..." } }, null, 2);
        }
        if (type === 'VideoObject') {
            return JSON.stringify({ ...base, "name": "Video Content", "uploadDate": new Date().toISOString() }, null, 2);
        }
        return JSON.stringify(base, null, 2);
    };

    // Propagate UTM changes
    useEffect(() => {
        onUtmChange({ source: utmSource, medium: utmMedium, campaign: utmCampaign });
    }, [utmSource, utmMedium, utmCampaign, onUtmChange]);

    return (
        <div className="w-full h-full bg-[#111] text-gray-200 p-6 flex flex-col gap-6 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden relative font-mono text-sm leading-relaxed"
            style={{
                backfaceVisibility: 'hidden',
                // transform: 'rotateY(180deg)' // Removed rotation since we are swapping views now
            }}
        >
            {/* Header / Tabs */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('seo')}
                        className={`pb-2 px-1 transition-colors ${activeTab === 'seo' ? 'text-white border-b-2 border-blue-500 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        SEO Schema
                    </button>
                    <button
                        onClick={() => setActiveTab('utm')}
                        className={`pb-2 px-1 transition-colors ${activeTab === 'utm' ? 'text-white border-b-2 border-green-500 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        UTM Builder
                    </button>
                </div>
            </div>


            {/* Body */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'seo' && (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Active Schema Type</label>
                            <div className="flex items-center gap-2 text-blue-400 font-bold">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                {getSchemaType()}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Keywords (Meta)</label>
                            <textarea
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="Comma separated keywords..."
                                className="w-full bg-[#000] border border-gray-700 rounded p-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none h-20 placeholder:text-gray-700"
                            />
                        </div>

                        <div className="flex flex-col gap-1 flex-1 min-h-[100px]">
                            <label className="text-xs uppercase text-gray-500 font-semibold tracking-wide">JSON-LD Preview</label>
                            <div className="bg-[#000] border border-gray-700 rounded p-3 font-mono text-xs text-green-400/90 overflow-x-auto whitespace-pre h-full">
                                {generateJsonLd()}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'utm' && (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                        <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 text-xs text-gray-400 italic">
                            These parameters will be automatically appended to every link clicked within this block.
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Source (utm_source)</label>
                                <input
                                    type="text"
                                    value={utmSource}
                                    onChange={(e) => setUtmSource(e.target.value)}
                                    placeholder="e.g. newsletter, google"
                                    className="w-full bg-[#000] border border-gray-700 rounded p-2 text-white focus:border-green-500 focus:outline-none transition-colors placeholder:text-gray-700"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Medium (utm_medium)</label>
                                <input
                                    type="text"
                                    value={utmMedium}
                                    onChange={(e) => setUtmMedium(e.target.value)}
                                    placeholder="e.g. email, cpc"
                                    className="w-full bg-[#000] border border-gray-700 rounded p-2 text-white focus:border-green-500 focus:outline-none transition-colors placeholder:text-gray-700"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Campaign (utm_campaign)</label>
                                <input
                                    type="text"
                                    value={utmCampaign}
                                    onChange={(e) => setUtmCampaign(e.target.value)}
                                    placeholder="e.g. summer_sale"
                                    className="w-full bg-[#000] border border-gray-700 rounded p-2 text-white focus:border-green-500 focus:outline-none transition-colors placeholder:text-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="pt-4 border-t border-neutral-800 flex justify-end">
                <button
                    onClick={onFlipBack}
                    className="flex items-center gap-2 bg-neutral-100 hover:bg-white text-neutral-900 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-white/5 active:scale-95 transform duration-100"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 14l-4-4 4-4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></svg>
                    Done / Flip Back
                </button>
            </div>
        </div >
    );
};
