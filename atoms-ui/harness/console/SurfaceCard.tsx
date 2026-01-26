import React from 'react';
import { RegistryEntry } from '../registry/client';

export const SurfaceCard = ({ surface, onClick }: { surface: RegistryEntry; onClick: () => void }) => {
    // Default theme colors if not present in config
    const themeColor = surface.config?.theme?.primary || 'bg-neutral-800';

    return (
        <div
            onClick={onClick}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300"
        >
            {/* Background / Theme */}
            <div className={`absolute inset-0 bg-gradient-to-br from-neutral-900 to-black`}></div>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white`}></div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                    <div className="text-xs font-mono text-neutral-500 mb-2 uppercase tracking-widest">{surface.namespace}</div>
                    <h3 className="text-2xl font-light text-white tracking-tight">{surface.name}</h3>
                </div>

                <div className="flex justify-between items-end">
                    <p className="text-sm text-neutral-400 line-clamp-2 max-w-[80%]">{surface.summary}</p>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Status Indicator */}
            {surface.maturity && (
                <div className="absolute top-4 right-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${surface.maturity === 'production' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {surface.maturity}
                    </span>
                </div>
            )}
        </div>
    );
};
