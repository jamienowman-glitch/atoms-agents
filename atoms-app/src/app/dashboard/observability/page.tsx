"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ObservabilityConfig() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans">
            <div className="w-full max-w-5xl min-h-[70vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 flex flex-col relative">

                {/* Header */}
                <div className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">OBSERVABILITY</h1>
                        <p className="font-bold text-lg tracking-[0.2em] uppercase text-neutral-500">EVENT SPINE CONFIG</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="font-bold uppercase tracking-widest hover:text-blue-600"
                    >
                        ← Back
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-8">

                    {/* Section 1: Visibility Rules */}
                    <div className="border-2 border-black p-6 bg-neutral-50">
                         <h2 className="text-2xl font-black uppercase mb-4">VISIBILITY RULES</h2>
                         <p className="font-mono text-sm mb-4 text-neutral-600">Configure default visibility for SaaS/Enterprise modes.</p>

                         <div className="grid gap-4">
                             <div className="flex items-center justify-between p-4 bg-white border-2 border-black hover:bg-neutral-100 cursor-pointer transition-colors">
                                 <span className="font-bold uppercase tracking-wider">SaaS Mode: Hide Providers</span>
                                 <div className="w-4 h-4 bg-green-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                             </div>
                             <div className="flex items-center justify-between p-4 bg-white border-2 border-black hover:bg-neutral-100 cursor-pointer transition-colors">
                                 <span className="font-bold uppercase tracking-wider">PII Rehydration (Tenant UI)</span>
                                 <div className="w-4 h-4 bg-green-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                             </div>
                         </div>
                    </div>

                    {/* Section 2: Retention */}
                    <div className="border-2 border-black p-6 bg-neutral-50">
                         <h2 className="text-2xl font-black uppercase mb-4">RETENTION POLICIES</h2>
                         <div className="font-mono text-sm space-y-2">
                             <div className="flex justify-between border-b border-black/10 pb-2">
                                 <span>SAAS_DEFAULT</span>
                                 <span className="font-bold">12 MONTHS</span>
                             </div>
                             <div className="flex justify-between border-b border-black/10 pb-2">
                                 <span>ENTERPRISE_DEFAULT</span>
                                 <span className="font-bold">24 MONTHS</span>
                             </div>
                             <div className="flex justify-between pt-2">
                                 <span>SYSTEM_DEFAULT</span>
                                 <span className="font-bold">36 MONTHS</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
