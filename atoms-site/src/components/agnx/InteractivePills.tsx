"use client";

import { useState } from "react";

const TABS = [
    { id: "safety", label: "SAFETY", content: "Our guardrails ensure that autonomous agents operate within strict business boundaries." },
    { id: "customised", label: "CUSTOMISED", content: "Every agent is fine-tuned on your specific business data and tone of voice." },
    { id: "reasoning", label: "REASONING", content: "Advanced chain-of-thought capabilities allow agents to solve complex multi-step problems." },
    { id: "adaptive", label: "ADAPTIVE", content: "Systems that learn from feedback and evolve with your changing business needs." },
];

export default function InteractivePills() {
    const [activeTab, setActiveTab] = useState(TABS[0]);

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-12">
            {/* Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-full border transition-all text-sm font-bold tracking-wider ${activeTab.id === tab.id
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-gray-300 hover:border-black"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="text-center min-h-[100px]">
                <h3 className="text-xl font-bold mb-4 font-roboto uppercase tracking-tight">{activeTab.label}</h3>
                <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {activeTab.content}
                </p>
            </div>

            {/* Placeholder for "YouTube playlist same as before" under pills */}
        </div>
    );
}
