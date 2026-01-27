import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Check } from "lucide-react";

export default function TheOffer() {
    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            <section className="py-24 text-center px-6">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                    CHOOSE YOUR WEAPON
                </h1>
                <p className="text-gray-400 uppercase tracking-widest text-sm">
                    Scalable power. No hidden fees. Cancel anytime.
                </p>
            </section>

            {/* Pricing Table */}
            <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl">
                {/* TIER 1 */}
                <div className="bg-zinc-900 border border-white/10 p-8 rounded-xl flex flex-col">
                    <h3 className="text-xl font-bold uppercase text-gray-500 mb-2">Starter</h3>
                    <div className="text-4xl font-black mb-6">$49<span className="text-sm font-normal text-gray-400">/mo</span></div>
                    <p className="text-gray-400 text-sm mb-8">For solo operators looking to automate basic tasks.</p>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex gap-3 text-sm items-center"><Check size={16} className="text-green-500" /> 1 Active Agent</li>
                        <li className="flex gap-3 text-sm items-center"><Check size={16} className="text-green-500" /> Basic Memory</li>
                        <li className="flex gap-3 text-sm items-center"><Check size={16} className="text-green-500" /> Community Support</li>
                    </ul>

                    <button className="w-full border border-white py-3 text-sm font-bold uppercase hover:bg-white hover:text-black transition-colors">
                        Get Started
                    </button>
                </div>

                {/* TIER 2 (FEATURED) */}
                <div className="bg-white text-black p-8 rounded-xl flex flex-col transform md:-translate-y-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase">Most Popular</div>
                    <h3 className="text-xl font-bold uppercase text-gray-800 mb-2">Pro</h3>
                    <div className="text-5xl font-black mb-6">$199<span className="text-sm font-normal text-gray-500">/mo</span></div>
                    <p className="text-gray-600 text-sm mb-8">For serious builders scaling their operations.</p>

                    <ul className="space-y-4 mb-8 flex-1 font-medium">
                        <li className="flex gap-3 text-sm items-center"><Check size={16} className="text-red-600" /> 5 Active Agents</li>
                        <li className="flex gap-3 text-sm items-center"><Check size={16} className="text-red-600" /> Long-term Memory</li>
                        <li className="flex gap-3 text-sm items-center"><Check size={16} className="text-red-600" /> Priority Support</li>
                        <li className="flex gap-3 text-sm items-center"><Check size={16} className="text-red-600" /> Custom Avatars</li>
                    </ul>

                    <button className="w-full bg-black text-white py-4 text-sm font-bold uppercase hover:bg-gray-800 transition-colors shadow-lg">
                        Deploy Pro
                    </button>
                </div>

                {/* TIER 3 */}
                <div className="bg-zinc-900 border border-white/10 p-8 rounded-xl flex flex-col">
                    <h3 className="text-xl font-bold uppercase text-gray-500 mb-2">Enterprise</h3>
                    <div className="text-4xl font-black mb-6">Custom</div>
                    <p className="text-gray-400 text-sm mb-8">Full orchestration for organizations.</p>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex gap-3 text-sm items-center"><Check size={16} className="text-green-500" /> Unlimited Agents</li>
                        <li className="flex gap-3 text-sm items-center"><Check size={16} className="text-green-500" /> On-prem Deployment</li>
                        <li className="flex gap-3 text-sm items-center"><Check size={16} className="text-green-500" /> Dedicated Account Manager</li>
                    </ul>

                    <button className="w-full border border-white py-3 text-sm font-bold uppercase hover:bg-white hover:text-black transition-colors">
                        Contact Sales
                    </button>
                </div>
            </section>

            {/* Guarantee */}
            <section className="py-16 bg-zinc-900 text-center border-y border-white/10">
                <div className="container mx-auto px-6 max-w-2xl">
                    <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldIcon />
                    </div>
                    <h3 className="text-2xl font-bold uppercase mb-4">30-Day Protocol Guarantee</h3>
                    <p className="text-gray-400">
                        If your agents don't outperform your manual workflow within 30 days, we'll refund your subscription and export your data. No questions asked.
                    </p>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}

function ShieldIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    )
}
