import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { BookOpen, Video, Award } from "lucide-react";

export default function TheProfessor() {
    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            {/* Hero */}
            <section className="py-32 px-6 text-center border-b border-white/10">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">
                    THE WORKSHOP
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-xl">
                    Knowledge transfer initiated. Download the skills to master the agentic age.
                </p>
            </section>

            {/* Course Grid */}
            <section className="container mx-auto px-6 py-24">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">Available Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Course 1 */}
                    <div className="group cursor-pointer">
                        <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden mb-4 border border-white/10 group-hover:border-red-500 transition-colors">
                            <Image src="/atoms-fam-marketing-agents.JPG" alt="Course 1" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
                                    <span className="text-xl">▶</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold uppercase mb-2">Agent Engineering 101</h3>
                        <div className="flex gap-4 text-xs text-gray-500 font-mono uppercase">
                            <span className="flex items-center gap-1"><Video size={12} /> 2.5 Hours</span>
                            <span className="flex items-center gap-1"><BookOpen size={12} /> 6 Modules</span>
                        </div>
                    </div>

                    {/* Course 2 */}
                    <div className="group cursor-pointer">
                        <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden mb-4 border border-white/10 group-hover:border-blue-500 transition-colors">
                            <Image src="/mynx-cad-pricing-agents.png" alt="Course 2" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
                                    <span className="text-xl">▶</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold uppercase mb-2">Advanced Orchestration</h3>
                        <div className="flex gap-4 text-xs text-gray-500 font-mono uppercase">
                            <span className="flex items-center gap-1"><Video size={12} /> 4.0 Hours</span>
                            <span className="flex items-center gap-1"><BookOpen size={12} /> 12 Modules</span>
                        </div>
                    </div>

                    {/* Course 3 */}
                    <div className="group cursor-pointer">
                        <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden mb-4 border border-white/10 group-hover:border-purple-500 transition-colors">
                            <Image src="/broker-portfolio-management-agents.png" alt="Course 3" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
                                    <span className="text-xl">▶</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold uppercase mb-2">Prompt Architecture</h3>
                        <div className="flex gap-4 text-xs text-gray-500 font-mono uppercase">
                            <span className="flex items-center gap-1"><Video size={12} /> 1.5 Hours</span>
                            <span className="flex items-center gap-1"><BookOpen size={12} /> 3 Modules</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Certification Path */}
            <section className="py-24 bg-zinc-900 border-t border-white/10">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <Award className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold uppercase mb-4">Become Certified</h2>
                    <p className="text-gray-400 mb-8">
                        Prove your mastery. Join the elite rank of Northstar Architects. Certified experts command higher rates and get priority access to beta features.
                    </p>
                    <button className="bg-white text-black px-8 py-3 font-bold uppercase hover:bg-gray-200 transition-colors">
                        Start Certification
                    </button>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
