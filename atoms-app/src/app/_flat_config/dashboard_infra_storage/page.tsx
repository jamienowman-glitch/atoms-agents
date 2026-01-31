"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StorageManager() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'checking' | 'active' | 'error'>('idle');

    // MOCKED STATUS for P0 - In real app, fetch from /api/infra/aws/status
    const BUCKETS = [
        { name: 'northstar-media-dev', region: 'us-east-1', provider: 'AWS S3', purpose: 'Video & Imagery (Free Tier)' },
        { name: 'northstar-vectors-dev', region: 'us-east-1', provider: 'AWS S3', purpose: 'LanceDB Vectors' },
    ];

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-neutral-50 flex justify-between items-center">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">STORAGE</h1>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">AWS S3 • Media & Vectors</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-mono bg-green-500 text-white px-2 py-1 uppercase font-bold">AWS AUTH: ACTIVE</div>
                        <div className="text-[10px] font-mono mt-1 opacity-60">521176575081</div>
                    </div>
                </header>

                <div className="flex-1 p-12">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-bold uppercase border-b-2 border-black pb-2">Active Buckets</h2>
                        <button
                            className="bg-black text-white px-6 py-2 font-bold uppercase text-sm hover:bg-orange-500 transition-colors"
                            onClick={() => alert("AWS Bucket Creation Wizard launching soon...")}
                        >
                            + Provision S3 Bucket
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {BUCKETS.map((b) => (
                            <div key={b.name} className="border-4 border-black p-6 flex justify-between items-center hover:bg-neutral-50 transition-colors cursor-pointer">
                                <div>
                                    <h3 className="text-2xl font-black font-mono mb-1">{b.name}</h3>
                                    <div className="flex gap-4 text-xs font-mono uppercase opacity-60">
                                        <span>{b.provider}</span>
                                        <span>{b.region}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold uppercase text-sm">{b.purpose}</div>
                                    <div className="text-green-600 text-xs font-bold">ONLINE</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-orange-50 border-4 border-orange-500 p-6">
                        <h4 className="font-bold uppercase text-orange-800 mb-2">Billing Watch</h4>
                        <p className="font-mono text-xs text-orange-800">
                            <strong>AWS Credits Applied:</strong> Using $100.00 credit balance.<br />
                            <strong>Free Tier:</strong> 5GB S3 Storage / 20k GETs remaining.
                        </p>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard/infra')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Infrastructure
                    </button>
                </div>
            </div>
        </div>
    );
}
