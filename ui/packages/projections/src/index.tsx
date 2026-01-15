import React from 'react';
import { CanvasState } from '@northstar/canvas-kernel';
import { AtomRegistry } from '@northstar/ui-atoms';

interface CanvasViewProps {
    state: CanvasState;
    onSelectAtom: (id: string) => void;
    selectedAtomIds: string[];
    onUpdate?: (id: string, prop: string, value: any) => void;
    cursors?: Record<string, { x: number; y: number; color: string; label: string }>;
}

const AtomRenderer: React.FC<{
    id: string;
    state: CanvasState;
    onSelect: (id: string) => void;
    selectedIds: string[];
    onUpdate?: (id: string, prop: string, value: any) => void;
}> = ({ id, state, onSelect, selectedIds, onUpdate }) => {
    const atom = state.atoms[id];

    if (!atom) return null;

    const Component = AtomRegistry[atom.type] || AtomRegistry['box'];
    const isSelected = selectedIds.includes(id);

    // Recurse
    const children = atom.children?.map(childId => (
        <AtomRenderer
            key={childId}
            id={childId}
            state={state}
            onSelect={onSelect}
            selectedIds={selectedIds}
            onUpdate={onUpdate}
        />
    ));

    return (
        <Component
            id={id}
            properties={atom.properties as any}
            isSelected={isSelected}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(id);
            }}
            onUpdate={onUpdate}
        >
            {children}
        </Component>
    );
};

export const CanvasView: React.FC<CanvasViewProps> = ({ state, onSelectAtom, selectedAtomIds, cursors, onUpdate }) => {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#f5f5f5', padding: '40px' }}>

            {/* Content Layer */}
            <div className="canvas-content">
                {state.rootAtomIds.map(id => (
                    <AtomRenderer
                        key={id}
                        id={id}
                        state={state}
                        onSelect={onSelectAtom}
                        selectedIds={selectedAtomIds}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>

            {/* Cursor Overlay Layer */}
            <div className="cursor-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
                {cursors && Object.entries(cursors).map(([actorId, cursor]) => (
                    <div
                        key={actorId}
                        style={{
                            position: 'absolute',
                            transform: `translate(${cursor.x}px, ${cursor.y}px)`,
                            transition: 'transform 0.1s linear',
                            zIndex: 9999
                        }}
                    >
                        <div style={{
                            width: '12px',
                            height: '20px',
                            backgroundColor: cursor.color,
                            clipPath: 'polygon(0 0, 0 100%, 100% 100%, 0 0)' // Simple pointer
                        }} />
                        <div style={{
                            backgroundColor: cursor.color,
                            color: 'white',
                            padding: '2px 6px',
                            fontSize: '10px',
                            borderRadius: '4px',
                            marginTop: '4px'
                        }}>
                            {cursor.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
