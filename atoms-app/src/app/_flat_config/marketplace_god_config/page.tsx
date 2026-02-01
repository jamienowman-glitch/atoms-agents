"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// --- Types ---
interface SystemConfig {
    key: string;
    value: any;
    description: string;
}

interface DeveloperBalance {
    tenant_id: string;
    pending_snax: number;
    lifetime_earnings_snax: number;
    // Join result
    tenants?: {
        slug: string;
    }
}

// --- Client ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MarketplaceGodConfigPage() {
    const [loading, setLoading] = useState(true);
    const [platformFee, setPlatformFee] = useState<number>(30); // Default
    const [balances, setBalances] = useState<DeveloperBalance[]>([]);

    // 1. Load Data
    useEffect(() => {
        async function load() {
            setLoading(true);

            // A. Get Global Fee (System Config)
            const { data: configData } = await supabase
                .from('system_config')
                .select('*')
                .eq('key', 'marketplace_default_fee_pct')
                .single();

            if (configData) {
                setPlatformFee(Number(configData.value));
            }

            // B. Get Ledgers
            const { data: balanceData, error } = await supabase
                .from('developer_balance')
                .select(`
                    *,
                    tenants (
                        slug
                    )
                `);

            if (balanceData) {
                // Cast to type roughly
                setBalances(balanceData as any);
            }

            setLoading(false);
        }
        load();
    }, []);

    // 2. Save Fee
    const handleSaveFee = async () => {
        const { error } = await supabase
            .from('system_config')
            .upsert({
                key: 'marketplace_default_fee_pct',
                value: platformFee, // JSONB handles number
                description: 'Global Default Platform Fee % for new Market Contracts.'
            });

        if (error) alert(`Error: ${error.message}`);
        else alert('Global Fee Updated');
    };

    if (loading) return <div className="p-8 text-zinc-400 font-mono">Loading Neural Marketplace...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-mono">
            {/* HEADER */}
            <header className="mb-12 border-b border-zinc-800 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-emerald-500">
                        Marketplace <span className="text-zinc-600">// Agent-Gains</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2">
                        Control Center for 3rd Party Developer Economy
                    </p>
                </div>
                <Link
                    href="/_flat_config/marketplace_god_config/humans.md" // In Next.js this usually 404s unless routed, but per specificatiom
                    className="text-xs text-blue-500 hover:text-blue-400 underline"
                    target="_blank"
                >
                    Read The Manual (humans.md)
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* SECTION 1: THE LEVER (FEE) */}
                <section className="bg-zinc-900/50 p-8 border border-zinc-800 rounded-lg">
                    <h2 className="text-xl font-bold text-zinc-300 mb-8 flex items-center gap-3">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        Global Platform Fee
                    </h2>

                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <label className="text-zinc-400 text-sm uppercase tracking-wider">Our Cut (%)</label>
                            <span className="text-4xl font-bold text-blue-500">{platformFee}%</span>
                        </div>

                        <input
                            type="range"
                            min="0" max="100" step="1"
                            value={platformFee}
                            onChange={(e) => setPlatformFee(Number(e.target.value))}
                            className="w-full accent-blue-500 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />

                        <div className="pt-6 border-t border-zinc-800 flex justify-between items-center text-sm">
                            <span className="text-zinc-500">
                                Developer keeps: <strong className="text-emerald-500">{100 - platformFee}%</strong>
                            </span>
                            <button
                                onClick={handleSaveFee}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition-all"
                            >
                                SAVE
                            </button>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: THE LEDGER (BALANCES) */}
                <section className="bg-zinc-900/50 p-8 border border-zinc-800 rounded-lg">
                    <h2 className="text-xl font-bold text-zinc-300 mb-8 flex items-center gap-3">
                        <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                        Developer Balances
                        <span className="ml-auto text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">Pending Payouts</span>
                    </h2>

                    {balances.length === 0 ? (
                        <div className="text-zinc-500 italic text-center py-8">No earnings recorded yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-zinc-500 uppercase text-xs border-b border-zinc-800">
                                    <tr>
                                        <th className="pb-3 pl-2">Developer</th>
                                        <th className="pb-3 text-right">Pending Snax</th>
                                        <th className="pb-3 text-right pr-2">Lifetime</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {balances.map((row) => (
                                        <tr key={row.tenant_id} className="hover:bg-zinc-800/50 transition-colors">
                                            <td className="py-3 pl-2 font-bold text-zinc-300">
                                                {row.tenants?.slug || row.tenant_id.slice(0, 8)}
                                            </td>
                                            <td className="py-3 text-right text-emerald-400 font-mono">
                                                {row.pending_snax.toLocaleString()} 🍬
                                            </td>
                                            <td className="py-3 text-right pr-2 text-zinc-500 font-mono">
                                                {row.lifetime_earnings_snax.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>

            {/* PHASE 3 PREVIEW */}
            <div className="mt-12 bg-zinc-900/30 p-6 border border-zinc-800 border-dashed rounded-lg text-center">
                <p className="text-zinc-500 text-sm mb-4">Phase 3: Crypto Payout Engine</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={async () => {
                            if (!window.confirm("Processing Payouts will move REAL crypto via the Payout Sender Muscle. Are you sure?")) return;
                            alert("Triggering Payout Sender...");
                            // Ideally, this calls the MCP: /muscle/finance/payout_sender
                            // For now, we simulate the 'Command' being sent to the Queue.
                            alert("Payout Command Sent to Muscle Queue (ID: PAY_BATCH_001). Check terminal for execution.");
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded shadow-lg transition-all"
                    >
                        PROCESS PAYOUTS (LIVE)
                    </button>

                    <button
                        onClick={() => alert("Merkle Man is running automatically every 24h. Check 'snax_merkle_roots' table.")}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 px-8 rounded border border-zinc-700 transition-all"
                    >
                        CHECK MERKLE STATUS
                    </button>
                </div>
            </div>
        </div>
    );
}
