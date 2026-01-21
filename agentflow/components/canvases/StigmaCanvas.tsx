
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWorkbenchTransport } from '../workbench/useWorkbenchTransport';
import { TopPill } from '@/app/nx-marketing-agents/core/multi21/headers/TopPill';
import { ChatRailShell } from '@/components/chat/ChatRailShell';
import { ToolControlProvider } from '@/context/ToolControlContext';

// --- Types ---

interface Atom {
    id: string;
    type: 'text' | 'shape' | 'image';
    x: number;
    y: number;
    w: number;
    h: number | 'auto';
    content?: string;
    src?: string;
    style?: Record<string, any>;
    // Builder flags
    isSelected?: boolean;
}

// --- Icons ---

const Icons = {
    Pointer: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>,
    Text: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>,
    Image: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Shape: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3z" /></svg>
};

// --- Hooks ---

const generateId = () => Math.random().toString(36).substr(2, 9);

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const useAutoSave = (atoms: Atom[], canvasId: string) => {
    const debouncedAtoms = useDebounce(atoms, 1000);
    const transport = useWorkbenchTransport(canvasId, {});

    useEffect(() => {
        if (debouncedAtoms.length > 0) {
            localStorage.setItem('stigma_draft', JSON.stringify(debouncedAtoms));
        }
    }, [debouncedAtoms]);

    const remoteDebouncedAtoms = useDebounce(atoms, 2000);
    useEffect(() => {
        if (remoteDebouncedAtoms.length > 0 && transport) {
            // console.log('[Stigma] Auto-Saving to Remote:', remoteDebouncedAtoms.length, 'atoms');
        }
    }, [remoteDebouncedAtoms, transport]);

    useEffect(() => {
        const draft = localStorage.getItem('stigma_draft');
        if (draft) {
            try {
                // Restoration handled by parent via initial state if possible, 
                // but since this is a hook, we rely on parent to read it or we emit an event. 
                // For this V1, we duplicate restore logic in parent or let this hook assume it runs once.
                // Parent currently handles it.
            } catch (e) {
                console.error("Failed to check draft", e);
            }
        }
    }, []);
};


// --- Components ---

const ScaleWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [scale, setScale] = useState(1);
    const BASE_WIDTH = 1440;

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const s = w < BASE_WIDTH ? w / BASE_WIDTH : 1;
            setScale(s);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            className="origin-top-left w-[1440px] h-full relative shadow-2xl transition-transform duration-200 ease-out"
            style={{
                transform: `scale(${scale})`,
                width: 1440,
                height: '100%'
            }}
        >
            {children}
        </div>
    );
};

const SideToolbar = ({ onSpawn, onUpload }: { onSpawn: (type: Atom['type']) => void, onUpload: () => void }) => {
    const btnClass = "p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors flex items-center justify-center";
    return (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-2 flex flex-col gap-2 z-50 border border-gray-100">
            <button className={btnClass} title="Pointer">
                <Icons.Pointer />
            </button>
            <div className="w-8 h-px bg-gray-100 mx-auto" />
            <button className={btnClass} onClick={() => onSpawn('text')} title="Text Tool">
                <Icons.Text />
            </button>
            <button className={btnClass} onClick={() => onSpawn('shape')} title="Shape Tool">
                <Icons.Shape />
            </button>
            <button className={btnClass} onClick={onUpload} title="Image Upload">
                <Icons.Image />
            </button>
        </div>
    );
};

// Main Stigma Canvas Container
const StigmaCanvas: React.FC<{ canvasId?: string }> = ({ canvasId = 'stigma-demo' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State
    const [showGrid, setShowGrid] = useState(true);
    const [atoms, setAtoms] = useState<Atom[]>([]);

    // UI State for ChatRail
    const [showTools, setShowTools] = useState(false);
    const [chatMode, setChatMode] = useState<'nano' | 'micro' | 'standard' | 'full'>('standard');

    // Auto-Save
    const debouncedAtoms = useDebounce(atoms, 1000);
    const transport = useWorkbenchTransport(canvasId, {});

    useEffect(() => {
        if (debouncedAtoms.length > 0) {
            localStorage.setItem('stigma_draft', JSON.stringify(debouncedAtoms));
        }
    }, [debouncedAtoms]);

    // Restore
    useEffect(() => {
        const draft = localStorage.getItem('stigma_draft');
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                if (Array.isArray(parsed)) setAtoms(parsed);
            } catch (e) { console.error("Restore failed", e); }
        }
    }, []);

    // --- Actions ---

    const spawnAtom = (type: Atom['type'], extra?: Partial<Atom>) => {
        const isText = type === 'text';
        const isImage = type === 'image';

        const newAtom: Atom = {
            id: generateId(),
            type,
            x: (1440 / 2) - (isImage ? (extra?.w || 300) / 2 : 150),
            y: 400,
            w: extra?.w || 300,
            h: extra?.h || (isText ? 'auto' : 300),
            content: isText ? "Double Click to Edit" : undefined,
            src: isImage ? extra?.src : undefined,
            style: isText ? {} : (isImage ? {} : { background: '#ccc' }),
            isSelected: true,
            ...extra
        };

        setAtoms(prev => [
            ...prev.map(a => ({ ...a, isSelected: false })),
            newAtom
        ]);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const src = ev.target?.result as string;
            // Create dummy image to get dimensions
            const img = new Image();
            img.onload = () => {
                let w = img.width;
                let h = img.height;
                // Auto-fit logic
                if (w > 500) {
                    const ratio = h / w;
                    w = 500;
                    h = 500 * ratio;
                }
                spawnAtom('image', { src, w, h });
            };
            img.src = src;
        };
        reader.readAsDataURL(file);

        // Reset input
        e.target.value = '';
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        // Only if clicking background
        if (e.target === containerRef.current) {
            spawnAtom('text', { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        }
    };

    const exportManifest = () => {
        const cleanAtoms = atoms.map(({ isSelected, ...rest }) => rest);
        console.log("🛠️ EXPORT MANIFEST:", JSON.stringify({ atoms: cleanAtoms }, null, 2));
        alert("Manifest exported to Console");
    };

    return (
        <div className="w-screen h-screen overflow-hidden bg-[#F3F4F6] relative">

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
            />

            {/* UI LAYER: Top Pill (Fixed) */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
                <TopPill />
            </div>

            {/* UI LAYER: Side Toolbar */}
            <SideToolbar
                onSpawn={(t) => spawnAtom(t)}
                onUpload={() => fileInputRef.current?.click()}
            />

            {/* UI LAYER: Chat Rail (Fixed Right) */}
            <div className="fixed top-0 right-0 h-full z-50 pointer-events-none">
                <div className="pointer-events-auto h-full">
                    <ChatRailShell
                        showTools={showTools}
                        onToggleTools={() => setShowTools(!showTools)}
                        mode={chatMode}
                        onModeChange={setChatMode}
                    />
                </div>
            </div>

            {/* SCALED WORKSPACE */}
            <div className="w-full h-full flex justify-center items-start pt-10 pl-20">
                <ScaleWrapper>
                    <div
                        ref={containerRef}
                        className="relative w-full h-full bg-white shadow-sm overflow-hidden group cursor-crosshair"
                        onDoubleClick={handleDoubleClick}
                    >
                        {/* Background Grid */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        {/* Editorial Grid */}
                        {showGrid && (
                            <div className="absolute inset-0 pointer-events-none z-0 flex px-12 space-x-4 opacity-5">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="flex-1 bg-red-500 h-full border-x border-red-500/20"></div>
                                ))}
                            </div>
                        )}

                        {/* ATOMS RENDER LAYER */}
                        {atoms.map(atom => (
                            <div
                                key={atom.id}
                                className={`absolute ${atom.isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-blue-200'} transition-shadow`}
                                style={{
                                    left: atom.x,
                                    top: atom.y,
                                    width: atom.w,
                                    height: atom.h === 'auto' ? 'auto' : atom.h,
                                    ...atom.style
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAtoms(prev => prev.map(a => ({ ...a, isSelected: a.id === atom.id })));
                                }}
                            >
                                {atom.type === 'text' && (
                                    <div className="w-full h-full p-2 font-sans text-xl text-black select-none pointer-events-none whitespace-pre-wrap">
                                        {atom.content}
                                    </div>
                                )}
                                {atom.type === 'shape' && (
                                    <div className="w-full h-full bg-gray-200 border border-gray-300 pointer-events-none" />
                                )}
                                {atom.type === 'image' && atom.src && (
                                    <img src={atom.src} className="w-full h-full object-cover pointer-events-none select-none" alt="user upload" />
                                )}

                                {/* Selection Handles */}
                                {atom.isSelected && (
                                    <>
                                        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border border-blue-500 rounded-full shadow-sm"></div>
                                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-blue-500 rounded-full shadow-sm"></div>
                                        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border border-blue-500 rounded-full shadow-sm"></div>
                                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border border-blue-500 rounded-full shadow-sm"></div>
                                    </>
                                )}
                            </div>
                        ))}

                        {/* Zero State */}
                        {atoms.length === 0 && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-30">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Stigma Canvas</h1>
                                <p className="text-sm text-gray-500">Double-click or drop items to start</p>
                            </div>
                        )}
                    </div>
                </ScaleWrapper>
            </div>

            {/* Info Footnote */}
            <div className="fixed bottom-4 left-4 text-[10px] text-gray-400 font-mono z-40">
                Atoms: {atoms.length} | ID: {canvasId} | Grid: {showGrid ? 'ON' : 'OFF'}
                <button onClick={() => setShowGrid(!showGrid)} className="ml-2 underline hover:text-gray-600">Toggle</button>
                <button onClick={exportManifest} className="ml-2 underline hover:text-blue-600">Export</button>
            </div>
        </div>
    );
};

export default StigmaCanvas;
