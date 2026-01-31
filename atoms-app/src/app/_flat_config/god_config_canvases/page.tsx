"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

type ToolPopCategory = {
    id: string;
    label: string;
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

type ToolPopSlot = {
    id: string;
    title: string;
    ui_atom_ref?: string;
    left_categories: ToolPopCategory[];
    right_controls_by_category: Record<string, ToolPopControl[]>;
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
        slots: ToolPopSlot[];
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
        slots: [
            {
                id: 'slot_1',
                title: 'Slot 1',
                ui_atom_ref: 'ui_atom.contextual_default',
                left_categories: [
                    { id: 'multi21_tiles', label: 'Multi21 Tiles' },
                    { id: 'multi21_copy', label: 'Multi21 Copy' },
                    { id: 'multi21_cta', label: 'Multi21 CTA' }
                ],
                right_controls_by_category: {
                    multi21_tiles: [{ name: 'contextual_atom', control_type: 'select', token: 'contextual.atom' }]
                }
            },
            {
                id: 'slot_2',
                title: 'Slot 2',
                left_categories: [
                    { id: 'font', label: 'Font' },
                    { id: 'type', label: 'Type' },
                    { id: 'color', label: 'Color' }
                ],
                right_controls_by_category: {
                    font: [{ name: 'typo.size', control_type: 'slider', token: 'typo.size', min: 8, max: 120, step: 1 }]
                }
            }
        ],
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

const mergeSlots = (slots: ToolPopSlot[]) => {
    const left_categories: ToolPopCategory[] = [];
    const right_controls_by_category: Record<string, ToolPopControl[]> = {};

    slots.forEach((slot) => {
        slot.left_categories.forEach((cat) => {
            left_categories.push(cat);
            if (slot.right_controls_by_category[cat.id]) {
                right_controls_by_category[cat.id] = slot.right_controls_by_category[cat.id];
            }
        });
    });

    return { left_categories, right_controls_by_category };
};

const buildContract = (state: BuilderState) => {
    const merged = mergeSlots(state.toolPop.slots);
    return {
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
                    left: { type: "category_selector", default: merged.left_categories[0]?.id || "layout" },
                    right: { type: "tool_selector", default: merged.right_controls_by_category[merged.left_categories[0]?.id || "layout"]?.[0]?.name || "density" }
                },
                left_categories: merged.left_categories,
                right_controls_by_category: merged.right_controls_by_category,
                slots: state.toolPop.slots,
                settings_notes: state.toolPop.settings_notes
            },
            tool_pill: state.toolPill,
            atom_flip: state.atomFlip
        },
        atoms: state.atoms
    };
};

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
    const slots: ToolPopSlot[] = toolPop.slots || [
        {
            id: 'slot_1',
            title: 'Slot 1',
            ui_atom_ref: toolPop.left_categories?.find((c: any) => c.id === 'context_atom')?.ui_atom_ref || 'ui_atom.contextual_default',
            left_categories: toolPop.left_categories || [],
            right_controls_by_category: toolPop.right_controls_by_category || parseControlsFromSliders(toolPop.sliders)
        }
    ];

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
            slots,
            settings_notes: toolPop.settings_notes || ''
        },
        toolPill: harness.tool_pill || { enabled: true, long_press_map: { text: ['jumbo', 'headline', 'quote'] } },
        atomFlip: harness.atom_flip || { enabled: false, notes: '' },
        atoms: structure.atoms || DEFAULT_STRUCTURE.atoms
    };
};

const Section = ({
    id,
    title,
    open,
    onToggle,
    children
}: {
    id: string;
    title: string;
    open: boolean;
    onToggle: (id: string) => void;
    children: React.ReactNode;
}) => (
    <div className="border-2 border-black">
        <button
            className="w-full flex items-center justify-between px-4 py-3 text-left text-lg font-bold uppercase"
            onClick={() => onToggle(id)}
        >
            <span>{title}</span>
            <span className="text-xl">{open ? '▾' : '▸'}</span>
        </button>
        {open && <div className="p-4 pt-2">{children}</div>}
    </div>
);

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
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        toolpop: true,
        toolpill: true,
        atomflip: true,
        toppill: true,
        atoms: false,
        export: true
    });

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) router.push('/login');
            else fetchCanvases();
        });
    }, []);

    useEffect(() => {
        fetch('/api/god/config/ui-atoms')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setUiAtoms(data);
                } else {
                    alert('UI Atoms registry missing or invalid. Ensure public.ui_atoms exists.');
                }
            })
            .catch(() => {
                alert('UI Atoms registry missing or invalid. Ensure public.ui_atoms exists.');
            });
    }, []);

    const toggleSection = (id: string) => {
        setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
    };

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

    const updateSlot = (slotIndex: number, patch: Partial<ToolPopSlot>) => {
        const next = [...builderData.toolPop.slots];
        next[slotIndex] = { ...next[slotIndex], ...patch };
        setBuilderData({ ...builderData, toolPop: { ...builderData.toolPop, slots: next } });
    };

    const addSlot = () => {
        const next = [
            ...builderData.toolPop.slots,
            { id: `slot_${Date.now()}`, title: 'New Slot', left_categories: [], right_controls_by_category: {} }
        ];
        setBuilderData({ ...builderData, toolPop: { ...builderData.toolPop, slots: next } });
    };

    const addLeftCategory = (slotIndex: number) => {
        const slot = builderData.toolPop.slots[slotIndex];
        const nextCats = [...slot.left_categories, { id: `cat_${Date.now()}`, label: 'New Category' }];
        updateSlot(slotIndex, { left_categories: nextCats });
    };

    const updateLeftCategory = (slotIndex: number, catIndex: number, patch: Partial<ToolPopCategory>) => {
        const slot = builderData.toolPop.slots[slotIndex];
        const next = [...slot.left_categories];
        next[catIndex] = { ...next[catIndex], ...patch };
        updateSlot(slotIndex, { left_categories: next });
    };

    const addRightControl = (slotIndex: number, categoryId: string) => {
        const slot = builderData.toolPop.slots[slotIndex];
        const existing = slot.right_controls_by_category[categoryId] || [];
        const nextControls = {
            ...slot.right_controls_by_category,
            [categoryId]: [...existing, { name: 'new_control', control_type: 'slider' as const, token: 'new.token', min: 0, max: 100, step: 1 }]
        };
        updateSlot(slotIndex, { right_controls_by_category: nextControls });
    };

    const updateRightControl = (slotIndex: number, categoryId: string, index: number, patch: Partial<ToolPopControl>) => {
        const slot = builderData.toolPop.slots[slotIndex];
        const existing = slot.right_controls_by_category[categoryId] || [];
        const next = [...existing];
        next[index] = { ...next[index], ...patch };
        updateSlot(slotIndex, { right_controls_by_category: { ...slot.right_controls_by_category, [categoryId]: next } });
    };

    const setLongPressMap = (key: string, value: string) => {
        const values = value.split(',').map((v) => v.trim()).filter(Boolean);
        setBuilderData({
            ...builderData,
            toolPill: { ...builderData.toolPill, long_press_map: { ...builderData.toolPill.long_press_map, [key]: values } }
        });
    };

    return (
        <div className="min-h-screen bg-graph-paper pb-20 font-sans text-base md:text-lg">
            {/* Header */}
            <div className="bg-white border-b-2 border-black p-4 md:p-6 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">Canvases Registry</h1>
                        <p className="font-bold text-xs md:text-sm tracking-widest uppercase text-neutral-500">Contract Builder</p>
                    </div>
                    <div className="flex gap-2">
                        {mode === 'list' && (
                            <button
                                onClick={() => {
                                    setBuilderData(makeDefaultBuilderState());
                                    setMode('builder');
                                    setExportJson('');
                                }}
                                className="h-11 px-4 bg-black text-white font-bold uppercase hover:opacity-80 transition-opacity text-sm whitespace-nowrap"
                            >
                                + New
                            </button>
                        )}
                        <button
                            onClick={() => mode === 'builder' ? setMode('list') : router.push('/god/config')}
                            className="h-11 px-4 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors text-sm whitespace-nowrap"
                        >
                            {mode === 'builder' ? 'Close' : 'Back'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 md:p-6">
                {mode === 'list' ? (
                    loading ? (
                        <div className="p-8 font-mono animate-pulse text-center">LOADING...</div>
                    ) : (
                        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            {canvases.length === 0 && (
                                <div className="p-8 text-center opacity-50 font-bold uppercase">No canvases found.</div>
                            )}
                            {canvases.map((canvas) => (
                                <div key={canvas.id} className="border-b-2 border-black last:border-b-0 p-4 hover:bg-neutral-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-black uppercase text-lg">{canvas.name}</span>
                                        <button
                                            onClick={() => handleLoadCanvas(canvas)}
                                            className="px-4 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div className="font-mono text-xs opacity-60 mb-2">{canvas.key}</div>
                                    <p className="text-sm opacity-80 leading-snug">{canvas.description}</p>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="space-y-6">
                        {/* Meta Section - Always open-ish */}
                        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2">Key</label>
                                    <input
                                        className="w-full h-11 px-3 border-2 border-black bg-neutral-50 focus:bg-white focus:outline-none rounded-none"
                                        value={builderData.key}
                                        onChange={e => setBuilderData({ ...builderData, key: e.target.value })}
                                        placeholder="unique_key"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2">Name</label>
                                    <input
                                        className="w-full h-11 px-3 border-2 border-black bg-neutral-50 focus:bg-white focus:outline-none rounded-none"
                                        value={builderData.name}
                                        onChange={e => setBuilderData({ ...builderData, name: e.target.value })}
                                        placeholder="Display Name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2">Description</label>
                                <textarea
                                    className="w-full p-3 border-2 border-black bg-neutral-50 focus:bg-white focus:outline-none rounded-none min-h-[80px]"
                                    value={builderData.description}
                                    onChange={e => setBuilderData({ ...builderData, description: e.target.value })}
                                    placeholder="Brief description..."
                                />
                            </div>
                        </div>

                        {/* ToolPop */}
                        <Section id="toolpop" title="ToolPop" open={openSections.toolpop} onToggle={toggleSection}>
                            <div className="bg-white">
                                {builderData.toolPop.slots.map((slot, slotIndex) => (
                                    <Section
                                        key={slot.id}
                                        id={`slot_${slot.id}`}
                                        title={slot.title}
                                        open={openSections[`slot_${slot.id}`] ?? false}
                                        onToggle={toggleSection}
                                    >
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-bold uppercase mb-2">Contextual Atom</label>
                                                <input
                                                    list="uiAtomsList"
                                                    className="w-full h-11 px-3 border-2 border-black bg-white rounded-none"
                                                    value={slot.ui_atom_ref || ''}
                                                    onChange={(e) => updateSlot(slotIndex, { ui_atom_ref: e.target.value })}
                                                    placeholder="Select UI Atom..."
                                                />
                                                <datalist id="uiAtomsList">
                                                    {uiAtoms.map((atom) => (
                                                        <option key={atom.id} value={atom.key}>{atom.name}</option>
                                                    ))}
                                                </datalist>
                                            </div>

                                            {/* Magnifiers Grid - Strict 2 Columns */}
                                            <div className="grid grid-cols-2 gap-4 md:gap-8 border-t-2 border-black pt-6">
                                                {/* Left Magnifier */}
                                                <div>
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                                        <span className="font-black uppercase text-sm md:text-base">Left Magnifier</span>
                                                        <button onClick={() => addLeftCategory(slotIndex)} className="h-10 px-3 border-2 border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors w-full md:w-auto">+ Cat</button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {slot.left_categories.map((cat, idx) => (
                                                            <div key={cat.id} className="pb-4 border-b border-black last:border-0 last:pb-0">
                                                                <input
                                                                    className="w-full h-10 px-2 border-b border-dashed border-black bg-transparent mb-2 font-bold placeholder:font-normal focus:outline-none"
                                                                    value={cat.label}
                                                                    onChange={e => updateLeftCategory(slotIndex, idx, { label: e.target.value })}
                                                                    placeholder="Label"
                                                                />
                                                                <input
                                                                    className="w-full h-8 px-2 bg-neutral-100 text-xs font-mono focus:outline-none"
                                                                    value={cat.id}
                                                                    onChange={e => updateLeftCategory(slotIndex, idx, { id: e.target.value })}
                                                                    placeholder="id"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Right Magnifier */}
                                                <div>
                                                    <span className="block font-black uppercase text-sm md:text-base mb-4">Right Magnifier</span>
                                                    <div className="space-y-6">
                                                        {slot.left_categories.map((cat) => (
                                                            <div key={cat.id}>
                                                                <div className="flex items-center justify-between mb-3 bg-neutral-100 p-2">
                                                                    <span className="text-xs font-bold uppercase">{cat.label || 'Unable to name'}</span>
                                                                    <button onClick={() => addRightControl(slotIndex, cat.id)} className="w-8 h-8 flex items-center justify-center border border-black font-bold hover:bg-black hover:text-white">+</button>
                                                                </div>
                                                                <div className="space-y-4 pl-2">
                                                                    {(slot.right_controls_by_category[cat.id] || []).map((ctl, idx) => (
                                                                        <div key={`${cat.id}-${idx}`} className="space-y-2 pb-4 border-b border-dashed border-black last:border-0 last:pb-0">
                                                                            <input
                                                                                className="w-full h-9 border-b border-black bg-transparent focus:outline-none text-sm font-bold"
                                                                                value={ctl.name}
                                                                                onChange={e => updateRightControl(slotIndex, cat.id, idx, { name: e.target.value })}
                                                                                placeholder="Control Name"
                                                                            />
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <select
                                                                                    className="w-full h-9 bg-white border border-black text-xs"
                                                                                    value={ctl.control_type}
                                                                                    onChange={e => updateRightControl(slotIndex, cat.id, idx, { control_type: e.target.value as ToolPopControl['control_type'] })}
                                                                                >
                                                                                    <option value="slider">slider</option>
                                                                                    <option value="icon-carousel">carousel</option>
                                                                                    <option value="checkbox">check</option>
                                                                                    <option value="color-picker">color</option>
                                                                                    <option value="select">select</option>
                                                                                </select>
                                                                                <input
                                                                                    className="w-full h-9 px-2 bg-neutral-50 text-xs font-mono border border-black"
                                                                                    value={ctl.token || ''}
                                                                                    onChange={e => updateRightControl(slotIndex, cat.id, idx, { token: e.target.value })}
                                                                                    placeholder="token"
                                                                                />
                                                                            </div>

                                                                            {ctl.control_type === 'slider' && (
                                                                                <div className="flex gap-2">
                                                                                    <input className="w-1/3 h-8 px-1 border border-black text-center text-xs" type="number" placeholder="min" value={ctl.min} onChange={e => updateRightControl(slotIndex, cat.id, idx, { min: Number(e.target.value) })} />
                                                                                    <input className="w-1/3 h-8 px-1 border border-black text-center text-xs" type="number" placeholder="max" value={ctl.max} onChange={e => updateRightControl(slotIndex, cat.id, idx, { max: Number(e.target.value) })} />
                                                                                    <input className="w-1/3 h-8 px-1 border border-black text-center text-xs" type="number" placeholder="step" value={ctl.step} onChange={e => updateRightControl(slotIndex, cat.id, idx, { step: Number(e.target.value) })} />
                                                                                </div>
                                                                            )}
                                                                            {ctl.control_type === 'select' && (
                                                                                <input
                                                                                    className="w-full h-8 px-2 border border-black text-xs"
                                                                                    value={(ctl.options || []).join(',')}
                                                                                    onChange={e => updateRightControl(slotIndex, cat.id, idx, { options: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
                                                                                    placeholder="opt1, opt2"
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
                                        </div>
                                    </Section>
                                ))}
                                <button onClick={addSlot} className="w-full py-4 border-2 border-dashed border-black font-bold uppercase hover:bg-neutral-100 transition-colors bg-white mt-4">
                                    + Add New Slot
                                </button>
                                <div className="mt-6">
                                    <label className="block text-xs font-bold uppercase mb-2">Settings Notes</label>
                                    <textarea
                                        className="w-full h-24 p-3 border-2 border-black bg-white focus:outline-none"
                                        value={builderData.toolPop.settings_notes}
                                        onChange={e => setBuilderData({ ...builderData, toolPop: { ...builderData.toolPop, settings_notes: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* ToolPill */}
                        <Section id="toolpill" title="ToolPill" open={openSections.toolpill} onToggle={toggleSection}>
                            <div className="bg-white">
                                <label className="block text-xs font-bold uppercase mb-4 opacity-70">Long Press Map</label>
                                {Object.entries(builderData.toolPill.long_press_map).map(([key, values]) => (
                                    <div key={key} className="mb-4">
                                        <div className="font-bold uppercase mb-1 text-sm">{key}</div>
                                        <input
                                            className="w-full h-11 px-3 border-2 border-black bg-white rounded-none"
                                            value={values.join(', ')}
                                            onChange={(e) => setLongPressMap(key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* TopPill */}
                        <Section id="toppill" title="TopPill" open={openSections.toppill} onToggle={toggleSection}>
                            <div className="space-y-4 bg-white">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2">Left Items (Locked)</label>
                                    <div className="p-3 bg-neutral-100 border-2 border-black text-sm font-mono opacity-60">
                                        {builderData.topPill.left.join(', ')}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2">Right Items</label>
                                    <input
                                        className="w-full h-11 px-3 border-2 border-black bg-white rounded-none"
                                        value={builderData.topPill.right.join(', ')}
                                        onChange={e => setBuilderData({ ...builderData, topPill: { ...builderData.topPill, right: e.target.value.split(',').map(v => v.trim()).filter(Boolean) } })}
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* AtomFlip */}
                        <Section id="atomflip" title="AtomFlip" open={openSections.atomflip} onToggle={toggleSection}>
                            <div className="bg-white">
                                <label className="block text-xs font-bold uppercase mb-2">Notes</label>
                                <textarea
                                    className="w-full h-24 p-3 border-2 border-black bg-white focus:outline-none"
                                    value={builderData.atomFlip.notes}
                                    onChange={e => setBuilderData({ ...builderData, atomFlip: { ...builderData.atomFlip, notes: e.target.value } })}
                                />
                            </div>
                        </Section>

                        {/* Export */}
                        <Section id="export" title="Export" open={openSections.export} onToggle={toggleSection}>
                            <div className="bg-white">
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => setExportJson(contractPreview)}
                                        className="flex-1 h-11 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                                    >
                                        Preview JSON
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(exportJson || contractPreview);
                                            alert('Copied to clipboard');
                                        }}
                                        className="h-11 px-4 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <textarea
                                    className="w-full h-64 p-4 border-2 border-black bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-relaxed resize-none focus:outline-none"
                                    value={exportJson || contractPreview}
                                    readOnly
                                />
                            </div>
                        </Section>

                        {/* Sticky Save Footer */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black p-4 md:p-6 z-50">
                            <div className="max-w-5xl mx-auto flex justify-end">
                                <button
                                    onClick={handleBuilderSave}
                                    disabled={saving}
                                    className="w-full md:w-auto px-8 h-12 bg-green-600 text-white font-black uppercase hover:bg-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg tracking-wide"
                                >
                                    {saving ? 'Saving...' : builderData.id ? 'Update Contract' : 'Create Contract'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
