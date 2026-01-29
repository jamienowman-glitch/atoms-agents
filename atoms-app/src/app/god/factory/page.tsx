"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { isGodUser } from '@/lib/god';
import { ChevronDown, ChevronUp, Plus, ArrowRight, Globe, Layout, Type } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  repo_url?: string;
}

interface Domain {
  id: string;
  domain: string;
}

export default function FactoryPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Auth
    const [accessDenied, setAccessDenied] = useState(false);

    // Form State
    const [siteName, setSiteName] = useState('');
    const [urlPrefix, setUrlPrefix] = useState('');
    const [templateId, setTemplateId] = useState('');
    const [domainId, setDomainId] = useState('');

    // Output
    const [output, setOutput] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            if (!isGodUser(user.email)) {
                setAccessDenied(true);
                return;
            }

            setLoading(true);

            // Parallel fetch
            const [tempRes, domRes] = await Promise.all([
                supabase.from('site_templates').select('*'),
                supabase.from('owned_domains').select('*')
            ]);

            if (tempRes.data) setTemplates(tempRes.data);
            if (domRes.data) setDomains(domRes.data);

            setLoading(false);
        };

        init();
    }, [supabase, router]);

    const handleSpawn = async () => {
        if (!siteName || !templateId || !domainId) {
            setError('Please fill in all required fields.');
            return;
        }

        setSubmitting(true);
        setError(null);
        setOutput(null);

        try {
            const res = await fetch('/api/god/factory/spawn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    site_name: siteName,
                    url_prefix: urlPrefix,
                    template_id: templateId,
                    domain_id: domainId
                })
            });

            const data = await res.json();

            if (data.success) {
                setOutput(data.output || 'Process initiated successfully.');
            } else {
                setError(data.error || 'Unknown error occurred.');
                if (data.output) setOutput(data.output);
            }
        } catch (e: any) {
            setError(e.message || 'Network error');
        } finally {
            setSubmitting(false);
        }
    };

    if (accessDenied) {
        return (
            <div className="min-h-screen bg-black text-red-600 font-mono flex items-center justify-center p-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">ACCESS DENIED</h1>
                    <button onClick={() => router.push('/')} className="underline">Return Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-12 font-sans text-neutral-900">
             {/* Header */}
            <header className="mb-12 border-b-2 border-black pb-4">
                <div className="flex items-center gap-4 mb-2">
                     <button onClick={() => router.push('/god')} className="text-neutral-400 hover:text-black transition-colors font-mono text-xs">
                        &larr; BACK TO CONSOLE
                     </button>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Factory Floor</h1>
                <p className="font-mono text-sm text-neutral-500 uppercase tracking-widest mt-2">
                    Site Spawner • Press Engine
                </p>
            </header>

            <main className="max-w-2xl mx-auto space-y-8">

                {/* Section 1: Identity */}
                <Section title="1. Site Identity" icon={<Type className="w-5 h-5" />}>
                     <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Site Name (Internal)</label>
                            <input
                                type="text"
                                value={siteName}
                                onChange={e => setSiteName(e.target.value)}
                                placeholder="e.g. Project Orion"
                                className="w-full border-2 border-neutral-200 p-3 font-mono focus:border-black focus:outline-none transition-colors rounded-sm"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold uppercase mb-1">URL Prefix (Slug)</label>
                            <div className="flex items-center">
                                <span className="bg-neutral-100 border-2 border-r-0 border-neutral-200 p-3 text-neutral-500 font-mono text-sm">/</span>
                                <input
                                    type="text"
                                    value={urlPrefix}
                                    onChange={e => setUrlPrefix(e.target.value)}
                                    placeholder="project-orion"
                                    className="w-full border-2 border-neutral-200 p-3 font-mono focus:border-black focus:outline-none transition-colors rounded-r-sm"
                                />
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1 uppercase">Optional. Defaults to kebab-case of name.</p>
                        </div>
                     </div>
                </Section>

                {/* Section 2: Blueprint */}
                <Section title="2. Blueprint" icon={<Layout className="w-5 h-5" />}>
                    {loading ? (
                        <div className="text-neutral-400 font-mono text-sm animate-pulse">Loading templates...</div>
                    ) : templates.length === 0 ? (
                        <EmptyState message="No Templates Found" />
                    ) : (
                         <div className="flex gap-2">
                            <div className="relative w-full">
                                <select
                                    value={templateId}
                                    onChange={e => setTemplateId(e.target.value)}
                                    className="w-full appearance-none border-2 border-neutral-200 bg-white p-3 pr-8 font-mono focus:border-black focus:outline-none rounded-sm"
                                >
                                    <option value="">Select a Template...</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                            </div>
                            <button className="bg-neutral-100 hover:bg-neutral-200 text-black p-3 border-2 border-neutral-200 rounded-sm" title="Add Template">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </Section>

                {/* Section 3: Territory */}
                <Section title="3. Territory" icon={<Globe className="w-5 h-5" />}>
                    {loading ? (
                         <div className="text-neutral-400 font-mono text-sm animate-pulse">Loading domains...</div>
                    ) : domains.length === 0 ? (
                         <EmptyState message="No Domains Found" />
                    ) : (
                        <div className="flex gap-2">
                            <div className="relative w-full">
                                <select
                                    value={domainId}
                                    onChange={e => setDomainId(e.target.value)}
                                    className="w-full appearance-none border-2 border-neutral-200 bg-white p-3 pr-8 font-mono focus:border-black focus:outline-none rounded-sm"
                                >
                                    <option value="">Select a Root Domain...</option>
                                    {domains.map(d => (
                                        <option key={d.id} value={d.id}>{d.domain}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                            </div>
                             <button className="bg-neutral-100 hover:bg-neutral-200 text-black p-3 border-2 border-neutral-200 rounded-sm" title="Add Domain">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </Section>

                {/* Action */}
                <div className="pt-8 border-t-2 border-dashed border-neutral-300">
                    <button
                        onClick={handleSpawn}
                        disabled={submitting || loading}
                        className={`w-full py-4 px-6 text-white font-bold uppercase tracking-widest text-lg flex items-center justify-center gap-3 transition-all rounded-sm
                            ${submitting ? 'bg-neutral-400 cursor-not-allowed' : 'bg-black hover:bg-neutral-800 hover:translate-y-[-2px] hover:shadow-lg'}
                        `}
                    >
                        {submitting ? 'Spawning...' : 'Initiate Sequence'}
                        {!submitting && <ArrowRight className="w-5 h-5" />}
                    </button>

                    {error && (
                        <div className="mt-6 p-4 border-2 border-red-500 bg-red-50 text-red-700 font-mono text-sm whitespace-pre-wrap">
                            <strong className="block mb-2 text-red-900">ERROR REPORT:</strong>
                            {error}
                        </div>
                    )}

                    {output && (
                        <div className="mt-6 p-4 border-2 border-neutral-800 bg-neutral-900 text-green-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap shadow-inner">
                             <strong className="block mb-2 text-white border-b border-neutral-700 pb-2">PROCESS LOG:</strong>
                            {output}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-2 border-neutral-100 bg-white shadow-sm rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-neutral-50 border-b border-neutral-100 hover:bg-neutral-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-neutral-400">{icon}</span>
                    <h2 className="font-bold text-lg uppercase tracking-tight">{title}</h2>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
            </button>

            {isOpen && (
                <div className="p-6">
                    {children}
                </div>
            )}
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="border-2 border-dashed border-neutral-300 p-6 text-center rounded-sm">
            <p className="text-neutral-400 font-mono text-sm mb-4">{message}</p>
            <button className="text-xs font-bold uppercase underline hover:text-blue-600">
                + Register New Record
            </button>
        </div>
    );
}
