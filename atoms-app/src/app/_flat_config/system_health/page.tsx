"use client";

import React from 'react';
import Link from 'next/link';

export default function SystemHealthPage() {
    return (
        <div className="min-h-screen bg-graph-paper p-12 text-black">
            <Link href="/" className="text-xs font-mono mb-8 block hover:underline">← BACK TO CONSOLE</Link>

            <h1 className="text-4xl font-black uppercase mb-2">System Health</h1>
            <p className="text-neutral-500 mb-12">Northstar OS v2.0 Status</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div className="border border-black p-6 bg-white">
                    <h3 className="font-mono text-xs uppercase text-neutral-500 mb-2">Core Kernel</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xl font-bold">ONLINE</span>
                    </div>
                    <div className="mt-4 text-sm font-mono text-neutral-600">
                        Version: 2.0.1<br />
                        Uptime: 4h 22m<br />
                        Latency: 12ms
                    </div>
                </div>

                <div className="border border-black p-6 bg-white">
                    <h3 className="font-mono text-xs uppercase text-neutral-500 mb-2">Northstar Engines</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xl font-bold">CONNECTED</span>
                    </div>
                    <div className="mt-4 text-sm font-mono text-neutral-600">
                        Bridge: Active<br />
                        Registry: Mounted<br />
                        Muscles: 14 Available
                    </div>
                </div>
            </div>
        </div>
    );
}
