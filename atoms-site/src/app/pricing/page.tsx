"use client";

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const [stripeKey, setStripeKey] = useState<string | null>(null);

React.useEffect(() => {
    // Hydrate Config from Vault API
    fetch('/api/config/stripe')
        .then(res => res.json())
        .then(data => {
            if (data.key) setStripeKey(data.key);
        });
}, []);

const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const TIERS = [
    {
        id: "starter",
        name: "Atom",
        price: "$0",
        period: "/mo",
        description: "For explorers and hobbyists.",
        features: ["1 Agent", "Public Models", "Community Support"],
        priceId: null // Free
    },
    {
        id: "pro",
        name: "Molecule",
        price: "$29",
        period: "/mo",
        description: "For creators and builders.",
        features: ["5 Agents", "Private Memory", "Priority Compute", "4K Video Render"],
        priceId: "price_1Q..." // To be filled from Config
    },
    {
        id: "business",
        name: "Organism",
        price: "$99",
        period: "/mo",
        description: "For teams and agencies.",
        features: ["Unlimited Agents", "Team Canvas", "Dedicated GPU", "API Access"],
        priceId: "price_1Q..."
    }
];

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleCheckout = async (priceId: string | null) => {
        if (!priceId) return; // Free tier logic (redirect to login)

        setLoading(priceId);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, mode: 'subscription' })
            });
            const { sessionId } = await res.json();
            const stripe = await stripePromise;
            if (stripe) {
                await stripe.redirectToCheckout({ sessionId });
            }
        } catch (err) {
            console.error(err);
            alert("Checkout failed. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Pricing</h1>
                    <p className="text-neutral-500 font-mono">SCALABLE INTELLIGENCE FOR CARBON & SILICON.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TIERS.map((tier) => (
                        <div
                            key={tier.id}
                            className={`relative p-8 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-neutral-900 ${tier.id === 'pro' ? 'ring-2 ring-blue-500/50' : ''}`}
                        >
                            {tier.id === 'pro' && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                    Recommended
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-black tracking-tight">{tier.price}</span>
                                <span className="text-neutral-500 text-sm">{tier.period}</span>
                            </div>
                            <p className="text-neutral-400 text-sm mb-8 min-h-[40px]">{tier.description}</p>

                            <button
                                onClick={() => handleCheckout(tier.priceId)}
                                disabled={!!loading}
                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${tier.id === 'pro'
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                    : 'bg-white text-black hover:bg-neutral-200'
                                    }`}
                            >
                                {loading === tier.priceId ? 'Processing...' : (tier.priceId ? 'Subscribe' : 'Get Started')}
                            </button>

                            <div className="mt-8 space-y-4">
                                {tier.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-500"></div>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
