"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function InfrastructureHub() {
    const router = useRouter();
    const supabase = createClient();
    const [registries, setRegistries] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchRegistries() {
            // DYNAMIC FETCH: Query the 'registries' table
            const { data, error } = await supabase
                .from('registries')
                .select('*')
                .eq('category', 'infra')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (data) {
                setRegistries(data);
            }
            setLoading(false);
        }
        fetchRegistries();
    }, []);

    if (loading) return <div className="min-h-screen bg-neutral-100 flex items-center justify-center font-black text-2xl">LOADING REGISTRY...</div>;

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-5xl min-h-[70vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-neutral-50">
                    <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">INFRASTRUCTURE</h1>
                    <p className="font-mono text-sm uppercase tracking-widest opacity-60">The Backbone • OS Level 0</p>
                </header>

                <div className="flex-1 p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {registries.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => router.push(item.path)}
                                className="border-4 border-black p-8 text-left hover:bg-black hover:text-white transition-all group"
                            >
                                <h3 className="text-3xl font-black uppercase mb-2 group-hover:translate-x-2 transition-transform">
                                    {item.label}
                                </h3>
                                <p className="font-mono text-xs uppercase tracking-widest opacity-70">
                                    {item.description}
                                </p>
                            </button>
                        ))}

                        {/* FALLBACK IF EMPTY */}
                        {registries.length === 0 && (
                            <div className="col-span-2 border-4 border-red-500 p-8 bg-red-50 text-red-900 font-mono">
                                <strong>ERROR:</strong> No registries found in database table 'public.registries'. <br />
                                Please run migration: <code>supabase/migrations/20260126221100_create_registries_table.sql</code>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Main Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
