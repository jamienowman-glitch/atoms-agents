"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function TuningConfig() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans">
            <div className="w-full max-w-5xl min-h-[70vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 flex flex-col relative">

                {/* Header */}
                <div className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">TUNING</h1>
                        <p className="font-bold text-lg tracking-[0.2em] uppercase text-neutral-500">RLHF & FEEDBACK</p>
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

                    {/* Active Sessions */}
                    <div className="border-2 border-black p-6 bg-neutral-50">
                         <h2 className="text-2xl font-black uppercase mb-4">ACTIVE SESSIONS</h2>
                         <div className="bg-white border-2 border-black p-8 text-center">
                            <p className="font-mono text-neutral-400 uppercase">No active tuning sessions found.</p>
                         </div>
                    </div>

                    {/* Feedback Configuration */}
                    <div className="border-2 border-black p-6 bg-neutral-50">
                         <h2 className="text-2xl font-black uppercase mb-4">FEEDBACK CONFIG</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="p-4 border-2 border-black bg-white hover:bg-neutral-50 transition-colors cursor-pointer">
                                 <h3 className="font-bold uppercase mb-2">AUTO_INGEST</h3>
                                 <p className="text-xs font-mono text-neutral-500">Automatically ingest feedback from thumbs up/down.</p>
                                 <div className="mt-4 flex justify-end">
                                    <div className="w-4 h-4 bg-green-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                                 </div>
                             </div>
                             <div className="p-4 border-2 border-black bg-white hover:bg-neutral-50 transition-colors cursor-pointer">
                                 <h3 className="font-bold uppercase mb-2">HUMAN_REVIEW</h3>
                                 <p className="text-xs font-mono text-neutral-500">Require human sign-off before model update.</p>
                                 <div className="mt-4 flex justify-end">
                                    <div className="w-4 h-4 bg-red-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
