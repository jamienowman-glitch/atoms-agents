"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CanvasForge() {
    const router = useRouter();
    const [contract, setContract] = useState(JSON.stringify({
        name: "MyNewCanvas",
        description: "A canvas for doing X",
        tools: {
            magnifier_left: { label: "Zoom", id: "zoom_level", type: "slider" },
            magnifier_right: { label: "Export", id: "export_fmt", type: "select" }
        },
        atom: { name: "Card", props: [] },
        molecule: { name: "Grid", layout: "flex-row" }
    }, null, 2));

    const [forging, setForging] = useState(false);

    const handleForge = async () => {
        setForging(true);
        // In a real agentic flow, this would commit the YAML to atoms-registry
        // For now, we simulate the 'Save' and creation.
        setTimeout(() => {
            alert("Contract Forged! (Simulation)");
            setForging(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">

                <header className="bg-black text-white p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Canvas Forge</h1>
                        <p className="font-mono text-xs uppercase tracking-widest opacity-80">Define Contract • Map Tools • Generate Harness</p>
                    </div>
                    <button onClick={() => router.push('/dashboard')} className="font-bold hover:text-red-500">CLOSE</button>
                </header>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                    {/* LEFT: EDITOR */}
                    <div className="p-0 border-r-4 border-black bg-[#1e1e1e]">
                        <textarea
                            value={contract}
                            onChange={(e) => setContract(e.target.value)}
                            className="w-full h-full p-8 font-mono text-sm bg-transparent text-[#d4d4d4] resize-none focus:outline-none"
                            spellCheck={false}
                        />
                    </div>

                    {/* RIGHT: PREVIEW / DOCS */}
                    <div className="p-8 bg-graph-paper">
                        <h2 className="text-2xl font-bold uppercase mb-4">The Contract</h2>
                        <p className="mb-4 text-sm font-medium">To create a new Surface/Canvas, verify the mapping:</p>

                        <div className="space-y-4 font-mono text-xs">
                            <div className="p-4 border-2 border-black bg-white">
                                <strong className="block mb-1">MAGNIFIER LEFT (Tool)</strong>
                                <span className="opacity-60">Maps to Bottom-Left Scroll Wheel. typically for 'View' (Zoom, Pan).</span>
                            </div>
                            <div className="p-4 border-2 border-black bg-white">
                                <strong className="block mb-1">MAGNIFIER RIGHT (Context)</strong>
                                <span className="opacity-60">Maps to Bottom-Right Scroll Wheel. typically for 'Action' (Export, Format).</span>
                            </div>
                        </div>

                        <div className="mt-12">
                            <button
                                onClick={handleForge}
                                disabled={forging}
                                className="w-full py-4 bg-black text-white font-black uppercase tracking-widest text-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                {forging ? 'FORGING...' : 'FORGE CANVAS'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
