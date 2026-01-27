import Link from "next/link";
import { Twitter, Instagram, Linkedin } from "lucide-react";

export default function SiteFooter() {
    return (
        <footer className="bg-black text-white py-12 border-t border-white/10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Quick Links */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Explore</h4>
                    <Link href="/" className="hover:text-gray-400 transition-colors">The House</Link>
                    <Link href="/the-dream" className="hover:text-gray-400 transition-colors">The Dream</Link>
                    <Link href="/the-story" className="hover:text-gray-400 transition-colors">The Story</Link>
                    <Link href="/the-offer" className="hover:text-gray-400 transition-colors">The Offer</Link>
                </div>

                {/* Social Media */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Connect</h4>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></Link>
                        <Link href="#" className="hover:text-pink-400 transition-colors"><Instagram size={20} /></Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors"><Linkedin size={20} /></Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="flex flex-col gap-4 md:text-right">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Legal</h4>
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} Atoms Family.<br />
                        All rights reserved.
                    </p>
                    <div className="flex gap-4 md:justify-end text-xs text-gray-600">
                        <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gray-400">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
