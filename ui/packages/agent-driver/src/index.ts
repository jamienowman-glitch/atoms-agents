import { CanvasOp, AtomId, TokenValue, PrimitiveValue } from '@northstar/contracts';

// --- Types ---

export type AgentAction =
    | { kind: 'type'; atomId: AtomId; text: string; delayMs?: number }
    | { kind: 'delete'; atomId: AtomId; count: number; delayMs?: number }
    | { kind: 'set_token'; atomId: AtomId; property: string; value: TokenValue | PrimitiveValue; delayMs?: number }
    | { kind: 'move'; atomId: AtomId; newIndex: number; newParentId: AtomId | null; delayMs?: number }
    | { kind: 'wait'; durationMs: number };

export type AgentPlan = AgentAction[];

// --- Driver ---

export async function runScriptedAgent(
    plan: AgentPlan,
    emitOp: (op: CanvasOp) => void,
    getContext: () => any, // e.g. retrieve current text for incremental updates
    signal?: AbortSignal
) {
    for (const action of plan) {
        if (signal?.aborted) break;

        switch (action.kind) {
            case 'wait':
                await new Promise(r => setTimeout(r, action.durationMs));
                break;

            case 'type': {
                // Char-by-char typing
                const { atomId, text, delayMs = 100 } = action;
                let currentText = getContext().atoms[atomId]?.properties.text || '';

                for (const char of text) {
                    if (signal?.aborted) break;
                    currentText += char;
                    emitOp({
                        kind: 'update',
                        actor_id: 'agent', // placeholder
                        atom_id: atomId,
                        properties: { text: currentText }
                    });
                    await new Promise(r => setTimeout(r, delayMs));
                }
                break;
            }

            case 'delete': {
                // Char-by-char deletion from end
                const { atomId, count, delayMs = 100 } = action;
                let currentText = getContext().atoms[atomId]?.properties.text || '';

                for (let i = 0; i < count; i++) {
                    if (signal?.aborted) break;
                    if (currentText.length === 0) break;

                    currentText = currentText.slice(0, -1);
                    emitOp({
                        kind: 'update',
                        actor_id: 'agent',
                        atom_id: atomId,
                        properties: { text: currentText }
                    });
                    await new Promise(r => setTimeout(r, delayMs));
                }
                break;
            }

            case 'set_token': {
                await new Promise(r => setTimeout(r, action.delayMs || 0));
                emitOp({
                    kind: 'update',
                    actor_id: 'agent',
                    atom_id: action.atomId,
                    properties: { [action.property]: action.value }
                });
                break;
            }

            case 'move': {
                await new Promise(r => setTimeout(r, action.delayMs || 0));
                emitOp({
                    kind: 'move',
                    actor_id: 'agent',
                    atom_id: action.atomId,
                    new_parent_id: action.newParentId,
                    new_index: action.newIndex
                });
                break;
            }
        }
    }
}

export * from './catalog';
