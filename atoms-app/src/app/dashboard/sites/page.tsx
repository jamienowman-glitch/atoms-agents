"use client";

import React, { useState } from 'react';

export default function SitesPage() {
    const [sitePath, setSitePath] = useState('/Users/jaynowman/sites/atoms-fam');
    const [subPath, setSubPath] = useState('SITEMAP_DRAFT.md');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<string>('Ready');
    const [isLoading, setIsLoading] = useState(false);

    // Helper to construct full path for the API
    const getFullPath = () => {
        // Basic join logic, handling slash redundancy
        const root = sitePath.replace(/\/$/, '');
        const sub = subPath.replace(/^\//, '');
        return `${root}/${sub}`;
    };

    const handleLoad = async () => {
        setIsLoading(true);
        setStatus('Loading...');
        try {
            const fullPath = getFullPath();
            const res = await fetch(`/api/bridge/content`, {
                method: 'GET',
                headers: {
                    'x-atoms-path': fullPath,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to load file');
            }

            const data = await res.json();
            setContent(data.content);
            setStatus(`Loaded: ${fullPath}`);
        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setStatus('Saving...');
        try {
            const fullPath = getFullPath();
            const res = await fetch(`/api/bridge/content`, {
                method: 'POST',
                headers: {
                    'x-atoms-path': fullPath,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save file');
            }

            setStatus(`Saved: ${fullPath}`);
        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto font-sans">
            <h1 className="text-3xl font-bold mb-6 tracking-tight">UNIVERSAL SITE MANAGER</h1>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mb-6">
                <div className="space-y-4">
                    {/* Site Root Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Site Root (Must start with ~/sites/)
                        </label>
                        <input
                            type="text"
                            value={sitePath}
                            onChange={(e) => setSitePath(e.target.value)}
                            className="w-full bg-[#111] border border-gray-800 p-3 rounded text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Sub Path Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Relative File Path
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={subPath}
                                onChange={(e) => setSubPath(e.target.value)}
                                className="w-full bg-[#111] border border-gray-800 p-3 rounded text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button
                                onClick={handleLoad}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? '...' : 'LOAD'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Panel */}
                <div className="bg-[#111] border border-gray-800 p-4 rounded flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase text-gray-500 mb-2">Bridge Status</span>
                    <div className={`text-sm font-mono break-all ${status.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                        {status}
                    </div>
                </div>
            </div>

            {/* Editor Area */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                        File Content
                    </label>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        SAVE CHANGES
                    </button>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[600px] bg-[#0A0A0A] border border-gray-800 p-4 rounded font-mono text-sm text-gray-300 focus:outline-none focus:border-blue-500 resize-y"
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
