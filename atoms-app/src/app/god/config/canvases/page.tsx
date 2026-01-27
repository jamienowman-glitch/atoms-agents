"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

type ToolPopCategory = {
    id: string;
    label: string;
    locked?: boolean;
    ui_atom_ref?: string;
};

type ToolPopControl = {
    name: string;
    control_type: 'slider' | 'icon-carousel' | 'checkbox' | 'color-picker' | 'select';
    token?: string;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
};

type BuilderState = {
    id?: string;
    key: string;
    name: string;
    description: string;
    viewport: {
        type: 'infinite' | 'fixed';
        preset?: string;
        bg_color: string;
    };
    topPill: {
        left: string[];
        right: string[];
        left_locked: boolean;
    };
    chatRail: {
        enabled: boolean;
        position: 'left' | 'right';
        width: number;
    };
    toolPop: {
        enabled: boolean;
        position: 'bottom' | 'top';
        left_categories: ToolPopCategory[];
        right_controls_by_category: Record<string, ToolPopControl[]>;
        settings_notes: string;
    };
    toolPill: {
        enabled: boolean;
        long_press_map: Record<string, string[]>;
    };
    atomFlip: {
        enabled: boolean;
        notes: string;
    };
    atoms: any[];
};

const DEFAULT_STRUCTURE = {
    contract_version: "2.0.0",
    meta: {
        name: "Infinite Whiteboard",
        description: "A free-form Vario canvas with dual-magnifier control."
    },
    viewport: {
        type: "infinite",
        preset: "1080x1080",
        bg_color: "#f5f5f5"
    },
    harness: {
        top_pill: {
            left: ["surface_switcher", "chat_toggle"],
            right: ["view_mode", "export", "settings"]
        },
        chat_rail: {
            enabled: true,
            position: "left",
            width: 320
        },
        tool_pop: {
            enabled: true,
            position: "bottom",
            magnifiers: {
                left: { type: "category_selector", default: "layout" },
                right: { type: "tool_selector", default: "density" }
            },
            sliders: {
                layout: ["grid.cols", "grid.gap", "grid.radius"],
                font: ["typo.size", "typo.weight", "typo.width"],
                type: ["typo.tracking", "typo.leading"],
                color: ["style.opacity", "style.blur"]
            }
        }
    },
    atoms: [
        {
            name: "Tile",
            props: {
                title: { type: "string", default: "Untitled" },
                variant: { type: "select", options: ["generic", "product", "video"] }
            },
            vario: {
                axes: ["weight", "width", "slant", "casual"],
                mappings: {
                    "weight": "font-variation-settings: 'wght' var(--v-weight)",
                    "width": "font-variation-settings: 'wdth' var(--v-width)"
                }
            }
        }
    ]
};

const makeDefaultBuilderState = (): BuilderState => ({
    key: '',
    name: '',
    description: '',
    viewport: {
        type: 'infinite',
        preset: '1080x1080',
        bg_color: '#f5f5f5'
    },
    topPill: {
        left: ['space_switcher', 'surface_switcher', 'chat_toggle'],
        right: ['view_mode', 'export', 'settings'],
        left_locked: true
    },
    chatRail: {
        enabled: true,
        position: 'left',
        width: 320
    },
    toolPop: {
        enabled: true,
        position: 'bottom',
        left_categories: [
            { id: 'context_atom', label: 'Contextual Atom', locked: true, ui_atom_ref: 'ui_atom.contextual_default' },
            { id: 'layout', label: 'Layout' },
            { id: 'font', label: 'Font' },
            { id: 'type', label: 'Type' },
            { id: 'color', label: 'Color' }
        ],
        right_controls_by_category: {
            layout: [{ name: 'grid.cols', control_type: 'slider', token: 'grid.cols', min: 1, max: 12, step: 1 }],
            font: [{ name: 'typo.size', control_type: 'slider', token: 'typo.size', min: 8, max: 120, step: 1 }],
            type: [{ name: 'typo.tracking', control_type: 'slider', token: 'typo.tracking', min: -4, max: 10, step: 0.1 }],
            color: [{ name: 'style.opacity', control_type: 'slider', token: 'style.opacity', min: 0, max: 100, step: 1 }]
        },
        settings_notes: ''
    },
    toolPill: {
        enabled: true,
        long_press_map: {
            text: ['jumbo', 'headline', 'quote']
        }
    },
    atomFlip: {
        enabled: false,
        notes: ''
    },
    atoms: DEFAULT_STRUCTURE.atoms
});

const buildContract = (state: BuilderState) => ({
    contract_version: "2.1.0",
    meta: {
        name: state.name,
        description: state.description
    },
    viewport: state.viewport,
    harness: {
        top_pill: {
            left: state.topPill.left,
            right: state.topPill.right,
            left_locked: state.topPill.left_locked
        },
        chat_rail: state.chatRail,
        tool_pop: {
            enabled: state.toolPop.enabled,
            position: state.toolPop.position,
            magnifiers: {
                left: { type: "category_selector", default: state.toolPop.left_categories[0]?.id || "layout" },
                right: { type: "tool_selector", default: state.toolPop.right_controls_by_category[state.toolPop.left_categories[0]?.id || "layout"]?.[0]?.name || "density" }
            },
            left_categories: state.toolPop.left_categories,
            right_controls_by_category: state.toolPop.right_controls_by_category,
            settings_notes: state.toolPop.settings_notes
        },
        tool_pill: state.toolPill,
        atom_flip: state.atomFlip
    },
    atoms: state.atoms
});

const parseControlsFromSliders = (sliders: Record<string, string[]> | undefined) => {
    if (!sliders) return {};
    const map: Record<string, ToolPopControl[]> = {};
    Object.entries(sliders).forEach(([cat, tokens]) => {
        map[cat] = tokens.map((token) => ({
            name: token,
            control_type: 'slider',
            token,
            min: 0,
            max: 100,
            step: 1
        }));
    });
    return map;
};

const mapCanvasToBuilderState = (canvas: any): BuilderState => {
    const structure = canvas.structure || {};
    const harness = structure.harness || {};
    const toolPop = harness.tool_pop || {};
    const leftCategories = toolPop.left_categories || [
        { id: 'context_atom', label: 'Contextual Atom', locked: true, ui_atom_ref: 'ui_atom.contextual_default' },
        ...(toolPop.sliders ? Object.keys(toolPop.sliders).map((id: string) => ({ id, label: id })) : [])
    ];
    const rightControls = toolPop.right_controls_by_category || parseControlsFromSliders(toolPop.sliders);

    return {
        id: canvas.id,
        key: canvas.key || '',
        name: canvas.name || structure.meta?.name || '',
        description: canvas.description || structure.meta?.description || '',
        viewport: structure.viewport || { type: 'infinite', preset: '1080x1080', bg_color: '#f5f5f5' },
        topPill: {
            left: harness.top_pill?.left || ['space_switcher', 'surface_switcher', 'chat_toggle'],
            right: harness.top_pill?.right || ['view_mode', 'export', 'settings'],
            left_locked: harness.top_pill?.left_locked ?? true
        },
        chatRail: harness.chat_rail || { enabled: true, position: 'left', width: 320 },
        toolPop: {
            enabled: toolPop.enabled ?? true,
            position: toolPop.position || 'bottom',
            left_categories: leftCategories,
            right_controls_by_category: rightControls,
            settings_notes: toolPop.settings_notes || ''
        },
        toolPill: harness.tool_pill || { enabled: true, long_press_map: { text: ['jumbo', 'headline', 'quote'] } },
        atomFlip: harness.atom_flip || { enabled: false, notes: '' },
        atoms: structure.atoms || DEFAULT_STRUCTURE.atoms
    };
};

export default function CanvasesConfigPage() {
    const router = useRouter();
    const supabase = createClient();
    const [canvases, setCanvases] = useState<any[]>([]);
    const [uiAtoms, setUiAtoms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'list' | 'builder'>('list');
    const [builderData, setBuilderData] = useState<BuilderState>(makeDefaultBuilderState());
    const [saving, setSaving] = useState(false);
    const [exportJson, setExportJson] = useState('');

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) router.push('/login');
            else fetchCanvases();
        });
    }, []);

    useEffect(() => {
        fetch('/api/god/config/ui-atoms')
            .then((res) => res.json())
            .then((data) => Array.isArray(data) && setUiAtoms(data));
    }, []);

    const fetchCanvases = async () => {
        setLoading(true);
        const res = await fetch('/api/god/config/canvases');
        const data = await res.json();
        if (Array.isArray(data)) {
            setCanvases(data);
        }
        setLoading(false);
    };

    const handleLoadCanvas = (canvas: any) => {
        setBuilderData(mapCanvasToBuilderState(canvas));
        setMode('builder');
        setExportJson('');
    };

    const handleBuilderSave = async () => {
        setSaving(true);
        try {
            const structureJson = buildContract(builderData);

            const res = await fetch('/api/god/config/canvases', {
                method: builderData.id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: builderData.id,
                    key: builderData.key,
                    name: builderData.name,
                    description: builderData.description,
                    structure: structureJson
                })
            });

            if (res.ok) {
                setMode('list');
                fetchCanvases();
                setBuilderData(makeDefaultBuilderState());
                setExportJson('');
            } else {
                alert('Failed to save canvas.');
            }
        } catch (e) {
            alert('Invalid Contract Structure');
        }
        setSaving(false);
    };

    const contractPreview = useMemo(() => JSON.stringify(buildContract(builderData), null, 2), [builderData]);

    const updateLeftCategory = (index: number, patch: Partial<ToolPopCategory>) => {
        const next = [...builderData.toolPop.left_categories];
        next[index] = { ...next[index], ...patch };
        setBuilderData({ ...builderData, toolPop: { ...builderData.toolPop, left_categories: next } });
    };

    const addLeftCategory = () => {
        const next = [...builderData.toolPop.left_categories, { id: `custom_${Date.now()}`, label: 'New Category' }];
        setBuilderData({ ...builderData, toolPop: { ...builderData.toolPop, left_categories: next } });
    };

    const addRightControl = (categoryId: string) => {
        const existing = builderData.toolPop.right_controls_by_category[categoryId] || [];
        const nextControls = {
            ...builderData.toolPop.right_controls_by_category,
            [categoryId]: [...existing, { name: 'new_control', control_type: 'slider', token: 'new.token', min: 0, max: 100, step: 1 }]
        };
        setBuilderData({ ...builderData, toolPop: { ...builderData.toolPop, right_controls_by_category: nextControls } });
    };

    const updateRightControl = (categoryId: string, index: number, patch: Partial<ToolPopControl>) => {
        const existing = builderData.toolPop.right_controls_by_category[categoryId] || [];
        const next = [...existing];
        next[index] = { ...next[index], ...patch };
        const nextControls = { ...builderData.toolPop.right_controls_by_category, [categoryId]: next };
        setBuilderData({ ...builderData, toolPop: { ...builderData.toolPop, right_controls_by_category: nextControls } });
    };

    const setLongPressMap = (key: string, value: string) => {
        const values = value.split(',').map((v) => v.trim()).filter(Boolean);
        setBuilderData({
            ...builderData,
            toolPill: { ...builderData.toolPill, long_press_map: { ...builderData.toolPill.long_press_map, [key]: values } }
        });
    };

    return (
        <div className="min-h-screen bg-graph-paper p-12 font-sans">
            <div className="max-w-6xl mx-auto bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">CANVASES REGISTRY</h1>
                        <p className="font-bold text-sm tracking-widest uppercase">CONTRACT BUILDER</p>
                    </div>
                    <div className="flex gap-4">
                        {mode === 'list' && (
                            <button
                                onClick={() => {
                                    setBuilderData(makeDefaultBuilderState());
                                    setMode('builder');
                                    setExportJson('');
                                }}
                                className="px-6 py-2 bg-black text-white font-bold uppercase hover:opacity-80 transition-opacity"
                            >
                                + New Canvas
                            </button>
                        )}
                        <button
                            onClick={() => mode === 'builder' ? setMode('list') : router.push('/god/config')}
                            className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                        >
                            {mode === 'builder' ? 'Cancel' : '← Back'}
                        </button>
                    </div>
                </div>

                {mode === 'list' ? (
                    loading ? (
                        <div className="font-mono animate-pulse">LOADING CANVASES...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left font-mono text-sm">
                                <thead>
                                    <tr className="border-b-2 border-black">
                                        <th className="p-4 uppercase bg-black text-white">KEY</th>
                                        <th className="p-4 uppercase bg-black text-white">NAME</th>
                                        <th className="p-4 uppercase bg-black text-white">DESCRIPTION</th>
                                        <th className="p-4 uppercase bg-black text-white">STRUCTURE (JSON)</th>
                                        <th className="p-4 uppercase bg-black text-white">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {canvases.length === 0 && (
                                        <tr><td colSpan={5} className="p-8 text-center opacity-50">NO CANVASES FOUND. CREATE ONE.</td></tr>
                                    )}
                                    {canvases.map((canvas) => (
                                        <tr key={canvas.id} className="border-b border-black/20 hover:bg-neutral-50">
                                            <td className="p-4 font-bold">{canvas.key}</td>
                                            <td className="p-4">{canvas.name}</td>
                                            <td className="p-4 opacity-70">{canvas.description}</td>
                                            <td className="p-4">
                                                <div className="text-xs bg-neutral-100 p-2 overflow-hidden truncate max-w-xs">{JSON.stringify(canvas.structure)}</div>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleLoadCanvas(canvas)}
                                                    className="px-3 py-1 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                                                >
                                                    Remap/Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    <div className="space-y-6 max-w-4xl font-mono">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Key (Slug)</label>
                                <input
                                    className="w-full p-2 border-2 border-black bg-neutral-50 focus:outline-none focus:bg-white"
                                    value={builderData.key}
                                    onChange={e => setBuilderData({ ...builderData, key: e.target.value })}
                                    placeholder="e.g. infinite_whiteboard"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Name</label>
                                <input
                                    className="w-full p-2 border-2 border-black bg-neutral-50 focus:outline-none focus:bg-white"
                                    value={builderData.name}
                                    onChange={e => setBuilderData({ ...builderData, name: e.target.value })}
                                    placeholder="e.g. Infinite Whiteboard"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Description</label>
                            <input
                                className="w-full p-2 border-2 border-black bg-neutral-50 focus:outline-none focus:bg-white"
                                value={builderData.description}
                                onChange={e => setBuilderData({ ...builderData, description: e.target.value })}
                                placeholder="Brief description of the UX contract"
                            />
                        </div>

                        <details open className="border-2 border-black p-4">
                            <summary className="font-bold uppercase text-sm cursor-pointer">ToolPop</summary>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold uppercase">Left Magnifier Categories</span>
                                        <button onClick={addLeftCategory} className="px-2 py-1 border-2 border-black text-xs font-bold uppercase">+ Add</button>
                                    </div>
                                    <div className="space-y-3">
                                        {builderData.toolPop.left_categories.map((cat, idx) => (
                                            <div key={cat.id} className={`p-2 border-2 ${cat.locked ? 'border-dashed border-neutral-400 bg-neutral-100' : 'border-black'}`}>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        className="w-full p-1 border-2 border-black bg-white text-xs"
                                                        value={cat.label}
                                                        onChange={e => updateLeftCategory(idx, { label: e.target.value })}
                                                        disabled={cat.locked}
                                                    />
                                                    <input
                                                        className="w-full p-1 border-2 border-black bg-white text-xs"
                                                        value={cat.id}
                                                        onChange={e => updateLeftCategory(idx, { id: e.target.value })}
                                                        disabled={cat.locked}
                                                    />
                                                </div>
                                                {cat.locked && (
                                                    <div className="mt-2">
                                                        <label className="block text-[10px] font-bold uppercase mb-1">Choose UI Atom</label>
                                                        <select
                                                            className="w-full p-1 border-2 border-black bg-white text-xs"
                                                            value={cat.ui_atom_ref || ''}
                                                            onChange={e => updateLeftCategory(idx, { ui_atom_ref: e.target.value })}
                                                        >
                                                            {uiAtoms.map((atom) => (
                                                                <option key={atom.id} value={atom.key}>{atom.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase">Right Magnifier Controls</span>
                                    <div className="space-y-4 pt-2">
                                        {builderData.toolPop.left_categories.map((cat) => (
                                            <div key={cat.id} className="border-2 border-black p-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold uppercase">{cat.label}</span>
                                                    <button onClick={() => addRightControl(cat.id)} className="px-2 py-1 border-2 border-black text-xs font-bold uppercase">+ Add</button>
                                                </div>
                                                <div className="space-y-2 pt-2">
                                                    {(builderData.toolPop.right_controls_by_category[cat.id] || []).map((ctl, idx) => (
                                                        <div key={`${cat.id}-${idx}`} className="grid grid-cols-6 gap-2 items-center">
                                                            <input
                                                                className="col-span-2 p-1 border-2 border-black bg-white text-xs"
                                                                value={ctl.name}
                                                                onChange={e => updateRightControl(cat.id, idx, { name: e.target.value })}
                                                            />
                                                            <select
                                                                className="col-span-2 p-1 border-2 border-black bg-white text-xs"
                                                                value={ctl.control_type}
                                                                onChange={e => updateRightControl(cat.id, idx, { control_type: e.target.value as ToolPopControl['control_type'] })}
                                                            >
                                                                <option value="slider">slider</option>
                                                                <option value="icon-carousel">icon-carousel</option>
                                                                <option value="checkbox">checkbox</option>
                                                                <option value="color-picker">color-picker</option>
                                                                <option value="select">select</option>
                                                            </select>
                                                            <input
                                                                className="col-span-2 p-1 border-2 border-black bg-white text-xs"
                                                                value={ctl.token || ''}
                                                                onChange={e => updateRightControl(cat.id, idx, { token: e.target.value })}
                                                                placeholder="token"
                                                            />
                                                            {ctl.control_type === 'slider' && (
                                                                <>
                                                                    <input
                                                                        className="col-span-2 p-1 border-2 border-black bg-white text-xs"
                                                                        type="number"
                                                                        value={ctl.min ?? 0}
                                                                        onChange={e => updateRightControl(cat.id, idx, { min: Number(e.target.value) })}
                                                                        placeholder="min"
                                                                    />
                                                                    <input
                                                                        className="col-span-2 p-1 border-2 border-black bg-white text-xs"
                                                                        type="number"
                                                                        value={ctl.max ?? 100}
                                                                        onChange={e => updateRightControl(cat.id, idx, { max: Number(e.target.value) })}
                                                                        placeholder="max"
                                                                    />
                                                                    <input
                                                                        className="col-span-2 p-1 border-2 border-black bg-white text-xs"
                                                                        type="number"
                                                                        value={ctl.step ?? 1}
                                                                        onChange={e => updateRightControl(cat.id, idx, { step: Number(e.target.value) })}
                                                                        placeholder="step"
                                                                    />
                                                                </>
                                                            )}
                                                            {ctl.control_type === 'select' && (
                                                                <input
                                                                    className="col-span-6 p-1 border-2 border-black bg-white text-xs"
                                                                    value={(ctl.options || []).join(',')}
                                                                    onChange={e => updateRightControl(cat.id, idx, { options: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })}
                                                                    placeholder="options (csv)"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <label className="block text-xs font-bold uppercase mb-1">ToolPop Settings Notes</label>
                                <textarea
                                    className="w-full h-20 p-2 border-2 border-black bg-neutral-50 focus:outline-none focus:bg-white text-xs"
                                    value={builderData.toolPop.settings_notes}
                                    onChange={e => setBuilderData({ ...builderData, toolPop: { ...builderData.toolPop, settings_notes: e.target.value } })}
                                />
                            </div>
                        </details>

                        <details className="border-2 border-black p-4">
                            <summary className="font-bold uppercase text-sm cursor-pointer">ToolPill</summary>
                            <div className="pt-4 space-y-2">
                                <label className="block text-xs font-bold uppercase">Long Press Map (CSV per key)</label>
                                {Object.entries(builderData.toolPill.long_press_map).map(([key, values]) => (
                                    <div key={key} className="grid grid-cols-2 gap-2">
                                        <input className="p-1 border-2 border-black bg-white text-xs" value={key} readOnly />
                                        <input
                                            className="p-1 border-2 border-black bg-white text-xs"
                                            value={values.join(',')}
                                            onChange={(e) => setLongPressMap(key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </details>

                        <details className="border-2 border-black p-4">
                            <summary className="font-bold uppercase text-sm cursor-pointer">AtomFlip</summary>
                            <div className="pt-4 space-y-2">
                                <label className="block text-xs font-bold uppercase">Notes</label>
                                <textarea
                                    className="w-full h-20 p-2 border-2 border-black bg-neutral-50 focus:outline-none focus:bg-white text-xs"
                                    value={builderData.atomFlip.notes}
                                    onChange={e => setBuilderData({ ...builderData, atomFlip: { ...builderData.atomFlip, notes: e.target.value } })}
                                />
                            </div>
                        </details>

                        <details className="border-2 border-black p-4">
                            <summary className="font-bold uppercase text-sm cursor-pointer">TopPill</summary>
                            <div className="pt-4 space-y-2">
                                <label className="block text-xs font-bold uppercase">Left (Locked / Space + Surface)</label>
                                <input className="w-full p-1 border-2 border-black bg-neutral-100 text-xs" value={builderData.topPill.left.join(',')} readOnly />
                                <label className="block text-xs font-bold uppercase">Right (Configurable CSV)</label>
                                <input
                                    className="w-full p-1 border-2 border-black bg-white text-xs"
                                    value={builderData.topPill.right.join(',')}
                                    onChange={e => setBuilderData({ ...builderData, topPill: { ...builderData.topPill, right: e.target.value.split(',').map(v => v.trim()).filter(Boolean) } })}
                                />
                            </div>
                        </details>

                        <details className="border-2 border-black p-4">
                            <summary className="font-bold uppercase text-sm cursor-pointer">Atoms (JSON)</summary>
                            <textarea
                                className="w-full h-48 p-2 border-2 border-black bg-[#1e1e1e] text-[#d4d4d4] text-xs resize-none focus:outline-none"
                                value={JSON.stringify(builderData.atoms, null, 2)}
                                onChange={e => {
                                    try {
                                        const parsed = JSON.parse(e.target.value);
                                        setBuilderData({ ...builderData, atoms: parsed });
                                    } catch {
                                        setBuilderData({ ...builderData, atoms: builderData.atoms });
                                    }
                                }}
                                spellCheck={false}
                            />
                        </details>

                        <details className="border-2 border-black p-4">
                            <summary className="font-bold uppercase text-sm cursor-pointer">Export Contract</summary>
                            <div className="pt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase">Contract JSON</span>
                                    <button
                                        onClick={() => setExportJson(contractPreview)}
                                        className="px-3 py-1 border-2 border-black text-xs font-bold uppercase"
                                    >
                                        Export
                                    </button>
                                </div>
                                <textarea
                                    className="w-full h-48 p-2 border-2 border-black bg-[#1e1e1e] text-[#d4d4d4] text-xs resize-none focus:outline-none"
                                    value={exportJson || contractPreview}
                                    readOnly
                                />
                                <div className="text-xs opacity-70">Saved to Supabase table `canvases` via `/api/god/config/canvases`.</div>
                            </div>
                        </details>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleBuilderSave}
                                disabled={saving}
                                className="px-8 py-3 bg-green-600 text-white font-bold uppercase hover:bg-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                            >
                                {saving ? 'Saving...' : builderData.id ? 'UPDATE CANVAS' : 'SAVE CANVAS'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
