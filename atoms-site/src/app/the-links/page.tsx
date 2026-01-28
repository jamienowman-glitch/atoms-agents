import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowUpRight, Book, Github, ExternalLink } from "lucide-react";

export default function TheLinks() {
    const externalResources = [
        {
            category: "Research",
            items: [
                { label: "Attention Is All You Need (Paper)", href: "https://arxiv.org/abs/1706.03762" },
                { label: "Generative Agents Simulation", href: "https://arxiv.org/abs/2304.03442" },
                { label: "Chain-of-Thought Prompting", href: "https://arxiv.org/abs/2201.11903" }
            ]
        },
        {
            category: "The Stack",
            items: [
                { label: "Next.js Documentation", href: "https://nextjs.org" },
                { label: "Tailwind CSS Configuration", href: "https://tailwindcss.com" },
                { label: "Rust Language", href: "https://www.rust-lang.org" }
            ]
        },
        {
            category: "Inspiration",
            items: [
                { label: "Awwwards - Site of the Day", href: "https://www.awwwards.com" },
                { label: "Godly - Web Design", href: "https://godly.website" },
                { label: "Brutalist Websites", href: "https://brutalistwebsites.com" }
            ]
        }
    ];

    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            <section className="pt-32 pb-12 px-6 text-center border-b border-white/10">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">
                    THE LINKS
                </h1>
                <p className="text-gray-500 uppercase tracking-widest text-sm max-w-xl mx-auto">
                    Curated external signals. Resources, raw data, and inspiration from outside the simulation.
                </p>
            </section>

            <section className="container mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {externalResources.map((section, i) => (
                        <div key={i} className="space-y-6">
                            <h2 className="text-xl font-bold uppercase text-red-600 tracking-widest border-b border-red-600/20 pb-2">
                                {section.category}
                            </h2>
                            <ul className="space-y-4">
                                {section.items.map((link, j) => (
                                    <li key={j}>
                                        <Link
                                            href={link.href}
                                            target="_blank"
                                            className="group flex items-start gap-2 hover:text-gray-300 transition-colors"
                                        >
                                            <ArrowUpRight size={18} className="mt-1 text-gray-600 group-hover:text-white transition-colors" />
                                            <div>
                                                <span className="font-bold uppercase text-lg block leading-none mb-1 border-b border-transparent group-hover:border-white inline-block transition-all">
                                                    {link.label}
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
