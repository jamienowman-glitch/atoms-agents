"use client";

import React, { useState } from 'react';
import { PreviewTopPill } from './preview/PreviewTopPill';
import { PreviewToolPill } from './preview/PreviewToolPill';
import { PreviewToolPop } from './preview/PreviewToolPop';

// --- Types ---
type FlowStep = 'zones' | 'config' | 'atoms' | 'contract';
type ZoneType = 'toppill' | 'toolpill' | 'toolpop';
type UIType = 'SLIDER' | 'BUTTONS' | 'CHECKBOX' | 'DROP DOWN';

interface MapperState {
    surfaceId: string;

    // Stage 1/2: Zone Config
    headerItems: { label: string, value: string }[]; // TopPill (Label = Preset Title, Value = User Description)
    injectorCategories: string[]; // ToolPill

    toolPopConfig: {
        leftMag2: string; // "Left 2" (Left 1 is reserved)
        rightMags: string[];
    };

    // Stage 3: Atom Mapper
    atoms: Record<string, AtomConfig>;
}

interface AtomConfig {
    leftMag: string; // Category selection for Left 2
    rightMags: Record<string, { // Map Right Mag Name -> UI Type
        uiType: UIType;
    }>;
    flipSide: string; // Description of flip side
}

export function MapperCockpit() {
    const [step, setStep] = useState<FlowStep>('zones');
    const [config, setConfig] = useState<MapperState>({
        surfaceId: '',
        headerItems: [
            { label: 'EXPORT OPTIONS', value: '' },
            { label: 'CANVAS SIZE', value: '' },
            { label: 'PROJECT SELECTOR', value: '' },
            { label: 'PAGE SELECTOR', value: '' },
            { label: 'CANVAS SETTINGS', value: '' }
        ],
        injectorCategories: ['CATEGORY 1', 'CATEGORY 2', 'CATEGORY 3'],
        toolPopConfig: {
            leftMag2: 'LEFT 2',
            rightMags: ['RIGHT 1', 'RIGHT 2', 'RIGHT 3']
        },
        atoms: {}
    });

    const [activeAtom, setActiveAtom] = useState<string>('text_block');
    const [activeZone, setActiveZone] = useState<ZoneType | null>(null);

    // --- Helpers ---
    const addAtom = () => {
        const name = prompt("Enter Atom Name (e.g. image_block)");
        if (name) {
            setConfig(p => ({
                ...p,
                atoms: {
                    ...p.atoms,
                    [name]: {
                        leftMag: config.toolPopConfig.leftMag2,
                        rightMags: config.toolPopConfig.rightMags.reduce((acc, curr) => ({ ...acc, [curr]: { uiType: 'SLIDER' } }), {}),
                        flipSide: 'Settings'
                    }
                }
            }));
            setActiveAtom(name);
        }
    };

    const updateAtomRight = (mag: string, type: UIType) => {
        setConfig(p => ({
            ...p,
            atoms: {
                ...p.atoms,
                [activeAtom]: {
                    ...p.atoms[activeAtom],
                    rightMags: {
                        ...p.atoms[activeAtom].rightMags,
                        [mag]: { uiType: type }
                    }
                }
            }
        }));
    };

    // --- Renderers ---

    // STAGE 1: ZONE SELECTOR (The Visual Start)
    if (step === 'zones') {
        return (
            <div className="min-h-screen bg-neutral-100 flex flex-col items-center py-12 gap-12 font-sans overflow-y-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-black tracking-tighter mb-2">BUILD NEW CANVAS</h1>
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Select a Zone to Configure</p>
                </div>

                <div className="flex flex-col gap-12 w-full max-w-2xl items-center pb-20">

                    {/* TopPill Zone */}
                    <div onClick={() => { setActiveZone('toppill'); setStep('config'); }} className="group relative transition-transform hover:scale-105 cursor-pointer">
                        <div className="pointer-events-none">
                            <PreviewTopPill />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full">
                            <span className="bg-black text-white font-black uppercase tracking-widest px-4 py-2 rounded-lg text-xs shadow-xl">Configure Header</span>
                        </div>
                    </div>

                    {/* ToolPill Zone */}
                    <div onClick={() => { setActiveZone('toolpill'); setStep('config'); }} className="group relative transition-transform hover:scale-105 cursor-pointer">
                        <div className="pointer-events-none">
                            <PreviewToolPill />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-xl">
                            <span className="bg-black text-white font-black uppercase tracking-widest px-4 py-2 rounded-lg text-xs shadow-xl">Configure Injector</span>
                        </div>
                    </div>

                    {/* ToolPop Zone */}
                    <div onClick={() => { setActiveZone('toolpop'); setStep('config'); }} className="group relative transition-transform hover:scale-105 cursor-pointer">
                        <div className="pointer-events-none transform scale-90">
                            <PreviewToolPop />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-2xl">
                            <span className="bg-black text-white font-black uppercase tracking-widest px-4 py-2 rounded-lg text-xs shadow-xl">Configure Controls</span>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-8 right-8">
                    <button onClick={() => setStep('atoms')} className="bg-blue-600 text-white px-8 py-4 rounded-full font-black tracking-widest hover:bg-blue-700 shadow-xl transition-colors">
                        NEXT: MAP ATOMS →
                    </button>
                </div>
            </div>
        );
    }

    // STAGE 2: CONFIGURATOR
    if (step === 'config') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center py-12 font-sans">
                <button onClick={() => setStep('zones')} className="fixed top-8 left-8 text-neutral-400 font-bold uppercase tracking-widest hover:text-black">← Back to Zones</button>

                <div className="w-full max-w-2xl px-6">
                    <h2 className="text-2xl font-black mb-8 uppercase border-b-4 border-black pb-4">Configuring: {activeZone}</h2>

                    {activeZone === 'toppill' && (
                        <div className="space-y-6">
                            <div className="flex justify-center py-4 bg-neutral-100 rounded-xl">
                                <PreviewTopPill />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-4 text-neutral-500">Header Configuration</label>
                                <div className="space-y-4">
                                    {config.headerItems.map((item, i) => (
                                        <div key={i} className="flex flex-col gap-1">
                                            {/* Field Title */}
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800">{item.label}</span>
                                            </div>

                                            {/* Input Value */}
                                            <input
                                                className="w-full border-b-2 border-neutral-200 py-2 px-0 font-medium text-sm focus:outline-none focus:border-black placeholder:text-neutral-300 placeholder:italic"
                                                placeholder={`Define ${item.label.toLowerCase()}...`}
                                                value={item.value}
                                                onChange={(e) => {
                                                    const newItems = [...config.headerItems];
                                                    newItems[i] = { ...item, value: e.target.value };
                                                    setConfig({ ...config, headerItems: newItems });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => {
                                    const label = prompt("Enter New Field Title (e.g. USER PERMISSIONS)");
                                    if (label) setConfig({ ...config, headerItems: [...config.headerItems, { label, value: '' }] });
                                }} className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-6">+ Add Header Field</button>
                            </div>
                        </div>
                    )}

                    {activeZone === 'toolpill' && (
                        <div className="space-y-6">
                            <div className="flex justify-center py-4 bg-neutral-100 rounded-xl">
                                <PreviewToolPill />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-neutral-500">Injector Categories</label>
                                {config.injectorCategories.map((c, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input className="flex-1 border-b-2 border-neutral-200 py-2 px-0 font-bold focus:outline-none focus:border-black" value={c} onChange={(e) => {
                                            const newC = [...config.injectorCategories]; newC[i] = e.target.value; setConfig({ ...config, injectorCategories: newC });
                                        }} />
                                    </div>
                                ))}
                                <button onClick={() => setConfig({ ...config, injectorCategories: [...config.injectorCategories, 'NEW CATEGORY'] })} className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-2">+ Add Category</button>
                            </div>
                        </div>
                    )}

                    {activeZone === 'toolpop' && (
                        <div className="space-y-6">
                            <div className="flex justify-center py-4 bg-neutral-100 rounded-xl overflow-hidden">
                                <div className="transform scale-90">
                                    <PreviewToolPop />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-neutral-500">Left Magnifier 2</label>
                                    <input className="w-full border-b-2 border-neutral-200 py-2 font-bold focus:border-black" value={config.toolPopConfig.leftMag2} onChange={e => setConfig({ ...config, toolPopConfig: { ...config.toolPopConfig, leftMag2: e.target.value } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-neutral-500">Right Magnifiers</label>
                                    {config.toolPopConfig.rightMags.map((r, i) => (
                                        <input key={i} className="w-full border-b-2 border-neutral-200 py-2 mb-2 font-bold focus:border-black" value={r} onChange={e => {
                                            const newR = [...config.toolPopConfig.rightMags]; newR[i] = e.target.value; setConfig({ ...config, toolPopConfig: { ...config.toolPopConfig, rightMags: newR } });
                                        }} />
                                    ))}
                                    <button onClick={() => setConfig({ ...config, toolPopConfig: { ...config.toolPopConfig, rightMags: [...config.toolPopConfig.rightMags, 'NEW RIGHT'] } })} className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-2">+ Add Right Mag</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        );
    }

    // STAGE 3: ATOM MAPPER
    if (step === 'atoms') {
        // Init atom if missing
        if (!config.atoms[activeAtom]) {
            // Can't set state directly in render, but checked via button logic usually. 
            // For now assume default.
        }

        const atom = config.atoms[activeAtom] || { leftMag: 'DEFAULT', rightMags: {}, flipSide: '' };

        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col py-12 font-sans">
                <div className="max-w-6xl mx-auto w-full px-6 flex gap-12">

                    {/* Sidebar: Atom List */}
                    <div className="w-64 border-r border-neutral-200 pr-8">
                        <h2 className="text-xl font-black uppercase mb-6">UI Atoms</h2>
                        <div className="space-y-2">
                            {Object.keys(config.atoms).length === 0 && <div className="text-sm text-neutral-400 italic">No atoms added yet.</div>}
                            {Object.keys(config.atoms).map(key => (
                                <button key={key} onClick={() => setActiveAtom(key)} className={`w-full text-left py-3 px-4 rounded-lg font-bold uppercase tracking-wider text-xs transition-colors ${activeAtom === key ? 'bg-black text-white shadow-lg' : 'bg-white text-neutral-500 hover:bg-neutral-200'}`}>
                                    {key}
                                </button>
                            ))}
                            <button onClick={addAtom} className="w-full py-3 px-4 mt-4 border-2 border-dashed border-neutral-300 rounded-lg font-bold uppercase tracking-wider text-xs text-neutral-400 hover:border-blue-500 hover:text-blue-500">
                                + Add New Atom
                            </button>
                        </div>

                        <div className="mt-12 pt-12 border-t border-neutral-200">
                            <button onClick={() => setStep('contract')} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-700">
                                Generate Contract →
                            </button>
                        </div>
                    </div>

                    {/* Main: Mapping Interface */}
                    <div className="flex-1">
                        {config.atoms[activeAtom] ? (
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">Mapping Atom</h3>
                                    <h1 className="text-4xl font-black uppercase">{activeAtom}</h1>
                                </div>

                                {/* Left Mapping */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Left Magnifier ({config.toolPopConfig.leftMag2})</h4>
                                    <input className="w-full text-xl font-serif italic border-b-2 border-neutral-100 pb-2 focus:border-black outline-none"
                                        placeholder="Enter Context Category..."
                                        value={atom.leftMag === 'LEFT 2' ? '' : atom.leftMag}
                                        onChange={e => setConfig(p => ({ ...p, atoms: { ...p.atoms, [activeAtom]: { ...atom, leftMag: e.target.value } } }))}
                                    />
                                </div>

                                {/* Right Mapping (The Core) */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Right Magnifier Tools & UI Types</h4>
                                    <div className="grid grid-cols-1 gap-6">
                                        {config.toolPopConfig.rightMags.map(mag => (
                                            <div key={mag} className="flex items-center gap-6 pb-6 border-b border-neutral-50 last:border-0 last:pb-0">
                                                <div className="w-32 font-bold text-sm uppercase">{mag}</div>
                                                <div className="flex-1 flex gap-2">
                                                    {['SLIDER', 'BUTTONS', 'CHECKBOX', 'DROP DOWN'].map((type) => (
                                                        <button
                                                            key={type}
                                                            onClick={() => updateAtomRight(mag, type as UIType)}
                                                            className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${atom.rightMags[mag]?.uiType === type ? 'bg-black text-white shadow-md' : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'}`}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Flip Side */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Flip Side (Metadata)</h4>
                                    <textarea className="w-full bg-neutral-50 rounded-lg p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-black" rows={3}
                                        value={atom.flipSide}
                                        onChange={e => setConfig(p => ({ ...p, atoms: { ...p.atoms, [activeAtom]: { ...atom, flipSide: e.target.value } } }))}
                                    />
                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-neutral-300 font-bold uppercase tracking-widest">Select or Add an Atom</div>
                        )}
                    </div>

                </div>
            </div>
        );
    }

    // STAGE 4: CONTRACT
    if (step === 'contract') {
        const contract = `
# CANVAS BUILD CONTRACT
## Surface: ${config.surfaceId || 'New Canvas'}

### 1. ZONE CONFIGURATION

**Top Pill (Header)**
${config.headerItems.map(p => `- **${p.label}**: ${p.value || '[No Config]'}`).join('\n')}

**Tool Pill (Injector)**
${config.injectorCategories.map(c => `- ${c}`).join('\n')}

**Tool Pop (Controls)**
- Left Mag 1: [Reserved: Standard]
- Left Mag 2: ${config.toolPopConfig.leftMag2}
- Right Mags: ${config.toolPopConfig.rightMags.join(', ')}

---

### 2. ATOM MAPPING SPECIFICATION

${Object.entries(config.atoms).map(([name, conf]) => `
#### Atom: ${name}
*   **Left Context:** ${conf.leftMag}
*   **Right Tools:**
${Object.entries(conf.rightMags).map(([mag, setting]) => `    - ${mag} -> [${setting.uiType}]`).join('\n')}
*   **Flip Side:** ${conf.flipSide}
`).join('\n')}

---
*Generated by Agentflow Iron Suit Mapper*
        `;

        return (
            <div className="min-h-screen bg-black text-white p-12 font-mono overflow-auto">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-8 text-blue-500">GENERATED BUILD CONTRACT</h1>
                    <pre className="whitespace-pre-wrap text-sm bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
                        {contract}
                    </pre>
                    <div className="mt-8 flex gap-4">
                        <button onClick={() => setStep('atoms')} className="px-6 py-3 rounded-lg border border-neutral-700 hover:bg-neutral-800 font-bold uppercase text-xs">Test / Edit</button>
                        <button onClick={() => navigator.clipboard.writeText(contract)} className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold uppercase text-xs">Copy to Clipboard</button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
