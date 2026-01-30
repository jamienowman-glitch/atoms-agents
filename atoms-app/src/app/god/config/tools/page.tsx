"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type ToolRecord = {
    tool_id: string;
    key: string;
    name: string;
    type: string;
    entrypoint: string;
    description: string | null;
    status: string;
    metadata: any;
    created_at: string;
    updated_at: string;
};

const emptyTool = (): Partial<ToolRecord> => ({
    key: "",
    name: "",
    type: "script",
    entrypoint: "",
    description: "",
    status: "active",
    metadata: {}
});

const jsonPretty = (value: any) => {
    try {
        return JSON.stringify(value ?? {}, null, 2);
    } catch {
        return "{}";
    }
};

const safeParse = (value: string, fallback: any) => {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

export default function ToolsConfigPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [tools, setTools] = useState<ToolRecord[]>([]);
    const [selected, setSelected] = useState<ToolRecord | null>(null);
    const [draft, setDraft] = useState<Partial<ToolRecord>>(emptyTool());

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) router.push("/login");
            else fetchTools();
        });
    }, []);

    const fetchTools = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("tools_registry")
            .select("*")
            .order("name", { ascending: true });
        if (data) {
            setTools(data as ToolRecord[]);
            const first = (data as ToolRecord[])[0] || null;
            setSelected(first);
            setDraft(first ? { ...first } : emptyTool());
        }
        setLoading(false);
    };

    const selectTool = (tool: ToolRecord) => {
        setSelected(tool);
        setDraft({ ...tool });
    };

    const addTool = () => {
        setSelected(null);
        setDraft(emptyTool());
    };

    const saveTool = async () => {
        if (!draft.key || !draft.name || !draft.type || !draft.entrypoint) {
            alert("Key, Name, Type, and Entrypoint are required.");
            return;
        }
        const payload = {
            key: draft.key,
            name: draft.name,
            type: draft.type,
            entrypoint: draft.entrypoint,
            description: draft.description || null,
            status: draft.status || "active",
            metadata: draft.metadata ?? {}
        };
        const { error } = await supabase
            .from("tools_registry")
            .upsert(payload, { onConflict: "key" });
        if (error) {
            alert(error.message);
            return;
        }
        await fetchTools();
    };

    const deleteTool = async () => {
        if (!selected?.key) return;
        if (!confirm(`Delete tool "${selected.name}"?`)) return;
        await supabase.from("tools_registry").delete().eq("key", selected.key);
        await fetchTools();
    };

    const selectedTitle = useMemo(() => {
        if (!draft?.name) return "NEW TOOL";
        return `${draft.name}`.toUpperCase();
    }, [draft?.name]);

    return (
        <div className="min-h-screen bg-graph-paper p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">TOOLS — GOD CONFIG</h1>
                        <p className="font-bold text-xs tracking-widest uppercase text-neutral-500">REGISTRY • EDITABLE • READABLE</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={addTool}
                            className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                        >
                            + Add Tool
                        </button>
                        <button
                            onClick={() => router.push("/god/config")}
                            className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="font-mono animate-pulse">LOADING TOOLS...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                        <div className="border-2 border-black">
                            <div className="bg-black text-white px-4 py-3 font-black uppercase text-sm">TOOLS</div>
                            <div className="divide-y-2 divide-black">
                                {tools.map((t) => (
                                    <button
                                        key={t.tool_id}
                                        onClick={() => selectTool(t)}
                                        className={`w-full text-left px-4 py-3 uppercase font-bold tracking-tight transition-colors ${
                                            selected?.tool_id === t.tool_id ? "bg-neutral-100" : "hover:bg-neutral-50"
                                        }`}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                                {tools.length === 0 && (
                                    <div className="p-4 text-xs uppercase text-neutral-500">No tools yet.</div>
                                )}
                            </div>
                        </div>

                        <div className="border-2 border-black">
                            <div className="bg-black text-white px-4 py-3 font-black uppercase text-sm">{selectedTitle}</div>
                            <div className="p-4 md:p-6 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase font-bold">Key</label>
                                        <input
                                            className="w-full border-2 border-black px-3 py-2"
                                            value={draft.key || ""}
                                            onChange={(e) => setDraft(prev => ({ ...prev, key: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase font-bold">Name</label>
                                        <input
                                            className="w-full border-2 border-black px-3 py-2"
                                            value={draft.name || ""}
                                            onChange={(e) => setDraft(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase font-bold">Type</label>
                                        <input
                                            className="w-full border-2 border-black px-3 py-2"
                                            value={draft.type || ""}
                                            onChange={(e) => setDraft(prev => ({ ...prev, type: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase font-bold">Status</label>
                                        <input
                                            className="w-full border-2 border-black px-3 py-2"
                                            value={draft.status || ""}
                                            onChange={(e) => setDraft(prev => ({ ...prev, status: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase font-bold">Entrypoint</label>
                                    <input
                                        className="w-full border-2 border-black px-3 py-2"
                                        value={draft.entrypoint || ""}
                                        onChange={(e) => setDraft(prev => ({ ...prev, entrypoint: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase font-bold">Description</label>
                                    <textarea
                                        className="w-full border-2 border-black px-3 py-2"
                                        rows={3}
                                        value={draft.description || ""}
                                        onChange={(e) => setDraft(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase font-bold">Metadata (JSON)</label>
                                    <textarea
                                        className="w-full border-2 border-black px-3 py-2 font-mono text-xs"
                                        rows={4}
                                        value={jsonPretty(draft.metadata || {})}
                                        onChange={(e) => setDraft(prev => ({ ...prev, metadata: safeParse(e.target.value, {}) }))}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={saveTool}
                                        className="px-4 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white"
                                    >
                                        Save Tool
                                    </button>
                                    <button
                                        onClick={deleteTool}
                                        className="px-4 py-2 border-2 border-black font-bold uppercase hover:bg-red-600 hover:text-white"
                                    >
                                        Delete Tool
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
