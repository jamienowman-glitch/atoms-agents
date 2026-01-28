"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const BASE_FEATURES = [
    'TEXT BASED REASONING',
    'NEXUS CONTEXT',
    'RUN TIME PRIORS',
    'ATOMIC SPECIALISED AGENTS'
];

const EXTRA_FEATURES = [
    'ADAPTIVE CRITIQUE LOOPS',
    'POST PERFORMANCE EVOLUTION'
];

const TIERS = [
    { id: 'lite', label: 'LITE', price: 3, features: BASE_FEATURES },
    { id: 'mid', label: 'MID', price: 5, features: BASE_FEATURES },
    { id: 'heavy', label: 'HEAVY', price: 7, features: [...BASE_FEATURES, ...EXTRA_FEATURES] }
];

export default function AgentFlowsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-graph-paper-dark text-white font-sans">
            <div className="min-h-screen w-full px-4 sm:px-6 py-10 md:py-16">
                <div className="border-l-4 border-white/30 pl-3">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl leading-none uppercase">
                        <span className="font-semibold">AGENT</span><span className="font-extralight italic">FLOWS</span>
                    </h1>
                </div>

                <p className="mt-4 text-sm sm:text-base md:text-lg font-extralight italic max-w-[22rem] sm:max-w-[28rem] leading-snug">
                    non-deterministic fixed flows of a family of atomic expert agents
                </p>

                <p className="mt-6 text-[11px] sm:text-xs md:text-sm text-yellow-300 max-w-[28rem] sm:max-w-[34rem] leading-relaxed uppercase">
                    THESE ARE NOT APPS EVERYONE THE FLOW UPDATES IT IT&apos;S PRIORS CONTEXTUAL AWARE OF THE REALITY OF YOUR
                    BUSINESS TODAY THE ANNA LIFE THEIR OWN POST PERFORMANCE, THEY AMPLIFY YOUR CREATIVE WORK AND THEY ADAPT
                    LEARNING MORE EVERY CYCLE.
                </p>

                <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
                    {TIERS.map((tier) => (
                        <div
                            key={tier.id}
                            className="border-2 border-white/40 bg-white/5 p-3 sm:p-4 flex flex-col gap-3 min-h-[240px]"
                        >
                            <h2 className="text-base sm:text-lg uppercase leading-tight">
                                <span className="font-semibold">{tier.label}</span><span className="font-extralight italic">FLOW</span>
                            </h2>

                            <div className="text-[10px] sm:text-[11px] uppercase tracking-wide space-y-1">
                                {tier.features.map((feature) => (
                                    <div key={`${tier.id}-${feature}`}>{feature}</div>
                                ))}
                            </div>

                            <div className="mt-auto text-xs sm:text-sm uppercase tracking-widest">
                                <span className="font-semibold">{tier.price}</span>{' '}
                                <span className="font-normal">AGENT</span><span className="font-extralight italic">SNAX</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex items-center justify-between text-[11px] sm:text-xs uppercase tracking-widest">
                    <button
                        onClick={() => router.push('/dashboard/subscriptions')}
                        className="hover:underline"
                    >
                        ← Back to Subscriptions
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="hover:underline"
                    >
                        Main Dashboard →
                    </button>
                </div>
            </div>
        </div>
    );
}
