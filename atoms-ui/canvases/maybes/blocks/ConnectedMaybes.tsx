import React, { useCallback, useEffect } from 'react';
import { useToolControl, useToolState } from '../../../harness/ToolControlProvider';
import { useCanvasTransport } from '../../../harness/transport/provider'; // Canonical hook
import { MaybesCity } from './molecules/MaybesCity';
import { useMaybesStore } from '../logic/store';
import { saveLocal, loadLocal } from '../logic/persistence';
import { CanvasActionContext } from '../logic/CanvasActionContext';
import { MaybesToolPill } from './MaybesToolPill';

export const ConnectedMaybes = () => {
    const transport = useCanvasTransport();
    // We use a specific tool ID 'canvas_mode' to track the current active mode from the ToolPill
    const [activeMode] = useToolState('canvas_mode', ''); // Default empty
    const { updateTool } = useToolControl();

    // Store access
    const addNode = useMaybesStore((state) => state.addNode);

    // Mount: Load persistence
    useEffect(() => {
        loadLocal();
        // Subscribe to store changes to save local
        const unsub = useMaybesStore.subscribe((state) => {
            saveLocal(state.nodes, state.edges);
        });
        return () => unsub();
    }, []);

    // Action Handlers
    const handleForward = useCallback((nodeId: string, payload?: any) => {
        // Emit command via transport
        if (!transport) return;

        // Use Command type extension fields (type, command, payload)
        transport.sendCommand('maybes-canvas', {
            base_rev: 0,
            ops: [],
            actor_id: 'user',
            correlation_id: `forward-${Date.now()}`,
            type: 'FORWARD_NODE',
            payload: {
                nodeId,
                content: payload,
                timestamp: Date.now()
            }
        });

        console.log('[ConnectedMaybes] Forwarding node', nodeId);
    }, [transport]);

    // Effect: Listen to activeMode changes to trigger creation
    useEffect(() => {
        if (!activeMode || activeMode === '') return;

        // ToolPill actions (Text, Voice, Camera)
        const mode = activeMode.toLowerCase();

        if (['text', 'voice', 'camera'].includes(mode)) {
            // Spawn logic
            // We spawn at center (approx 0,0 or map center if we had viewport info)
            // Ideally we'd get viewport center from ReactFlow instance, but for now 0,0 is fine or random
            const randomOffset = () => (Math.random() - 0.5) * 50;
            const position = { x: randomOffset(), y: randomOffset() };

            // Map 'voice' to 'audio'
            const type = mode === 'voice' ? 'audio' : mode;

            // If camera, checking if enabled (disabled in plan)
            if (type === 'camera') {
                // Do nothing or show toast? Plan says "Disabled with tooltip"
                // Implemented at UI level usually, but here strict check
            } else {
                addNode(type, position);
            }

            // RESET signal immediately to allow re-triggering
            // This makes the tool pill act like a momentary button
            updateTool('canvas_mode', 'setValue', '');
        }
    }, [activeMode, addNode, updateTool]);

    // Verify transport connection on mount
    useEffect(() => {
        if (!transport) return;
        console.log('[ConnectedMaybes] Transport active');
    }, [transport]);

    return (
        <CanvasActionContext.Provider value={{ onForward: handleForward }}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                {/* The Molecule */}
                <MaybesCity
                    mode={activeMode}
                    transport={transport}
                />

                {/* Canvas-scoped ToolPill */}
                <MaybesToolPill />
            </div>
        </CanvasActionContext.Provider>
    );
};
