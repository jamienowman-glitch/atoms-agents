import React, { useEffect, useState } from 'react';
import { CanvasView } from '@northstar/projections';
import { runScriptedAgent, AgentPlan, CatalogClient, CatalogResponse } from '@northstar/agent-driver';
import { Sidebar } from '@northstar/builder-layout';
import { Inspector } from '@northstar/builder-inspector';
import { useBuilder } from '@northstar/builder-core';
import { CanvasFrame } from './components/CanvasFrame';
import { ChatRail } from './components/ChatRail/ChatRail';
import { Toolpill } from './components/Toolpill/Toolpill';

const CLIENT = new CatalogClient((import.meta as any).env.VITE_ENGINES_BASE_URL || '');

export const App = () => {
    const {
        state,
        selectedId,
        setSelectedId,
        deviceMode,
        setDeviceMode,
        status,
        handleOp,
        handleAddSection,
        handleAddBlock,
        handleDelete,
        handleUpdateProperty,
        handleReorder,
        lastSafetyDecision,
        lastSafetyError,
    } = useBuilder();

    // Data Layer
    const [catalog, setCatalog] = useState<CatalogResponse | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await CLIENT.fetchCatalog({ surface: 'builder', viewport: deviceMode });
            setCatalog(data);
        };
        load();
    }, [deviceMode]);

    // Sections only for sidebar
    const sections = state.rootAtomIds.map(id => state.atoms[id]).filter(Boolean);
    const selectedAtom = selectedId ? state.atoms[selectedId] : null;

    const handleInsert = (kind: string) => {
        // Simple insertion logic for P0
        if (kind.includes('section')) {
            handleAddSection(kind);
        } else {
            // Try to add to currently selected section, or first section, or create new
            let targetSectionId = state.rootAtomIds[0];

            // If selected is a section, use it
            if (selectedAtom && selectedAtom.type.includes('section')) {
                targetSectionId = selectedAtom.id;
            }
            // If selected is a block, use its parent
            else if (selectedAtom && selectedAtom.parent_id) {
                targetSectionId = selectedAtom.parent_id;
            }

            if (targetSectionId) {
                handleAddBlock(targetSectionId, kind);
            } else {
                // No sections, create one then add block (or just add section if kind was section)
                // For simplicity, just alert if no container
                console.warn("No target section for block insertion");
                handleAddSection('text-section'); // Emergency container
                // Ideally wait for update then add, but sync is tricky here without async op handling
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            {/* Top Bar */}
            <header style={{ height: '50px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', background: '#fff', zIndex: 10 }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Northstar Builder</div>

                {/* Device Toggles */}
                <div style={{ display: 'flex', background: '#f1f1f1', borderRadius: '4px', padding: '2px' }}>
                    {(['desktop', 'tablet', 'mobile'] as const).map(mode => (
                        <button
                            key={mode}
                            onClick={() => setDeviceMode(mode)}
                            style={{
                                border: 'none',
                                background: deviceMode === mode ? '#fff' : 'transparent',
                                boxShadow: deviceMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                textTransform: 'capitalize'
                            }}
                        >
                            {mode}
                        </button>
                    ))}
                </div>

                <div style={{ fontSize: '12px', color: status === 'disconnected' ? 'red' : 'green' }}>
                    {status === 'disconnected' ? '• Offline' : '• Live'}
                </div>
            </header>

            <div style={{ padding: '6px 20px', borderBottom: '1px solid #eee', background: '#f9fafb', fontSize: '12px' }}>
                <div>
                    <strong>Last safety decision:</strong>
                    {lastSafetyDecision
                        ? ` ${lastSafetyDecision.result} - ${lastSafetyDecision.reason} (gate: ${lastSafetyDecision.gate})`
                        : ' none yet'}
                </div>
                {lastSafetyDecision && (
                    <div style={{ fontSize: '11px', color: '#555' }}>
                        Action: {lastSafetyDecision.action}
                    </div>
                )}
                {lastSafetyError && (
                    <div style={{ fontSize: '11px', color: '#a00' }}>
                        Last HTTP safety block ({lastSafetyError.status}): {JSON.stringify(lastSafetyError.payload)}
                    </div>
                )}
            </div>
            {/* Responsive Styles */}
            <style>{`
                @media (max-width: 768px) {
                    .desktop-only-panel { display: none !important; }
                    .canvas-area { width: 100% !important; flex: 1; }
                }
            `}</style>

            {/* Main Workspace */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Sidebar - Hidden on Mobile */}
                <div className="desktop-only-panel">
                    <Sidebar
                        sections={sections}
                        atoms={state.atoms}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onAddSection={handleAddSection}
                        onAddBlock={handleAddBlock}
                        onDelete={handleDelete}
                        onReorder={handleReorder}
                    />
                </div>

                {/* Canvas Preview */}
                <CanvasFrame deviceMode={deviceMode}>
                    <CanvasView
                        state={state}
                        selectedAtomIds={selectedId ? [selectedId] : []}
                        onSelectAtom={setSelectedId}
                        onUpdate={handleUpdateProperty}
                        cursors={{}} // No cursors for builder MVP
                    />
                </CanvasFrame>

                {/* Right Inspector - Hidden on Mobile */}
                <div className="desktop-only-panel" style={{ width: '300px', borderLeft: '1px solid #eee', background: '#fff' }}>
                    <Inspector
                        atomId={selectedId}
                        type={selectedAtom?.type || null}
                        properties={selectedAtom?.properties || {}}
                        onChange={handleUpdateProperty}
                        onUpload={async (files) => {
                            const file = files[0];
                            return URL.createObjectURL(file);
                        }}
                        onSimulateAgent={async (id, prop, text) => {
                            // 1. Clear existing text
                            handleUpdateProperty(id, prop, "");

                            // 2. Type new text
                            const plan: AgentPlan = [
                                { kind: 'wait', durationMs: 300 },
                                { kind: 'type', atomId: id, text: text, delayMs: 50 }
                            ];

                            await runScriptedAgent(
                                plan,
                                (op: any) => handleOp({ ...op, actor_id: 'agent-writer' }),
                                () => state
                            );
                        }}
                    />
                </div>
            </div>

            {/* Tooling Layer */}
            <Toolpill catalog={catalog} onInsert={handleInsert} />

            {/* Chat Rail - Omnipresent */}
            <ChatRail
                catalog={catalog}
                selectedAtomKind={selectedAtom?.type || null}
                onUpdateToken={(token, value) => {
                    if (selectedId) handleUpdateProperty(selectedId, token, value);
                }}
            />
        </div>
    );
};
