"use client";

import React from 'react';
import Link from 'next/link';

export default function GodConfigJuniorSecurity() {
    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b border-green-900/50 pb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tight text-green-500 mb-2">
                                🛡️ Junior Agent Security
                            </h1>
                            <p className="text-gray-400 max-w-xl">
                                The "Adult in the Room" for managing AI Agent secrets.
                                This is a <strong>Local Sidecar Service</strong> that runs on your machine.
                            </p>
                        </div>
                        <Link
                            href="/_flat_config/god_config_junior_security/humans.md"
                            className="px-4 py-2 border border-green-500 text-green-500 text-xs uppercase hover:bg-green-500 hover:text-black transition-colors"
                        >
                            Read Manual
                        </Link>
                    </div>
                </div>

                {/* Status Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-green-900/10 border border-green-900 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Local Sidecar Status
                        </h2>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-400">
                                Since this service runs locally on your machine, this web dashboard cannot connect to it directly.
                                Please check your local dashboard:
                            </p>
                            <a
                                href="http://localhost:9090"
                                target="_blank"
                                className="inline-block bg-green-600 text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-green-500 transition-colors"
                            >
                                Open Local Dashboard →
                            </a>
                            <p className="text-xs text-gray-500 mt-2">
                                http://localhost:9090
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4 text-gray-300">Quick Commands</h2>
                        <div className="space-y-2 font-mono text-xs">
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-500">Launch App</span>
                                <span className="text-green-400 select-all">open /Applications/JuniorAgentSecurity.app</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-500">Reset TOTP</span>
                                <span className="text-green-400 select-all">mcp-call setup_totp_generate</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">View Logs</span>
                                <span className="text-green-400 select-all">tail -f ~/.junior-agent-security/logs.txt</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Commercial Strategy */}
                <div className="border-t border-gray-800 pt-8">
                    <h3 className="text-lg font-bold text-white mb-6 uppercase">Commercial Tiers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Tier 1 */}
                        <div className="border border-gray-800 p-6 bg-gray-900/50">
                            <div className="text-2xl font-bold mb-2">Free</div>
                            <div className="text-xs text-gray-400 mb-4 uppercase tracking-wider">Community</div>
                            <ul className="text-sm space-y-2 text-gray-300 mb-6">
                                <li>✅ Localhost Only</li>
                                <li>✅ Unlimited Secrets</li>
                                <li>✅ SQLite Audit Log</li>
                            </ul>
                            <button className="w-full py-2 bg-gray-800 text-gray-400 text-xs uppercase cursor-not-allowed">Current (Dev)</button>
                        </div>

                        {/* Tier 2 */}
                        <div className="border border-green-900 p-6 bg-green-900/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] px-2 py-1 uppercase font-bold">Recommended</div>
                            <div className="text-2xl font-bold mb-1 text-green-400">$29<span className="text-sm text-gray-500">/mo</span></div>
                            <div className="text-xs text-green-600 mb-4 uppercase tracking-wider">Team</div>
                            <ul className="text-sm space-y-2 text-gray-300 mb-6">
                                <li>✅ **Supabase Sync**</li>
                                <li>✅ Manager Approval</li>
                                <li>✅ Shared Vaults</li>
                            </ul>
                            <button className="w-full py-2 bg-green-600 text-white text-xs uppercase hover:bg-green-500">Upgrade</button>
                        </div>

                        {/* Tier 3 */}
                        <div className="border border-gray-800 p-6 bg-gray-900/50">
                            <div className="text-2xl font-bold mb-2">Custom</div>
                            <div className="text-xs text-gray-500 mb-4 uppercase tracking-wider">Enterprise</div>
                            <ul className="text-sm space-y-2 text-gray-400 mb-6">
                                <li>✅ SSO / SAML</li>
                                <li>✅ On-Premise Anchor</li>
                                <li>✅ SIEM Integration</li>
                            </ul>
                            <button className="w-full py-2 border border-gray-700 text-gray-400 text-xs uppercase hover:bg-gray-800">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
